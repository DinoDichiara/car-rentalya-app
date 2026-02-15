import { ClientHeader } from '@/components/client-header'

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ClientHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
