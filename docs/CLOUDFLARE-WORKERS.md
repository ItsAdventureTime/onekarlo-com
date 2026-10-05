# Cloudflare Workers deployment

The production site is deployed as a Cloudflare Workers Static Assets project.
The public production URL is the custom domain `https://onekarlo.com`.

This is a Cloudflare Workers deployment and is not hosted on Vercel. The
original worker address is `https://onekarlo-com.jk-s-account.workers.dev`, but
public access to that default `workers.dev` subdomain is disabled (`workers_dev: false`
in `wrangler.jsonc`). Public traffic resolves exclusively through the custom
domain `https://onekarlo.com`.

Workers serves the Vite `dist/` directory directly from Cloudflare's edge with
zero runtime server or container dependency.

## Domain architecture

| Endpoint | Type | Access |
| --- | --- | --- |
| `https://onekarlo.com` | Custom domain | Public production |
| `https://onekarlo-com.jk-s-account.workers.dev` | Default Worker URL | Disabled / Not accessible in public |

The repository configures `"workers_dev": false` in `wrangler.jsonc` so that
deployments preserve the custom domain as the only public entry point.

## One-time setup

1. In the Cloudflare dashboard, ensure your zone uses Cloudflare nameservers.
2. From the repository root, prepare the Docker Compose volumes:

   ```bash
   docker compose config
   docker volume create onekarlo-com-wrangler-auth
   docker compose run --rm build
   ```

3. Authenticate Wrangler interactively from the Mac mini. Do not store an API
   token in the repository.

   ```bash
   docker compose run --rm build \
     ./node_modules/.bin/wrangler login --device
   ```

   The Compose build service persists Wrangler's credentials in the
   `wrangler_auth` volume, so later `docker compose run --rm` commands reuse
   this login instead of starting OAuth again.

4. Build and deploy:

   ```bash
   docker compose run --rm build
   docker compose run --rm build npm run verify:workers
   docker compose run --rm build npm run deploy:workers
   ```

5. Verify the home page at `https://onekarlo.com`, confirm an unknown path
   returns the custom `404.html`, verify the browser console is clean, and
   check that responses include the headers declared in `public/_headers`.

The release sequence is: `build` -> `verify:workers` -> `preview:workers` -> `deploy:workers`.
The preview upload creates a version without sending live traffic;
`deploy:workers` promotes the built assets to production on `https://onekarlo.com`.

## Custom domain configuration

`onekarlo.com` is configured as a Custom Domain in the Worker settings
(Settings > Domains & Routes). Keep `workers_dev: false` in `wrangler.jsonc` so
the default `*.workers.dev` subdomain remains closed to the public.

Do not put `routes` in `wrangler.jsonc`: the exact zone and hostname are an
account-level decision managed in the Cloudflare dashboard.

## Ongoing deployment

Run the same Compose build and deploy commands above from the Mac mini. Docker Desktop
is only the local build environment; Cloudflare Workers hosts production and
does not use the Mac, Caddy, or a Cloudflare Tunnel as its request origin.

For CI, store a narrowly scoped `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` in the CI secret store, then run
`npm run build && npm run verify:workers && npm run deploy:workers`. Never
commit either value.

## Troubleshooting

- `docker compose config` fails: repair Docker Desktop, then rerun it. The
  error occurs before the project build.
- `localhost:8976` or `This site can't be reached`: use the local Wrangler
  binary with device authorization
  (`docker compose run --rm build ./node_modules/.bin/wrangler login --device`).
  The device flow avoids the callback because the default OAuth server runs
  inside the container, not on your Mac. Cloudflare documents `--device` for
  containers and remote hosts.
- `ENOENT ... /usr/local/share/npm-global/lib`: use the checked-in
  local binary through Compose (`docker compose run --rm build
  ./node_modules/.bin/wrangler ...`); do not use an unqualified `npx` command.
- `ENOENT ... /app/node_modules/.bin`: the named dependency volume is stale or
  incomplete. Remove only this generated volume, then reinstall:

  ```bash
  docker compose down -v
  docker compose run --rm build
  ```

  `docker compose down` alone intentionally preserves named volumes.
  `wrangler_auth` is an external volume and is not removed by
  `docker compose down -v`. Do not delete `onekarlo-com-wrangler-auth` unless
  you intentionally want to revoke this local login and authenticate again.
- `Missing file or directory: /app/.wrangler/tmp/bundle-*` during a dry run:
  this is a Wrangler 4.127.1 dry-run packaging failure for an assets-only
  Worker. Do not use `--dry-run`, `--no-bundle`, or `--outdir` for this project.
  Validate the static artifact, then create a real non-production preview:

  ```bash
  docker compose run --rm build npm run verify:workers
  docker compose run --rm build npm run preview:workers
  ```

  Wrangler returns a preview URL for the uploaded version. The repository
  explicitly enables preview URLs in `wrangler.jsonc`. The Compose service
  uses an ephemeral tmpfs for `.wrangler`, so each Wrangler command starts with
  a clean temporary deployment directory.
- `Missing file or directory: /app/.wrangler/tmp/deploy-*` during deploy:
  this is a stale account cache under `node_modules/.cache/wrangler`. The
  `preview:workers` and `deploy:workers` commands now clear that generated
  cache before each Wrangler invocation. Run the command again; do not delete
  the authentication volume.
- `wrangler deploy` rejects the name: change only `name` in `wrangler.jsonc` to
  an available Worker name, then deploy again.
- A custom domain cannot be attached: confirm the domain's authoritative
  nameservers are Cloudflare's and that no existing route owns the hostname.

Wrangler logs are inside the container, not at `/root` on the Mac. Read the
latest persisted log with:

```bash
docker compose run --rm build sh -lc \
  'log=$(ls -t /root/.config/.wrangler/logs/*.log | head -n 1); sed -n "1,240p" "$log"'
```

## References

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Migrating static assets from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Workers headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
