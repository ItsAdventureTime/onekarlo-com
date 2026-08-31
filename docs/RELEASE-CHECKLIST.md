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
docker compose config
docker compose run --rm build
docker compose run --rm build npm run verify:workers
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

HTTPS authentication configured by `gh auth setup-git` is separate from commit
signing. Use a GPG, SSH, or S/MIME signer only when one is deliberately
configured; do not substitute a broken signer or claim that an HTTPS commit is
signed.

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
git commit -m "docs: update project and deployment guides"
~~~

If a working signing method is configured, use `git commit -S` and verify its
status. Never add private key material to the repository.

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

## 6. Cloudflare Workers deployment

GitHub synchronization and web deployment are separate operations. Only after
the commit is on the intended branch, deploy the verified static build:

~~~bash
docker compose run --rm build npm run preview:workers
docker compose run --rm build npm run deploy:workers
~~~

Verify the returned `workers.dev` URL before attaching or changing the custom
domain. Follow [CLOUDFLARE-WORKERS.md](CLOUDFLARE-WORKERS.md) for authentication,
custom-domain cutover, and recovery steps. This does not change the GitHub HTTPS
requirement.

## 7. Post-release record

- [ ] Record the commit SHA and target used.
- [ ] Confirm the public page, project filters, dialogs, and fallback page.
- [ ] Confirm the Workers deployment served the expected static assets and no
      private files are publicly available.
- [ ] Record any warning or follow-up instead of silently bypassing a failed
      preflight.

Reference: [GitHub CLI gh auth setup-git](https://cli.github.com/manual/gh_auth_setup-git).
