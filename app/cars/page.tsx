import { CarCatalog } from '@/components/car-catalog'

export default function CarsPage() {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground font-serif text-balance">
          Super Autos Disponibles
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Encuentra el auto de tus suenos y contacta al propietario
        </p>
      </div>
      <CarCatalog />
    </div>
  )
}
