import { ensureUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NavSidebar from '@/components/nav-sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await ensureUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-1">
      <NavSidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
