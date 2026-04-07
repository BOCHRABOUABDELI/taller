'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ArrowLeft } from 'lucide-react'

interface SpecialOrder {
  id: string
  order_number: string
  order_type: string
  title: string
  description: string
  customer_name: string
  customer_phone: string
  status: string
  priority: string
  cost_materials: number
  cost_labor: number
  price_customer: number
  profit: number
  expected_date: string
  deposit_amount: number
  deposit_paid: boolean
}

export default function SpecialOrdersPage() {
  const [orders, setOrders] = useState<SpecialOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/special-orders')
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-900/30 text-green-300 border-green-700'
      case 'in_production':
        return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'approved':
        return 'bg-cyan-900/30 text-cyan-300 border-cyan-700'
      case 'quality_check':
        return 'bg-purple-900/30 text-purple-300 border-purple-700'
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
      case 'cancelled':
        return 'bg-red-900/30 text-red-300 border-red-700'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'approved': 'Aprobado',
      'in_production': 'En Producción',
      'quality_check': 'Control Calidad',
      'completed': 'Completado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
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
                <h1 className="text-3xl font-bold text-slate-100">Pedidos Especiales</h1>
                <p className="text-slate-400">Seguimiento de pedidos de proveedores</p>
              </div>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 gap-2">
              <Plus size={18} />
              Nuevo Pedido
            </Button>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Pedidos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-400">Cargando...</p>
              ) : (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-slate-400">No hay pedidos especiales</p>
                  ) : orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-slate-500">{order.order_number}</span>
                          <Badge className="bg-slate-600 text-slate-300 text-xs">{order.order_type}</Badge>
                        </div>
                        <p className="font-semibold text-slate-100">{order.title}</p>
                        <p className="text-sm text-slate-400">Cliente: {order.customer_name}</p>
                        {order.expected_date && (
                          <p className="text-sm text-slate-500">Esperado: {new Date(order.expected_date).toLocaleDateString('es-ES')}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-500">${Number(order.price_customer || 0).toFixed(2)}</p>
                          <p className="text-xs text-green-400">Beneficio: ${Number(order.profit || 0).toFixed(2)}</p>
                          {order.deposit_paid && (
                            <p className="text-xs text-blue-400">Depósito: ${Number(order.deposit_amount || 0).toFixed(2)}</p>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <Link href={`/special-orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="border-slate-600">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
