'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center rounded-md border border-border bg-card text-xs font-medium">
      <button
        onClick={() => setLocale('en')}
        className={`rounded-l-md px-2 py-1 transition-colors ${
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLocale('es')}
        className={`rounded-r-md px-2 py-1 transition-colors ${
          locale === 'es'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Cambiar a Espanol"
      >
        ES
      </button>
    </div>
  )
}
