'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Save, Edit2, Package, User, DollarSign, 
  Calendar, AlertTriangle, CheckCircle, Clock, FileText,
  Phone, Mail, Crown
} from 'lucide-react'

interface SpecialOrder {
  id: string
  order_number: string
  customer_id: string
  order_type: string
  title: string
  description: string
  specifications: string
  status: string
  priority: string
  cost_materials: number
  cost_labor: number
  price_customer: number
  profit: number
  deposit_amount: number
  deposit_paid: boolean
  expected_date: string
  completion_date: string
  photos: string[]
  notes: string
  created_at: string
  updated_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_is_vip: boolean
}

interface Incident {
  id: string
  incident_type: string
  severity: string
  description: string
  resolution: string
  is_resolved: boolean
  resolved_at: string
  created_at: string
  reported_by_name: string
}

export default function SpecialOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<SpecialOrder | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<SpecialOrder>>({})

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/special-orders/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data.order)
          setIncidents(data.incidents || [])
          setEditData(data.order)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const handleSave = async () => {
    if (!order) return
    setSaving(true)
    try {
      const res = await fetch(`/api/special-orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      if (res.ok) {
        const updated = await res.json()
        setOrder({ ...order, ...updated })
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving order:', error)
    } finally {
      setSaving(false)
    }
  }

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

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'urgent':
        return 'bg-red-900/30 text-red-300 border-red-700'
      case 'high':
        return 'bg-orange-900/30 text-orange-300 border-orange-700'
      case 'normal':
        return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'low':
        return 'bg-slate-700 text-slate-300 border-slate-600'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  function getPriorityLabel(priority: string) {
    const labels: Record<string, string> = {
      'urgent': 'Urgente',
      'high': 'Alta',
      'normal': 'Normal',
      'low': 'Baja'
    }
    return labels[priority] || priority
  }

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/30 text-red-300 border-red-700'
      case 'high':
        return 'bg-orange-900/30 text-orange-300 border-orange-700'
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
      case 'low':
        return 'bg-slate-700 text-slate-300 border-slate-600'
      default:
        return 'bg-slate-700 text-slate-300'
    }
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

  if (!order) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Pedido no encontrado</p>
            <Link href="/special-orders">
              <Button variant="outline" className="border-slate-600">
                Volver a Pedidos
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const profit = Number(order.profit || 0)
  const margin = order.price_customer > 0 
    ? (profit / Number(order.price_customer) * 100).toFixed(1) 
    : '0'

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/special-orders">
                <Button variant="outline" size="icon" className="border-slate-600">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-100">{order.title}</h1>
                  <Badge className={`${getStatusColor(order.status)} border`}>
                    {getStatusLabel(order.status)}
                  </Badge>
                  <Badge className={`${getPriorityColor(order.priority)} border`}>
                    {getPriorityLabel(order.priority)}
                  </Badge>
                </div>
                <p className="text-slate-400 font-mono text-sm">{order.order_number}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    className="border-slate-600"
                    onClick={() => {
                      setIsEditing(false)
                      setEditData(order)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 gap-2"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save size={18} />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={18} />
                  Editar
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-900/30 rounded-lg">
                    <DollarSign className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Precio Cliente</p>
                    <p className="text-xl font-bold text-amber-500">
                      ${Number(order.price_customer || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-900/30 rounded-lg">
                    <Package className="text-red-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Coste Total</p>
                    <p className="text-xl font-bold text-red-400">
                      ${(Number(order.cost_materials || 0) + Number(order.cost_labor || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border ${profit >= 0 ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${profit >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                    <DollarSign className={profit >= 0 ? 'text-green-400' : 'text-red-400'} size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Beneficio ({margin}%)</p>
                    <p className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${profit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${order.deposit_paid ? 'bg-green-900/30' : 'bg-yellow-900/30'}`}>
                    <CheckCircle className={order.deposit_paid ? 'text-green-400' : 'text-yellow-400'} size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Depósito</p>
                    <p className={`text-xl font-bold ${order.deposit_paid ? 'text-green-400' : 'text-yellow-400'}`}>
                      ${Number(order.deposit_amount || 0).toFixed(2)}
                      <span className="text-xs ml-1">
                        {order.deposit_paid ? '(Pagado)' : '(Pendiente)'}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="bg-slate-800 border-slate-700">
                  <TabsTrigger value="info" className="data-[state=active]:bg-amber-600">
                    Información
                  </TabsTrigger>
                  <TabsTrigger value="costs" className="data-[state=active]:bg-amber-600">
                    Costes
                  </TabsTrigger>
                  <TabsTrigger value="incidents" className="data-[state=active]:bg-amber-600">
                    Incidencias ({incidents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-100 flex items-center gap-2">
                        <FileText size={20} />
                        Detalles del Pedido
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400">Tipo de Pedido</label>
                          {isEditing ? (
                            <select
                              value={editData.order_type || ''}
                              onChange={(e) => setEditData({ ...editData, order_type: e.target.value })}
                              className="w-full mt-1 bg-slate-700 border-slate-600 rounded-md text-slate-100 p-2"
                            >
                              <option value="jewelry">Joyería</option>
                              <option value="custom_watch">Reloj Personalizado</option>
                              <option value="engraving">Grabado</option>
                              <option value="restoration">Restauración</option>
                              <option value="parts">Piezas</option>
                              <option value="other">Otro</option>
                            </select>
                          ) : (
                            <p className="text-slate-100 mt-1 capitalize">{order.order_type}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Estado</label>
                          {isEditing ? (
                            <select
                              value={editData.status || ''}
                              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                              className="w-full mt-1 bg-slate-700 border-slate-600 rounded-md text-slate-100 p-2"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="approved">Aprobado</option>
                              <option value="in_production">En Producción</option>
                              <option value="quality_check">Control Calidad</option>
                              <option value="completed">Completado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          ) : (
                            <Badge className={`${getStatusColor(order.status)} border mt-1`}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400">Prioridad</label>
                          {isEditing ? (
                            <select
                              value={editData.priority || ''}
                              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                              className="w-full mt-1 bg-slate-700 border-slate-600 rounded-md text-slate-100 p-2"
                            >
                              <option value="low">Baja</option>
                              <option value="normal">Normal</option>
                              <option value="high">Alta</option>
                              <option value="urgent">Urgente</option>
                            </select>
                          ) : (
                            <Badge className={`${getPriorityColor(order.priority)} border mt-1`}>
                              {getPriorityLabel(order.priority)}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Depósito Pagado</label>
                          {isEditing ? (
                            <select
                              value={editData.deposit_paid ? 'true' : 'false'}
                              onChange={(e) => setEditData({ ...editData, deposit_paid: e.target.value === 'true' })}
                              className="w-full mt-1 bg-slate-700 border-slate-600 rounded-md text-slate-100 p-2"
                            >
                              <option value="false">No</option>
                              <option value="true">Sí</option>
                            </select>
                          ) : (
                            <p className={`mt-1 font-medium ${order.deposit_paid ? 'text-green-400' : 'text-yellow-400'}`}>
                              {order.deposit_paid ? 'Sí' : 'No'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Título</label>
                        {isEditing ? (
                          <Input
                            value={editData.title || ''}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100 mt-1">{order.title}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Descripción</label>
                        {isEditing ? (
                          <Textarea
                            value={editData.description || ''}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                            rows={3}
                          />
                        ) : (
                          <p className="text-slate-300 mt-1">{order.description || 'Sin descripción'}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Especificaciones Técnicas</label>
                        {isEditing ? (
                          <Textarea
                            value={editData.specifications || ''}
                            onChange={(e) => setEditData({ ...editData, specifications: e.target.value })}
                            className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                            rows={4}
                            placeholder="Detalles técnicos, medidas, materiales..."
                          />
                        ) : (
                          <p className="text-slate-300 mt-1 whitespace-pre-wrap">
                            {order.specifications || 'Sin especificaciones'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">Notas Internas</label>
                        {isEditing ? (
                          <Textarea
                            value={editData.notes || ''}
                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                            rows={3}
                          />
                        ) : (
                          <p className="text-slate-300 mt-1">{order.notes || 'Sin notas'}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="costs" className="mt-4">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-100 flex items-center gap-2">
                        <DollarSign size={20} />
                        Control de Costes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400">Coste Materiales</label>
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editData.cost_materials || 0}
                              onChange={(e) => setEditData({ ...editData, cost_materials: parseFloat(e.target.value) || 0 })}
                              className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                            />
                          ) : (
                            <p className="text-red-400 font-bold text-lg mt-1">
                              ${Number(order.cost_materials || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Coste Mano de Obra</label>
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editData.cost_labor || 0}
                              onChange={(e) => setEditData({ ...editData, cost_labor: parseFloat(e.target.value) || 0 })}
                              className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                            />
                          ) : (
                            <p className="text-red-400 font-bold text-lg mt-1">
                              ${Number(order.cost_labor || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400">Precio al Cliente</label>
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editData.price_customer || 0}
                              onChange={(e) => setEditData({ ...editData, price_customer: parseFloat(e.target.value) || 0 })}
                              className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                            />
                          ) : (
                            <p className="text-amber-500 font-bold text-lg mt-1">
                              ${Number(order.price_customer || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Depósito</label>
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editData.deposit_amount || 0}
                              onChange={(e) => setEditData({ ...editData, deposit_amount: parseFloat(e.target.value) || 0 })}
                              className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                            />
                          ) : (
                            <p className={`font-bold text-lg mt-1 ${order.deposit_paid ? 'text-green-400' : 'text-yellow-400'}`}>
                              ${Number(order.deposit_amount || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-700 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Coste Total:</span>
                          <span className="text-red-400 font-bold text-xl">
                            ${(Number(order.cost_materials || 0) + Number(order.cost_labor || 0)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-slate-400">Beneficio:</span>
                          <span className={`font-bold text-xl ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${profit.toFixed(2)} ({margin}%)
                          </span>
                        </div>
                        {order.deposit_paid && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-slate-400">Pendiente de Cobro:</span>
                            <span className="text-amber-500 font-bold text-xl">
                              ${(Number(order.price_customer || 0) - Number(order.deposit_amount || 0)).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      {profit < 0 && (
                        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-3">
                          <AlertTriangle className="text-red-400" size={24} />
                          <div>
                            <p className="text-red-400 font-bold">Pedido con Pérdidas</p>
                            <p className="text-red-300 text-sm">
                              Este pedido tiene un margen negativo. Revisa los costes o ajusta el precio al cliente.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="incidents" className="mt-4">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-100 flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Incidencias
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {incidents.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No hay incidencias registradas</p>
                      ) : (
                        <div className="space-y-4">
                          {incidents.map((incident) => (
                            <div 
                              key={incident.id}
                              className={`p-4 rounded-lg border ${
                                incident.is_resolved 
                                  ? 'bg-green-900/10 border-green-700' 
                                  : 'bg-red-900/10 border-red-700'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getSeverityColor(incident.severity)} border`}>
                                    {incident.severity}
                                  </Badge>
                                  <span className="text-slate-100 font-medium">{incident.incident_type}</span>
                                </div>
                                <Badge className={incident.is_resolved 
                                  ? 'bg-green-900/30 text-green-300 border-green-700 border' 
                                  : 'bg-red-900/30 text-red-300 border-red-700 border'
                                }>
                                  {incident.is_resolved ? 'Resuelto' : 'Pendiente'}
                                </Badge>
                              </div>
                              <p className="text-slate-300 text-sm mb-2">{incident.description}</p>
                              {incident.resolution && (
                                <div className="mt-2 pt-2 border-t border-slate-700">
                                  <p className="text-xs text-slate-400">Resolución:</p>
                                  <p className="text-green-300 text-sm">{incident.resolution}</p>
                                </div>
                              )}
                              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                <span>Por: {incident.reported_by_name || 'Sistema'}</span>
                                <span>{new Date(incident.created_at).toLocaleDateString('es-ES')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Customer & Dates */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <User size={20} />
                    Cliente
                    {order.customer_is_vip && (
                      <Badge className="bg-amber-900/30 text-amber-300 border-amber-700 border ml-2">
                        <Crown size={12} className="mr-1" />
                        VIP
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-lg font-bold text-slate-100">{order.customer_name}</p>
                  </div>
                  {order.customer_email && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={16} />
                      <a href={`mailto:${order.customer_email}`} className="hover:text-amber-500">
                        {order.customer_email}
                      </a>
                    </div>
                  )}
                  {order.customer_phone && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone size={16} />
                      <a href={`tel:${order.customer_phone}`} className="hover:text-amber-500">
                        {order.customer_phone}
                      </a>
                    </div>
                  )}
                  <Link href={`/customers/${order.customer_id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2 border-slate-600">
                      Ver Perfil Completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Calendar size={20} />
                    Fechas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400">Fecha de Creación</label>
                    <p className="text-slate-100">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Fecha Esperada de Entrega</label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.expected_date ? editData.expected_date.split('T')[0] : ''}
                        onChange={(e) => setEditData({ ...editData, expected_date: e.target.value })}
                        className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                      />
                    ) : (
                      <p className="text-amber-500 font-medium">
                        {order.expected_date 
                          ? new Date(order.expected_date).toLocaleDateString('es-ES')
                          : 'No definida'
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Fecha de Completado</label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.completion_date ? editData.completion_date.split('T')[0] : ''}
                        onChange={(e) => setEditData({ ...editData, completion_date: e.target.value })}
                        className="mt-1 bg-slate-700 border-slate-600 text-slate-100"
                      />
                    ) : (
                      <p className={order.completion_date ? 'text-green-400 font-medium' : 'text-slate-500'}>
                        {order.completion_date 
                          ? new Date(order.completion_date).toLocaleDateString('es-ES')
                          : 'Pendiente'
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Última Actualización</label>
                    <p className="text-slate-400 text-sm">
                      {new Date(order.updated_at).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Clock size={20} />
                    Proceso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['pending', 'approved', 'in_production', 'quality_check', 'completed', 'delivered'].map((status, index) => {
                      const isActive = order.status === status
                      const isPast = ['pending', 'approved', 'in_production', 'quality_check', 'completed', 'delivered']
                        .indexOf(order.status) > index
                      const isCancelled = order.status === 'cancelled'
                      
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            isCancelled ? 'bg-red-500' :
                            isActive ? 'bg-amber-500' : 
                            isPast ? 'bg-green-500' : 'bg-slate-600'
                          }`} />
                          <span className={`text-sm ${
                            isActive ? 'text-amber-500 font-medium' :
                            isPast ? 'text-green-400' : 'text-slate-500'
                          }`}>
                            {getStatusLabel(status)}
                          </span>
                          {isActive && (
                            <Badge className="bg-amber-900/30 text-amber-300 border-amber-700 border text-xs">
                              Actual
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
