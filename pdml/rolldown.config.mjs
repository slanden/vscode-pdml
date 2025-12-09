import { defineConfig } from "rolldown";

export default defineConfig([
	{
		input: "client/src/main.cjs",
		output: {
			dir: "dist",
			entryFileNames: "client.cjs",
			format: "cjs",
			inlineDynamicImports: true,
			minify: true,
		},
		transform: {
			define: {
				"process.env.IS_PROD": "true",
			},
		},
		external: ["vscode", "@bytecodealliance/preview2-shim"],
	},
	{
		input: "server/src/main.mjs",
		output: {
			dir: "dist",
			entryFileNames: "server.mjs",
			minify: true,
		},
		platform: "node",
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
			minify: true,
		},
	},
]);
