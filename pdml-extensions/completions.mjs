const PDML_DOC_BASE_URL = "https://pdml-lang.dev";
const PDML_DOC_EXT_REF_SUBDIR = "/docs/extensions/reference_manual";
const CMD_TRIGGER_SUGGEST = "editor.action.triggerSuggest";

const CompletionItemKind = Object.freeze({
	Text: 1,
	Method: 2,
	Function: 3,
	Constructor: 4,
	Field: 5,
	Variable: 6,
	Class: 7,
	Interface: 8,
	Module: 9,
	Property: 10,
	Unit: 11,
	Value: 12,
	Enum: 13,
	Keyword: 14,
	Snippet: 15,
	Color: 16,
	File: 17,
	Reference: 18,
	Folder: 19,
	EnumMember: 20,
	Constant: 21,
	Struct: 22,
	Event: 23,
	Operator: 24,
	TypeParameter: 25,
});

/**
 * @param {CompletionType} completionType Which
 * part of a node completions are being asked for
 * @param {string} name the namespace or node name,
 * depending on the `completionType`
 * @returns {CompletionItem[]} */
export function completions(completionType, name) {
	switch (completionType) {
		case CompletionType.BeginNode: {
			return pdmlNamespaces();
		}
		case CompletionType.EndNamespace: {
			switch (name) {
				case "s": {
					return pdmlScriptNodes();
				}
				case "t": {
					return pdmlTypeNodes();
				}
				case "u": {
					return pdmlUtilNodes();
				}
				default:
					return [];
			}
		}
		default:
			return [];
	}
}

/**@returns {CompletionItem[]} */
export function pdmlNamespaces() {
	return [
		{
			// `title` is required but empty because it's never shown
			command: { command: CMD_TRIGGER_SUGGEST, title: "" },
			label: "s",
			insertText: "s:",
			kind: CompletionItemKind.Module,
			documentation: mDoc(`PDML Extension: Script Nodes

[PDML Reference](${PDML_DOC_BASE_URL}/docs/extensions/user_manual/#script_nodes)`),
		},
		{
			command: { command: CMD_TRIGGER_SUGGEST, title: "" },
			insertText: "t:",
			label: "t",
			kind: CompletionItemKind.Module,
			documentation: mDoc(`PDML Extension: Type Nodes

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#types)`),
		},
		{
			command: { command: CMD_TRIGGER_SUGGEST, title: "" },
			insertText: "u:",
			label: "u",
			kind: CompletionItemKind.Module,
			documentation: mDoc(`PDML Extension: Utility Nodes

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#utility_nodes)`),
		},
	];
}

/**@returns {CompletionItem[]} */
export function pdmlScriptNodes() {
	return [
		{
			label: "def",
			kind: CompletionItemKind.Function,
			documentation: mDoc(`An \`s:def\` is used to define constants, variables, and functions that will later be used in \`s:exp\` or \`s:script\` nodes.

\`s:def\` nodes must be declared before using them in \`s:exp\` or \`s:script\` nodes.

[PDML Reference](${PDML_DOC_BASE_URL}/docs/extensions/user_manual/#definition_node)`),
		},
		{
			label: "exp",
			kind: CompletionItemKind.Function,
			documentation: mDoc(`An \`s:exp\` node evaluates an expression and inserts the result into the document.

[PDML Reference](${PDML_DOC_BASE_URL}/docs/extensions/user_manual/#expression_node)`),
		},
		{
			label: "script",
			kind: CompletionItemKind.Function,
			documentation:
				mDoc(`An \`s:script\` node embeds a regular script that can contain multiple statements. Any output from the script is not inserted into the document like in an \`s:exp\` node. To insert into the document, you must call [\`doc.insert\`](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#doc-insert).

[PDML Reference](${PDML_DOC_BASE_URL}/docs/extensions/user_manual/#script_node)`),
		},
	];
}

/**@returns {CompletionItem[]} */
export function pdmlTypeNodes() {
	return [
		{
			label: "date",
			kind: CompletionItemKind.TypeParameter,
			documentation: mDoc(`Specify a date in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#date)`),
		},
		{
			label: "string",
			kind: CompletionItemKind.TypeParameter,
			documentation: mDoc(`A \`t:string\` type denotes a node that can only contain text.

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#string)`),
		},
		{
			label: "raw_text",
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

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#raw_text)`),
		},
	];
}

/**@returns {CompletionItem[]} */
export function pdmlUtilNodes() {
	return [
		{
			label: "get",
			kind: CompletionItemKind.Function,
			documentation: mDoc(`A \`u:get\` node gets a parameter and inserts the parameter's value in the document. The parameter must have been defined with a \`u:set\` node before it can be used in a \`u:get\` node.

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#get_node)`),
		},
		{
			label: "set",
			kind: CompletionItemKind.Function,
			documentation: mDoc(`A \`u:set\` node assigns a value to one or more parameters.

After defining a parameter, its value can be inserted in the document with a \`u:get\` node.

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#set_node)`),
		},
		{
			label: "ins_file",
			kind: CompletionItemKind.Function,
			documentation: mDoc(`A \`u:ins_file\` node reads a text file and inserts the text into the PDML document.

The file's path is specified by attribute \`path\`.

E.g.
\`[u:ins_file path=foo.txt]\`

[PDML Reference](${PDML_DOC_BASE_URL}${PDML_DOC_EXT_REF_SUBDIR}/#ins_file_node)`),
		},
	];
}

// TODO: Copied from pdml extension; publish a
// 			 package extension devs can use instead
/**@typedef {Symbol} CompletionType */
const CompletionType = Object.freeze({
	Empty: 1,
	BeginNode: 2,
	EndNamespace: 3,
});

function mDoc(markdownString) {
	return {
		kind: "markdown",
		value: markdownString,
	};
}
