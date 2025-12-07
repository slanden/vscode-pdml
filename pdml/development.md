## Project Structure
|Path|Description|
|--|--|
|pdml/| This extension
|pdml/cache/| Caches WebAssembly transpilation files from plugins, which are needed until Node in VS Code uses the WebAssembly Component Model|
|pdml/client/| The entry point
|pdml/scripts/| For long build scripts|
|pdml/server/| The language server|
|pdml/wasi-modules/| For the PDML parser transpilation files|
|pdml-extensions/| A separate VS Code extension implementing the extensions specified in the PDML Extensions specification|

> The parser and WebAssembly component implementations can be found at https://github.com/slanden/pdml-parser

## Develop
1. Build WASI components: `npm run build-wasi`
2. Set `main` in *package.json* to the development path: `npm run set-main-dev`

> When making changes to plugins, delete them from the cache to allow the main extension to pick them up.

> When making changes to the interface, be sure to update the "supportedVersion" logic

## Publish
1. Build WASI components in release mode: `npm run build-wasi-release`
2. Bundle: `npm run build`
3. Set `main` in *package.json* to the production path: `npm run set-main-prod`
