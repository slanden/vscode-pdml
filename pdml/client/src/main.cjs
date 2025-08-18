// CommonJS wrapper to load the ES module

let extension;

module.exports = {
	async activate(context) {
		extension ??= await import("./main.mjs");
		return extension.activate(context);
	},
	async deactivate() {
		return extension?.deactivate();
	},
};
