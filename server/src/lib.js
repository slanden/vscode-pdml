const { MarkupContent, MarkupKind } = require("vscode-languageserver/node");
const {
  DiagnosticCode,
} = require("../../parser/pdml");

/** The second item will be the node name if the
 * `CompletionType` needs it
 * @typedef {[CompletionType, string | undefined]} CompletionHint
 */

const DIAGNOSTIC_CODE_TOGGLES = [
  // LintUnclosedNode
  true,
  // LintUnclosedAttributes
  true,
  // LintUnexpectedEquals
  true,
  // LintInvalidName
  false,
  // LintOneRoot
  true,
  // LintUnclosedRawText
  true,
  // LintInvalidCommentLocation
  true,
  // LintUselessAttributes
  true,
  // LintWhitespaceOnlyText
  true,
  // LintExcessiveWhitespace
  true,
];

/**@typedef {Symbol} CompletionType */
const CompletionType = Object.freeze({
  Empty: Symbol(0),
  BeginNode: Symbol(1),
  EndNamespace: Symbol(2),
});

/**@returns {CompletionHint} */
function getCompletionHint(lineText, index) {
  let sectionStart = rfindUnless(
    (char) => char === "[" || char === ":",
    lineText,
    index,
    /\s/,
  );
  if (sectionStart === undefined) {
    return [CompletionType.Empty, undefined];
  }
  if (lineText[sectionStart] === ":") {
    let nodeStart = rfindUnless(
      "[",
      lineText,
      index,
      /\s/,
    );
    return nodeStart === undefined ? [CompletionType.Empty, undefined] : [
      CompletionType.EndNamespace,
      lineText.substring(nodeStart + 1, index - 1),
    ];
  }
  return [CompletionType.BeginNode, undefined];
}

/** Returns true if the lint is enabled
 * @param {DiagnosticCode} code
 */
function lintEnabled(code) {
  return DIAGNOSTIC_CODE_TOGGLES[code];
}

/** @returns {MarkupContent} A Markdown doc object */
function mDoc(markdownString) {
  return {
    kind: MarkupKind.Markdown,
    value: markdownString,
  };
}

//* This works in production, but not in testing;
//* Something to do with escaping characters.
/**
 * Search from the end of *haystack* for *needle*,
 * return undefined if *spider* found.
 * @param {String | Function} needle - A single character, or
 * function that takes in a char to see if it matches
 * @param {String} haystack
 * @param {Number} index - Position to search from
 * @param {RegExp} spider - A single character
 * @returns {Number} The index where `needle` was
 * found, otherwise undefined
 */
function rfindUnless(needle, haystack, index, spider = undefined) {
  const matches = typeof needle === "string"
    ? (char) => char === needle
    : needle;
  let needlePos = index;
  while (needlePos >= 0) {
    if (
      spider && spider.test(
        haystack.charAt(needlePos),
      )
    ) {
      return;
    }
    if (
      matches(haystack.charAt(needlePos)) && (
        needlePos == 0 ||
        haystack.charAt(needlePos - 1) !== "\\"
      )
    ) {
      return needlePos;
    }
    needlePos--;
  }
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
function settingNameToLintName(name) {
  return "Lint" +
    name.charAt(0).toUpperCase() +
    name.substring(1);
}

module.exports = {
  CompletionType,
  DIAGNOSTIC_CODE_TOGGLES,
  getCompletionHint,
  lintEnabled,
  mDoc,
  rfindUnless,
  settingNameToLintName,
};
