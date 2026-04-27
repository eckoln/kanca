import { createFileRoute, redirect } from '@tanstack/react-router'
import { customAlphabet } from 'nanoid'

function generateId() {
  const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  )
  return nanoid(12)
}

export const Route = createFileRoute('/new/')({
  beforeLoad: async () => {
    const id = generateId()
    throw redirect({ to: '/$id', params: { id } })
  },
  server: {
    handlers: {
      GET: async () => {
        const id = generateId()
        throw redirect({ to: '/$id', params: { id } })
      },
    },
  },
})
