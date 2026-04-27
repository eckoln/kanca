# `kanca-client`

CLI tool to receive webhooks forwarded by Kanca on your local development machine.

## Usage

Point your webhook provider at your Kanca URL, then run `kanca-client` on your machine to receive events in real-time.

### Install

```bash
npm install -g kanca-client
```

Or run directly without installing:

```bash
npx kanca-client [options]
```

### CLI Options

```bash
kanca [options]
```

| Option | Short | Description | Default |
|---|---|---|---|
| `--url` | `-u` | Webhook proxy URL | `https://kanca.eckoln.workers.dev/new` |
| `--target-url` | `-t` | Full destination URL for forwarding | `http://127.0.0.1:3000` |
| `--port` | `-p` | Target port | `3000` |
| `--path` | — | POST path (e.g. `/webhook`) | `/` |
| `--help` | `-h` | Show help message | — |

### Examples

```bash
# Auto-create a channel, forward to localhost:3000/webhook
kanca --path /webhook

# Listen on a specific channel, forward to a different port
kanca -u https://kanca.eckoln.workers.dev/<id> -p 8080

# Full target URL with specific channel
kanca -u https://kanca.eckoln.workers.dev/<id> --target-url http://localhost:4000/hooks
```
