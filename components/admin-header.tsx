'use client'

import Link from 'next/link'
import { Car, LogOut, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageToggle } from '@/components/language-toggle'

export function AdminHeader() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground font-serif">RENTYA</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {t.common.admin}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/cars">
              <Eye className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-1">{t.common.viewCatalog}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">{t.common.logoutSrOnly}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
