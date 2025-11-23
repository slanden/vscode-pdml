const plugins = [];

export function expectedPluginLayers(index) {
	return plugins[Math.max(Math.min(index, plugins.length), 0)].expectedLayers();
}

export function pluginsLen() {
	return plugins.length;
}

export function pushPlugin(plugin) {
	plugins.push(plugin);
}

export function runPlugin(index, bytes, layers, interupted = false) {
	return plugins[Math.max(Math.min(index, plugins.length), 0)].run(
		bytes,
		layers,
		interupted,
	);
}
