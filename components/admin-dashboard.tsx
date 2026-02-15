'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Car, CalendarDays, Trash2, Pencil, Eye, EyeOff } from 'lucide-react'
import useSWR from 'swr'
import { useState } from 'react'
import { CarFormDialog } from '@/components/car-form-dialog'
import { ReservationManager } from '@/components/reservation-manager'

interface CarData {
  id: string
  brand: string
  model: string
  year: number
  price_per_day: number
  image_url: string | null
  horsepower: number | null
  seats: number
  transmission: string
  fuel_type: string
  is_available: boolean
  description: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminDashboard() {
  const { data: cars, isLoading, mutate } = useSWR<CarData[]>('/api/admin/cars', fetcher)
  const [showCarForm, setShowCarForm] = useState(false)
  const [editingCar, setEditingCar] = useState<CarData | null>(null)
  const [managingCar, setManagingCar] = useState<CarData | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Seguro que quieres eliminar este auto?')) return

    await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' })
    mutate()
  }

  const handleToggleAvailability = async (car: CarData) => {
    await fetch(`/api/admin/cars/${car.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: !car.is_available }),
    })
    mutate()
  }

  if (managingCar) {
    return (
      <ReservationManager
        car={managingCar}
        onBack={() => setManagingCar(null)}
      />
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">
            Mis Autos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra tus autos y reservaciones
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCar(null)
            setShowCarForm(true)
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-card border border-border"
            />
          ))}
        </div>
      ) : cars && cars.length > 0 ? (
        <div className="flex flex-col gap-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-card-foreground">
                      {car.brand} {car.model}
                    </h3>
                    <Badge
                      variant={car.is_available ? 'default' : 'secondary'}
                      className={car.is_available ? 'bg-emerald-600 text-emerald-50 hover:bg-emerald-700' : ''}
                    >
                      {car.is_available ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {car.year} &middot; {car.horsepower ? `${car.horsepower} HP` : car.transmission} &middot; ${car.price_per_day.toLocaleString()}/dia
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setManagingCar(car)}
                >
                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                  Reservaciones
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingCar(car)
                    setShowCarForm(true)
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAvailability(car)}
                >
                  {car.is_available ? (
                    <EyeOff className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 mr-1" />
                  )}
                  {car.is_available ? 'Ocultar' : 'Mostrar'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(car.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Car className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            No tienes autos publicados
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Agrega tu primer auto para comenzar
          </p>
          <Button
            onClick={() => {
              setEditingCar(null)
              setShowCarForm(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar Auto
          </Button>
        </div>
      )}

      <CarFormDialog
        open={showCarForm}
        onOpenChange={setShowCarForm}
        car={editingCar}
        onSuccess={() => {
          setShowCarForm(false)
          setEditingCar(null)
          mutate()
        }}
      />
    </div>
  )
}
