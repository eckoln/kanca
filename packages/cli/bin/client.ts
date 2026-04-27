#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { Client } from '../src/client'

const { values } = parseArgs({
  options: {
    help: {
      type: 'boolean',
      short: 'h',
    },
    url: {
      type: 'string',
      short: 'u',
    },
    'target-url': {
      type: 'string',
      short: 't',
    },
    path: {
      type: 'string',
      default: '/',
    },
    port: {
      type: 'string',
      short: 'p',
      default: '3000',
    },
  },
})

async function start() {
  if (values.help) {
    console.log(`
      Usage: kanca-client [options]
      Options:
        -u, --url <url>         URL of the webhook proxy service
                                Default: https://kanca.eckoln.workers.dev/new
        -t, --target-url <url>  Full destination URL for event forwarding
        -p, --port <port>       Target port
        --path <path>           POST path (e.g., /webhook)
        -h, --help              Display this help message
    `)
    return
  } else {
    let { url, port, path, 'target-url': targetUrl } = values

    if (!url) {
      url = await Client.createChannel()
    }

    return new Client(url, Number(port), path, targetUrl).connect()
  }
}

start().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
