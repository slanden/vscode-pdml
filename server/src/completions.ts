/*
Decision:
The default `CompletionItemKind` for nodes is `Constructor`,
as the closest thing to what a markup element does; it tells
the renderer how to *construct* a node. The second closest
thing might be `Class`.
*/

import { CompletionItem, CompletionItemKind, Position } from 'vscode-languageserver/node';
import { mDoc } from './lib.js';

const PDML_DOC_BASE_URL = 'https://pdml-lang.dev';
const PDML_DOC_EXT_REF_SUBDIR = '/docs/extensions/reference_manual';
const CMD_TRIGGER_SUGGEST = 'editor.action.triggerSuggest';

const PML_DOC_BASE_URL = 'https://pml-lang.dev';
const PML_REF_SUBDIR = '/docs/reference_manual';

/**@returns {CompletionItem[]} */
export function pdmlNamespaces(pos: Position) {
  return [
    {
      label: 's',
      kind: CompletionItemKind.Module,
      documentation: mDoc(`PDML Extension: Script Nodes

[PDML Reference](${PDML_DOC_BASE_URL
        }/docs/extensions/user_manual/#script_nodes)`),
      textEdit: { newText: 's:', range: { start: pos, end: pos } },
      // `title` is required but empty because it's never shown
      command: { command: CMD_TRIGGER_SUGGEST, title: '' },
    },
    {
      label: 't',
      kind: CompletionItemKind.Module,
      documentation: mDoc(`PDML Extension: Type Nodes

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#types)`),
      textEdit: { newText: 't:', range: { start: pos, end: pos } },
      command: { command: CMD_TRIGGER_SUGGEST, title: '' }
    },
    {
      label: 'u',
      kind: CompletionItemKind.Module,
      documentation: mDoc(`PDML Extension: Utility Nodes

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#utility_nodes)`),
      textEdit: { newText: 'u:', range: { start: pos, end: pos } },
      // `title` is required but empty because it's never shown
      command: { command: CMD_TRIGGER_SUGGEST, title: '' },
    },
  ];
}

/**@returns {CompletionItem[]} */
export function pdmlScriptNodes() {
  return [
    {
      label: 'def',
      kind: CompletionItemKind.Function,
      documentation: mDoc(`An \`s:def\` is used to define constants, variables, and functions that will later be used in \`s:exp\` or \`s:script\` nodes.

\`s:def\` nodes must be declared before using them in \`s:exp\` or \`s:script\` nodes.

[PDML Reference](${PDML_DOC_BASE_URL
        }/docs/extensions/user_manual/#definition_node)`)
    },
    {
      label: 'exp',
      kind: CompletionItemKind.Function,
      documentation: mDoc(`An \`s:exp\` node evaluates an expression and inserts the result into the document.

[PDML Reference](${PDML_DOC_BASE_URL
        }/docs/extensions/user_manual/#expression_node)`)
    },
    {
      label: 'script',
      kind: CompletionItemKind.Function,
      documentation: mDoc(`An \`s:script\` node embeds a regular script that can contain multiple statements. Any output from the script is not inserted into the document like in an \`s:exp\` node. To insert into the document, you must call [\`doc.insert\`](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#doc-insert).

[PDML Reference](${PDML_DOC_BASE_URL
        }/docs/extensions/user_manual/#script_node)`)
    },
  ];
}

/**@returns {CompletionItem[]} */
export function pdmlTypeNodes() {
  return [
    {
      label: 'date',
      kind: CompletionItemKind.TypeParameter,
      documentation: mDoc(`Specify a date in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#date)`)
    },
    {
      label: 'string',
      kind: CompletionItemKind.TypeParameter,
      documentation: mDoc(`A \`t:string\` type denotes a node that can only contain text.

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#string)`)
    },
    {
      label: 'raw_text',
      kind: CompletionItemKind.TypeParameter,
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

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#raw_text)`)
    },
  ];
}

/**@returns {CompletionItem[]} */
export function pdmlUtilNodes() {
  return [
    {
      label: 'get',
      kind: CompletionItemKind.Function,
      documentation: mDoc(`A \`u:get\` node gets a parameter and inserts the parameter's value in the document. The parameter must have been defined with a \`u:set\` node before it can be used in a \`u:get\` node.

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#get_node)`)
    },
    {
      label: 'set',
      kind: CompletionItemKind.Function,
      documentation: mDoc(`A \`u:set\` node assigns a value to one or more parameters.

After defining a parameter, its value can be inserted in the document with a \`u:get\` node.

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#set_node)`)
    },
    {
      label: 'ins_file',
      kind: CompletionItemKind.Function,
      documentation: mDoc(`A \`u:ins_file\` node reads a text file and inserts the text into the PDML document.

The file's path is specified by attribute \`path\`.

E.g.
\`[u:ins_file path=foo.txt]\`

[PDML Reference](${PDML_DOC_BASE_URL
        }${PDML_DOC_EXT_REF_SUBDIR}/#ins_file_node)`)
    },
  ];
}

/**@returns {CompletionItem[]} */
export function pmlNodes() {
  return [
    {
      label: 'options',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Options\n
Used to define a set of options applied to the document. If used, this node must be the first child node of the \`doc\` node.

Please consult the user manual and/or the CLI manual to see the list of options available.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_options)`)
    },
    {
      label: 'doc',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Document\n
Every PML document must start with a 'doc' node. It is the root node of the document.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_doc)`)
    },
    {
      label: 'p',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Paragraph\n
A paragraph is a set of one or more sentences. It is not required to embed a paragraph within a node.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_p)`)
    },
    {
      label: 'ch',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Chapter\n
A chapter in the document.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_ch)`)
    },
    {
      label: 'title',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Chapter Title\n
A title for a chapter. This must be the first child node of a chapter. The text of this node is used in the table of contents.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_title)`)
    },
    {
      label: 'subtitle',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Chapter Subtitle\n
A subtitle for a chapter, displayed on a separate line after a chapter's title. If present, this node must follow a \`title\` node.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_ch)`)
    },
    {
      label: 'list',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`List\n
A bulleted list of nodes.

CSS can be used to change the item marker's appearance (e.g. use numbers). The CSS must be assigned to attribute \`html_style\`.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_list)`)
    },
    {
      label: 'el',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`List Element\n
An element of a list.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_el)`)
    },
    {
      label: 'sim_table',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Table Data\n
Simple table data defined as plain text, and rendered as a table. Each line of text represents a row.

All cell values in all rows are separated by the same character which can be: a vertical bar (|), a semicolon (;), or a comma (,).

The content of each cell can only be plain text. If formatted text or complex cell content (e.g. picture in a cell, or table in a table) is needed, then please use the \`table\` tag.

## Example

Simple table:
\`\`\`
[sim_table
  ~~~
    cell 1.1, cell 1.2
    cell 2.1, cell 2.2
  ~~~
]
\`\`\`

Table with header, footer, and column alignments:
\`\`\`
[sim_table (halign="C,L,R")
    ~~~
    Position, Product, Price
    -
    1, Organic food, 12.50
    2, Meditation lessons, 150.00
    -
    ,,Total: 162.50
    ~~~
]
\`\`\`

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_table_data)`)
    },
    {
      label: 'table',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Table\n
A table consisting of rows and columns. The content of each cell can be just plain text or any complex node, such as formatted text, a picture, a table (table in a table), etc. The table's structure is similar to an HTML table.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_table)`)
    },
    {
      label: 'theader',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Table Header\n
A header in a table.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_theader)`)
    },
    {
      label: 'tfooter',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Table Footer\n
A footer in a table.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_tfooter)`)
    },
    {
      label: 'tr',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Table Row\n
A row in a table.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_tr)`)
    },
    {
      label: 'tc',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Table Cell\n
A cell in a table row.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_tc)`)
    },
    {
      label: 'header',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Header\n
A header (small title) displayed on a separate line.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_header)`)
    },
    {
      label: 'caption',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Caption\n
A small title that is not part of the table of contents, typically displayed below a block element (\`image\`, \`video\`, \`table\`, etc.).

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_caption)`)
    },
    {
      label: 'admon',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Admonition\n
A labeled piece of advice, such as a note, tip, warning, etc.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_admon)`)
    },
    {
      label: 'note',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Note\n
A note is an \`admonition\` with label 'Note'.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_note)`)
    },
    {
      label: 'quote',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Quote\n
A piece of text said or written by somebody else.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_quote)`)
    },
    {
      label: 'monospace',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Monospace\n
A paragraph in which whitespace is preserved, and a fixed-width font is used. The text will be rendered exactly as written in the PML document.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_monospace)`)
    },
    {
      label: 'div',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Division\n
A division or section in the document.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_div)`)
    },
    {
      label: 'html',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`HTML Code\n
      A node that contains HTML code.
The HTML code is not processed in any way by the PML converter. It is passed as is to the resulting HTML document.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_html)`)
    },
    {
      label: 'image',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Image\n
An image.

Note: Attribute 'html_alt' can be used to add an explicit 'alt' attribute in the resulting HTML.

## Example

\`\`\`
[image (
    source=media/strawberries.jpg
    link=https://unsplash.com/photos/kH3Sr9K8EBA
    html_alt="Delicious strawberries"
  )
]
\`\`\`

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_image)`)
    },
    {
      label: 'audio',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Audio\n
An audio stream.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_audio)`)
    },
    {
      label: 'video',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Video\n
A video.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_video)`)
    },
    {
      label: 'youtube_video',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Embedded Youtube Video\n
A Youtube video embedded in the document.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_youtube_video)`)
    },
    {
      label: 'fnote',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Inline Footnote\n
Footnotes whose content is defined inline. They are displayed later in the document, as soon as an \`fnotes\` node is encountered. Inline footnotes can contain text and other inline nodes to style the footnote, but cannot contain block nodes.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_fnote)`)
    },
    {
      label: 'fnotes',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Footnotes Placeholder\n
Used as a placeholder for printing/displaying footnotes. All footnotes not yet displayed will be displayed as soon as an \`fnotes\` node is encountered. This includes inline and non-inline footnotes.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_fnotes)`)
    },
    {
      label: 'fnote_def',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Footnote Definition\n
Define the content of a footnote. \`fnote_def\` nodes can be defined anywhere in the document, but they must be defined before the \`fnotes\` node used to display the footnotes.

Every 'fnote_def' node must have a unique identifier, explicitly specified by attribute 'id'. This identifier is used in 'fnote_ref' nodes to insert a link to the footnote in the text, using attribute 'did'.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_fnote_def)`)
    },
    {
      label: 'fnote_ref',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Footnote Reference\n
Inserts a footnote defined with an \`fnote_def\` node.

Attribute \`did\` must be explicitly defined, and must be equal to the \`id\` attribute of a \`fnote_def\` node.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_fnote_ref)`)
    },
    {
      label: 'code',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Source Code\n
A block of source code.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_code)`)
    },
    {
      label: 'insert_code',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Insert Source Code\n
Insert source code stored in an external file.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_insert_code)`)
    },
    {
      label: 'input',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Input\n
Any input provided to a software application, such as a command typed in a terminal, text contained in a config file, etc.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_input)`)
    },
    {
      label: 'output',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Output\n
Any output created by a software application, such as a result written to the OS's standard output device.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_output)`)
    },
    {
      label: 'b',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Bold Text\n
Bold text.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_b)`)
    },
    {
      label: 'i',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Italic Text\n
Italicized text.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_i)`)
    },
    {
      label: 'sub',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Subscript Text\n
Subscript text is rendered in a smaller font below the normal text line.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_sub)`)
    },
    {
      label: 'sup',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Superscript Text\n
Superscript text is rendered in a smaller font above the normal text line.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_sup)`)
    },
    {
      label: 'strike',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Strikethrough Text\n
Strikethrough text is rendered with a line through it.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_strike)`)
    },
    {
      label: 'c',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Inline Source Code\n
Source code embedded within text.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_c)`)
    },
    {
      label: 'link',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`URL Link\n
A URL link to a resource, such as a website or a file to download.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_link)`)
    },
    {
      label: 'verbatim',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Verbatim Text\n
Raw text that is rendered as is, without any transformations.

Note: The text still has to be escaped, according to the standard PML escaping rules.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_verbatim)`)
    },
    {
      label: 'xref',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Cross Reference\n
A cross reference to another node in the same document.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_xref)`)
    },
    {
      label: 'span',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Span\n
This inline node is typically used to render an HTML \`<span>\` element with a specific set of HTML attributes.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_span)`)
    },
    {
      label: 'nl',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`New Line\n
An explicit line break.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_nl)`)
    },
    {
      label: 'sp',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Space Character\n
An explicit space character. Consecutive whitespace is always converted into a single space, as in HTML. This node can be used to explicitly insert two or more spaces.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_sp)`)
    },
    {
      label: 'text',
      kind: CompletionItemKind.Constructor,
      documentation: mDoc(`Text\n
A node containing text. This node is not usually used in hand-written documents, because free text is implicitly contained in a \`text\` node.

[PML Reference](${PML_DOC_BASE_URL}${PML_REF_SUBDIR
        }/#node_text)`)
    },
  ];
}
