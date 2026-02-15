import { AdminHeader } from '@/components/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
