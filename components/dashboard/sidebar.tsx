'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut, BarChart3, Wrench, Users, Package, Bell, Settings, LineChart } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: Wrench, label: 'Reparaciones', href: '/repairs' },
  { icon: Users, label: 'Clientes', href: '/customers' },
  { icon: Users, label: 'Técnicos', href: '/technicians' },
  { icon: Package, label: 'Pedidos Especiales', href: '/special-orders' },
  { icon: LineChart, label: 'Reportes', href: '/reports' },
  { icon: Bell, label: 'Notificaciones', href: '/notifications' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
]

export default function Sidebar() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-slate-100">⌚ LuxeRepair</h2>
        <p className="text-xs text-slate-400 mt-1">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-amber-500 rounded-lg transition-colors">
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-slate-600 text-slate-300 hover:bg-red-900/20 hover:text-red-300"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
