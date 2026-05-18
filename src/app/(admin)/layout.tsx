import { redirect } from 'next/navigation'
import { getSession } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  return <AdminLayout>{children}</AdminLayout>
}
