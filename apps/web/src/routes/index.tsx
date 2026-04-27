import { ArrowRightIcon, WebhooksLogoIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

export default function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 sm:py-44">
        <div className="max-w-lg mx-auto space-y-10">
          {/* Logo */}
          <div className="mx-auto flex items-center justify-center size-11 rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <WebhooksLogoIcon size={26} className="text-primary" />
          </div>

          {/* Title */}
          <div className="space-y-5">
            <h1 className="text-7xl sm:text-8xl font-extralight tracking-widest">
              Kanca
            </h1>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.3em]">
              Webhook event delivery
            </p>
            <p className="text-base text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
              Forward webhooks from any source directly to your development
              machine. No tunnels, no hassle.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              render={
                <Link to="/new">
                  <span>Create a channel</span>
                  <ArrowRightIcon />
                </Link>
              }
            />
            <a
              href="https://github.com/eckoln/kanca"
              className="text-sm text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 border-t border-border/40">
        <div className="max-w-lg mx-auto px-6 py-20 sm:py-28 space-y-20">
          {/* How it works */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.2em]">
              How it works
            </h2>
            <p className="text-base text-muted-foreground/70 leading-relaxed">
              When building webhook integrations, you need a way to receive
              events on your local machine.{' '}
              <strong className="text-foreground font-medium">Kanca</strong>{' '}
              creates a unique URL that captures incoming webhooks and streams
              them to your application in real-time via{' '}
              <a
                href="https://developers.cloudflare.com/durable-objects/best-practices/websockets/"
                className="text-primary underline underline-offset-4 hover:no-underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Durable Objects &amp; WebSocket
              </a>
              .
            </p>
          </div>

          {/* Flow */}
          <div className="flex items-center justify-center gap-4 text-sm font-mono text-muted-foreground/50">
            <span>Provider</span>
            <span className="text-primary/60">&mdash;</span>
            <span className="text-foreground/80 font-semibold">Kanca</span>
            <span className="text-primary/60">&mdash;</span>
            <span>You</span>
          </div>

          {/* Usage */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.2em]">
              Usage
            </h2>
            <p className="text-base text-muted-foreground/70 leading-relaxed">
              Point your webhook provider at your Kanca URL, then run{' '}
              <a
                href="https://npmjs.com/package/kanca-client"
                className="text-primary underline underline-offset-4 hover:no-underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                kanca-client
              </a>{' '}
              on your machine to receive events in real-time via WebSocket.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center">
        <p className="text-sm text-muted-foreground/40 uppercase tracking-widest">
          Kanca
        </p>
      </footer>
    </div>
  )
}
