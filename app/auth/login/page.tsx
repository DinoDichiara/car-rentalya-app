'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Car } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Check role and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role || 'user'

      if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/cars')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-foreground font-serif">RENTYA</span>
          </Link>

          <div className="w-full rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col gap-1 mb-6">
              <h1 className="text-xl font-semibold text-card-foreground">Iniciar Sesion</h1>
              <p className="text-sm text-muted-foreground">
                Ingresa tu correo y contrasena
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-card-foreground">Correo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-card-foreground">Contrasena</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {'No tienes cuenta? '}
                <Link
                  href="/auth/sign-up"
                  className="text-primary underline underline-offset-4"
                >
                  Registrate
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
