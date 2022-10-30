import { CompletionItemKind, CompletionList, Position } from 'vscode-languageserver/node';
import { mDoc } from './lib.js';

const DOC_BASE_URL = 'https://pdml-lang.dev';
const DOC_EXT_REF_SUBDIR = '/docs/extensions/reference_manual';
const CMD_TRIGGER_SUGGEST = 'editor.action.triggerSuggest';

export const pdmlCompletions = {
  /** @returns {CompletionList} */
  namespaces(pos: Position) {
    return CompletionList.create([
      {
        label: 's',
        kind: CompletionItemKind.Module,
        data: 1,
        documentation: mDoc(`PDML Extension: Script Nodes
[PDML Reference](${DOC_BASE_URL
          }/docs/extensions/user_manual/#script_nodes)`),
        textEdit: { newText: 's:', range: { start: pos, end: pos } },
        // `title` is required but empty because it's never shown
        command: { command: CMD_TRIGGER_SUGGEST, title: '' },
      },
      {
        label: 't',
        kind: CompletionItemKind.Module,
        data: 2,
        documentation: mDoc(`PDML Extension: Type Nodes
[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#types)`),
        textEdit: { newText: 't:', range: { start: pos, end: pos } },
        command: { command: CMD_TRIGGER_SUGGEST, title: '' }
      },
      {
        label: 'u',
        kind: CompletionItemKind.Module,
        data: 3,
        documentation: mDoc(`PDML Extension: Utility Nodes
[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#utility_nodes)`),
        textEdit: { newText: 'u:', range: { start: pos, end: pos } },
        // `title` is required but empty because it's never shown
        command: { command: CMD_TRIGGER_SUGGEST, title: '' },
      },
    ]);
  },
  /** @returns {CompletionList} */
  scriptNodes() {
    return CompletionList.create([
      {
        label: 'def',
        kind: CompletionItemKind.Function,
        data: 1,
        documentation: mDoc(`An \`s:def\` is used to define constants, variables, and functions that will later be used in \`s:exp\` or \`s:script\` nodes.

\`s:def\` nodes must be declared before using them in \`s:exp\` or \`s:script\` nodes.

[PDML Reference](${DOC_BASE_URL
          }/docs/extensions/user_manual/#definition_node)`)
      },
      {
        label: 'exp',
        kind: CompletionItemKind.Function,
        data: 2,
        documentation: mDoc(`An \`s:exp\` node evaluates an expression and inserts the result into the document.

[PDML Reference](${DOC_BASE_URL
          }/docs/extensions/user_manual/#expression_node)`)
      },
      {
        label: 'script',
        kind: CompletionItemKind.Function,
        data: 3,
        documentation: mDoc(`An \`s:script\` node embeds a regular script that can contain multiple statements. Any output from the script is not inserted into the document like in an \`s:exp\` node. To insert into the document, you must call [\`doc.insert\`](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#doc-insert).

[PDML Reference](${DOC_BASE_URL
          }/docs/extensions/user_manual/#script_node)`)
      },
    ]);
  },
  /** @returns {CompletionList} */
  typeNodes() {
    return CompletionList.create([
      {
        label: 'date',
        kind: CompletionItemKind.TypeParameter,
        data: 1,
        documentation: mDoc(`Specify a date in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.

[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#date)`)
      },
      {
        label: 'string',
        kind: CompletionItemKind.TypeParameter,
        data: 2,
        documentation: mDoc(`A \`t:string\` type denotes a node that can only contain text.

[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#string)`)
      },
      {
        label: 'raw_text',
        kind: CompletionItemKind.TypeParameter,
        data: 3,
        documentation: mDoc(`A \`t:raw_text\` type denotes a block of raw text.

In this context, the term *raw* means the text is not interpreted by the parser. For example, the text \`[foo]\` is not parsed as an empty node with name \`foo\`. It is pared as the text \`"[foo]"\`.

The text can be written as plain text like in other nodes, or in code fences.

Example:
\`\`\`
[t:raw_text
  ~~~
  first text line
  ...
  last text line
  ~~~
]
\`\`\`

- A delimiter character must be a \`"\`, \`=\`, or \`~\`
- There must be at least 3 in each set

[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#raw_text)`)
      },
    ]);
  },
  /** @returns {CompletionList} */
  utilNodes() {
    return CompletionList.create([
      {
        label: 'get',
        kind: CompletionItemKind.Function,
        data: 1,
        documentation: mDoc(`A \`u:get\` node gets a parameter and inserts the parameter's value in the document. The parameter must have been defined with a \`u:set\` node before it can be used in a \`u:get\` node.

[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#get_node)`)
      },
      {
        label: 'set',
        kind: CompletionItemKind.Function,
        data: 2,
        documentation: mDoc(`A \`u:set\` node assigns a value to one or more parameters.

After defining a parameter, its value can be inserted in the document with a \`u:get\` node.

[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#set_node)`)
      },
      {
        label: 'ins_file',
        kind: CompletionItemKind.Function,
        data: 3,
        documentation: mDoc(`A \`u:ins_file\` node reads a text file and inserts the text into the PDML document.

The file's path is specified by attribute \`path\`.

E.g.
\`[u:ins_file path=foo.txt]\`

[PDML Reference](${DOC_BASE_URL
          }${DOC_EXT_REF_SUBDIR}/#ins_file_node)`)
      },
    ]);
  }
}