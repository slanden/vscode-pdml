# Change Log

## 0.9.0
- Added configuration settings to disable lints
- Added Auto-closing quotes
- Fixed completions not triggerable after no matches were found
- Fixed the namespace character not triggering namespaced PDML extension nodes
- Fixed PDML extension nodes listed in completions when they shouldn't be

## 0.8.0
- Added support for new attribute node syntax
- Added support for additional top-level PML node, `options`
- Added PML `title` code completion
- Changed PML `table_data` node to `sim_table` to align with PML 4
- Fixed scripting nodes not highlighting in some cases
- Allow empty node names to avoid validating for names inside the body of script nodes until a better solution is implemented

## 0.7.0
- Added linting
- Added support for Extension nodes as attribute values
- Fixed raw-text delimiters not checked for three of a kind, i.e. "=" should not count as the three needed delimiters to open a block
- Fixed some cases of attributes not highlighting correctly

## 0.6.0
- Added '[' as a completion trigger character
- Added completions for PML nodes
- Added the file icon to PML files
- Optimized the file icon

## 0.5.0
- Added support for Script nodes
- Added completions for all PDML Extension nodes
- Added logo
- Added file icon
- Reduced packaged extension size

## 0.4.0
- Added support for Type nodes
- Added support for Utility nodes
- Added support for '~' and '=' code fence delimiters
- Added support for 4 & 8 digit unicode escapes
- Removed unused grammar patterns
- Updated link to PDML website

## 0.3.0
- Added scaffolding for a language server
- Added support for using ".pml" file extension

## 0.2.0
- Fixed attributes being allowed anywhere. Now they must start on the same line as the node, and can continue on multiple lines.
- Fixed empty link to the PDML website in the Readme
- Fixed auto-indentation issues

## 0.1.0
- Added Basic PDML syntax highlighting
- Added auto-indentation rules