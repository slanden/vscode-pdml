import * as path from "node:path";
import vscode from "./vscode.cjs";
import {
	addVocabLangsToDocumentSelector,
	debounceAsync as debounce,
	waitForAllToFinish,
} from "./lib.mjs";
import { transpile } from "./transpile.mjs";

// Commonjs module, so we have to import it and then
// destructure the imports out of it
import langClientPackage from "vscode-languageclient";
const { LanguageClient, TransportKind } = langClientPackage;

let client;

/**@param {vscode.ExtensionContext} context */
export async function activate(context) {
	// Relative to the root, not the module
	const serverModule = process.env.IS_PROD
		? vscode.Uri.joinPath(context.extensionUri, "dist", "server.mjs").fsPath
		: context.asAbsolutePath(path.join("server", "src", "main.mjs"));
	const serverOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		},
	};
	const clientOptions = {
		documentSelector: [{ scheme: "file", language: "pdml" }],
	};
	const registrationRequests = [];

	const debouncedStartFn = debounce(async () => {
		client = await startClientAndServer(serverOptions, clientOptions);
	}, 500);

	// Wait for the actual register requests to populate
	const debouncedRegisterFn = debounce(async () => {
		await waitForAllToFinish(registrationRequests);
		client.sendRequest("client-ready");
	}, 500);

	// Allow time for other extensions to register
	debouncedStartFn().then(debouncedRegisterFn);
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"pdml.register",
			/** Register a plugin
			 * @param {string} id The VS Code extension's identifier and version
			 * @param {{
			 *  noCache?: boolean,
			 *  plugins?: [],
			 *  vocabularies?: import("../../server/src/completion.mjs").Vocabulary[]
			 * }} bundle
			 */
			async function registerPlugin(id, bundle) {
				if (!client) {
					if (bundle.vocabularies) {
						addVocabLangsToDocumentSelector(
							bundle.vocabularies,
							clientOptions.documentSelector,
							(vocabId) => {
								// Cause VS Code extensions for the included
								// language to activate
								vscode.workspace.openTextDocument({
									content: "",
									language: vocabId,
								});
							},
						);
					}
					await debouncedStartFn();
				}

				if (bundle.plugins) {
					const cacheDir = vscode.Uri.joinPath(context.extensionUri, "cache");
					const pluginDir = vscode.Uri.joinPath(cacheDir, id);
					const needsTranspile =
						bundle.noCache || !(await pathExists(pluginDir));

					if (needsTranspile) {
						if (await pathExists(cacheDir)) {
							await deleteOlderVersions(cacheDir, id);
						} else {
							await vscode.workspace.fs.createDirectory(cacheDir);
						}
					}

					for (let i = 0; i < bundle.plugins.length; ++i) {
						if (bundle.plugins[i].type !== "wasip2") continue;

						const extensionStart = bundle.plugins[i].path.lastIndexOf(".");
						const basename = bundle.plugins[i].path.substring(
							bundle.plugins[i].path.lastIndexOf(
								process.platform.startsWith("win") ? "\\" : "/",
							) + 1,
							extensionStart,
						);
						const transpiledPath = vscode.Uri.joinPath(
							pluginDir,
							`${basename}.mjs`,
						);

						if (needsTranspile || !(await pathExists(transpiledPath))) {
							registrationRequests.push(
								...(await transpile(bundle.plugins[i].path, pluginDir.fsPath)),
							);
						}
						bundle.plugins[i].path = transpiledPath.fsPath;
					}
				}
				const req = client.sendRequest("register", {
					id,
					bundle,
				});
				registrationRequests.push(req);
				debouncedRegisterFn();
				const response = await req;
				if (!response?.error) return;
				throw new Error(response.error);
			},
		),
	);
}

export function deactivate() {
	return client?.stop();
}

async function startClientAndServer(serverOptions, clientOptions) {
	const _client = new LanguageClient(
		"pdml-lsp-client",
		"PDML",
		serverOptions,
		clientOptions,
	);
	_client.start();
	// Avoid dependent extensions from getting failure
	// responses from trying to register plugins before
	// the server is ready
	await new Promise((resolve) => {
		const disposable = _client.onDidChangeState((e) => {
			if (e.newState === langClientPackage.State.Running) {
				disposable.dispose();
				resolve();
			}
		});
	});
	return _client;
}

/**@returns {Promise<vscode.FileType>} */
function pathExists(path) {
	return vscode.workspace.fs
		.stat(path)
		.then((stat) => stat.type)
		.catch(() => false);
}

async function deleteOlderVersions(dir, basename) {
	const entries = await vscode.workspace.fs.readDirectory(dir);
	const basenameVersionStart = basename.lastIndexOf("@");
	const _basename =
		basenameVersionStart === -1
			? basename
			: basename.substring(0, basenameVersionStart);

	let versionStart;
	for (const entry of entries) {
		versionStart = entry[0].lastIndexOf("@");
		if (
			(versionStart === -1 ? entry[0] : entry[0].substring(0, versionStart)) ===
			_basename
		) {
			vscode.workspace.fs.delete(vscode.Uri.joinPath(dir, entry[0]), {
				recursive: true,
			});
			// Only expects to find one version cached
			return;
		}
	}
}
