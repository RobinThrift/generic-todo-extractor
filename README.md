# Grumpf the Generic Todo Extractor
[![Build Status](https://travis-ci.org/RobinThrift/grumpf.svg)](https://travis-ci.org/RobinThrift/grumpf)

> Note this is just the parser, for a CLI, please see [grumpf-cli](https://github.com/RobinThrift/grumpf-cli)

This parser extracts tags like `//@todo` or `//@fix(function): descripion` from source code. In theory, any C-Like language,
that uses `//` or `/*` for comments should work, but it was designed around JavaScript/TypeScript.

### Format
The parser tries to accommodate many different styles, but the base format is: `// @TYPE(SCOPE): DESCRIPTION`,
however, the following should work too (and any combination thereof):

- `//@TYPE: DESCRIPTION`
- `/* @TYPE([SCOPE]): DESCRIPTION`
- `* @TYPE DESCRIPTION`
- `// @TYPE: DESCRIPTION`

### Usage
`grumpf` exposes one main method: `parse(code: string, plugins?: Map<string, Plugin>)`, that returns an array of `Tags`.

```javascript
import {parse} from 'grumpf';
import {readFileSync} from 'fs';
let tags = parse(readFileSync('src/index.js'), 'utf8'));
```

#### `Tag`-Type
```typescript
type Tag = {
    tagName: string,
    scope: string,
    params: Map<string, string>,
    body: string,
    meta: Object
}
```

### Plugins
`grumpf` supports transforming or decorating tags using plugins. These plugins must simply comply to the interface below:

#### `Plugin`-Interface
```typescript
interface Plugin {
    (tag: Tag, params: Map<string, string>, lines: string[]): Tag;
}
```

## Git Commit Messages

- Use the past tense ("Added feature" not "Add feature")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally
- Consider starting the commit message with an applicable emoji:
 - ➕ when adding a feature
 - ➖ when removing a feature
 - 🎉 when improving a feature
 - 🎨 when improving the format/structure of the code
 - 🐎 when improving performance
 - 🚱 when plugging memory leaks
 - 🔞 when using dirty hacks
 - 📝 when writing docs
 - 🐛 when fixing a bug
 - 🔥 when removing code or files
 - 💚 when fixing the CI build
 - 💻 when making changes to the infrastructure
 - ✅ when adding tests
 - 🔒 when dealing with security
 - ⬆️ when upgrading dependencies
 - ⬇️ when downgrading dependencies
 - 👕 when removing linter warnings

([source](https://atom.io/docs/latest/contributing#git-commit-messages))
