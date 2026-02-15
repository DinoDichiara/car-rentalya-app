'use client'

import { CarCatalog } from '@/components/car-catalog'
import { useLanguage } from '@/lib/i18n/language-context'

export default function CarsPage() {
  const { t } = useLanguage()

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground font-serif text-balance">
          {t.carCatalog.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.carCatalog.subtitle}
        </p>
      </div>
      <CarCatalog />
    </div>
  )
}
