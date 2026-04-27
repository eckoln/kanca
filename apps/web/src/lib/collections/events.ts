import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import { z } from 'zod'

export const eventsSchema = z.object({
  id: z.uuid(),
  timestamp: z.number(),
  payload: z.json(),
  channelId: z.string(),
})

export type Event = z.infer<typeof eventsSchema>

export const eventsCollection = createCollection(
  localStorageCollectionOptions({
    id: 'events',
    storageKey: 'events',
    schema: eventsSchema,
    getKey: (item) => item.id,
  }),
)
