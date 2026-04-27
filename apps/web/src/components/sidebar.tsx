import {
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  TrashIcon,
  WarningCircleIcon,
  WebhooksLogoIcon,
} from '@phosphor-icons/react'
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { useLocation, useParams } from '@tanstack/react-router'
import { useCopyToClipboard } from '#/hooks/use-copy-to-clipboard'
import { useWebSocket } from '#/hooks/use-websocket'
import { type Event, eventsCollection } from '#/lib/collections/events'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group'
import { Spinner } from './ui/spinner'

export function Sidebar({
  selected,
  onSelect,
}: {
  selected: Event | null
  onSelect: (event: Event | null) => void
}) {
  const location = useLocation()
  const params = useParams({ from: '/$id/' })

  const { copy, isCopied } = useCopyToClipboard()

  const { isLoading, isConnected } = useWebSocket(location.href, {
    onMessage: (event: MessageEvent) => {
      console.log(event.data)
      const payload = JSON.parse(event.data) as Event
      eventsCollection.insert(payload)
    },
  })

  const { data: events } = useLiveSuspenseQuery((q) =>
    q
      .from({ events: eventsCollection })
      .where(({ events }) => eq(events.channelId, params.id))
      .orderBy(({ events }) => events.timestamp, 'desc'),
  )

  return (
    <div className="w-80 sm:w-96 border-r flex flex-col bg-sidebar">
      <div className="flex justify-between p-4 gap-3 h-16 border-b">
        <InputGroup>
          <InputGroupInput value={window.location.href} readOnly />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Copy"
              title="Copy"
              size="icon-xs"
              onClick={() => copy(window.location.href)}
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <div
          className="flex items-center justify-center data-[status=loading]:text-yellow-400 data-[status=success]:text-green-400 data-[status=error]:text-red-400"
          data-status={
            isLoading ? 'loading' : isConnected ? 'success' : 'error'
          }
        >
          {isLoading ? (
            <Spinner />
          ) : isConnected ? (
            <CheckCircleIcon />
          ) : (
            <WarningCircleIcon />
          )}
        </div>
      </div>

      {events.length > 0 && (
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {events.length} events
          </span>
          <Button
            variant="destructive"
            size="xs"
            onClick={() => {
              eventsCollection.delete(events.map((e) => e.id))
              onSelect(null)
            }}
          >
            <TrashIcon />
            <span>Clear</span>
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <WebhooksLogoIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Waiting for webhooks
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Send a request to the URL above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {events.map((event) => (
              <button
                type="button"
                className="inline-flex text-start w-full cursor-pointer bg-transparent hover:bg-sidebar-accent/50 transition-colors data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
                data-active={selected?.id === event.id}
                onClick={() => onSelect(event)}
                key={event.id}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className="font-mono font-bold bg-yellow-500/10 text-yellow-400"
                    >
                      POST
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono truncate">
                      {event.id}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground/70 font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
