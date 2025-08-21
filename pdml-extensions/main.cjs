const vscode = require("vscode");

module.exports = {
	async activate(context) {
		const entries = await vscode.workspace.fs.readDirectory(
			vscode.Uri.joinPath(context.extensionUri, "wasi-modules"),
		);
		const plugins = [];
		for (const entry of entries) {
			if (entry[1] !== vscode.FileType.File || !entry[0].endsWith(".mjs"))
				continue;

			plugins.push({
				path: (process.env.IS_PROD
					? vscode.Uri.joinPath(context.extensionUri, "dist", entry[0])
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
				vocabularies: [
					{
						language: "pdml",
						id: "pdml:extensions",
						path: (process.env.IS_PROD
							? vscode.Uri.joinPath(
									context.extensionUri,
									"dist",
									"completions.mjs",
								)
							: vscode.Uri.joinPath(context.extensionUri, "completions.mjs")
						).fsPath,
					},
				],
			},
		);
	},
};
