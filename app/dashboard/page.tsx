'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/providers/auth-context'
import Sidebar from '@/components/dashboard/sidebar'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { 
  Wrench, DollarSign, Clock, AlertCircle, Users, TrendingUp, 
  Package, Bell, Crown, Calendar, ArrowRight, Star
} from 'lucide-react'

interface DashboardStats {
  general: {
    active_repairs: number
    completed_repairs: number
    repairs_today: number
    total_customers: number
    vip_customers: number
    active_technicians: number
    pending_orders: number
    waiting_parts: number
  }
  financial: {
    total_revenue: number
    total_profit: number
    revenue_this_month: number
    profit_this_month: number
    avg_repair_days: number
  }
  repairsByStatus: Array<{ status: string; count: number }>
  topTechnicians: Array<{ id: string; name: string; specialization: string; total_repairs: number; profit_generated: number }>
  recentRepairs: Array<{
    id: string
    repair_number: string
    status: string
    priority: string
    price_customer: number
    profit: number
    created_at: string
    brand: string
    model: string
    customer_name: string
    technician_name: string
  }>
  monthlyRevenue: Array<{ month: string; revenue: number; costs: number; profit: number; repairs: number }>
  topBrands: Array<{ brand: string; count: number; revenue: number }>
  pendingOrders: Array<{ id: string; order_number: string; title: string; status: string; expected_date: string; priority: string; customer_name: string }>
  unreadNotifications: number
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  assigned: '#8b5cf6',
  in_progress: '#3b82f6',
  waiting_parts: '#f97316',
  quality_check: '#06b6d4',
  completed: '#10b981',
  delivered: '#22c55e',
  cancelled: '#ef4444'
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  assigned: 'Asignada',
  in_progress: 'En Progreso',
  waiting_parts: 'Esp. Piezas',
  quality_check: 'Control',
  completed: 'Completada',
  delivered: 'Entregada',
  cancelled: 'Cancelada'
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      fetchStats()
    }
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Spinner className="text-amber-500" />
      </div>
    )
  }

  const pieData = stats?.repairsByStatus?.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: Number(item.count),
    fill: STATUS_COLORS[item.status] || '#64748b'
  })) || []

  const monthlyData = stats?.monthlyRevenue?.map(item => ({
    month: item.month,
    ingresos: Number(item.revenue),
    costos: Number(item.costs),
    beneficio: Number(item.profit)
  })) || []

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Bienvenido, {user.name}
              </h1>
              <p className="text-slate-400 mt-1">Panel de Control - Taller de Relojes de Lujo</p>
            </div>
            {stats && stats.unreadNotifications > 0 && (
              <Link href="/notifications">
                <Button variant="outline" className="border-amber-600 text-amber-500 hover:bg-amber-600/10">
                  <Bell size={18} className="mr-2" />
                  {stats.unreadNotifications} Notificaciones
                </Button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="text-amber-500" />
            </div>
          ) : stats ? (
            <>
              {/* KPIs Principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Wrench size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-100">{stats.general.active_repairs}</p>
                        <p className="text-xs text-slate-400">Reparaciones Activas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <DollarSign size={20} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-100">${Number(stats.financial.revenue_this_month).toFixed(0)}</p>
                        <p className="text-xs text-slate-400">Ingresos del Mes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <TrendingUp size={20} className="text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-100">${Number(stats.financial.profit_this_month).toFixed(0)}</p>
                        <p className="text-xs text-slate-400">Beneficio del Mes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Clock size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-100">{Number(stats.financial.avg_repair_days).toFixed(1)}</p>
                        <p className="text-xs text-slate-400">Días Promedio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <Users size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-100">{stats.general.total_customers}</p>
                        <p className="text-xs text-slate-400">Clientes ({stats.general.vip_customers} VIP)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Package size={20} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-100">{stats.general.pending_orders}</p>
                        <p className="text-xs text-slate-400">Pedidos Pendientes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alertas */}
              {(stats.general.waiting_parts > 0 || stats.general.repairs_today > 0) && (
                <div className="flex gap-4 flex-wrap">
                  {stats.general.waiting_parts > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <AlertCircle size={18} className="text-orange-400" />
                      <span className="text-orange-300 text-sm">{stats.general.waiting_parts} reparaciones esperando piezas</span>
                    </div>
                  )}
                  {stats.general.repairs_today > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <Calendar size={18} className="text-green-400" />
                      <span className="text-green-300 text-sm">{stats.general.repairs_today} reparaciones ingresadas hoy</span>
                    </div>
                  )}
                </div>
              )}

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico de Ingresos vs Costos */}
                <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-100 text-lg">Ingresos vs Costos (Últimos 6 meses)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {monthlyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                            labelStyle={{ color: '#e2e8f0' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="ingresos" stroke="#d4af37" strokeWidth={2} name="Ingresos" />
                          <Line type="monotone" dataKey="costos" stroke="#ef4444" strokeWidth={2} name="Costos" />
                          <Line type="monotone" dataKey="beneficio" stroke="#10b981" strokeWidth={2} name="Beneficio" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-slate-400 text-center py-10">Sin datos de ingresos</p>
                    )}
                  </CardContent>
                </Card>

                {/* Gráfico de Estado de Reparaciones */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-100 text-lg">Estado de Reparaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                          />
                          <Legend 
                            formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-slate-400 text-center py-10">Sin reparaciones</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Segunda fila de gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Técnicos */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 text-lg">Top Técnicos</CardTitle>
                    <Link href="/technicians">
                      <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                        Ver todos <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {stats.topTechnicians.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.topTechnicians} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                          />
                          <Bar dataKey="total_repairs" fill="#3b82f6" name="Reparaciones" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-slate-400 text-center py-10">Sin datos de técnicos</p>
                    )}
                  </CardContent>
                </Card>

                {/* Top Marcas */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-100 text-lg">Marcas Más Reparadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.topBrands.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topBrands.map((brand, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-slate-200 font-medium">{brand.brand}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-100 font-semibold">{brand.count} rep.</p>
                              <p className="text-xs text-green-400">${Number(brand.revenue).toFixed(0)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-10">Sin datos de marcas</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Reparaciones Recientes y Pedidos Pendientes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reparaciones Recientes */}
                <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 text-lg">Reparaciones Recientes</CardTitle>
                    <Link href="/repairs">
                      <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                        Ver todas <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2 px-3 text-slate-400 font-medium">Número</th>
                            <th className="text-left py-2 px-3 text-slate-400 font-medium">Reloj</th>
                            <th className="text-left py-2 px-3 text-slate-400 font-medium">Cliente</th>
                            <th className="text-left py-2 px-3 text-slate-400 font-medium">Estado</th>
                            <th className="text-right py-2 px-3 text-slate-400 font-medium">Precio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentRepairs.map((repair) => (
                            <tr key={repair.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                              <td className="py-2 px-3">
                                <Link href={`/repairs/${repair.id}`} className="text-amber-500 hover:text-amber-400 font-mono text-xs">
                                  {repair.repair_number}
                                </Link>
                              </td>
                              <td className="py-2 px-3 text-slate-300">{repair.brand} {repair.model}</td>
                              <td className="py-2 px-3 text-slate-400">{repair.customer_name || '-'}</td>
                              <td className="py-2 px-3">
                                <Badge 
                                  className="text-xs border"
                                  style={{ 
                                    backgroundColor: `${STATUS_COLORS[repair.status]}20`,
                                    color: STATUS_COLORS[repair.status],
                                    borderColor: `${STATUS_COLORS[repair.status]}50`
                                  }}
                                >
                                  {STATUS_LABELS[repair.status] || repair.status}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-right text-slate-100 font-semibold">
                                ${Number(repair.price_customer || 0).toFixed(0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Pedidos Especiales Pendientes */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 text-lg">Pedidos Pendientes</CardTitle>
                    <Link href="/special-orders">
                      <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                        Ver todos <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {stats.pendingOrders.length > 0 ? (
                      <div className="space-y-3">
                        {stats.pendingOrders.map((order) => (
                          <Link key={order.id} href={`/special-orders/${order.id}`}>
                            <div className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-slate-200 font-medium text-sm">{order.title}</p>
                                  <p className="text-slate-400 text-xs">{order.customer_name}</p>
                                </div>
                                {order.priority === 'urgent' && (
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">Urgente</Badge>
                                )}
                              </div>
                              {order.expected_date && (
                                <p className="text-xs text-slate-500 mt-2">
                                  Esperado: {new Date(order.expected_date).toLocaleDateString('es-ES')}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-6">Sin pedidos pendientes</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Resumen Financiero */}
              <Card className="bg-gradient-to-r from-slate-800 to-slate-800/50 border-amber-600/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="text-amber-500" size={24} />
                    <h3 className="text-lg font-semibold text-slate-100">Resumen Financiero Total</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-slate-400 text-sm">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-green-400">${Number(stats.financial.total_revenue).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Beneficio Total</p>
                      <p className="text-2xl font-bold text-amber-400">${Number(stats.financial.total_profit).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Reparaciones Completadas</p>
                      <p className="text-2xl font-bold text-slate-100">{stats.general.completed_repairs}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Técnicos Activos</p>
                      <p className="text-2xl font-bold text-blue-400">{stats.general.active_technicians}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <p className="text-slate-400 text-center py-10">Error cargando estadísticas</p>
          )}
        </div>
      </main>
    </div>
  )
}
