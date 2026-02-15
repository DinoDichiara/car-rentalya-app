'use client'

import { CarCard } from '@/components/car-card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import useSWR from 'swr'
import { useState } from 'react'

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
  is_available: boolean
  profiles: { full_name: string; phone: string } | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CarCatalog() {
  const { data: cars, isLoading } = useSWR<Car[]>('/api/cars', fetcher)
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')

  const brands = cars
    ? Array.from(new Set(cars.map((c) => c.brand))).sort()
    : []

  const filtered = cars?.filter((car) => {
    const matchesSearch =
      `${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(search.toLowerCase())
    const matchesBrand = brandFilter === 'all' || car.brand === brandFilter
    return matchesSearch && matchesBrand
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por marca, modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border-border text-foreground pl-9"
          />
        </div>
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-card border-border text-foreground">
            <SelectValue placeholder="Todas las marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[16/13] animate-pulse rounded-xl bg-card border border-border"
            />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No se encontraron autos
          </p>
          <p className="text-sm text-muted-foreground">
            Intenta con otra busqueda o filtro
          </p>
        </div>
      )}
    </div>
  )
}
