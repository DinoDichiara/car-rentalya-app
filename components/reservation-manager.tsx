'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import useSWR from 'swr'
import { useState } from 'react'
import {
  format,
  parseISO,
  eachDayOfInterval,
  differenceInDays,
} from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import { useLanguage } from '@/lib/i18n/language-context'

interface CarData {
  id: string
  brand: string
  model: string
  year: number
  price_per_day: number
}

interface Reservation {
  id: string
  car_id: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  start_date: string
  end_date: string
  total_price: number | null
  status: string
  notes: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ReservationManager({
  car,
  onBack,
}: {
  car: CarData
  onBack: () => void
}) {
  const { data: reservations, mutate } = useSWR<Reservation[]>(
    `/api/admin/reservations?car_id=${car.id}`,
    fetcher
  )
  const [showForm, setShowForm] = useState(false)
  const [month, setMonth] = useState(new Date())
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const { t, locale } = useLanguage()

  const dateFnsLocale = locale === 'es' ? es : enUS

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bookedDates =
    reservations
      ?.filter((r) => r.status === 'confirmed')
      .flatMap((r) =>
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

  const handleAddReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dateRange?.from || !dateRange?.to) {
      setError(t.reservations.selectDateRange)
      return
    }

    setIsLoading(true)
    setError(null)

    const days = differenceInDays(dateRange.to, dateRange.from) + 1

    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: car.id,
          customer_name: customerName,
          customer_phone: customerPhone || null,
          customer_email: customerEmail || null,
          start_date: format(dateRange.from, 'yyyy-MM-dd'),
          end_date: format(dateRange.to, 'yyyy-MM-dd'),
          total_price: days * car.price_per_day,
          notes: notes || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || t.reservations.saveError)
      }

      setShowForm(false)
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setNotes('')
      setDateRange(undefined)
      mutate()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.reservations.saveError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.reservations.confirmDeleteReservation)) return
    await fetch(`/api/admin/reservations/${id}`, { method: 'DELETE' })
    mutate()
  }

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    mutate()
  }

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-600 text-emerald-50 hover:bg-emerald-700',
    completed: 'bg-blue-600 text-blue-50 hover:bg-blue-700',
    cancelled: 'bg-muted text-muted-foreground',
  }

  const statusLabels: Record<string, string> = {
    confirmed: t.reservations.confirmed,
    completed: t.reservations.completed,
    cancelled: t.reservations.cancelled,
  }

  return (
    <div className="px-4 py-6">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.reservations.backToMyCars}
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">
            {car.brand} {car.model}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.reservations.manageReservations}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1" />
          {t.reservations.new}
        </Button>
      </div>

      {/* Calendar view */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-card-foreground">
          {t.reservations.availabilityCalendar}
        </h2>
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
          modifiers={{ booked: isDateBooked }}
          modifiersClassNames={{
            booked: 'bg-destructive/20 text-destructive line-through',
          }}
          className="rounded-md"
        />
      </div>

      {/* Reservations list */}
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t.admin.reservations}
      </h2>
      {reservations && reservations.length > 0 ? (
        <div className="flex flex-col gap-3">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-card-foreground">
                    {res.customer_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {res.customer_phone || res.customer_email || t.common.noContact}
                  </p>
                </div>
                <Badge className={statusColors[res.status] || ''}>
                  {statusLabels[res.status] || res.status}
                </Badge>
              </div>

              <div className="mb-2 text-sm text-muted-foreground">
                {format(parseISO(res.start_date), 'dd MMM yyyy', { locale: dateFnsLocale })}
                {' - '}
                {format(parseISO(res.end_date), 'dd MMM yyyy', { locale: dateFnsLocale })}
                {res.total_price && (
                  <span className="ml-2 font-medium text-primary">
                    ${res.total_price.toLocaleString()}
                  </span>
                )}
              </div>

              {res.notes && (
                <p className="mb-2 text-xs text-muted-foreground italic">
                  {res.notes}
                </p>
              )}

              <div className="flex items-center gap-2">
                <Select
                  value={res.status}
                  onValueChange={(val) => handleStatusChange(res.id, val)}
                >
                  <SelectTrigger className="w-36 h-8 text-xs bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">{t.reservations.confirmed}</SelectItem>
                    <SelectItem value="completed">{t.reservations.completed}</SelectItem>
                    <SelectItem value="cancelled">{t.reservations.cancelled}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-8"
                  onClick={() => handleDelete(res.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-muted-foreground">
            {t.reservations.noReservations}
          </p>
        </div>
      )}

      {/* Add Reservation Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90svh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground font-serif">
              {t.reservations.newReservation}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddReservation} className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <Label className="text-card-foreground">{t.reservations.customerName}</Label>
              <Input
                required
                placeholder={t.reservations.customerNamePlaceholder}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-card-foreground">{t.reservations.phone}</Label>
                <Input
                  placeholder="+1..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-card-foreground">{t.reservations.email}</Label>
                <Input
                  type="email"
                  placeholder="email@..."
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-card-foreground">{t.reservations.rentalDates}</Label>
              <div className="rounded-lg border border-border bg-background p-2">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={(date) => date < new Date() || isDateBooked(date)}
                  className="rounded-md"
                />
              </div>
              {dateRange?.from && dateRange?.to && (
                <p className="text-xs text-muted-foreground">
                  {differenceInDays(dateRange.to, dateRange.from) + 1} {t.reservations.days} = $
                  {(
                    (differenceInDays(dateRange.to, dateRange.from) + 1) *
                    car.price_per_day
                  ).toLocaleString()}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label className="text-card-foreground">{t.reservations.notesOptional}</Label>
              <Input
                placeholder={t.reservations.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? t.reservations.savingText : t.reservations.registerReservation}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
