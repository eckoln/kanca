export class Client {
  private ws: WebSocket | null = null
  private pingInterval: ReturnType<typeof setInterval> | null = null
  private readonly url: string
  private readonly path: string
  private readonly targetUrl: string

  constructor(
    url: string,
    port: number,
    path: string = '/',
    targetUrl?: string,
  ) {
    this.url = url
    this.path = path.startsWith('/') ? path : `/${path}`
    this.targetUrl = targetUrl || `http://127.0.0.1:${port}`
  }

  public connect(): void {
    this.disconnect()

    this.ws = new WebSocket(this.url)

    this.ws.addEventListener('open', () => this.onOpen())
    this.ws.addEventListener('message', (event) => this.onMessage(event))
    this.ws.addEventListener('close', () => this.onClose())
    this.ws.addEventListener('error', (error) => this.onError(error))

    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping')
      }
    }, 90_000)
  }

  public disconnect(): void {
    this.clearPing()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private clearPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private onOpen(): void {
    console.log(`Forwarding ${this.url} to ${this.targetUrl}${this.path}`)
  }

  private async onMessage(event: MessageEvent): Promise<void> {
    const text = event.data.toString()
    if (text === 'pong') return

    try {
      const data = JSON.parse(text)
      const payload = JSON.stringify(data.payload)

      console.log(`➔ Message received (${payload.length} bytes).`)

      const response = await fetch(`${this.targetUrl}${this.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      })

      if (response.ok) {
        console.log(`➔ Success: (${response.status}) ${response.statusText}`)
      } else {
        console.warn(`Warning: Server returned error (${response.status})`)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn(`Warning: Received non-JSON message: ${text}`)
      } else {
        console.error(`Forwarding Error: Could not reach server. (${error})`)
      }
    }
  }

  private onClose(): void {
    this.clearPing()
    this.ws = null
    console.log('Connection closed.')
  }

  private onError(error: Event): void {
    this.clearPing()
    console.error('Error:', error || 'Unknown error')
  }

  public static async createChannel(
    origin = 'https://kanca.eckoln.workers.dev/new',
  ) {
    let url = origin
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
    })

    // Follow up to 5 redirects
    for (let i = 0; i < 5; i++) {
      if (response.status < 300 || response.status >= 400) break

      const location = response.headers.get('location')
      if (!location) break

      url = new URL(location, url).href
      response = await fetch(url, {
        method: 'HEAD',
        redirect: 'manual',
      })
    }

    if (response.status >= 300 && response.status < 400) {
      throw new Error('Too many redirects when creating channel')
    }

    return url
  }
}
