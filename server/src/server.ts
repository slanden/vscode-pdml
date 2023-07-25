import {
  CompletionList,
  createConnection,
  Diagnostic,
  DiagnosticSeverity,
  DidChangeConfigurationNotification,
  InitializeParams,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind
} from 'vscode-languageserver/node';
import { getLanguageModes, LanguageMode } from './Vocabularies';
import {
  DIAGNOSTIC_CODE_TOGGLES,
  lintEnabled,
  settingNameToLintName,
} from './lib';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticCode, parse } from '../../parser/pdml';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> =
  new TextDocuments(TextDocument);
let languageModes: Map<String, LanguageMode>;

/** Parse and validate a text document */
async function validateTextDocument(doc: TextDocument) {
  try {
    const diagnostics: Diagnostic[] = [];
    // const modes = languageModes.getAllModesInDocument(doc);
    const latestDoc = documents.get(doc.uri);
    if (latestDoc?.version === doc.version) {
      let parseResult = parse(new TextEncoder().encode(latestDoc.getText()));

      if (doc.languageId === 'pml') {
        let doc_index;
        for (let i = 0; i < parseResult.diag_len(); ++i) {
          if (!lintEnabled(parseResult.diag_code(i))) continue;

          if (doc_index == undefined &&
            parseResult.node_name(parseResult.diag_node_index(i)) === 'doc') {
            doc_index = parseResult.diag_node_index(i);
            continue;
          }
          diagnostics.push({
            message: parseResult.diag_msg(i),
            range: {
              start: latestDoc.positionAt(parseResult.diag_start(i)),
              end: latestDoc.positionAt(parseResult.diag_end(i))
            },
            severity: parseResult.diag_severity(i) as DiagnosticSeverity,
          });
        }
      } else {
        for (let i = 0; i < parseResult.diag_len(); ++i) {
          if (!lintEnabled(parseResult.diag_code(i))) continue;

          diagnostics.push({
            message: parseResult.diag_msg(i),
            range: {
              start: latestDoc.positionAt(parseResult.diag_start(i)),
              end: latestDoc.positionAt(parseResult.diag_end(i))
            },
            severity: parseResult.diag_severity(i) as DiagnosticSeverity,
          });
        }
      }

      connection.sendDiagnostics(
        { uri: latestDoc.uri, diagnostics }
      );
    }
  } catch (e) {
    connection.console.error(`Error while validating ${doc.uri}\n${String(e)}`);
  }
}

connection.onInitialize((_params: InitializeParams) => {
  languageModes = getLanguageModes();

  // documents.onDidClose(e => {});
  // connection.onShutdown(() => {
  //   // languageModes.dispose();
  // });

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client this server supports code completion
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['[', ':']
      }
    }
  };
});

connection.onInitialized(() => {
  connection.client.register(
    DidChangeConfigurationNotification.type,
    { section: 'pdml.lints' }
  );
})

// Also triggers when the document is opened
connection.onDidChangeConfiguration(async (change) => {
  // Override default settings
  for (const setting in change.settings.pdml.lints) {
    // @ts-ignore
    DIAGNOSTIC_CODE_TOGGLES[DiagnosticCode[settingNameToLintName(setting)]]
      = change.settings.pdml.lints[setting];
  }
  documents.all().forEach(validateTextDocument);
});

// Also triggers when the document is opened
documents.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

// Triggers on a "trigger" character, or when a match
// wasn't found
connection.onCompletion((docPosition) => {
  const doc = documents.get(docPosition.textDocument.uri);
  if (!doc) return null;

  return languageModes.get(doc.languageId)?.
    getCompletions?.(doc, docPosition.position) ??
    CompletionList.create();
});

// Listen for open, change, and close TextDocument events
documents.listen(connection);
connection.listen();
