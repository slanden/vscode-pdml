import { transpile as jcoTranspile } from "@bytecodealliance/jco-transpile";
import vscode from "./vscode.cjs";

const WASI_PKG_NAME = "pdml:plugin";

export async function transpile(path, outDir) {
	const { files } = await jcoTranspile(path, {
		outDir,
		map: [
			`${WASI_PKG_NAME}/*=../../host.mjs`,
			"layer-identity=../../host.mjs#layerIdentity",
		],
	});
	let extensionStart;

	return Promise.all(
		Object.entries(files).map(async ([filePath, bytes]) => {
			extensionStart = filePath.lastIndexOf(".");

			return vscode.workspace.fs.writeFile(
				vscode.Uri.file(
					filePath.charAt(extensionStart + 1) === "j" &&
						filePath.charAt(extensionStart + 2) === "s"
						? `${filePath.substring(0, extensionStart)}.mjs`
						: filePath,
				),
				bytes,
			);
		}),
	);
}
