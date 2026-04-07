'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Save, Edit2, Mail, Phone, Wrench, Clock, 
  DollarSign, TrendingUp, Award, Calendar, AlertCircle, CheckCircle
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

interface Technician {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  is_internal: boolean
  is_active: boolean
  hourly_rate: number
  commission_rate: number
  total_repairs: number
  success_rate: number
  notes: string
  created_at: string
}

interface Repair {
  id: string
  repair_number: string
  status: string
  repair_type: string
  priority: string
  cost_technician: number
  price_customer: number
  profit: number
  brand: string
  model: string
  customer_name: string
  created_at: string
  completed_at: string
}

interface Stats {
  total_repairs: number
  completed_repairs: number
  active_repairs: number
  total_earned: number
  total_profit_generated: number
  avg_days_to_complete: number
}

interface MonthlyPerformance {
  month: string
  repairs_count: number
  earned: number
  profit_generated: number
}

interface RepairType {
  repair_type: string
  count: number
  avg_cost: number
}

const CHART_COLORS = ['#d4af37', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function TechnicianDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([])
  const [repairTypes, setRepairTypes] = useState<RepairType[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Technician>>({})

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const res = await fetch(`/api/technicians/${resolvedParams.id}`)
        if (res.ok) {
          const data = await res.json()
          setTechnician(data.technician)
          setRepairs(data.repairs || [])
          setStats(data.stats)
          setMonthlyPerformance(data.monthlyPerformance || [])
          setRepairTypes(data.repairTypes || [])
          setFormData(data.technician)
        }
      } catch (error) {
        console.error('Error fetching technician:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTechnician()
  }, [resolvedParams.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/technicians/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updated = await res.json()
        setTechnician(updated)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-900/30 text-green-300 border-green-700'
      case 'in_progress':
        return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'pending':
      case 'assigned':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
      case 'waiting_parts':
        return 'bg-purple-900/30 text-purple-300 border-purple-700'
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

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Cargando...</p>
        </main>
      </div>
    )
  }

  if (!technician) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Técnico no encontrado</p>
        </main>
      </div>
    )
  }

  const pieData = repairTypes.map((rt, index) => ({
    name: rt.repair_type || 'Sin tipo',
    value: Number(rt.count),
    color: CHART_COLORS[index % CHART_COLORS.length]
  }))

  const barData = monthlyPerformance.map(mp => ({
    month: mp.month.substring(5),
    reparaciones: Number(mp.repairs_count),
    ganado: Number(mp.earned)
  })).reverse()

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/technicians">
                <Button variant="outline" size="icon" className="border-slate-600">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-100">{technician.name}</h1>
                  <div className="flex gap-2">
                    {technician.is_internal ? (
                      <Badge className="bg-blue-900/30 text-blue-300 border-blue-700 border">Interno</Badge>
                    ) : (
                      <Badge className="bg-purple-900/30 text-purple-300 border-purple-700 border">Externo</Badge>
                    )}
                    <Badge className={`${technician.is_active ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-red-900/30 text-red-300 border-red-700'} border`}>
                      {technician.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                <p className="text-amber-500 font-medium">{technician.specialization || 'Sin especialización'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {editing ? (
                <>
                  <Button variant="outline" onClick={() => setEditing(false)} className="border-slate-600">
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 gap-2">
                    <Save size={18} />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)} className="bg-amber-600 hover:bg-amber-700 gap-2">
                  <Edit2 size={18} />
                  Editar
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <Wrench className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Reparaciones</p>
                    <p className="text-xl font-bold text-slate-100">{stats?.total_repairs || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-900/30 rounded-lg">
                    <CheckCircle className="text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Completadas</p>
                    <p className="text-xl font-bold text-green-400">{stats?.completed_repairs || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-900/30 rounded-lg">
                    <Clock className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">En Progreso</p>
                    <p className="text-xl font-bold text-yellow-400">{stats?.active_repairs || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-900/30 rounded-lg">
                    <DollarSign className="text-amber-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Ganado</p>
                    <p className="text-xl font-bold text-amber-400">${Number(stats?.total_earned || 0).toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-900/30 rounded-lg">
                    <TrendingUp className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Beneficio Generado</p>
                    <p className="text-xl font-bold text-emerald-400">${Number(stats?.total_profit_generated || 0).toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-900/30 rounded-lg">
                    <Calendar className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Días Promedio</p>
                    <p className="text-xl font-bold text-purple-400">{Number(stats?.avg_days_to_complete || 0).toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="info" className="data-[state=active]:bg-amber-600">Información</TabsTrigger>
              <TabsTrigger value="repairs" className="data-[state=active]:bg-amber-600">Reparaciones</TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-amber-600">Rendimiento</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Datos de Contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Nombre</label>
                        {editing ? (
                          <Input
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{technician.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Especialización</label>
                        {editing ? (
                          <Input
                            value={formData.specialization || ''}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{technician.specialization || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Email</label>
                        {editing ? (
                          <Input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-slate-100">
                            <Mail size={16} className="text-slate-400" />
                            {technician.email || '-'}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Teléfono</label>
                        {editing ? (
                          <Input
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-slate-100">
                            <Phone size={16} className="text-slate-400" />
                            {technician.phone || '-'}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Configuración Laboral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Tipo de Técnico</label>
                        {editing ? (
                          <select
                            value={formData.is_internal ? 'internal' : 'external'}
                            onChange={(e) => setFormData({ ...formData, is_internal: e.target.value === 'internal' })}
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                          >
                            <option value="internal">Interno</option>
                            <option value="external">Externo (Autónomo)</option>
                          </select>
                        ) : (
                          <p className="text-slate-100">{technician.is_internal ? 'Interno' : 'Externo (Autónomo)'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Estado</label>
                        {editing ? (
                          <select
                            value={formData.is_active ? 'active' : 'inactive'}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                          >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                          </select>
                        ) : (
                          <p className={technician.is_active ? 'text-green-400' : 'text-red-400'}>
                            {technician.is_active ? 'Activo' : 'Inactivo'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Tarifa por Hora ($)</label>
                        {editing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.hourly_rate || 0}
                            onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-amber-400 font-bold">${Number(technician.hourly_rate || 0).toFixed(2)}/hora</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Comisión (%)</label>
                        {editing ? (
                          <Input
                            type="number"
                            step="0.1"
                            value={formData.commission_rate || 0}
                            onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{Number(technician.commission_rate || 0).toFixed(1)}%</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Notas</label>
                      {editing ? (
                        <Textarea
                          value={formData.notes || ''}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100"
                          rows={3}
                        />
                      ) : (
                        <p className="text-slate-300">{technician.notes || 'Sin notas'}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Repairs Tab */}
            <TabsContent value="repairs">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100">Historial de Reparaciones ({repairs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {repairs.length === 0 ? (
                    <p className="text-slate-400">No hay reparaciones asignadas</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Número</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Reloj</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Cliente</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Tipo</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Cobrado</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Estado</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Fecha</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {repairs.map((repair) => (
                            <tr key={repair.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                              <td className="py-3 px-4 text-slate-300 font-mono text-xs">{repair.repair_number}</td>
                              <td className="py-3 px-4 text-slate-100">{repair.brand} {repair.model}</td>
                              <td className="py-3 px-4 text-slate-300">{repair.customer_name || '-'}</td>
                              <td className="py-3 px-4 text-slate-400 text-sm">{repair.repair_type || '-'}</td>
                              <td className="py-3 px-4 text-amber-400 font-semibold">${Number(repair.cost_technician || 0).toFixed(2)}</td>
                              <td className="py-3 px-4">
                                <Badge className={`${getStatusColor(repair.status)} border`}>
                                  {getStatusLabel(repair.status)}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-sm">
                                {new Date(repair.created_at).toLocaleDateString('es-ES')}
                              </td>
                              <td className="py-3 px-4">
                                <Link href={`/repairs/${repair.id}`}>
                                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
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
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Performance Chart */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Rendimiento Mensual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {barData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                            labelStyle={{ color: '#f1f5f9' }}
                          />
                          <Bar dataKey="reparaciones" fill="#d4af37" name="Reparaciones" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-slate-400 text-center py-10">Sin datos de rendimiento</p>
                    )}
                  </CardContent>
                </Card>

                {/* Repair Types Chart */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Tipos de Reparación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pieData.length > 0 ? (
                      <div className="flex items-center justify-center gap-8">
                        <ResponsiveContainer width={200} height={200}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2">
                          {pieData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm text-slate-300">{item.name}: {item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-10">Sin datos de tipos</p>
                    )}
                  </CardContent>
                </Card>

                {/* Ranking Card */}
                <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Award className="text-amber-500" />
                      Indicadores de Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-3xl font-bold text-slate-100">{Number(technician.success_rate || 100).toFixed(0)}%</p>
                        <p className="text-sm text-slate-400">Tasa de Éxito</p>
                        <div className="mt-2 w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${technician.success_rate || 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-3xl font-bold text-amber-400">${Number(stats?.total_earned || 0).toFixed(0)}</p>
                        <p className="text-sm text-slate-400">Ingresos Totales</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-3xl font-bold text-emerald-400">${Number(stats?.total_profit_generated || 0).toFixed(0)}</p>
                        <p className="text-sm text-slate-400">Beneficio Generado</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-400">{Number(stats?.avg_days_to_complete || 0).toFixed(1)} días</p>
                        <p className="text-sm text-slate-400">Tiempo Promedio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
