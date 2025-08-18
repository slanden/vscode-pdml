export const DIAGNOSTIC_CODE_TOGGLES = [
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
];
export const DiagnosticCode = {
	LintUnclosedNode: 0,
	LintUnclosedAttributes: 1,
	/** No registered extensions understand this */
	LintUnrecognizedExtension: 2,
	/** Unexpected '=' in attributes */
	LintUnexpectedEquals: 3,
	LintInvalidName: 4,
	/** No more than one root node */
	LintOneRoot: 5,
	/**
	 * Unbalanced raw text delimiters (open
	 * delimiters must match closing delimiters)
	 */
	LintUnclosedRawText: 6,
	/** Contains invalid characters */
	LintInvalidCharacter: 7,
	/**
	 * Comments not allowed b/w node name &
	 * attributes, or on either side of a '=' in
	 * attributes
	 */
	LintInvalidCommentLocation: 8,
	/** Only certain characters can be escaped */
	LintInvalidEscape: 9,
	/** A tag separator is not allowed in an empty node */
	LintInvalidSeparatorLocation: 10,
	/**
	 * A registered extension must follow an extension
	 * starting character
	 */
	LintMissingExtension: 11,
	/** Non-empty nodes must have a separator */
	LintMissingSeparator: 12,
	/**
	 * Empty Attributes container, except when
	 * used to disambiguate text starting with
	 * parentheses, i.e.
	 * `[a ()]` but not
	 * `[a () (text in actual parenthesis)]`
	 */
	LintUselessAttributes: 13,
	LintWhitespaceOnlyText: 14,
	/**
	 * Gratuitous leading/trailing whitespace
	 * in a text node
	 */
	LintExcessiveWhitespace: 15,
};

/** Returns true if the lint is enabled
 * @param {DiagnosticCode} code
 */
export function lintEnabled(code) {
	return DIAGNOSTIC_CODE_TOGGLES[code];
}

/** Convert a setting `name` to a `DiagnosticCode`
 * variant.
 *
 * A variant starts with "Lint" followed by the name
 * in PascalCase. A setting is just the name in
 * camelCase.
 *
 * E.g.
 * "someSetting" -> "LintSomeSetting"
 * @param {string} name
 */
export function settingNameToLintName(name) {
	// biome-ignore lint/style/useTemplate: <explanation>
	return "Lint" + name.charAt(0).toUpperCase() + name.substring(1);
}
