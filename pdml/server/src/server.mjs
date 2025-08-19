import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	DidChangeConfigurationNotification,
	TextDocumentSyncKind,
} from "./vscode-languageserver.mjs";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	pluginIdentity,
	registerPlugin,
	validateTextDocument,
} from "./lib.mjs";
import { getCompletions, registerVocabulary } from "./completion.mjs";
import {
	settingNameToLintName,
	DiagnosticCode,
	DIAGNOSTIC_CODE_TOGGLES,
} from "./lint.mjs";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
// let hasDiagnosticRelatedInformationCapability = false;
let isClientReady = false;

// Cache the settings of all open documents
const documentSettings = new Map();

// Triggers on a "trigger" character, or when a match
// wasn't found
connection.onCompletion((docPosition) => {
	if (!isClientReady) return;
	const doc = documents.get(docPosition.textDocument.uri);
	if (doc) {
		return getCompletions(doc, docPosition.position);
	}
});

connection.onInitialize(async (params /* : InitializeParams */) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	if (capabilities.workspace) {
		hasConfigurationCapability = !!capabilities.workspace.configuration;
		hasWorkspaceFolderCapability = !!capabilities.workspace.workspaceFolders;
	}
	// hasDiagnosticRelatedInformationCapability =
	// 	!!capabilities.textDocument?.publishDiagnostics?.relatedInformation;

	/**@type {import("vscode-languageserver").InitializeResult} */
	const result /* : InitializeResult */ = {
		capabilities: {
			// textDocumentSync: TextDocumentSyncKind.Incremental,
			textDocumentSync: TextDocumentSyncKind.Full,
			completionProvider: {
				resolveProvider: false,
				triggerCharacters: ["[", ":"],
			},
			// diagnosticProvider: {
			// 	interFileDependencies: false,
			// 	workspaceDiagnostics: false,
			// },
		},
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true,
			},
		};
	}
	// Although, we use UTF-8 regardless of this mechanism
	if (capabilities.general?.positionEncodings?.includes("utf-8")) {
		result.capabilities.positionEncoding = "utf-8";
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		connection.client.register(DidChangeConfigurationNotification.type, {
			section: "pdml.lints",
		});
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders((_event) => {
			// connection.console.log("Workspace folder change event received.");
		});
	}
});

// Also triggers when the document is opened
connection.onDidChangeConfiguration(async (change) => {
	if (!isClientReady) return;
	for (const setting in change.settings.pdml.lints) {
		// console.log(setting);
		DIAGNOSTIC_CODE_TOGGLES[DiagnosticCode[settingNameToLintName(setting)]] =
			change.settings.pdml.lints[setting];
	}
	for (const d of documents.all()) {
		connection.sendDiagnostics({
			uri: d.uri,
			diagnostics: await validateTextDocument(d),
		});
	}
});

// The content of a text document has changed. This
// event is emitted when the text document first
// opened or when its content has changed.
documents.onDidChangeContent(async (change) => {
	if (!isClientReady) return;

	connection.sendDiagnostics({
		uri: change.document.uri,
		diagnostics: await validateTextDocument(change.document),
	});
});

connection.onDidChangeWatchedFiles((change) => {
	if (!isClientReady) return;
});

documents.onDidClose((e) => {
	documentSettings.delete(e.document.uri);
});

connection.onRequest("client-ready", async () => {
	isClientReady = true;

	for (const d of documents.all()) {
		connection.sendDiagnostics({
			uri: d.uri,
			diagnostics: await validateTextDocument(d),
		});
	}
});

connection.onRequest("register", async ({ id, bundle }) => {
	try {
		const identity = pluginIdentity(id);
		if (!identity) {
			return {
				error:
					"`id` must be in the format of '<extension-id>@<extension-version>'",
			};
		}
		// TODO: Check if identifier is unique

		if (bundle.plugins) {
			for (const p of bundle.plugins) {
				await registerPlugin(p.path, p.type);
			}
		}
		if (bundle.vocabularies) {
			for (const vocab of bundle.vocabularies) {
				if (!vocab.path?.endsWith(".mjs")) {
					throw new Error(
						"Expected a `path` to a JavaScript module with an .mjs extension",
					);
				}
				vocab.completions = (await import(vocab.path)).completions;
				registerVocabulary(vocab);
			}
		}
	} catch (err) {
		return { error: err.message };
	}
});

documents.listen(connection);
connection.listen();
