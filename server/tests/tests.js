const test = require('baretest')('Tests');
const assert = require('assert');
const { rfindUnless } = require('../src/lib.js');

test('Should find a char index in reverse', () => {
  // assert.equal(
  //   rfindUnless('[', '[t:', 2, /\s/),
  //   0
  // );

  // assert.equal(
  //   rfindUnless('[', '[t :', 3, /\s/),
  //   undefined
  // );
  let r = JSON.stringify("\[t:");

  // let reg = new RegExp(String.raw`\\\\${d}`)
  // console.log(JSON.stringify("\[t:"))
  console.log(/\\.+/.test(r));
  assert.equal(
    rfindUnless('[', '\[t:', 2, /\s/),
    undefined
  );
});

test.run();