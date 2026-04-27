import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import { z } from 'zod'

export const userPreferencesSchema = z.object({
  id: z.string(),
  theme: z.enum(['light', 'dark', 'auto']),
})

export type UserPreferences = z.infer<typeof userPreferencesSchema>

export const userPreferencesCollection = createCollection(
  localStorageCollectionOptions({
    id: 'user-preferences',
    storageKey: 'preferences',
    schema: userPreferencesSchema,
    getKey: (item) => item.id,
  }),
)
