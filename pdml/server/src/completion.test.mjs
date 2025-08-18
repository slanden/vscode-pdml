import assert from "node:assert";
import test from "node:test";
import {
	getIncludes,
	getCompletionHint,
	rfindUnless,
	CompletionType,
	registerVocabulary,
	vocabulariesForCompletions,
} from "./completion.mjs";

test("Should find a char index in reverse", () => {
	assert.equal(rfindUnless("[", "[t:", 3, /\s/), 0);
	assert.equal(rfindUnless("[", "[t:", 2, /\s/), 0);
	assert.equal(rfindUnless("[", "[", 0, /\s/), 0);
	assert.equal(rfindUnless("[", "", 0, /\s/), undefined);
	assert.equal(rfindUnless(".", "a.b"), 1);
	assert.equal(rfindUnless(".", "a.b", 1), 1);
	assert.equal(rfindUnless(".", "a.b", 3), 1);
	assert.equal(rfindUnless(".", "a.b", 0), undefined);
});

test("Should determine completion type", () => {
	assert.equal(getCompletionHint("")?.[0], CompletionType.Empty);
	assert.equal(getCompletionHint("[")?.[0], CompletionType.BeginNode);
	let [hint, namespace] = getCompletionHint("[s:", 3);
	assert.equal(hint, CompletionType.EndNamespace);
	assert.equal(namespace, "s");
	[hint, namespace] = getCompletionHint("[s:t:", 3);
	assert.equal(hint, CompletionType.EndNamespace);
	// assert.equal(namespace, "s:t");
});

test("Should get a list of a vocab's includes", () => {
	const vocabularies = [
		{
			id: "base:bbb",
		},
		{
			id: "a:1",
			includes: ["base:bbb", "b:1", "e"],
		},
		{
			id: "b:1",
			includes: ["base:bbb", "c"],
		},
	];

	assert.deepEqual(getIncludes(["a:1", "d:d"], vocabularies), [
		"a:1",
		"base:bbb",
		"b:1",
	]);
	assert.deepEqual(getIncludes(["base:bbb"], vocabularies), ["base:bbb"]);
});

test("Should register a vocabulary", () => {
	/** @type {{language: string, index: number}[]} */
	const languages = [];
	/** @type {import("./completion.mjs").Vocabulary[]} */
	const vocabularies = [];

	const vocab = {
		completions: [],
		language: "a",
		id: "a:b",
		includes: [],
	};
	assert.throws(
		() => registerVocabulary(vocab, languages, vocabularies),
		"`completions` shoule be a function",
	);
	vocab.completions = () => [];
	assert.doesNotThrow(() => registerVocabulary(vocab, languages, vocabularies));
	assert(languages.find((x) => x.language === "a")?.index === 0);
	assert.deepEqual(
		vocabularies.find((x) => x.id === "a:b"),
		{
			completions: vocab.completions,
			language: "a",
			id: "a:b",
			includes: [],
		},
	);
});

test("Should get vocabularies to provide completions with", () => {
	/** @type {{language: string, index: number}[]} */
	const languages = [
		{ language: "base", index: 0 },
		{
			language: "a",
			index: 1,
		},
		{
			language: "b",
			index: 2,
		},
	];
	/** @type {import("./completion.mjs").Vocabulary[]} */
	const vocabularies = [
		{
			id: "base:bbb",
		},
		{
			id: "a:1",
			includes: ["base:bbb", "b:1", "e"],
		},
		{
			id: "b:1",
			includes: ["base:bbb", "c"],
		},
	];

	let results = vocabulariesForCompletions(
		"a",
		["a:1", "base:bbb", "b:1"],
		vocabularies,
	);
	assert(results.includes(vocabularies[0]));
	assert(results.includes(vocabularies[1]));
	assert(results.includes(vocabularies[2]));
	results = vocabulariesForCompletions("b", ["b:1", "base:bbb"], vocabularies);
	assert(results.includes(vocabularies[0]));
	assert(results.includes(vocabularies[2]));
});
