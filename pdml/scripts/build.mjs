import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const dir = import.meta.dirname;
const RUST_PROJECT_DIR = "/home/slanden/Projects/pdml-parser";
const WASM_OUTPUT_DIR = path.join(dir, "..", "wasi-modules");
const MOD_NAME = "pdml";
const WASI_PKG_NAME = "pdml:plugin";

if (!fs.existsSync(WASM_OUTPUT_DIR)) {
	fs.mkdirSync(WASM_OUTPUT_DIR, { recursive: true });
}

child_process.execSync(
	`cargo build --target wasm32-wasip2 ${process.argv[2] ? "--release" : ""}`,
	{
		cwd: `${RUST_PROJECT_DIR}/core`,
		stdio: "inherit",
	},
);

const WASM_FILE_PATH = path.join(
	RUST_PROJECT_DIR,
	"target",
	"wasm32-wasip2",
	process.argv[2] ? "release" : "debug",
	`${MOD_NAME}.wasm`,
);

child_process.execSync(
	`jco transpile ${WASM_FILE_PATH} -o ${WASM_OUTPUT_DIR} --map '${WASI_PKG_NAME}/*=../host.mjs'`,
);

// The language server can't have `"type": "module"`, which
// causes immediate crash
fs.renameSync(
	`${WASM_OUTPUT_DIR}/${MOD_NAME}.js`,
	`${WASM_OUTPUT_DIR}/${MOD_NAME}.mjs`,
);
fs.renameSync(
	`${WASM_OUTPUT_DIR}/${MOD_NAME}.d.ts`,
	`${WASM_OUTPUT_DIR}/${MOD_NAME}.d.mts`,
);
