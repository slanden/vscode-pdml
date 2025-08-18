const plugins = [];

export function pluginsLen() {
	return plugins.length;
}

export function pushPlugin(plugin) {
	plugins.push(plugin);
}

export function runPlugin(index, bytes, interupted = false) {
	return plugins[Math.max(Math.min(index, plugins.length), 0)].run(
		bytes,
		interupted,
	);
}
