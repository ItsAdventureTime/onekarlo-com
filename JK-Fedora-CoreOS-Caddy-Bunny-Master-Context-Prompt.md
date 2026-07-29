# Master Context Prompt: Fedora CoreOS, Rootless Podman Quadlets, Caddy, Websites, and Bunny CDN

## Purpose

Use this document as the authoritative working context for JK's Fedora CoreOS production server, rootless Podman Quadlets, Caddy, public websites, PIMASCOR demo, and bunny.net CDN.

## Assistant operating rules

1. Preserve confirmed architectural choices unless JK explicitly changes them.
2. Verify current, change-prone technical information using official documentation before giving commands.
3. Prefer primary sources:
   - Fedora CoreOS
   - Podman and Quadlet
   - Caddy and the official Caddy container image
   - systemd
   - Red Hat/Fedora SELinux
   - bunny.net
   - MDN, WHATWG, W3C, and WCAG
4. Clearly distinguish confirmed facts, inference, optional recommendations, and version-dependent behavior.
5. Put commands, configuration, HTML, CSS, and JavaScript in copyable code blocks.
6. Explain why each material command or change is needed.
7. For risky changes, include backup, validation, execution, verification, and rollback.
8. Never assume a generated systemd service supports reload.
9. Never recommend `systemctl --user reload caddy.service` unless `ExecReload=` is verified in the active generated unit.
10. Do not ask unnecessary questions when a safe and grounded solution can be provided.
11. Treat SELinux as enabled and enforcing unless verified otherwise.
12. Do not suggest disabling SELinux as the first solution.
13. Preserve Fedora CoreOS's immutable operating model.
14. Prefer rootless Quadlets for persistent services.
15. Use transient `podman run --rm` only for validation, formatting, testing, or inspection.

---

# 1. User and professional context

The user's name is **Juan Karlo de Guzman**, known professionally as **JK**.

Primary technical focus:

- AI Infrastructure Engineer
- DevOps and LLMOps
- Linux production systems
- Self-hosted LLM systems
- GPU inference
- Rootless containers
- Automation
- Secure and reproducible infrastructure

Additional professional experience:

- ESL educator and founder of LinguaPath Academy
- Project Manager
- Paralegal
- Business Development Manager
- Executive Assistant and founder-support professional
- Remote operations and client support

JK learns and troubleshoots by reverse engineering:

1. deploy,
2. break or test assumptions,
3. inspect logs,
4. isolate the cause,
5. fix the underlying issue,
6. validate,
7. document.

Preferred qualities:

- clear layers,
- isolation,
- reproducibility,
- maintainability,
- portability,
- security,
- accurate documentation,
- practical explanations,
- concise and organized responses,
- no invented facts or vague confidence.

---

# 2. Server environment

Confirmed server profile:

- VPS
- Approximately 16 GB RAM
- Approximately 300–350 GB SSD
- Fedora CoreOS stable stream
- Immutable Linux model
- Podman installed by default
- Rootless Podman is preferred
- Quadlets are preferred
- Security hardening will be handled later

Accounts:

```text
gsadmin
```

Existing administrator account.

```text
jk
```

Preferred rootless Podman account.

Requirements:

- `jk` has or should retain sudo access.
- Password was set manually with:

```bash
sudo passwd jk
```

- SSH keys/passkeys are not currently part of the setup.
- Do not assume SSH password authentication is enabled merely because the account has a password.
- Verify Fedora CoreOS SSH behavior separately before advising direct password SSH.

Persistent rootless user services:

```bash
sudo loginctl enable-linger jk
```

Switch from `gsadmin` to `jk`:

```bash
sudo -iu jk
```

If a nonstandard shell lacks the user systemd environment, verify before setting:

```bash
export XDG_RUNTIME_DIR="/run/user/$(id -u)"
export DBUS_SESSION_BUS_ADDRESS="unix:path=${XDG_RUNTIME_DIR}/bus"
```

---

# 3. Rootless Podman and Quadlet conventions

Rootless Quadlet root:

```text
/home/jk/.config/containers/systemd/
```

Equivalent:

```text
~/.config/containers/systemd/
```

Nested directories are used for organization.

Important behavior:

- Quadlet scans supported nested directories recursively.
- Generated unit names are based mainly on filenames.
- Filenames should be globally descriptive.
- Avoid repeated generic names such as `web.container`.

Caddy Quadlet directory:

```text
~/.config/containers/systemd/caddy/
```

Expected active definitions:

```text
caddy.container
caddy.network
```

No separate Caddy `.image` Quadlet is required by the current design.

Caddy image choice:

```text
docker.io/library/caddy:alpine
```

This is deliberate.

Reason:

- JK wants the latest stable Alpine-based Caddy image and current fixes.

Operational implications:

- It is a floating tag.
- It is less reproducible than a pinned version.
- It does not update a running container automatically.
- A pull and recreation or Podman auto-update is required.
- Prefer controlled maintenance-window updates unless monitoring justifies unattended updates.

Expected Quadlet fields:

```ini
Image=docker.io/library/caddy:alpine
AutoUpdate=registry
```

Do not silently replace this with a pinned tag.

---

# 4. Rootless low ports

Caddy publishes:

```text
80/tcp
443/tcp
443/udp
```

The host was designed to allow unprivileged binding beginning at port 80:

```bash
printf '%s
' 'net.ipv4.ip_unprivileged_port_start = 80' |
sudo tee /etc/sysctl.d/90-rootless-low-ports.conf >/dev/null

sudo sysctl --system
```

Verify:

```bash
sysctl net.ipv4.ip_unprivileged_port_start
```

Security note:

- This applies system-wide to local unprivileged users.
- It is not restricted only to `jk`.
- Review it during later hardening.

---

# 5. Directory layout

Caddy:

```text
/home/jk/caddy/
├── Caddyfile -> conf/Caddyfile
├── conf/
│   └── Caddyfile
├── data/
└── config/
```

Expected symlink:

```bash
ln -sfn conf/Caddyfile ~/caddy/Caddyfile
```

Persistent website directories:

```text
/home/jk/onekarlo-com/
/home/jk/linguapath-academy/
/home/jk/delegateops-business/
/home/jk/iamjk-site/
/home/jk/bridge-ph/
/home/jk/bridge-ph/pimascor/
/home/jk/bridge-ph/pimascor-demo/
```

Future application Quadlet directories:

```text
~/.config/containers/systemd/onekarlo-com/
~/.config/containers/systemd/linguapath-academy/
~/.config/containers/systemd/delegateops-business/
~/.config/containers/systemd/iamjk-site/
~/.config/containers/systemd/bridge-ph/
~/.config/containers/systemd/bridge-ph/pimascor/
~/.config/containers/systemd/bridge-ph/pimascor-demo/
```

Recommended globally unique filenames:

```text
onekarlo-com-web.container
linguapath-academy-web.container
delegateops-business-web.container
bridge-ph-pimascor-web.container
bridge-ph-pimascor-demo-web.container
```

---

# 6. Caddy Quadlet management

Caddy is managed through the rootless generated service:

```text
caddy.service
```

Run as `jk`:

```bash
systemctl --user status caddy.service
systemctl --user restart caddy.service
journalctl --user -u caddy.service
```

After modifying the Quadlet definition:

```bash
systemctl --user daemon-reload
systemctl --user restart caddy.service
```

Changes requiring recreation/restart include:

- mounts,
- image,
- ports,
- networks,
- environment,
- container arguments,
- labels,
- volumes.

## Critical correction: systemd reload

The actual environment returned:

```text
Failed to reload caddy.service:
Job type reload is not applicable for unit caddy.service.
```

Therefore:

- Do not assume `systemctl --user reload caddy.service` works.
- Verify first:

```bash
systemctl --user show caddy.service --property=ExecReload
```

or:

```bash
systemctl --user cat caddy.service | grep -n 'ExecReload'
```

If `ExecReload=` is absent or empty:

```bash
systemctl --user restart caddy.service
```

## Caddy application reload inside the container

Rootless Quadlet management does not make `podman exec` invalid.

Assuming:

```ini
ContainerName=caddy
```

A Caddyfile-only graceful reload can be performed as `jk`:

```bash
podman exec caddy   caddy reload   --config /etc/caddy/Caddyfile   --adapter caddyfile
```

Validate first.

Distinguish:

- `podman exec ... caddy reload`: Caddy application configuration reload.
- `systemctl --user restart caddy.service`: container/service restart.
- `systemctl --user reload`: unavailable unless the generated unit defines `ExecReload=`.

---

# 7. Caddy mounts

Expected mounts:

```ini
Volume=/home/jk/caddy/conf:/etc/caddy:ro,Z
Volume=/home/jk/caddy/data:/data:Z
Volume=/home/jk/caddy/config:/config:Z

Volume=/home/jk/onekarlo-com:/srv/onekarlo-com:ro,Z
Volume=/home/jk/linguapath-academy:/srv/linguapath-academy:ro,Z
Volume=/home/jk/delegateops-business:/srv/delegateops-business:ro,Z
Volume=/home/jk/iamjk-site:/srv/iamjk-site:ro,Z
```

PIMASCOR demo static files are expected under:

```text
/srv/bridge-ph-pimascor-demo
```

Mount semantics:

- `ro`: container cannot modify the files.
- `Z`: private SELinux relabeling for this container.
- Use lowercase `z` only for intentionally shared content.

---

# 8. Current Caddyfile baseline

Use this as the baseline unless JK supplies a newer version.

```caddyfile
(common_security) {
	encode zstd gzip

	header {
		>Strict-Transport-Security "max-age=31536000"
		>Referrer-Policy "strict-origin-when-cross-origin"
		>Permissions-Policy "accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), usb=()"
		>X-Content-Type-Options "nosniff"
		>X-Frame-Options "DENY"
		>Cross-Origin-Opener-Policy "same-origin-allow-popups"
		>Cross-Origin-Resource-Policy "same-origin"
	}

	log {
		output stdout
		format json
	}
}

(inline_style_static_csp) {
	header {
		>Content-Security-Policy "default-src 'none'; script-src 'none'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; worker-src 'none'; manifest-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests"
	}
}

(same_origin_web_csp) {
	header {
		>Content-Security-Policy "default-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; worker-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests"
	}
}

(private_noindex) {
	header {
		>X-Robots-Tag "noindex, nofollow, noarchive"
	}
}

(temporary_static_site) {
	import common_security
	import inline_style_static_csp
	import private_noindex

	header {
		>Cache-Control "public, max-age=300, must-revalidate"
	}

	file_server
}

onekarlo.com {
	root * /srv/onekarlo-com
	import temporary_static_site
}

linguapath.academy {
	root * /srv/linguapath-academy
	import temporary_static_site
}

delegateops.business {
	import common_security

	redir /pimascor/demo /pimascor/demo/ 308

	handle /pimascor/demo/api/* {
		uri strip_prefix /pimascor/demo

		header {
			>Cache-Control "private, no-store"
			>Pragma "no-cache"
			>X-Robots-Tag "noindex, nofollow, noarchive"
		}

		reverse_proxy bridge-ph-pimascor-demo-api:8000
	}

	handle_path /pimascor/demo/* {
		root * /srv/bridge-ph-pimascor-demo

		import same_origin_web_csp
		import private_noindex

		route {
			try_files {path} /index.html

			@revalidate path / /index.html /sw.js /manifest.webmanifest /pimascor-app-icon.jpg /pimascor-logo.jpg
			header @revalidate >Cache-Control "public, max-age=0, must-revalidate"

			@fingerprinted_assets path /assets/*
			header @fingerprinted_assets >Cache-Control "public, max-age=31536000, immutable"

			file_server
		}
	}

	handle {
		root * /srv/delegateops-business

		import inline_style_static_csp
		import private_noindex

		header {
			>Cache-Control "public, max-age=300, must-revalidate"
		}

		file_server
	}
}

iamjk.site {
	root * /srv/iamjk-site
	import temporary_static_site
}
```

Important:

- Preserve the DelegateOps route order.
- API requests go to the API container.
- `/pimascor/demo/*` serves the React/Vite SPA.
- Remaining requests serve the DelegateOps static site.

---

# 9. onekarlo.com portfolio

Purpose:

```text
https://onekarlo.com
```

This is JK's primary professional portfolio.

Professional identity represented:

- Juan Karlo de Guzman, known as JK
- AI Infrastructure Engineer
- DevOps and LLMOps
- ESL educator
- Project Manager
- Paralegal/legal operations
- Business Development Manager
- Executive/founder support
- Reverse-engineering work style

LinkedIn:

```text
https://www.linkedin.com/in/juan-karlo-de-guzman-51b79517/
```

The public email address is intentionally omitted to reduce harvesting and spam.

Newest site structure:

```text
/home/jk/onekarlo-com/
├── index.html
└── assets/
    ├── app.v1.js
    ├── favicon.v1.svg
    └── styles.v1.css
```

Design requirements:

- modern,
- compelling,
- responsive,
- desktop and mobile optimized,
- interactive,
- accessible,
- self-hosted,
- no third-party runtime dependency required,
- external same-origin CSS and JavaScript allowed,
- reduced-motion support,
- keyboard-accessible components,
- animated technical terminal,
- distinct visual treatment for each professional discipline.

## Dedicated CSP

The existing temporary static CSP blocks JavaScript.

Use:

```caddyfile
(onekarlo_portfolio_csp) {
	header {
		>Content-Security-Policy "default-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; img-src 'self' data:; font-src 'self'; connect-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; worker-src 'none'; manifest-src 'self'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests"
	}
}
```

Recommended site block:

```caddyfile
onekarlo.com {
	root * /srv/onekarlo-com

	import common_security
	import onekarlo_portfolio_csp
	import private_noindex

	@html path / /index.html
	header @html >Cache-Control "public, max-age=300, must-revalidate"

	@versioned_assets path /assets/*
	header @versioned_assets >Cache-Control "public, max-age=31536000, immutable"

	file_server
}
```

Keep `private_noindex` while staging.

Remove it only when JK explicitly wants search-engine indexing.

## Asset versioning

Files under `/assets/` are immutable for one year.

When content changes, change the URL:

```text
styles.v1.css -> styles.v2.css
app.v1.js -> app.v2.js
favicon.v1.svg -> favicon.v2.svg
```

Update references in `index.html`.

Never reuse an immutable asset URL for changed content.

---

# 10. Other public sites

## LinguaPath Academy

```text
https://linguapath.academy
```

Directories:

```text
~/linguapath-academy
~/.config/containers/systemd/linguapath-academy
```

Current state:

- unique static placeholder,
- ESL education brand,
- temporary,
- noindex.

## DelegateOps Business Support Services

```text
https://delegateops.business
```

Directories:

```text
~/delegateops-business
~/.config/containers/systemd/delegateops-business
```

Current state:

- static main site/placeholder,
- hosts the PIMASCOR demo path,
- temporary,
- noindex.

## iamjk.site

```text
https://iamjk.site
```

Directories:

```text
~/iamjk-site
~/.config/containers/systemd/iamjk-site
```

Current state:

- unique static placeholder,
- technical identity,
- temporary,
- noindex.

## PIMASCOR demo

Canonical URL:

```text
https://delegateops.business/pimascor/demo/
```

API:

```text
https://delegateops.business/pimascor/demo/api/*
```

Backend:

```text
bridge-ph-pimascor-demo-api:8000
```

Preserve:

- trailing-slash redirect,
- API prefix stripping,
- SPA fallback,
- API `private, no-store`,
- revalidation for app shell,
- immutable caching for hashed Vite assets.

---

# 11. Static-site permissions

For:

```text
/home/jk/onekarlo-com/
```

Use:

- owner/group: `jk:jk`
- directories: `750`
- files: `640`

Commands:

```bash
sudo chown -R jk:jk /home/jk/onekarlo-com

find /home/jk/onekarlo-com   -type d   -exec chmod 750 {} +

find /home/jk/onekarlo-com   -type f   -exec chmod 640 {} +
```

Do not use:

```bash
chmod -R 750 /home/jk/onekarlo-com
```

Static files do not require execute permission.

Verify:

```bash
find /home/jk/onekarlo-com   -printf '%M %u:%g %p
'
```

Test inside Caddy:

```bash
podman exec caddy sh -c '
set -eu

test -r /srv/onekarlo-com/index.html
test -r /srv/onekarlo-com/assets/styles.v1.css
test -r /srv/onekarlo-com/assets/app.v1.js
test -r /srv/onekarlo-com/assets/favicon.v1.svg

echo "All onekarlo.com files are readable."
'
```

SELinux:

- Quadlet uses `:Z`.
- Restart allows Podman to ensure labeling.
- Use `ls -Z` and `ls -Zd` for troubleshooting.

---

# 12. Caddy formatting and validation

A warning such as:

```text
Caddyfile input is not formatted
```

is a formatting warning, not necessarily a syntax failure.

Safe workflow:

```bash
cp   ~/caddy/conf/Caddyfile   ~/caddy/conf/Caddyfile.backup-$(date +%Y%m%d-%H%M%S)
```

```bash
podman run   --rm   --interactive   docker.io/library/caddy:alpine   caddy fmt -   < ~/caddy/conf/Caddyfile   > ~/caddy/conf/Caddyfile.formatted
```

```bash
test -s ~/caddy/conf/Caddyfile.formatted &&
mv ~/caddy/conf/Caddyfile.formatted ~/caddy/conf/Caddyfile
```

```bash
chmod 640 ~/caddy/conf/Caddyfile
```

Validate:

```bash
podman run   --rm   --volume /home/jk/caddy/conf:/etc/caddy:ro,Z   docker.io/library/caddy:alpine   caddy validate   --config /etc/caddy/Caddyfile   --adapter caddyfile
```

Include static-root mounts when validation requires them.

After a Caddyfile change, the known working action is:

```bash
systemctl --user restart caddy.service
```

---

# 13. Bunny CDN

All public websites use bunny.net CDN.

Observed working headers:

```text
server: BunnyCDN-PH1-1245
cdn-cache: HIT
cdn-pullzone: 6194262
cdn-requestpullsuccess: True
```

## HTML caching

Initial problem:

```text
cache-control: no-cache
cdn-cache: MISS
```

Cause:

- Bunny Smart Cache excludes `text/html` by default.
- Static sites were mostly HTML.
- Bunny Edge Rules were needed to override HTML cache time.

Resolution:

- sensible origin `Cache-Control`,
- Bunny Edge Rule for static HTML,
- cache purge/warm,
- repeated request returning:

```text
cdn-cache: HIT
```

## Perma-Cache

Observed:

```text
cdn-cache: HIT
perma-cache: MISS
```

This is acceptable.

Meaning:

- response came from the local Bunny edge,
- the request did not need to reach Caddy,
- Perma-Cache is a secondary layer used on edge misses.

Clear evidence of Perma-Cache use may be:

```text
cdn-cache: MISS
perma-cache: HIT
```

Do not purge repeatedly only to force a different Perma-Cache header.

## Cache strategy

Static HTML:

```text
public, max-age=300, must-revalidate
```

Versioned assets:

```text
public, max-age=31536000, immutable
```

PIMASCOR API:

```text
private, no-store
```

PIMASCOR shell and selected deployment files:

```text
public, max-age=0, must-revalidate
```

Hashed Vite assets:

```text
public, max-age=31536000, immutable
```

Bunny Edge Rules may override origin browser or edge cache times.

---

# 14. Verification commands

Caddy service:

```bash
systemctl --user status caddy.service --no-pager
```

Logs:

```bash
journalctl   --user   --unit caddy.service   --since "-10 minutes"   --no-pager
```

Public HTML:

```bash
curl   --fail   --silent   --show-error   --head   https://onekarlo.com/
```

Versioned assets:

```bash
for asset in   /assets/styles.v1.css   /assets/app.v1.js   /assets/favicon.v1.svg
do
  curl     --fail     --silent     --show-error     --head     "https://onekarlo.com${asset}"
done
```

Relevant CDN headers:

```text
cdn-cache
perma-cache
cache-control
content-type
content-encoding
etag
last-modified
server
```

Expected after warming:

```text
cdn-cache: HIT
```

Direct Caddy test preserving hostname and TLS SNI:

```bash
curl   --resolve "onekarlo.com:443:127.0.0.1"   --head   https://onekarlo.com/
```

---

# 15. Known errors not to repeat

1. Do not claim rootless Quadlet management makes `podman exec` invalid.
2. Do not assume `systemctl --user reload caddy.service` works.
3. Do not recommend systemd reload without verifying `ExecReload=`.
4. Do not say a floating image tag automatically updates a running container.
5. Do not treat `perma-cache: MISS` as a failure when `cdn-cache: HIT`.
6. Do not assume Bunny Smart Cache caches HTML by default.
7. Do not use `chmod -R 750` on static website files.
8. Do not replace `caddy:alpine` with a pinned tag unless JK asks.
9. Do not remove `private_noindex` until JK says the site is ready.
10. Do not weaken CSP broadly when a narrow same-origin policy is sufficient.
11. Do not publicly cache API or authenticated responses.
12. Do not apply immutable caching to unversioned assets.
13. Do not restructure DelegateOps/PIMASCOR route order casually.
14. Do not run rootless Podman management commands as root unless specifically required.

---

# 16. Required response workflow

For each future request:

1. Identify the affected layer:
   - host,
   - account,
   - Quadlet,
   - Caddy,
   - files,
   - application,
   - DNS,
   - or Bunny CDN.
2. Verify current official documentation.
3. Preserve confirmed choices.
4. Provide:
   - backup,
   - change,
   - formatting/validation,
   - reload or restart decision,
   - service verification,
   - HTTP verification,
   - CDN verification,
   - rollback.
5. Explain security, availability, SELinux, or caching consequences.
6. State which account runs each command:
   - `gsadmin`,
   - `jk`,
   - or root.
7. Keep the answer practical and executable.

---

# 17. Starter prompt

```text
Use the attached Master Context Prompt as the authoritative baseline for my Fedora CoreOS, rootless Podman Quadlet, Caddy, website, PIMASCOR demo, and Bunny CDN environment.

Before proposing changes:
1. identify the affected layer,
2. verify current official documentation,
3. preserve confirmed decisions,
4. account for the known corrections,
5. provide copy-paste commands with validation and rollback.

My current task is:

[INSERT TASK HERE]
```
