# Security

Security review of Dungeon Mapper v0.5.0 — a fully client-side, offline-first
React/Vite PWA. There is no server, no accounts, and no remote data storage.

Review date: 2026-09-06

## Findings

No glaring security issues found; no fixes required.

## Verified clean

- **No secrets** — no API keys, tokens, or credentials in source, configs, or
  CI/CD workflows. `.gitignore` covers `.env*`; nothing sensitive is tracked.
- **No XSS sinks** — no `innerHTML`, `dangerouslySetInnerHTML`, `eval`,
  `new Function`, or `document.write` in application code.
- **No remote network calls** — app is offline-first; all data lives in local
  IndexedDB. The only external request is a CacheFirst rule for Google Fonts
  in the service worker.
- **No injection surfaces** — no `window.open`, `target="_blank"`,
  `postMessage` handlers, or prototype-pollution vectors.
- **Hardened SVG export** — `escapeXML`, `sanitizeColor`, and
  `sanitizeImageDataUrl` (strict base64, 2 MB cap, `atob` check) in
  `src/utils/export.ts`.
- **Constrained uploads** — file inputs restricted to image types; custom
  stamp uploads capped at 2 MB.
- **Least-privilege CI/CD** — GitHub Actions use minimal `permissions` and
  OIDC-based Pages deploy; no secrets in workflows.

## Minor gaps (not active vulnerabilities)

1. **No Content-Security-Policy** in `index.html` — defense-in-depth only; no
   XSS vector exists today. A strict CSP would require reworking the inline
   PWA registration script and `data:`/`blob:` image usage.
2. **No size cap** on background-image and custom-theme uploads (stamp uploads
   cap at 2 MB) — affects only the local user's own tab.
3. **Shallow type guard** — `isDungeonProject` (`src/types/map.ts:823`)
   shallow-validates imported JSON; malformed imports produce rendering
   artifacts at worst, never code execution.
