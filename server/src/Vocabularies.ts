import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  CompletionItem,
  CompletionList,
  Position
} from 'vscode-languageserver/node';
import { pdmlNamespaces, pdmlScriptNodes, pdmlTypeNodes, pdmlUtilNodes, pmlNodes } from './completions'
import { CompletionType, getCompletionHint } from './lib';

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

export function getLanguageModes(): Map<String, LanguageMode> {
  return new Map([
    [
      'pml', <LanguageMode>{
        getCompletions(doc: TextDocument, pos: Position): CompletionList {
          const [hint, name] = getCompletionHint(doc.getText({
            start: {
              line: pos.line,
              character: 0
            },
            end: pos
          }), pos.character);

          switch (hint) {
            case CompletionType.BeginNode: {
              return CompletionList.create([...pmlNodes(), ...pdmlNamespaces(pos)]);
            }
            case CompletionType.EndNamespace: {
              return CompletionList.create([...pdmlNamespaceNodes(name ?? '')]);
            }
            default: return CompletionList.create();
          }
        }
      }
    ],
    [
      'pdml', <LanguageMode>{
        getCompletions(doc: TextDocument, pos: Position): CompletionList {
          const [hint, name] = getCompletionHint(doc.getText({
            start: {
              line: pos.line,
              character: 0
            },
            end: pos
          }), pos.character);

          switch (hint) {
            case CompletionType.BeginNode: {
              return CompletionList.create(pdmlNamespaces(pos));
            }
            case CompletionType.EndNamespace: {
              return CompletionList.create(pdmlNamespaceNodes(name ?? ''));
            }
            default: return CompletionList.create();
          }
        }
      }
    ],
  ]);
}