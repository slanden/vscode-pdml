import { pluginIdentity, buildOffsetMap, getUtf16Offset } from "./lib.mjs";
import assert from "node:assert";
import test from "node:test";

test("should validate a plugin identifier", () => {
	assert.deepEqual(pluginIdentity("a@1.0"), ["a", "1.0"]);
	assert.deepEqual(pluginIdentity("a@"), null);
	assert.deepEqual(pluginIdentity("@1.0"), null);
	assert.deepEqual(pluginIdentity(""), null);
});

test("Should convert utf-8 offsets to utf-16", () => {
	const text = `abc[root
  [subnode (no-val num=0 sq='1' dq="3\d2" uq=unq dec=-0.99 [- Comment in attrs -] 42 "standalone dquote" 'standalone squote' s=/a/b)]
  [subnode ^(
    no-value
    number=0
    squote='1'
    dquote="3\d2"
    unquote=unq
    invalid==
    namespaced:attr:a
    😁=emoj
    decimal= -0.99
    [- Comment in attrs -]

    tally=[u:get tally]
    42
    "standalone dquote"
    'standalone squote'
    s= /a/b
    path = C:\name\test ok
  )]
  [subnode
    (attr=3)
  ]
  [a[b c]]
  [title Example PDML File]
  [dashed-node]
  [😏:😁.-! moj]`;
	const map = buildOffsetMap(text);
	const diagnostics = [
		// Diagnostic { message: "Only whitespace can precede or follow the root node.", range: (0, 3), node-index: 1, code: 5, severity: 2 }
		[0, 3],
		// Diagnostic { message: "Invalid escape sequence", range: (46, 48), node-index: 3, code: 9, severity: 2 }
		[46, 48],
		// Diagnostic { message: "Invalid attribute", range: (361, 380), node-index: 0, code: 0, severity: 1 }
		[361, 380],
		// Diagnostic { message: "Invalid attribute", range: (385, 404), node-index: 0, code: 0, severity: 1 }
		[385, 404],
		// Diagnostic { message: "Must have a separator", range: (480, 481), node-index: 14, code: 12, severity: 2 }
		[480, 481],
		// Diagnostic { message: "This character must be escaped in node names", range: (536, 537), node-index: 23, code: 4, severity: 1 }
		[536, 537],
		// Diagnostic { message: "This character must be escaped in node names", range: (540, 541), node-index: 23, code: 4, severity: 1 }
		[540, 541],
	];
	assert.equal(getUtf16Offset(map, diagnostics[0][0]), 0);
	assert.equal(getUtf16Offset(map, diagnostics[0][1]), 3);

	assert.equal(getUtf16Offset(map, diagnostics[2][0]), 359);
	assert.equal(getUtf16Offset(map, diagnostics[2][1]), 378);

	assert.equal(getUtf16Offset(map, diagnostics[4][0]), 478);
	assert.equal(getUtf16Offset(map, diagnostics[4][1]), 479);
});
