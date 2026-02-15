'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'

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
  description: string | null
}

interface CarFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  car: CarData | null
  onSuccess: () => void
}

export function CarFormDialog({ open, onOpenChange, car, onSuccess }: CarFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [pricePerDay, setPricePerDay] = useState('')
  const [horsepower, setHorsepower] = useState('')
  const [seats, setSeats] = useState('2')
  const [transmission, setTransmission] = useState('Automatic')
  const [fuelType, setFuelType] = useState('Gasoline')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (car) {
      setBrand(car.brand)
      setModel(car.model)
      setYear(String(car.year))
      setPricePerDay(String(car.price_per_day))
      setHorsepower(car.horsepower ? String(car.horsepower) : '')
      setSeats(String(car.seats))
      setTransmission(car.transmission)
      setFuelType(car.fuel_type)
      setImageUrl(car.image_url || '')
      setDescription(car.description || '')
    } else {
      setBrand('')
      setModel('')
      setYear(String(new Date().getFullYear()))
      setPricePerDay('')
      setHorsepower('')
      setSeats('2')
      setTransmission('Automatic')
      setFuelType('Gasoline')
      setImageUrl('')
      setDescription('')
    }
    setError(null)
  }, [car, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const body = {
      brand,
      model,
      year: parseInt(year),
      price_per_day: parseFloat(pricePerDay),
      horsepower: horsepower ? parseInt(horsepower) : null,
      seats: parseInt(seats),
      transmission,
      fuel_type: fuelType,
      image_url: imageUrl || null,
      description: description || null,
    }

    try {
      const url = car ? `/api/admin/cars/${car.id}` : '/api/admin/cars'
      const method = car ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || t.carForm.saveError)
      }

      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.carForm.saveError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground font-serif">
            {car ? t.carForm.editCar : t.carForm.addCar}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="brand" className="text-card-foreground">{t.carForm.brand}</Label>
              <Input
                id="brand"
                required
                placeholder="Lamborghini"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="model" className="text-card-foreground">{t.carForm.model}</Label>
              <Input
                id="model"
                required
                placeholder="Huracan EVO"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="year" className="text-card-foreground">{t.carForm.year}</Label>
              <Input
                id="year"
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="price" className="text-card-foreground">{t.carForm.pricePerDay}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                placeholder="500"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="hp" className="text-card-foreground">{t.carForm.horsepowerLabel}</Label>
              <Input
                id="hp"
                type="number"
                placeholder="640"
                value={horsepower}
                onChange={(e) => setHorsepower(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="seats" className="text-card-foreground">{t.carForm.seatsLabel}</Label>
              <Input
                id="seats"
                type="number"
                required
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-card-foreground">{t.carForm.transmissionLabel}</Label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">{t.carForm.automatic}</SelectItem>
                  <SelectItem value="Manual">{t.carForm.manual}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-card-foreground">{t.carForm.fuelLabel}</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasoline">{t.carForm.gasoline}</SelectItem>
                  <SelectItem value="Electric">{t.carForm.electric}</SelectItem>
                  <SelectItem value="Hybrid">{t.carForm.hybrid}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="image" className="text-card-foreground">{t.carForm.imageUrl}</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-card-foreground">{t.carForm.descriptionLabel}</Label>
            <Textarea
              id="description"
              placeholder={t.carForm.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border text-foreground min-h-20"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? t.carForm.savingText
              : car
                ? t.carForm.updateCar
                : t.carForm.addCarButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
