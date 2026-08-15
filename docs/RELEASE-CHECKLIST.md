# Release Checklist

Use this checklist to move a reviewed change from the working tree to the
authenticated GitHub HTTPS remote and, separately, to a configured web target.

## 1. Scope and privacy

- [ ] Read the relevant source and documentation before editing.
- [ ] Preserve unrelated user changes in a dirty working tree.
- [ ] Review public copy against CONTENT-GUIDE.md.
- [ ] Remove client/company names, locations, addresses, private paths,
      credentials, and identifying infrastructure details.
- [ ] Confirm no generated dist/, dependency directory, or secret file is
      staged.

## 2. Local verification

~~~bash
podman info
npm run build:podman
bash -n deploy.sh
git diff --check
~~~

For UI changes, run npm run preview and verify desktop, mobile, keyboard,
dialog focus, reduced motion, filters, and browser-console output.

## 3. GitHub HTTPS authentication

Use the official GitHub CLI for authentication and Git credential setup:

~~~bash
gh auth status --hostname github.com
gh auth setup-git --hostname github.com
git remote get-url origin
~~~

The remote must be an HTTPS URL:

~~~text
https://github.com/<owner>/<repository>.git
~~~

Stop if origin uses git@github.com: or another SSH URL. Do not print or
commit an access token. gh auth setup-git configures Git to use the
authenticated GitHub CLI credential helper.

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

## 6. Optional web deployment

GitHub synchronization and web deployment are separate operations. Only after
the commit is on the intended branch and the target has been reviewed, run:

~~~bash
DEPLOY_TARGET=deploy-user@deploy-host \
DEPLOY_ROOT=/srv/onekarlo-com \
./deploy.sh
~~~

Follow DEPLOYMENT.md. The deployment script uses SSH/rsync for the configured
web host; that does not change the GitHub HTTPS requirement.

## 7. Post-release record

- [ ] Record the commit SHA and target used.
- [ ] Confirm the public page, project filters, dialogs, and fallback page.
- [ ] Confirm Caddy reload succeeded and no private files are publicly served.
- [ ] Record any warning or follow-up instead of silently bypassing a failed
      preflight.

Reference: [GitHub CLI gh auth setup-git](https://cli.github.com/manual/gh_auth_setup-git).
