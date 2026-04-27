import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as React from 'react'
import z from 'zod'
import { EventDetails } from '#/components/event-details'
import { Sidebar } from '#/components/sidebar'
import { type Event, eventsCollection } from '#/lib/collections/events'

async function sendEvent(id: string, payload: Event) {
  const stub = env.DISPATCHER.get(env.DISPATCHER.idFromName('default'))
  return stub.broadcast(id, payload)
}

export const sendEventFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      body: z.object({
        id: z.string(),
        channelId: z.string(),
        timestamp: z.number(),
        payload: z.any(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    return sendEvent(data.id, data.body)
  })

export const Route = createFileRoute('/$id/')({
  ssr: false,
  server: {
    handlers: {
      GET: async ({ request, next, params }) => {
        if (request.headers.get('Upgrade') === 'websocket') {
          const stub = env.DISPATCHER.get(env.DISPATCHER.idFromName('default'))
          return stub.fetch(
            new Request(request.url, {
              headers: {
                ...Object.fromEntries(request.headers),
                'X-Channel-Id': params.id,
              },
            }),
          )
        }
        return next()
      },
      POST: async ({ request, params }) => {
        const payload = await request.json<Event['payload']>()

        await sendEvent(params.id, {
          id: crypto.randomUUID(),
          channelId: params.id,
          timestamp: Date.now(),
          payload,
        })

        return new Response(null, { status: 201 })
      },
    },
  },
  loader: async () => {
    await eventsCollection.preload()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const [selected, setSelected] = React.useState<Event | null>(null)

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar selected={selected} onSelect={setSelected} />
      <EventDetails
        selected={selected}
        redeliver={async () => {
          if (selected) {
            console.log('triggered', params.id)
            await sendEventFn({
              data: {
                id: params.id,
                body: {
                  ...selected,
                  id: crypto.randomUUID(),
                  timestamp: Date.now(),
                },
              },
            })
          }
        }}
      />
    </div>
  )
}
