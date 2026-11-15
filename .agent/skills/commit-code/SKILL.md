---
name: commit-code
description: >-
  Use this skill when the user asks to commit code, save changes to git, create a git commit, or run /commit-code. Guides the agent through pre-commit verification, staging changes, writing Conventional Commit messages, and committing cleanly.
---

# Commit Code Workflow (`am-wedding`)

Follow these step-by-step instructions whenever the user asks to commit code in the `am-wedding` repository.

## Steps

### 1. Inspect Working Tree & Recent History
1. Run `git status` to see all modified, staged, and untracked files.
   - If the working tree is completely clean (`nothing to commit, working tree clean`), inform the user and stop.
2. Run `git diff --stat` (and `git diff` if needed) to understand the scope of changes across `src/`, `public/`, and `.agent/`.
3. Run `git log -n 5 --oneline` to match the repository's Conventional Commits style.

### 2. Verify Build / Dev Server Health
1. Ensure there are no syntax or bundling errors in the modified React/Vite components (`src/components/`, `src/data/weddingData.js`, `src/index.css`):
   - If the Vite dev server is running in a background task, check its task log to confirm the latest HMR updates succeeded without errors.
   - Otherwise, run `npm run build` to verify a clean production bundle.
2. Make sure temporary/build artifacts (`dist/`, `node_modules/`, `.DS_Store`) are ignored and not staged.

### 3. Stage Changes
1. Stage the intended files using `git add .` (or `git add <specific-files>` if the user requested a partial commit).
2. Note: Writing `.git/index.lock` requires `BypassSandbox: true` if standard sandbox mode returns `Operation not permitted`. Always try sandboxed first per execution rules, then retry with `BypassSandbox: true` if blocked.

### 4. Craft a Conventional Commit Message
Format the commit message using the **Conventional Commits** specification:

```text
<type>(<optional-scope>): <concise summary in imperative mood>
```

**Allowed `<type>` values:**
- `feat`: New wedding section, interactive feature, theme redesign, or new photo/venue assets
- `fix`: Bug fix, mobile viewport overflow fix, layout/modal fix, or broken link fix
- `style`: Visual/CSS styling, color palette, typography, or animation refinements
- `content`: Updates to `src/data/weddingData.js` (schedule, couple info, venue, dress code, bank accounts)
- `chore`: Build config, dependencies, `.agent/` skills/rules, or maintenance

**Guidelines:**
- Keep the subject line under 72 characters.
- Summarize the primary user-facing change clearly (e.g., `feat: redesign envelope intro and Korean minimalist die-cut theme`).

### 5. Create the Commit & Verify
1. Execute the commit:
   ```bash
   git commit -m "<type>: <summary>"
   ```
2. Run `git status` and `git log -n 1 --stat` to verify that the commit succeeded and the working tree is clean.
3. Report the commit hash, commit message, and summary of changed files to the user. Do **not** run `git push` unless the user explicitly asks to push to the remote repository.

