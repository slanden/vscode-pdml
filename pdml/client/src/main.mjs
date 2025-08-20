import * as path from "node:path";
import vscode from "./vscode.cjs";
import { debounceAsync as debounce, waitForAllToFinish } from "./lib.mjs";

// Commonjs module, so we have to import it and then
// destructure the imports out of it
import langClientPackage from "vscode-languageclient";
const { LanguageClient, TransportKind } = langClientPackage;

let client;

/**@param {vscode.ExtensionContext} context */
export async function activate(context) {
	// Relative to the root, not the module
	const serverModule = process.env.IS_PROD
		? vscode.Uri.joinPath(context.extensionUri, "dist", "server.cjs").fsPath
		: context.asAbsolutePath(path.join("server", "src", "main.cjs"));
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
	}, 250);

	// Allow time for other extensions to register
	debouncedStartFn().then(debouncedRegisterFn);
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"pdml.register",
			/** Register a plugin
			 * @param {string} id The VS Code extension's identifier and version
			 * @param {{
			 *  plugins?: [],
			 *  vocabularies?: import("../../server/src/completion.mjs").Vocabulary[]
			 * }} bundle
			 */
			async function registerPlugin(id, bundle) {
				if (!client) {
					if (bundle.vocabularies) {
						for (const vocab of bundle.vocabularies) {
							if (
								!clientOptions.documentSelector.some(
									(x) => x.language === vocab.language,
								)
							) {
								clientOptions.documentSelector.push({
									scheme: "file",
									language: vocab.language,
								});
							}
							if (vocab.includes) {
								for (const vocabId of vocab.includes) {
									// Cause VS Code extensions for the included
									// language to activate
									vscode.workspace.openTextDocument({
										content: "",
										language: vocabId,
									});
								}
							}
						}
					}
					await debouncedStartFn();
				}
				const req = client.sendRequest("register", {
					id,
					bundle,
				});
				registrationRequests.push(req);
				debouncedRegisterFn();
				const response = await req;
				if (!response?.error) return;
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
