# PDML Language Support

The [Practical Data & Markup Language (PDML)](https://pdml-lang.dev) is a lean, but much more readable alternative to the XML family of languages.

## Features

This extension is still a work-in-progress, but includes the following features.

- Syntax highlighting
- Auto-indentation
- Code Completion

### PDML Extensions

The following language extensions are also supported.

- Attributes
- Comments
- Extension Nodes

### Supported Dialects

In addition to PDML, support for the [Practical Markup Language (PML)](https://pml-lang.dev) is also being worked on.

## Known Issues

Highlighting for code embedded in fenced code blocks is not supported. The highlighting defaults to JavaScript, but doesn't change if the parent node has the `lang` attribute set to something else.

If you know how to fix this please let me know.

## Contributing

File bugs, feature requests, or feedback at [Github Issues](https://github.com/slanden/vscode-pdml/issues)

PDML was created by [Christian Neumanns](https://github.com/pdml-lang) and is still being specified. If you like the language and care about its future, stop by the [PDML Github Discussion](https://github.com/pdml-lang/basic-specification/discussions) and say hello.


## License

[MIT License](LICENSE)
