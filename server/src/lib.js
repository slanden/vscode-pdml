const { MarkupContent, MarkupKind } = require('vscode-languageserver/node');

/** @returns {MarkupContent} A Markdown doc object */
function mDoc(markdownString) {
  return {
    kind: MarkupKind.Markdown,
    value: markdownString
  }
}

// ! This works in production, but not in testing;
// ! Something to do with escaping characters.
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

module.exports = {
  mDoc,
  rfindUnless
}