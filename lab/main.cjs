const vscode = require("vscode");

module.exports = {
	async activate(context) {
		const entries = await vscode.workspace.fs.readDirectory(
			process.env.IS_PROD
				? vscode.Uri.joinPath(context.extensionUri, "dist", "plugins")
				: vscode.Uri.joinPath(context.extensionUri, "wasi-modules"),
		);
		const plugins = [];
		for (const entry of entries) {
			plugins.push({
				path: (process.env.IS_PROD
					? vscode.Uri.joinPath(
							context.extensionUri,
							"dist",
							"plugins",
							entry[0],
						)
					: vscode.Uri.joinPath(context.extensionUri, "wasi-modules", entry[0])
				).fsPath,
				type: "wasip2",
			});
		}
		await vscode.commands.executeCommand(
			"pdml.register",
			`${context.extension.id}@${context.extension.packageJSON.version}`,
			{
				plugins,
			},
		);
	},
};
