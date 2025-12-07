# Extending PDML Language Support for VS Code

There are two ways a VS Code extension can extend PDML.

- PDML Extensions
- Vocabularies

Both require some common properties in your *package.json* file though.

```json
"activationEvents": [
  "onLanguage:pdml"
],
"extensionDependencies": [
  "shelby-landen.pdml"
]
```
These are both needed because your extension will need to activate, and then register with the main extension.

## Conventions
### Names
This is just what I did, but in the spirit of consistency I'll outline a starting point below while remaining open to suggestion.

**VS Code Extension Name**
Use a "pdml-" prefix.

E.g. The PML extension is called `pdml-pml`.

**VS Code Extension Display Name**
The extension just provides a vocabulary?
  Prefix it with "PDML Vocabulary: " and then whatever the vocabulary is called.

The extension just provides a PDML extension?
  Prefix it with "PDML Extension: " and then whatever the PDML extension is called.

It provides multiple vocabularies, or multiple extensions, or any number of both?
  Go nuts.

### VS Code Extension Logo
Not everything needs a custom logo and branding. I threw together [this image](https://github.com/slanden/vscode-pdml/blob/main/extension-icon.png) for extensions to signal a relation to PDML, and that it's just an extension and not a whole separate ecosystem. I'm open to suggestions.

### Package.json Keywords
I don't know how much it helps, but I'm using these for extensions providing PDML extensions:

```json
"categories": [
  "Programming Languages"
],
"keywords": [
  "pdml",
  "pdml extension",
  "pdml plugin"
]
```

For vocabularies, do whatever you think is best.

## Registering your plugin
In your extension, you need to call the `pdml.register` command provided by the *PDML Support for VS Code* extension. The first argument is your extension identifier and version in the following format:
  
  identifier '@' version

The second is an object with the things you're registering. We'll get into that later, but it'll look something like this:

```js
vscode.commands.executeCommand(
  "pdml.register",
  `${context.extension.id}@${context.extension.packageJSON.version}`,
  {
    vocabularies: [
      // ...
    ],
    plugins: [
      // ...
    ],
  },
);
```

### Vocabularies
An object in a `vocabularies` list looks like this:

```js
{
  language: "pdml",
  id: "your-namespace:your-desired-name",
  path: vscode.Uri.joinPath(
    context.extensionUri,
    "path",
    "to",
    "completions.mjs",
  ).fsPath,
  includes: [ /* ... */ ]
}
```
`language` tells VS Code which language the completions should show for. for the *.pdml* file extension, we use `language: "pdml"`. If your extension adds its own file extension, you would use that instead, e.g. `language: "yourLanguageId"`

`id` is the vocabulary's identifier, a unique string in the following format:

  namespace ':' name

Both the namespace and name are required.

> It's probably best to use your extension's identifier as the namespace for now.

`path` is a file path to a *.mjs* file that exports a `completions()` function, which should return a list of VS Code Completions.

> Important: This path will be used at runtime, so if the file passes through a build tool make sure the path points to the final build artifact.

`includes` is an optional list of other vocabulary `id`s to include in this vocabulary. The completions shown will be the combined set of completions expected for the `language`, as well as from `includes`.

#### Vocabularies with their own file extension
If you don't want to use the *.pdml* file extension for your vocabulary, you can register your own file extension. Here's an example of that for the PML vocabulary.

```json
"contributes": {
  "languages": [
    {
      "id": "pml:core",
      "aliases": [
        "Practical Markup Language",
        "pml"
      ],
      "extensions": [
        ".pml"
      ]
    }
  ]
}
```

### Plugins
You can extend PDML with additional syntax (what PDML calls "extensions", which I'm trying to separate from VS Code's concept of extensions). You do this by providing one or more "plugins", which are files executable by the JavaScript engine that provide the interface the core PDML engine expects.

Plugins can be either a JavaScript file, or a WebAssembly Component. In addition, every JavaScript file must be a *.mjs* file.

An object in a `plugins` list looks like this:

```js
{
  path: vscode.Uri.joinPath(
    context.extensionUri,
    "plugins",
    "your-plugin.mjs",
  ).fsPath,
  type: "js",
}
```

> Important: `path` will be used at runtime, so if the file passes through a build tool make sure the path points to the final build artifact.

#### Plugin interface
Your plugin should export these functions:
```js
/**
 * Defines the layers the plugin depends on
 * @returns {LayerDef[]}
 */
expectedLayers() {}

/**
 * @param {Uint8Array} bytes the remaining bytes of the
 * source text starting at the next character after the
 * '^' that triggered this function call
 * @param {Uint8Array} layers the IDs of layers your
 * plugin depends on. These will be determined behind
 * the scenes, but the order will be the same as the
 * order of your `expectedLayers()`.
 * @param {boolean} interupted whether or not the
 * previous call to this function had to exit to allow
 * nested PDML extensions to run. When `interupted` is
 * true, it's as if an inner PDML extension has
 * finished and is giving back control to the outer PDML
 * extension.
 * @returns {{
		nodes: {text: string, kind: number, layer: number?}[],
		notes: Diagnostic[],
		bytesRead: number,
		interupted: boolean,
	}}
 */
run(bytes, layers, interupted) {}
```

> JavaScript plugins must export a `pluginInterface` variable specifying the plugin interface and, most importantly, the version it supports. The format of this string is specified in the WIT specification for package names.

The layers defined in `expectedLayers()` are restricted to the layers registered by the PDML VS Code extension. If any of the items returned don't match one of those, an error will be returned during plugin registration. This is a precaution, and the restriction may be lifted in a later version.

In the result from `run()`, `nodes` and `notes` may be empty. `bytesRead` is important and tells the core parser to continue where your plugin completed. You should set `bytesRead` to the index of the last byte that was a part of your plugin's content.

A node in the `nodes` list will have a `kind` property that corresponds to `core-node-kind`.

##### UTF-8
PDML must be valid UTF-8, but your plugin doesn't need to check because the core parser does this after your plugin returns.

##### Failure
Your plugin should try to match syntax and produce nodes. If at any time your plugin determines the content is not a match for your plugin, return none. This allows other plugins to try to match from the beginning.


> ?: What if the plugin recognizes the first character, but fails after that, i.e. an unclosed comment or attribute group; should it return None to let others try to match that character, or consume it and say no this is for comments and it is unclosed, removing the possibility that another plugin could use that character

> ?: What should happen if a plugin errors not due to syntax, but because of something incorrect like UTF-8? should those diagnostics be returned and instead of checking for None, the driver should check for something else to determine if it should keep trying other extensions?

##### Nesting extensions
If your plugin allows other extensions to be nested within, you should halt parsing when an "extension start" character ('^') is found, and return a result object like you normally would except you'd also set `interputed: true`. This is what allows your plugin to continue once the nested plugin completes.

##### Diagnostics
Any diagnostics your plugin generates should have ranges based on UTF-8 byte offsets. These ranges are converted to character offsets later.

##### Versioning
As the PDML VS Code extension is pre-1.0, it only loads plugins that use the latest version of the plugin interface, defined in the WIT file. If the plugin is a WASM Component, and doesn't specify the version, it will be considered incompatible. This is because the API is still being worked out.

#### Highlighting
You can support highlighting in your extensions with an injection grammar, e.g.

```json
"contributes": {
  "grammars": [
    {
      "path": "./path/to/grammar.json",
      "scopeName": "extensions",
      "injectTo": [
        "source.pdml"
      ]
    }
  ]
}
```
`scopeName` and `injectTo` must be kept as is.
