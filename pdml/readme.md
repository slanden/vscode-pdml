# PDML Language Support

The [Practical Data & Markup Language (PDML)](https://pdml-lang.dev) is a lean, but much more readable alternative to the XML family of languages.

Supports PDML 1.0.1

## Features

This extension is still a work-in-progress, but includes the following features.

- Syntax highlighting
- Auto-indentation
- Code Completion
- Basic Linting

> Pair this extension with [Expandra](https://marketplace.visualstudio.com/items?itemName=shelby-landen.expandra) to have *Emmet*-like dynamic snippets.

### Extensible
This VS Code extension can be extended by other VS Code extensions that provide PDML extensions (a bit confusing..), and/or what I'm calling, "vocabularies".

A PDML extension provides syntax that follows a '^' character. A vocabulary defines a set of nodes and provides a code completions for them, and can also choose to associate them with a different file extension.

The PDML Extensions VS Code extension implements extensions from the PDML Extensions specification.

The [PML VS Code extension]() is an example of a vocabulary.

See [plugins.md](./plugins.md) for more information on how to extend this extension.

## Migrating from 0.9 to 0.10
When the PDML v2 specification was published, the v1 specification was made unavailable. Although some of the changes were obvious, I don't remember everything from the v1 specification and cannot provide migration tooling or helpful hints in a way you could be confident in.

Extensions were moved to [PDML Extensions](). You can install that to use the PDML v2 equivalents.

If you were using PML, that was moved to [PML support]().

## Known Issues

Highlighting for code embedded in fenced code blocks is not supported. The highlighting defaults to JavaScript, but doesn't change if the parent node has the `lang` attribute set to something else.

If you know how to fix this please let me know.

## Contributing

File bugs, feature requests, or feedback at [Github Issues](https://github.com/slanden/vscode-pdml/issues).

PDML was created by [Christian Neumanns](https://github.com/pdml-lang) and is still being specified. If you like the language and care about its future, stop by the [PDML Github Discussion](https://github.com/pdml-lang/basic-specification/discussions) and say hello.

## License

[MIT License](LICENSE)
