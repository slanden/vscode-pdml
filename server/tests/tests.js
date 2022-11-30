const test = require('baretest')('Tests');
const assert = require('assert');
const { CompletionType, getCompletionHint, rfindUnless } = require('../src/lib.js');

// test('Should find a char index in reverse', () => {
//   // assert.equal(
//   //   rfindUnless('[', '[t:', 2, /\s/),
//   //   0
//   // );

//   // assert.equal(
//   //   rfindUnless('[', '[t :', 3, /\s/),
//   //   undefined
//   // );
//   let r = JSON.stringify("\[t:");

//   // let reg = new RegExp(String.raw`\\\\${d}`)
//   // console.log(JSON.stringify("\[t:"))
//   console.log(/\\.+/.test(r));
//   assert.equal(
//     rfindUnless('[', '\[t:', 2, /\s/),
//     undefined
//   );
// });

// test('Should get text left of the cursor', () => { });

test('Should determine completion type', () => {
  assert.equal(getCompletionHint("")?.[0], CompletionType.Empty);
  assert.equal(getCompletionHint("[")?.[0], CompletionType.BeginNode);
  const [hint, namespace] = getCompletionHint("[s:", 3);
  assert.equal(hint, CompletionType.EndNamespace);
  assert.equal(namespace, 's');
});

test.run();