import { useEffect, useRef, useState } from 'react'

interface UseWebSocketOptions {
  onMessage?: (event: MessageEvent) => void
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
}

interface UseWebSocketReturn {
  isLoading: boolean
  isError: boolean
  isConnected: boolean
}

function useWebSocket(
  url: string | null,
  options: UseWebSocketOptions = {},
): UseWebSocketReturn {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const ws = useRef<WebSocket | null>(null)
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  })

  useEffect(() => {
    if (!url) return

    const socket = new WebSocket(url)
    ws.current = socket

    const startPing = () => {
      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send('ping')
        }
      }, 90_000)
    }

    const clearPing = () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
        pingIntervalRef.current = null
      }
    }

    const handleOpen = (e: Event) => {
      setIsLoading(false)
      setIsConnected(true)
      setIsError(false)
      optionsRef.current.onOpen?.(e)
    }

    const handleMessage = (e: MessageEvent) => {
      optionsRef.current.onMessage?.(e)
    }

    const handleError = (e: Event) => {
      setIsLoading(false)
      setIsError(true)
      setIsConnected(false)
      clearPing()
      optionsRef.current.onError?.(e)
    }

    const handleClose = (e: CloseEvent) => {
      setIsConnected(false)
      clearPing()
      optionsRef.current.onClose?.(e)
    }

    socket.addEventListener('open', handleOpen)
    socket.addEventListener('message', handleMessage)
    socket.addEventListener('error', handleError)
    socket.addEventListener('close', handleClose)

    startPing()

    return () => {
      clearPing()
      socket.removeEventListener('open', handleOpen)
      socket.removeEventListener('message', handleMessage)
      socket.removeEventListener('error', handleError)
      socket.removeEventListener('close', handleClose)
      socket.close()
      ws.current = null
    }
  }, [url])

  return { isLoading, isError, isConnected }
}

export { useWebSocket }
