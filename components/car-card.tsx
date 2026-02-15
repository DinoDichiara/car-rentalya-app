'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Fuel, Gauge, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

interface CarCardProps {
  car: {
    id: string
    brand: string
    model: string
    year: number
    price_per_day: number
    image_url: string | null
    horsepower: number | null
    seats: number
    fuel_type: string
    transmission: string
  }
}

const defaultImages: Record<string, string> = {
  Lamborghini: '/images/lamborghini-huracan.jpg',
  Ferrari: '/images/ferrari-488.jpg',
  Porsche: '/images/porsche-911.jpg',
  McLaren: '/images/mclaren-720s.jpg',
}

export function CarCard({ car }: CarCardProps) {
  const { t } = useLanguage()
  const imageUrl = car.image_url || defaultImages[car.brand] || '/images/hero-car.jpg'

  return (
    <Link href={`/cars/${car.id}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${car.brand} ${car.model} ${car.year}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                {car.brand}
              </p>
              <h3 className="text-lg font-bold text-card-foreground">
                {car.model}
              </h3>
            </div>
            <span className="rounded-lg bg-primary/90 px-2.5 py-1 text-sm font-bold text-primary-foreground">
              ${car.price_per_day.toLocaleString()}{t.common.perDay}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5" />
            <span>{car.horsepower ? `${car.horsepower} HP` : car.transmission}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{car.seats} {t.common.seats}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Fuel className="h-3.5 w-3.5" />
            <span>{car.fuel_type}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
