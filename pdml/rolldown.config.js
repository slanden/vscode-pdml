import { defineConfig } from "rolldown";

export default defineConfig([
	{
		input: "client/src/main.cjs",
		output: {
			dir: "dist",
			format: "cjs",
			entryFileNames: "client.cjs",
			inlineDynamicImports: true,
		},
	},
	{
		input: "server/src/server.mjs",
		output: {
			dir: "dist",
			entryFileNames: "server.mjs",
		},
		define: {
			"process.env.IS_PROD": "true",
		},
		platform: "node",
	},
]);
