import {
  CompletionList,
  createConnection,
  Diagnostic,
  InitializeParams,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind
} from 'vscode-languageserver/node';
import { getLanguageModes, LanguageMode } from './Vocabularies'
import { TextDocument } from 'vscode-languageserver-textdocument';

// Create a connection for the server, using Node's IPC
// as a transport. Also include all preview/proposed
// LSP features.
const connection = createConnection(ProposedFeatures.all);
// Create a simple text document manager
const documents: TextDocuments<TextDocument> =
  new TextDocuments(TextDocument);
let languageModes: Map<String, LanguageMode>;

connection.onInitialize((_params: InitializeParams) => {
  languageModes = getLanguageModes();

  documents.onDidClose(e => {
    // languageModes.onDocumentRemoved(e.document);
  });
  connection.onShutdown(() => {
    // languageModes.dispose();
  });

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client this server supports code completion
      completionProvider: {
        resolveProvider: false
      }
    }
  };
});

// connection.onDidChangeConfiguration(_change => {
//   // Revalidate all open text documents
//   documents.all().forEach(validateTextDocument);
// });

// // The content of a text document changed. This event
// // is emitted when the text document first opened or
// // when its content has changed.
// documents.onDidChangeContent(change => {
//   validateTextDocument(change.document);
// });

async function validateTextDocument(doc: TextDocument) {
  try {
    const diagnostics: Diagnostic[] = [];
    if (doc.languageId === 'pml') {
      // const modes = languageModes.getAllModesInDocument(doc);
      const latestDoc = documents.get(doc.uri);
      if (latestDoc?.version === doc.version) {
        // Check no new version has come in after in
        // after the async op
        // modes.forEach(mode => {
        //   if (mode.doValidation) {
        //     mode.doValidation(latestDoc).forEach(d => {
        //       diagnostics.push(d);
        //     });
        //   }
        // });
        connection.sendDiagnostics(
          { uri: latestDoc.uri, diagnostics }
        );
      }
    }
  } catch (e) {
    connection.console.error(`Error while validating ${doc.uri}`);
    connection.console.error(String(e));
  }
}

connection.onCompletion(async (docPosition, token) => {
  const doc = documents.get(docPosition.textDocument.uri);
  if (!doc) {
    return null;
  }

  return languageModes.get(doc.languageId)?.
    doComplete?.(doc, docPosition.position) ??
    CompletionList.create();
});

// Listen for open, change, and close TextDocument events
documents.listen(connection);
// Listen on the connection
connection.listen();
