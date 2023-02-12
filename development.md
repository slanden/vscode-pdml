## Parser
1. Run `npm run build-parser`
2. In the resulting parser/pdml.js, change
  ```
  const path = require('path').join(__dirname, 'pdml_bg.wasm');
  ```
  to
  ```
  const path = require('path').join(__dirname, '../parser/pdml_bg.wasm');
  ```

