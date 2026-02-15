import Link from 'next/link'
import { Car, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-foreground font-serif">RENTYA</span>
          </Link>

          <div className="w-full rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-card-foreground mb-2">
              Cuenta Creada
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Revisa tu correo electronico para confirmar tu cuenta antes de iniciar sesion.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Ir a Iniciar Sesion</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
