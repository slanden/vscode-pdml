# PDML Language Support

The [Practical Data & Markup Language (PDML)](https://pdml-lang.dev/) is a lean, but much more readable alternative to the XML family of languages.

## Features

This extension is still a work-in-progress, but Syntax highlighting and auto-indentation for Basic PDML is implemented.

### PDML extensions

PDML also provides some language extensions. Those supported are listed below.

- Attributes
- Comments
- Type Nodes
- Utility Nodes

## Known Issues

Highlighting for code embedded in fenced code blocks is not supported. The highlighting defaults to JavaScript, but doesn't change if the parent node has the `lang` attribute set to something else.

If you know how to fix this please let me know.

## Contributing

File bugs, feature requests, or feedback at [Github Issues](https://github.com/slanden/vscode-pdml/issues)

PDML was created by [Christian Neumanns](https://github.com/pdml-lang) and is still being specified. If you like the language and care about its future, stop by the [PDML Github Discussion](https://github.com/pdml-lang/basic-specification/discussions) and say hello.


## License

[MIT License](LICENSE)
