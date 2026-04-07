'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ArrowLeft } from 'lucide-react'

interface Repair {
  id: string
  repair_number: string
  customer_name: string
  customer_phone: string
  brand: string
  model: string
  serial_number: string
  status: string
  repair_type: string
  priority: string
  cost_parts: number
  cost_labor: number
  cost_technician: number
  price_customer: number
  profit: number
  technician_name: string
  estimated_days: number
}

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const res = await fetch('/api/repairs')
        if (res.ok) {
          const data = await res.json()
          setRepairs(data)
        }
      } catch (error) {
        console.error('Error fetching repairs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepairs()
  }, [])

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-300 border-green-700'
      case 'in_progress':
        return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      'completed': 'Completada',
      'delivered': 'Entregada',
      'in_progress': 'En Progreso',
      'pending': 'Pendiente',
      'assigned': 'Asignada',
      'waiting_parts': 'Esperando Piezas',
      'quality_check': 'Control Calidad',
      'cancelled': 'Cancelada'
    }
    return labels[status] || status
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="icon" className="border-slate-600">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">Reparaciones</h1>
                <p className="text-slate-400">Gestión de todos los trabajos de reparación</p>
              </div>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 gap-2">
              <Plus size={18} />
              Nueva Reparación
            </Button>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Lista de Reparaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-400">Cargando...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Número</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Cliente</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Reloj</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Tipo</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Precio</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Beneficio</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Técnico</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Estado</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repairs.map((repair) => (
                        <tr key={repair.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="py-3 px-4 text-slate-300 font-mono text-xs">{repair.repair_number}</td>
                          <td className="py-3 px-4 text-slate-300">{repair.customer_name || 'Sin asignar'}</td>
                          <td className="py-3 px-4 text-slate-300">{repair.brand} {repair.model}</td>
                          <td className="py-3 px-4 text-slate-400 text-sm">{repair.repair_type}</td>
                          <td className="py-3 px-4 text-slate-300 font-semibold">${Number(repair.price_customer || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 text-green-400 font-semibold">${Number(repair.profit || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 text-slate-300">{repair.technician_name || '-'}</td>
                          <td className="py-3 px-4">
                            <Badge className={`${getStatusColor(repair.status)} border`}>
                              {getStatusLabel(repair.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Link href={`/repairs/${repair.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                Ver
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
