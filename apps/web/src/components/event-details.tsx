import {
  ArrowsClockwiseIcon,
  CheckIcon,
  CopyIcon,
  WebhooksLogoIcon,
} from '@phosphor-icons/react'
import { useCopyToClipboard } from '#/hooks/use-copy-to-clipboard'
import type { Event } from '#/lib/collections/events'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export function EventDetails({
  selected,
  redeliver,
}: {
  selected: Event | null
  redeliver: () => void
}) {
  const { isCopied, copy } = useCopyToClipboard()

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {selected ? (
        <>
          <div className="px-6 py-4 h-16 border-b border-border flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 font-mono">
              <Badge
                variant="secondary"
                className="font-mono font-bold bg-yellow-500/10 text-yellow-400"
              >
                POST
              </Badge>
              <span className="text-sm truncate">{selected.id}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Payload
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copy(JSON.stringify(selected.payload))}
                >
                  {isCopied ? (
                    <CheckIcon className="text-green-400" />
                  ) : (
                    <CopyIcon />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={redeliver}>
                  <ArrowsClockwiseIcon />
                </Button>
              </div>
            </div>
            <Card className="overflow-auto max-h-200">
              <CardContent>
                <pre className="font-mono whitespace-pre-wrap">
                  {JSON.stringify(selected.payload, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <WebhooksLogoIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Select a webhook to view details
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">
            Select a request from the left panel to inspect the body content.
          </p>
        </div>
      )}
    </div>
  )
}
