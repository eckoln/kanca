import { DurableObject } from 'cloudflare:workers'
import type { Event } from '@/lib/collections/events'

export class DispatcherDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)

    this.ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair('ping', 'pong'),
    )
  }

  async fetch(req: Request) {
    const channelId = req.headers.get('X-Channel-Id')
    if (!channelId) return new Response('Missing channel ID', { status: 400 })

    const [client, server] = Object.values(new WebSocketPair())
    this.ctx.acceptWebSocket(server, [channelId])
    return new Response(null, { status: 101, webSocket: client })
  }

  async broadcast(channelId: string, data: Event) {
    console.log('broadcasting', channelId, data)
    const sockets = this.ctx.getWebSockets(channelId)
    await Promise.all(sockets.map((ws) => ws.send(JSON.stringify(data))))
  }

  webSocketClose(ws: WebSocket) {
    ws.close()

    if (this.ctx.getWebSockets().length === 0) {
      this.ctx.storage.deleteAll()
    }
  }
}
