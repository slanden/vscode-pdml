import { defineConfig } from "rolldown";
import fs from "node:fs/promises";

const items = [
	{
		input: "completions.mjs",
		output: {
			dir: "dist",
			entryFileNames: "completions.mjs",
		},
		platform: "node",
	},
	{
		input: "main.cjs",
		output: {
			dir: "dist",
			entryFileNames: "main.cjs",
			format: "cjs",
		},
		define: {
			"process.env.IS_PROD": "true",
		},
	},
	// The JS file generated from JCO relies on this but the bundler
	// doesn't include it, probably because of the syntax it used for
	// a dynamic import:
	// `fileURLToPath(new URL("./worker-thread.js", import.meta.url))`
	{
		input:
			"node_modules/@bytecodealliance/preview2-shim/lib/io/worker-thread.js",
		output: {
			dir: "dist",
			format: "cjs",
		},
	},
];
const entries = await fs.readdir("wasi-modules");
for (const entry of entries) {
	if (!entry.endsWith(".mjs")) continue;
	console.log(entry);
	items.push({
		input: `wasi-modules/${entry}`,
		output: {
			dir: "dist",
			entryFileNames: entry,
		},
		platform: "node",
	});
}
export default defineConfig(items);
