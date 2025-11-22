import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const RUST_PROJECT_DIR = "/home/slanden/Projects/pdml-parser";
const WASM_OUTPUT_DIR = path.join(import.meta.dirname, "..", "wasi-modules");

if (fs.existsSync(WASM_OUTPUT_DIR)) {
	try {
		fs.rmSync(WASM_OUTPUT_DIR, { recursive: true });
	} catch (err) {
		console.error(err);
	}
} else {
	fs.mkdirSync(WASM_OUTPUT_DIR, { recursive: true });
}

// List directory names the plugin source lives in the
// official_plugins directory
const plugins = ["attributes", "comments"];

for (const name of plugins) {
	child_process.execSync(
		`cargo build --target wasm32-wasip2 ${process.argv[2] ? "--release" : ""}`,
		{
			cwd: `${RUST_PROJECT_DIR}/official_plugins/${name}`,
			stdio: "inherit",
		},
	);

	fs.cp(
		path.join(
			RUST_PROJECT_DIR,
			"target",
			"wasm32-wasip2",
			process.argv[2] ? "release" : "debug",
			`pdml_${name}.wasm`,
		),
		path.join(WASM_OUTPUT_DIR, `pdml_${name}.wasm`),
		(e) => e && console.error(e),
	);
}
