import { Position, CompletionList } from "./vscode-languageserver.mjs";
import { TextDocument } from "vscode-languageserver-textdocument";

/** The second item will be the node name if the
 * `CompletionType` needs it
 * @typedef {[CompletionType, string | undefined]} CompletionHint
 */

/**@typedef {Symbol} CompletionType */
export const CompletionType = Object.freeze({
	Empty: 1,
	BeginNode: 2,
	EndNamespace: 3,
});

/**@returns {CompletionHint} */
export function getCompletionHint(lineText, index = lineText.length) {
	const sectionStart = rfindUnless(
		(char) => char === "[" || char === ":",
		lineText,
		index,
		/\s/,
	);
	if (sectionStart === undefined) {
		return [CompletionType.Empty, undefined];
	}
	if (lineText[sectionStart] === ":") {
		const nodeStart = rfindUnless("[", lineText, index, /\s/);
		return nodeStart === undefined
			? [CompletionType.Empty, undefined]
			: [
					CompletionType.EndNamespace,
					lineText.substring(nodeStart + 1, index - 1),
				];
	}
	return [CompletionType.BeginNode, undefined];
}

/** Recursively get vocabulary includes
 * @param {VocabularyId[]} initialIncludes
 * @param {{id: VocabularyId, includes: VocabularyId[]?}[]} vocabs
 */
export function getIncludes(initialIncludes, vocabs) {
	if (!initialIncludes?.length) return [];

	const vocab_names = initialIncludes;
	let i = 0;
	while (i < vocab_names.length) {
		const incs = vocabs.find((x) => x.id === vocab_names[i]);
		if (!incs) {
			vocab_names.splice(i, 1);
			continue;
		}
		if (incs.includes?.length) {
			vocab_names.push(...incs.includes);
		}
		i += 1;
	}
	// Dedupe
	return [...new Set(vocab_names)];
}

export function mDoc(markdownString) {
	return {
		kind: "markdown",
		value: markdownString,
	};
}

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
export function rfindUnless(needle, haystack, index, spider = undefined) {
	const matches =
		typeof needle === "string" ? (char) => char === needle : needle;
	let needlePos = index ?? Math.max(haystack.length - 1, 0);
	while (needlePos >= 0) {
		if (spider?.test(haystack.charAt(needlePos))) {
			return;
		}
		if (
			matches(haystack.charAt(needlePos)) &&
			(needlePos === 0 || haystack.charAt(needlePos - 1) !== "\\")
		) {
			return needlePos;
		}
		needlePos--;
	}
}

/**
 * Declare our "MyNewType" type (which is a function)
 *     with two parameters
 *     and a return value (object literal of type TypeObjTwoFns)
 *     (==> where the magic happens)
 * Note that "[at]typedef Function" is the same as "[at]callback" (as per the docs)
 *
 * @callback CompletionFn
 * @param {CompletionType} completionType Which
 * part of a node completions are being asked for
 * @param {string} name the namespace or node name,
 * depending on the `completionType`
 * @returns {CompletionItem[]}
 */

// /** @type {Map<string, {includes: string[]?, completions: CompletionFn}>} */

/** @typedef {string} VocabularyId
 * @description format: namespace ':' name
 */

/**
 * @typedef {object} Vocabulary
 * @property {CompletionFn} completions
 * @property {string} language only present before registering
 * @property {VocabularyId} id
 * @property {VocabularyId[]?} includes
 * the path to the file with the `completions` function
 */

// Only needed to know the initial set of includes,
// but would not need it if PDML had a custom node
// system
/** @type {{language: string, index: number}[]} language
 * IDs and the index into _vocabularies of their initial
 * includes */
export const _languages = [];

/** @type {Vocabulary[]} */
export const _vocabularies = [];

/**
 * @param {TextDocument} doc
 * @param {Position} pos */
export function getCompletions(doc, pos) {
	const fileExtensionStart = rfindUnless(".", doc.uri);
	const lang = Number.isNaN(fileExtensionStart)
		? doc.languageId
		: doc.uri.slice(fileExtensionStart + 1);

	const foundLang = _languages.find((x) => x.language === lang);
	if (!foundLang) return CompletionList.create();

	const vocab_names = getIncludes(
		_vocabularies[foundLang.index].includes,
		_vocabularies,
	);
	vocab_names.push(_vocabularies[foundLang.index].id);

	const [hint, name] = getCompletionHint(
		doc.getText({
			start: {
				line: pos.line,
				character: 0,
			},
			end: pos,
		}),
		pos.character,
	);
	const completions = [];
	for (const v of _vocabularies) {
		if (v.language === foundLang.language || vocab_names.includes(v.id)) {
			const compls = v.completions(hint, name);
			compls && completions.push(...compls);
		}
	}

	return CompletionList.create(completions);
}

/**
 *
 * @param {Vocabulary} vocab
 */
export function registerVocabulary(
	vocab,
	languages = _languages,
	vocabularies = _vocabularies,
) {
	if (!vocab.id || !vocab.completions || !vocab.language) {
		throw new Error(
			"A completion provider must provide a `language` ID, a `path` to a JavaScript module that provides completions, and a vocabulary `id` in the format of: namespace ':' name",
		);
	}
	if (
		(vocab.includes && !Array.isArray(vocab.includes)) ||
		vocab.includes?.some((x) => typeof x !== "string")
	) {
		throw new Error(
			"A vocabulary's `includes` must be a list of `VocabularyId`s",
		);
	}
	if (typeof vocab.completions !== "function") {
		throw new Error(
			"`completions` must be a function that returns completion items",
		);
	}

	const lang = languages.find((x) => x.language === vocab.language);
	if (!lang) {
		languages.push({ language: vocab.language, index: vocabularies.length });
	}

	vocabularies.push({
		completions: vocab.completions,
		id: vocab.id,
		includes: vocab.includes,
		language: vocab.language,
	});
}

/**
 *
 * @param {string} language
 * @param {VocabularyId[]} flattenedIncludes
 * @param {Vocabulary[]} vocabularies
 */
export function vocabulariesForCompletions(
	language,
	flattenedIncludes,
	vocabularies,
) {
	return vocabularies.filter(
		(x) => x.language === language || flattenedIncludes.includes(x.id),
	);
}
