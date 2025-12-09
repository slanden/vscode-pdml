# PDML Lab
Provides experimental features and extensions to [PDML Language Support for VS Code](https://marketplace.visualstudio.com/items?itemName=shelby-landen.pdml).

## Current Prototypes
### Custom Nodes

### Extension: Raw Text
The *Raw Text* extension allows writing text without needing to escape PDML syntax within it. You open a raw text node with ` ^`` ` and close it with ` `` `. It's like Markdown, but with an extra set of " ` " characters.

So, an inline raw text node looks like:

```
regular text next to ^``some raw text``.
```

Raw text is often used for code examples, so the extra backtick, " ` ", allows adding a string that identifies the language the raw text is written in.

Here's some *inline* JavaScript code:

```
The, ^`js`await somePromise``, syntax improves on promises.
```

Instead of inline, a *block* of raw text would simply have the content start on a newline.

```
The following js example:
^`js`
let body = document.getElementById('body');
console.log(body);
``
```

The last node of the output is always the content (`let body = ...`), while the node before that, if any, is the language identifier (`js`).