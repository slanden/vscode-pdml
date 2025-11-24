import { pushPlugin } from "../../host.mjs";
import { core as pdml } from "../../wasi-modules/pdml.mjs";
import { DiagnosticCode, lintEnabled } from "./lint.mjs";

export function initEngine() {
	const engine = new pdml.Engine();
	// TODO: Remove and use commented code once plugins are allowed to register layers
	engine.registerLayer(new TextEncoder().encode("attributes"), "key-value");
	// for (let i = 0, len = pluginsLen(); i < len; ++i) {
	// 	const expectedLayers = expectedPluginLayers(i);
	// 	for (let j = 0; j < expectedLayers.length; ++j) {
	// 		console.log("Register layer: ", expectedLayers[j]);
	// 		engine.registerLayer(
	// 			new TextEncoder().encode(expectedLayers[j].name),
	// 			expectedLayers[j].kind,
	// 		);
	// 	}
	// }
	return engine;
}

/** For every character in `text`, store a mapping between
 * the current UTF-8 and UTF-16 offsets to allow conversions
 * later */
export function buildOffsetMap(text) {
	const map = [{ utf8: 0, utf16: 0 }];
	let byteOffset = 0;
	let utf16Offset = 0;
	for (const char of text) {
		const codePoint = char.codePointAt(0);
		// * Use these lines instead of the UTF-8 offset is a
		// * byte offset instead of a char offset, and remove
		// * the `extra_char_bytes` calculation from the parser
		// const byteLength = Buffer.from(char, "utf-8").length;
		// byteOffset += byteLength;
		byteOffset += 1;
		utf16Offset += codePoint > 0xffff ? 2 : 1;
		map.push({ utf8: byteOffset, utf16: utf16Offset });
	}
	return map;
}

/** Returns a function that debounces an async function */
export function debounceAsync(fn, wait) {
	let timeout;
	let pendingPromise;
	let pendingResolve;

	return function (...args) {
		if (!pendingPromise) {
			pendingPromise = new Promise((resolve) => {
				pendingResolve = resolve;
			});
		}

		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			timeout = null;
			try {
				pendingResolve(await fn.apply(this, args));
			} finally {
				pendingPromise = null;
				pendingResolve = null;
			}
		}, wait);
		return pendingPromise;
	};
}

/** Use the result of `buildOffsetMap` to convert `utf8Offset`
 * to a UTF-16 offset
 */
export function utf16Offset(map, utf8Offset) {
	for (let i = 1; i < map.length; i++) {
		if (map[i].utf8 >= utf8Offset) {
			return (
				map[i - 1].utf16 +
				Math.floor(
					((utf8Offset - map[i - 1].utf8) * (map[i].utf16 - map[i - 1].utf16)) /
						(map[i].utf8 - map[i - 1].utf8),
				)
			);
		}
	}
	return map[map.length - 1].utf16;
}

// export const IdentityError = {
// 	/** Empty string, not a string, or wrong format
// 	 */
// 	Invalid: 1,
// 	InvalidName: 2,
// 	InvalidVersion: 3,
// };

export function pluginIdentity(id) {
	if (!id || typeof id !== "string") return null;

	let i = id.length;
	while (i > 0) {
		i--;
		if (id.charAt(i) === "@") {
			if (i === id.length - 1 || i === 0) {
				return null;
			}
			return [id.slice(0, i), id.slice(i + 1)];
		}
	}
	return null;
}

/**
 * @param {string} id extension-id + '@' + extension-version
 * @param {string} path The absolute path to the plugin file
 * bundled with the extension
 * @param {'js|wasip2'} type The type of plugin that `path`
 * either is (if 'js') or loads (if 'wasip2') */
export async function registerPlugin(path, type) {
	let plugin;
	if (!path.endsWith(".mjs")) {
		throw new Error(
			"`path` is expected to be a JavaScript module with a .mjs extension",
		);
	}

	if (type === "wasip2") {
		const mod = await import(path);
		plugin = mod.plugin;
	} else if (!type || type === "js") {
		plugin = await import(path);
	} else {
		throw new Error("`type` must be 'wasip2', 'js' or nothing");
	}

	// TODO: Remove once plugins are allowed to register layers
	if (plugin.expectedLayers().some((x) => x.name !== "attributes")) {
		throw new Error("Plugin expects a layer that isn't registered");
	}

	// TODO: Maybe also validate interface here

	pushPlugin(plugin);
}

/** Parse and validate a text document
 * @param {import("vscode").TextDocument} textDocument
 * @param {pdml.Engine} engine
 * @param {function[]} changeSubscriberCallbacks
 * @returns {Promise<import("vscode").Diagnostic[]>}
 */
export async function validateTextDocument(
	textDocument,
	engine,
	changeSubscriberCallbacks = [],
) {
	engine.clearParseState();
	const result = engine.parse(new TextEncoder().encode(textDocument.getText()));
	const encodingMap = buildOffsetMap(textDocument.getText());
	const diags = [];
	for (const note of result.notes) {
		if (
			!lintEnabled(note.code) ||
			(note.code === DiagnosticCode.LintInvalidName &&
				isOldExtensionNode(
					textDocument.getText(),
					utf16Offset(encodingMap, note.range[0]),
					note.range,
				))
		) {
			continue;
		}

		diags.push({
			message: note.message,
			range: {
				start: textDocument.positionAt(utf16Offset(encodingMap, note.range[0])),
				end: textDocument.positionAt(utf16Offset(encodingMap, note.range[1])),
			},
			severity: note.severity,
		});
	}
	const data = {
		keyValueLayer(name) {
			return engine.keyValueLayer(new TextEncoder().encode(name));
		},
		nodeKeyValueLayerEntries(node, layer) {
			return engine.nodeKeyValueLayerEntries(node, layer);
		},
		nodeName(node) {
			return engine.nodeName(node);
		},
	};
	for (const fn of changeSubscriberCallbacks) {
		fn(result.nodes, result.tree, data);
	}

	return diags;
}

function isOldExtensionNode(text, offset, diagnosticRange) {
	return (
		text.charAt(offset) === ":" &&
		diagnosticRange[1] === diagnosticRange[0] + 1 &&
		(text.charAt(offset - 1) === "t" ||
			text.charAt(offset - 1) === "u" ||
			text.charAt(offset - 1) === "s")
	);
}
