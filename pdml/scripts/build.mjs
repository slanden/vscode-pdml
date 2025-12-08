import fs from "node:fs";
import path from "node:path";

const vendorDir = path.join(
	import.meta.dirname,
	"..",
	"client",
	"node_modules",
	"@bytecodealliance",
	"jco-transpile",
	"vendor",
);

// jco-transpile relies on these files but the bundler
// doesn't include them

fs.copyFileSync(
	path.join(vendorDir, "js-component-bindgen-component.core.wasm"),
	path.join(
		import.meta.dirname,
		"..",
		"dist",
		"js-component-bindgen-component.core.wasm",
	),
);
fs.copyFileSync(
	path.join(vendorDir, "js-component-bindgen-component.core2.wasm"),
	path.join(
		import.meta.dirname,
		"..",
		"dist",
		"js-component-bindgen-component.core2.wasm",
	),
);
fs.copyFileSync(
	path.join(vendorDir, "wasm-tools.core.wasm"),
	path.join(import.meta.dirname, "..", "dist", "wasm-tools.core.wasm"),
);
fs.copyFileSync(
	path.join(vendorDir, "wasm-tools.core2.wasm"),
	path.join(import.meta.dirname, "..", "dist", "wasm-tools.core2.wasm"),
);
