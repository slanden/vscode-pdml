import { defineConfig } from "rolldown";
import fs from "node:fs/promises";

const OUT_DIR = "dist";
const PLUGIN_DIR = `${OUT_DIR}/plugins`;

fs.mkdir(PLUGIN_DIR, { recursive: true });
const items = defineConfig([
	{
		input: "completions.mjs",
		output: {
			dir: OUT_DIR,
			entryFileNames: "completions.mjs",
			minify: true,
		},
		platform: "node",
	},
	{
		input: "main.cjs",
		output: {
			dir: OUT_DIR,
			entryFileNames: "main.cjs",
			format: "cjs",
			minify: true,
		},
		transform: {
			define: {
				"process.env.IS_PROD": "true",
			},
		},
		external: "vscode",
	},
]);
const entries = await fs.readdir("wasi-modules");
for (const entry of entries) {
	if (!entry.endsWith(".mjs")) continue;
	console.log(entry);
	items.push({
		input: `wasi-modules/${entry}`,
		output: {
			dir: PLUGIN_DIR,
			entryFileNames: entry,
		},
		platform: "node",
	});
}
export default items;
