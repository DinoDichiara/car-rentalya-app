'use client'

import Link from 'next/link'
import { Car, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageToggle } from '@/components/language-toggle'

export function ClientHeader() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/cars" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground font-serif">RENTYA</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          {user ? (
            <>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {user.email}
              </span>
              {user.user_metadata?.role === 'admin' && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">
                    <User className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">{t.common.admin}</span>
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">{t.common.logoutSrOnly}</span>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">{t.common.login}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
