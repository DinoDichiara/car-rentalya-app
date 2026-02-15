import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, Shield, CalendarDays, Phone } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Car className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground font-serif">
            RENTYA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Ingresar</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Registrate</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero-car.jpg"
            alt="Super auto de lujo en carretera"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>

        <div className="relative z-10 flex max-w-lg flex-col items-center gap-6">
          <h1 className="text-4xl font-bold leading-tight text-foreground font-serif text-balance sm:text-5xl">
            Renta Super Autos de Lujo
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground text-pretty">
            Accede a los vehiculos mas exclusivos del mundo. Lamborghini, Ferrari, Porsche, McLaren y mas al alcance de una llamada.
          </p>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link href="/cars">Ver Catalogo</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/sign-up">Publicar Autos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Disponibilidad en Tiempo Real
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Consulta la disponibilidad de cada auto al instante con nuestro calendario.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Contacto Directo
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Contacta directamente al propietario del auto con un solo toque.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Panel de Administracion
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Administra tus autos, controla reservaciones y gestiona tu flota desde un solo lugar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          RENTYA - Super Autos de Lujo
        </p>
      </footer>
    </div>
  )
}
