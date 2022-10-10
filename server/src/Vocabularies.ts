/* This will hold the different sublanguages, and each
   can contain embedded languages such as JS and CSS
*/

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  // CompletionItemKind,
  CompletionList,
  // Diagnostic,
  Position
} from 'vscode-languageserver/node';

export interface LanguageMode {
  doComplete?: (document: TextDocument, position: Position) => CompletionList;
}

export function getLanguageModes(): Map<String, LanguageMode> {
  return new Map(
    // [[
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
    // [
    //   'pdml', <LanguageMode>{
    //     doComplete(doc: TextDocument, pos: Position): CompletionList {
    //       return CompletionList.create([
    //         {
    //           label: 'Cow yes',
    //           kind: CompletionItemKind.Text,
    //           data: 1
    //         }
    //       ])
    //     }
    //   }
    // ]]
  )
}