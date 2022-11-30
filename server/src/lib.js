const { MarkupContent, MarkupKind } = require('vscode-languageserver/node');

/** @returns {MarkupContent} A Markdown doc object */
function mDoc(markdownString) {
  return {
    kind: MarkupKind.Markdown,
    value: markdownString
  }
}

//* This works in production, but not in testing;
//* Something to do with escaping characters.
/**
 * Search from the end of *haystack* for *needle*,
 * return undefined if *spider* found.
 * @param {String} needle - A single character
 * @param {String} haystack
 * @param {Number} index - Position to search from
 * @param {RegExp} spider  - A single character
 * @returns {Number} The index where `needle` was
 * found, otherwise undefined
 */
function rfindUnless(needle, haystack, index, spider = undefined) {
  let needlePos = index;
  while (needlePos >= 0) {
    if (spider && spider.test(
      haystack.charAt(needlePos)
    )) {
      return;
    }
    if (haystack.charAt(needlePos) === needle && (
      needlePos == 0 ||
      haystack.charAt(needlePos - 1) !== '\\'
    )) {
      return needlePos;
    }
    needlePos--;
  }
}

/**@typedef {Symbol} CompletionType */
const CompletionType = Object.freeze({
  Empty: Symbol(0),
  BeginNode: Symbol(1),
  EndNamespace: Symbol(2),
});

/** The second item will be the node name if the
 * `CompletionType` needs it
 * @typedef {[CompletionType, string | undefined]} CompletionHint
 */

/**@returns {CompletionHint} */
function getCompletionHint(lineText, index) {
  if (lineText.endsWith('[')) {
    return [CompletionType.BeginNode, undefined];
  } else if (lineText.endsWith(':')) {
    const nodeStart = rfindUnless(
      '[',
      lineText, index - 1,
      /\s/
    );

    if (nodeStart !== undefined) {
      return [
        CompletionType.EndNamespace,
        lineText.substring(nodeStart + 1, index - 1)
      ];
    }
  }
  return [CompletionType.Empty, undefined];
}

module.exports = {
  CompletionType,
  getCompletionHint,
  mDoc,
  rfindUnless
}