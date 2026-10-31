# Ploid CLI contract check

A zero-dependency Node.js harness that exercises the official Ploid CLI against a local HTTP fixture server. It does not query people, use Ploid credits, create an account, or assert live search quality.

## Run

Requires Node.js 20+. Download the official CLI and checksum from the links advertised by Ploid's installer, compare SHA-256, then run:

```sh
node check.cjs /path/to/ploid-cli
```

The harness gives the CLI an empty temporary home directory and a loopback base URL. The API key is a literal fixture string, not a credential. All test responses and queries are synthetic. Seven checks cover option validation before network, exact search method/path/body, structured hard filters, JSON output and missing credentials. Temporary config is deleted afterward.

## What I actually tried

I used Ploid's public homepage agent picker, browsed its API and CLI docs, downloaded and checksum-verified the official CLI, ran its help and unauthenticated status, and exercised its search command against this local server. I have not used an authenticated Ploid people search or assessed its data quality.

The search CLI sends `timeoutMs: 0` internally, while the top-level `--timeout` help describes a per-request timeout. A possible improvement is making the unbounded search override explicit in search help or offering a separate search deadline flag. This is a source-inspected behavior, not a live timeout benchmark.

## Source snapshot

Inspected November 1, 2026:
- https://ploid.com/documentation/cli
- https://ploid.com/documentation/api/search
- https://ploid.com/install
- https://ploid.com/downloads/ploid-cli
- https://ploid.com/downloads/ploid-cli.sha256

CLI SHA-256: `d5974ffb2efd8dc51a031d6e4e506e2d9109b996bf041b86ed0dde149af6ae01`.

No affiliation with Ploid. No third-party CLI bundle or personal data is included in this repository.
