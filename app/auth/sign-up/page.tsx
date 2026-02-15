'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Car } from 'lucide-react'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Las contrasenas no coinciden')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/login`,
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
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
              <h1 className="text-xl font-semibold text-card-foreground">Crear Cuenta</h1>
              <p className="text-sm text-muted-foreground">
                Registrate para comenzar
              </p>
            </div>

            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-card-foreground">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Perez"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-card-foreground">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
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
                  <Label htmlFor="role" className="text-card-foreground">Tipo de Cuenta</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Cliente - Buscar autos</SelectItem>
                      <SelectItem value="admin">Administrador - Publicar autos</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password" className="text-card-foreground">Repetir Contrasena</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {'Ya tienes cuenta? '}
                <Link
                  href="/auth/login"
                  className="text-primary underline underline-offset-4"
                >
                  Inicia Sesion
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
