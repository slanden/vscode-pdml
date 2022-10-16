/* This will hold the different sublanguages, and each
   can contain embedded languages such as JS and CSS
*/

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  CompletionList,
  // Diagnostic,
  Position
} from 'vscode-languageserver/node';
import { pdmlCompletions } from './completions'
import { rfindUnless } from './lib';


export interface LanguageMode {
  doComplete?: (document: TextDocument, position: Position) => CompletionList;
}

export function getLanguageModes(): Map<String, LanguageMode> {
  return new Map([
    // [
    //   'pml', <LanguageMode>{
    //     doComplete(doc: TextDocument, pos: Position): CompletionList {
    //       return CompletionList.create([
    //         {
    //           label: 'Cowabunga',
    //           kind: CompletionItemKind.Text,
    //           data: 1
    //         }
    //       ])
    //     }
    //   }
    // ],
    [
      'pdml', <LanguageMode>{
        doComplete(doc: TextDocument, pos: Position): CompletionList {
          const linePrefix = doc.getText({
            start: {
              line: pos.line,
              character: 0
            },
            end: pos
          });

          if (linePrefix.endsWith('[')) {
            return pdmlCompletions.namespaces(pos);
          } else if (linePrefix.endsWith(':')) {
            const nodeStart = rfindUnless(
              '[',
              linePrefix, pos.character - 1,
              /\s/
            );

            if (nodeStart === undefined) {
              return CompletionList.create();
            }

            const namespace = linePrefix.substring(
              nodeStart + 1,
              pos.character - 1
            );

            if (namespace === 'u') {
              return pdmlCompletions.utilNodes();
            }
            if (namespace === 't') {
              return pdmlCompletions.typeNodes();
            }
          }

          return CompletionList.create();
        }
      }
    ],
  ]);
}