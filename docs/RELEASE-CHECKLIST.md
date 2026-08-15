# Release Checklist

Use this checklist to move a reviewed change from the working tree to the
authenticated GitHub HTTPS remote and, separately, to a configured web target.

## 1. Scope and privacy

- [ ] Read the relevant source and documentation before editing.
- [ ] Preserve unrelated user changes in a dirty working tree.
- [ ] Review public copy against CONTENT-GUIDE.md.
- [ ] Review layout and interaction changes against UI-UX-GUIDE.md.
- [ ] Remove client/company names, locations, addresses, private paths,
      credentials, and identifying infrastructure details.
- [ ] Confirm no generated dist/, dependency directory, or secret file is
      staged.
- [ ] Update the relevant guide when commands, build inputs, deployment paths,
      security behavior, accessibility behavior, or release procedure changed.
- [ ] Confirm [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) still matches the
      Docker Sandbox workflow.

## 2. Local verification

~~~bash
jk-sbx-project ensure
jk-sbx-project run 'npm ci --no-audit --no-fund --no-update-notifier && npm run build'
bash -n deploy.sh
git diff --check
~~~

For UI changes, run the sandbox preview and verify wide desktop, mobile,
keyboard, dialog focus, reduced motion, filters, reflow, and browser-console
output. Use the UI and UX guide as the review checklist.

## 3. GitHub HTTPS authentication

Use the official GitHub CLI for authentication and Git credential setup:

~~~bash
gh auth status --hostname github.com
gh auth setup-git --hostname github.com
gh config get git_protocol
git remote get-url origin
~~~

The remote must be an HTTPS URL:

~~~text
https://github.com/<owner>/<repository>.git
~~~

Stop if origin uses git@github.com: or another SSH URL. Do not print or
commit an access token. `gh auth setup-git` configures Git to use the
authenticated GitHub CLI credential helper over HTTPS; it does not sign local
commits.

Before staging, confirm local signing is enabled:

~~~bash
git config --get commit.gpgsign
git config --get gpg.format
~~~

The first command must return `true` and the second must identify a configured
GitHub-supported signing format. See the [GitHub commit-signing
guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
if signing is not configured.

## 4. Review and commit

Stage only the intended files. Review both the staged summary and the exact
patch:

~~~bash
git status --short
git add path/to/intended-file path/to/another-file
git diff --cached --stat
git diff --cached --check
git diff --cached
~~~

Commit locally with a focused message:

~~~bash
git commit -S -m "docs: update project and deployment guides"
git log -1 --format='%h %G? %GS %s'
~~~

The signature status must be `G` (good). Do not continue with an unsigned
commit.

If local signing is configured, let the local Git configuration perform the
signature. Never add private key material to the repository.

## 5. Push over authenticated HTTPS

Confirm the branch and remote one more time, then push:

~~~bash
git branch --show-current
git remote -v
git push origin HEAD
~~~

The GitHub transport is HTTPS, authenticated through the preceding
gh auth setup-git step. Verify the remote commit with:

~~~bash
gh repo view --json nameWithOwner,defaultBranchRef,url
git log -1 --oneline
~~~

Confirm the pushed commit is signed in the GitHub commit view before treating
the release as complete.

## 6. Optional web deployment

GitHub synchronization and web deployment are separate operations. Only after
the commit is on the intended branch and the fixed VPS has been reviewed, run:

~~~bash
./deploy.sh
~~~

Do not set deployment variables. The script builds in the initialized project
Docker Sandbox, owns the fixed SSH target and remote paths, validates the VPS
Caddy container before syncing, and reloads it only after a successful build
and transfer. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the server contract and
recovery steps. This does not change the GitHub HTTPS requirement.

## 7. Post-release record

- [ ] Record the commit SHA and target used.
- [ ] Confirm the public page, project filters, dialogs, and fallback page.
- [ ] Confirm Caddy reload succeeded and no private files are publicly served.
- [ ] Record any warning or follow-up instead of silently bypassing a failed
      preflight.

Reference: [GitHub CLI gh auth setup-git](https://cli.github.com/manual/gh_auth_setup-git).
