'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  ArrowLeft,
  Phone,
  Fuel,
  Gauge,
  Users,
  Settings2,
  CalendarDays,
} from 'lucide-react'
import useSWR from 'swr'
import { useState } from 'react'
import {
  parseISO,
  eachDayOfInterval,
} from 'date-fns'
import { useLanguage } from '@/lib/i18n/language-context'

const defaultImages: Record<string, string> = {
  Lamborghini: '/images/lamborghini-huracan.jpg',
  Ferrari: '/images/ferrari-488.jpg',
  Porsche: '/images/porsche-911.jpg',
  McLaren: '/images/mclaren-720s.jpg',
}

interface Car {
  id: string
  brand: string
  model: string
  year: number
  price_per_day: number
  description: string | null
  image_url: string | null
  horsepower: number | null
  seats: number
  transmission: string
  fuel_type: string
  profiles: { full_name: string; phone: string } | null
}

interface Reservation {
  start_date: string
  end_date: string
  status: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function CarDetail({ carId }: { carId: string }) {
  const { data: car, isLoading } = useSWR<Car>(`/api/cars/${carId}`, fetcher)
  const { data: reservations } = useSWR<Reservation[]>(
    `/api/cars/${carId}/availability`,
    fetcher
  )
  const [month, setMonth] = useState(new Date())
  const { t } = useLanguage()

  // Calculate booked dates
  const bookedDates =
    reservations?.flatMap((r) =>
      eachDayOfInterval({
        start: parseISO(r.start_date),
        end: parseISO(r.end_date),
      })
    ) || []

  const isDateBooked = (date: Date) =>
    bookedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    )

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="animate-pulse">
          <div className="h-6 w-32 rounded bg-card mb-6" />
          <div className="aspect-[16/10] rounded-xl bg-card mb-6" />
          <div className="h-8 w-48 rounded bg-card mb-4" />
          <div className="h-4 w-full rounded bg-card mb-2" />
          <div className="h-4 w-3/4 rounded bg-card" />
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          {t.carDetail.carNotFound}
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/cars">{t.carDetail.backToCatalog}</Link>
        </Button>
      </div>
    )
  }

  const imageUrl = car.image_url || defaultImages[car.brand] || '/images/hero-car.jpg'
  const phoneNumber = car.profiles?.phone?.replace(/\D/g, '') || ''

  return (
    <div className="px-4 py-6">
      <Link
        href="/cars"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.carDetail.backToCatalog}
      </Link>

      {/* Hero image */}
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-xl border border-border">
        <Image
          src={imageUrl}
          alt={`${car.brand} ${car.model} ${car.year}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
      </div>

      {/* Car Info */}
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {car.brand}
        </p>
        <h1 className="text-2xl font-bold text-foreground font-serif">
          {car.model} <span className="text-muted-foreground">{car.year}</span>
        </h1>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">
            ${car.price_per_day.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">{t.carDetail.perDay}</span>
        </div>
      </div>

      {/* Specs */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Gauge className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">{t.carDetail.horsepower}</p>
            <p className="text-sm font-medium text-card-foreground">
              {car.horsepower ? `${car.horsepower} HP` : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">{t.carDetail.seatsLabel}</p>
            <p className="text-sm font-medium text-card-foreground">{car.seats}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Settings2 className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">{t.carDetail.transmission}</p>
            <p className="text-sm font-medium text-card-foreground">{car.transmission}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Fuel className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">{t.carDetail.fuel}</p>
            <p className="text-sm font-medium text-card-foreground">{car.fuel_type}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {car.description && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-foreground">{t.carDetail.description}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {car.description}
          </p>
        </div>
      )}

      {/* Availability Calendar */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
          <CalendarDays className="h-5 w-5 text-primary" />
          {t.carDetail.availability}
        </h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary/20 border border-primary/40" />
              <span className="text-xs text-muted-foreground">{t.common.available}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <span className="text-xs text-muted-foreground">{t.common.rented}</span>
            </div>
          </div>
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            modifiers={{
              booked: isDateBooked,
            }}
            modifiersClassNames={{
              booked: 'bg-destructive/20 text-destructive line-through',
            }}
            disabled={{ before: new Date() }}
            className="rounded-md"
          />
        </div>
      </div>

      {/* Contact Owner */}
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          {t.carDetail.contactOwner}
        </h2>
        {car.profiles && (
          <p className="mb-3 text-sm text-muted-foreground">
            {car.profiles.full_name}
          </p>
        )}
        {phoneNumber ? (
          <Button asChild className="w-full">
            <a href={`tel:+${phoneNumber}`}>
              <Phone className="h-4 w-4 mr-2" />
              {t.carDetail.callOwner}
            </a>
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t.carDetail.noPhone}
          </p>
        )}
      </div>
    </div>
  )
}
