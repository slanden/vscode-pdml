/* This will hold the different sublanguages, and each
   can contain embedded languages such as JS and CSS
*/

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  CompletionItem,
  CompletionList,
  // Diagnostic,
  Position
} from 'vscode-languageserver/node';
import { pdmlNamespaces, pdmlScriptNodes, pdmlTypeNodes, pdmlUtilNodes } from './completions'
import { CompletionType, getCompletionHint, rfindUnless } from './lib';

export interface LanguageMode {
  getCompletions?: (document: TextDocument, position: Position) => CompletionList;
}

function pdmlNamespaceNodes(name: string): CompletionItem[] {
  switch (name) {
    case 's': {
      return pdmlScriptNodes();
    }
    case 't': {
      return pdmlTypeNodes();
    }
    case 'u': {
      return pdmlUtilNodes();
    }
    default: return [];
  }
}

function getCompletions(doc: TextDocument, pos: Position): CompletionList {
  const [hint, name] = getCompletionHint(doc.getText({
    start: {
      line: pos.line,
      character: 0
    },
    end: pos
  }), pos.character);
  // TODO: Build lists from PML list *and* PDML list
  switch (hint) {
    case CompletionType.BeginNode: {
      return CompletionList.create(pdmlNamespaces(pos));
    }
    case CompletionType.EndNamespace: {
      return CompletionList.create([...pdmlNamespaceNodes(name ?? '')]);
    }
    default: return CompletionList.create();
  }
}

export function getLanguageModes(): Map<String, LanguageMode> {
  return new Map([
    [
      'pml', <LanguageMode>{
        getCompletions
      }
    ],
    [
      'pdml', <LanguageMode>{
        getCompletions
      }
    ],
  ]);
}