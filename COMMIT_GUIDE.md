# Commit Guidelines for Agents

## Core Rules

- Create small, focused commits.
- Each commit must contain changes for one logical purpose only.
- Do not mix feature work, bug fixes, refactors, formatting, tests, and documentation in one commit unless they are inseparable.
- Write commit messages in imperative form: use `add`, `fix`, `update`, `remove`, or `refactor`.
- Never use vague messages such as `update files`, `fix stuff`, `changes`, or `wip`.
- Review staged changes with `git diff --staged` before committing.
- Do not commit secrets, credentials, API keys, `.env` files, generated artifacts, or unrelated changes.

## Commit Message Format

Use Conventional Commits:

```text
<type>(<optional-scope>): <short descriptive message>
```

Examples:

```text
feat(auth): add Google sign-in flow
fix(api): handle missing user identifier
docs(readme): add local setup instructions
refactor(database): extract connection factory
test(auth): add login validation cases
```

## Commit Types

| Type | Use when | Example |
| --- | --- | --- |
| `feat` | Adding a user-facing feature or capability | `feat(profile): add avatar upload` |
| `fix` | Correcting a bug or incorrect behavior | `fix(cart): prevent duplicate items` |
| `docs` | Changing documentation only | `docs(api): clarify authentication examples` |
| `refactor` | Restructuring code without changing behavior | `refactor(auth): simplify token validation` |
| `test` | Adding or changing tests only | `test(api): cover invalid request payloads` |
| `perf` | Improving performance | `perf(search): cache frequent queries` |
| `style` | Non-functional formatting or style changes | `style(ui): format button component` |
| `build` | Changing build tools, dependencies, or packaging | `build: upgrade TypeScript dependency` |
| `ci` | Changing CI/CD configuration | `ci: add pull request test workflow` |
| `chore` | Maintenance that does not fit another type | `chore: update gitignore rules` |
| `revert` | Reverting a previous commit | `revert: remove avatar upload feature` |

## How to Separate Commits

Split commits by their purpose.

### Example: Adding a New Feature

If a task adds user profile editing, create separate commits when possible:

```text
feat(profile): add profile update endpoint
feat(profile): add profile edit form
test(profile): add profile update coverage
docs(api): document profile update endpoint
```

### Example: Bug Fix with Tests

Keep the fix and its directly related tests together:

```text
fix(auth): reject expired refresh tokens
```

Do not create a separate test commit if the tests are required to prove the same fix.

### Example: Refactor During Feature Work

Do not hide a refactor inside a feature commit.

```text
refactor(database): extract query builder
feat(search): add filtered product search
```

## Before Committing

Run these checks:

```bash
git status
git diff
git diff --staged
```

Then stage only the intended files:

```bash
git add path/to/file
git commit -m "type(scope): descriptive message"
```

## Commit Quality Checklist

Before creating a commit, verify:

- The commit has one clear purpose.
- The commit type matches the change.
- The message describes what changed.
- The message starts with an action verb.
- Unrelated files are not staged.
- Relevant tests or checks have been run.
- No sensitive information is included.