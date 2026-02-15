'use client'

import Link from 'next/link'
import { Car, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageToggle } from '@/components/language-toggle'

export function AuthErrorContent({ error }: { error?: string }) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight text-foreground font-serif">RENTYA</span>
            </Link>
            <LanguageToggle />
          </div>

          <div className="w-full rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-card-foreground mb-2">
              {t.auth.somethingWentWrong}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {error
                ? `Error: ${error}`
                : t.auth.unexpectedError}
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">{t.auth.backToSignIn}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
