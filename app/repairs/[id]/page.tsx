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
import { 
  ArrowLeft, Save, Clock, User, Phone, Mail, Wrench, 
  DollarSign, AlertTriangle, History, CheckCircle, XCircle,
  Calendar, Shield, Star, FileText
} from 'lucide-react'

interface Technician {
  id: string
  name: string
  specialization: string
  is_internal: boolean
  hourly_rate: number
}

interface HistoryEntry {
  id: string
  status_from: string
  status_to: string
  changed_by_name: string
  notes: string
  created_at: string
}

interface Incident {
  id: string
  incident_type: string
  severity: string
  description: string
  resolution: string
  is_resolved: boolean
  reported_by_name: string
  created_at: string
}

interface RepairDetail {
  id: string
  repair_number: string
  status: string
  priority: string
  repair_type: string
  description: string
  diagnosis: string
  work_performed: string
  parts_used: string
  cost_parts: number
  cost_labor: number
  cost_technician: number
  price_customer: number
  profit: number
  estimated_days: number
  warranty_months: number
  notes: string
  created_at: string
  assigned_date: string
  started_date: string
  completion_date: string
  delivery_date: string
  // Watch info
  brand: string
  model: string
  serial_number: string
  reference_number: string
  year: number
  material: string
  condition: string
  watch_description: string
  watch_photos: string[]
  // Customer info
  customer_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  is_vip: boolean
  // Technician info
  technician_id: string
  technician_name: string
  technician_email: string
  technician_phone: string
  technician_specialization: string
  technician_internal: boolean
}

export default function RepairDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [repair, setRepair] = useState<RepairDetail | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'costs' | 'history' | 'incidents'>('info')

  // Form state
  const [formData, setFormData] = useState({
    technician_id: '',
    status: '',
    priority: '',
    repair_type: '',
    description: '',
    diagnosis: '',
    work_performed: '',
    parts_used: '',
    cost_parts: 0,
    cost_labor: 0,
    cost_technician: 0,
    price_customer: 0,
    estimated_days: 0,
    warranty_months: 6,
    notes: ''
  })

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const res = await fetch(`/api/repairs/${id}`)
        if (res.ok) {
          const data = await res.json()
          setRepair(data.repair)
          setHistory(data.history || [])
          setIncidents(data.incidents || [])
          setTechnicians(data.technicians || [])
          
          // Initialize form with repair data
          setFormData({
            technician_id: data.repair.technician_id || '',
            status: data.repair.status || 'pending',
            priority: data.repair.priority || 'normal',
            repair_type: data.repair.repair_type || '',
            description: data.repair.description || '',
            diagnosis: data.repair.diagnosis || '',
            work_performed: data.repair.work_performed || '',
            parts_used: data.repair.parts_used || '',
            cost_parts: Number(data.repair.cost_parts) || 0,
            cost_labor: Number(data.repair.cost_labor) || 0,
            cost_technician: Number(data.repair.cost_technician) || 0,
            price_customer: Number(data.repair.price_customer) || 0,
            estimated_days: data.repair.estimated_days || 0,
            warranty_months: data.repair.warranty_months || 6,
            notes: data.repair.notes || ''
          })
        }
      } catch (error) {
        console.error('Error fetching repair:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepair()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/repairs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updated = await res.json()
        setRepair(prev => prev ? { ...prev, ...updated } : null)
        // Refresh history
        const refreshRes = await fetch(`/api/repairs/${id}`)
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          setHistory(refreshData.history || [])
        }
      }
    } catch (error) {
      console.error('Error saving repair:', error)
    } finally {
      setSaving(false)
    }
  }

  // Calculate profit in real-time
  const calculatedProfit = formData.price_customer - formData.cost_parts - formData.cost_labor - formData.cost_technician

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
      assigned: 'bg-blue-900/30 text-blue-300 border-blue-700',
      in_progress: 'bg-cyan-900/30 text-cyan-300 border-cyan-700',
      waiting_parts: 'bg-orange-900/30 text-orange-300 border-orange-700',
      quality_check: 'bg-purple-900/30 text-purple-300 border-purple-700',
      completed: 'bg-green-900/30 text-green-300 border-green-700',
      delivered: 'bg-emerald-900/30 text-emerald-300 border-emerald-700',
      cancelled: 'bg-red-900/30 text-red-300 border-red-700'
    }
    return colors[status] || 'bg-slate-700 text-slate-300'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      assigned: 'Asignada',
      in_progress: 'En Progreso',
      waiting_parts: 'Esperando Piezas',
      quality_check: 'Control Calidad',
      completed: 'Completada',
      delivered: 'Entregada',
      cancelled: 'Cancelada'
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-700 text-slate-300',
      normal: 'bg-blue-900/30 text-blue-300 border-blue-700',
      high: 'bg-orange-900/30 text-orange-300 border-orange-700',
      urgent: 'bg-red-900/30 text-red-300 border-red-700'
    }
    return colors[priority] || 'bg-slate-700 text-slate-300'
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  if (!repair) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Reparación no encontrada</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/repairs">
                <Button variant="outline" size="icon" className="border-slate-600">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-100">{repair.repair_number}</h1>
                  <Badge className={`${getStatusColor(formData.status)} border`}>
                    {getStatusLabel(formData.status)}
                  </Badge>
                  <Badge className={`${getPriorityColor(formData.priority)} border`}>
                    {formData.priority === 'urgent' ? 'URGENTE' : formData.priority.toUpperCase()}
                  </Badge>
                  {repair.is_vip && (
                    <Badge className="bg-amber-900/30 text-amber-300 border-amber-700 border">
                      <Star size={12} className="mr-1" /> VIP
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400">
                  {repair.brand} {repair.model} • {repair.customer_name}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-amber-600 hover:bg-amber-700 gap-2"
            >
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700 pb-2">
            {[
              { key: 'info', label: 'Información', icon: FileText },
              { key: 'costs', label: 'Costes y Precios', icon: DollarSign },
              { key: 'history', label: 'Historial', icon: History },
              { key: 'incidents', label: 'Incidencias', icon: AlertTriangle }
            ].map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={activeTab === tab.key ? 'bg-amber-600' : 'text-slate-400 hover:text-slate-100'}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
                {tab.key === 'incidents' && incidents.length > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {incidents.length}
                  </span>
                )}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'info' && (
                <>
                  {/* Watch Info */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-100 flex items-center gap-2">
                        <Clock size={20} className="text-amber-500" />
                        Información del Reloj
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-slate-500">Marca</label>
                          <p className="text-slate-100 font-semibold">{repair.brand}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Modelo</label>
                          <p className="text-slate-100 font-semibold">{repair.model}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Número de Serie</label>
                          <p className="text-slate-100 font-mono">{repair.serial_number || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Referencia</label>
                          <p className="text-slate-100">{repair.reference_number || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Año</label>
                          <p className="text-slate-100">{repair.year || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Material</label>
                          <p className="text-slate-100">{repair.material || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Condición</label>
                          <p className="text-slate-100 capitalize">{repair.condition || '-'}</p>
                        </div>
                      </div>
                      {repair.watch_description && (
                        <div>
                          <label className="text-xs text-slate-500">Descripción</label>
                          <p className="text-slate-300 text-sm">{repair.watch_description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Repair Details */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-100 flex items-center gap-2">
                        <Wrench size={20} className="text-amber-500" />
                        Detalles de la Reparación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Estado</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-slate-700 border-slate-600 rounded-md px-3 py-2 text-slate-100"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="assigned">Asignada</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="waiting_parts">Esperando Piezas</option>
                            <option value="quality_check">Control de Calidad</option>
                            <option value="completed">Completada</option>
                            <option value="delivered">Entregada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Prioridad</label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className="w-full bg-slate-700 border-slate-600 rounded-md px-3 py-2 text-slate-100"
                          >
                            <option value="low">Baja</option>
                            <option value="normal">Normal</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Tipo de Reparación</label>
                        <Input
                          value={formData.repair_type}
                          onChange={(e) => setFormData({ ...formData, repair_type: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100"
                          placeholder="Ej: Revisión completa, cambio de cristal..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Descripción del Problema</label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100 min-h-[80px]"
                          placeholder="Describe el problema reportado por el cliente..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Diagnóstico Técnico</label>
                        <Textarea
                          value={formData.diagnosis}
                          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100 min-h-[80px]"
                          placeholder="Diagnóstico realizado por el técnico..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Trabajo Realizado</label>
                        <Textarea
                          value={formData.work_performed}
                          onChange={(e) => setFormData({ ...formData, work_performed: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100 min-h-[80px]"
                          placeholder="Descripción del trabajo realizado..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Piezas Utilizadas</label>
                        <Textarea
                          value={formData.parts_used}
                          onChange={(e) => setFormData({ ...formData, parts_used: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100 min-h-[60px]"
                          placeholder="Lista de piezas utilizadas..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Días Estimados</label>
                          <Input
                            type="number"
                            value={formData.estimated_days}
                            onChange={(e) => setFormData({ ...formData, estimated_days: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Garantía (meses)</label>
                          <Input
                            type="number"
                            value={formData.warranty_months}
                            onChange={(e) => setFormData({ ...formData, warranty_months: parseInt(e.target.value) || 6 })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Notas Internas</label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100 min-h-[60px]"
                          placeholder="Notas internas (no visibles para el cliente)..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === 'costs' && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <DollarSign size={20} className="text-amber-500" />
                      Control de Costes y Beneficios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Costs Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Costes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Coste Piezas (€)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.cost_parts}
                            onChange={(e) => setFormData({ ...formData, cost_parts: parseFloat(e.target.value) || 0 })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Coste Mano de Obra (€)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.cost_labor}
                            onChange={(e) => setFormData({ ...formData, cost_labor: parseFloat(e.target.value) || 0 })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Pago al Técnico (€)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.cost_technician}
                            onChange={(e) => setFormData({ ...formData, cost_technician: parseFloat(e.target.value) || 0 })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Precio al Cliente</h3>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Precio Total (€)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.price_customer}
                          onChange={(e) => setFormData({ ...formData, price_customer: parseFloat(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-slate-100 text-lg font-bold"
                        />
                      </div>
                    </div>

                    {/* Profit Summary */}
                    <div className="pt-4 border-t border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Resumen de Rentabilidad</h3>
                      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Precio al Cliente</span>
                          <span className="text-slate-100 font-semibold">€{formData.price_customer.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">- Coste Piezas</span>
                          <span className="text-red-400">-€{formData.cost_parts.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">- Coste Mano de Obra</span>
                          <span className="text-red-400">-€{formData.cost_labor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">- Pago Técnico</span>
                          <span className="text-red-400">-€{formData.cost_technician.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-600 pt-3 flex justify-between">
                          <span className="text-slate-100 font-semibold">Beneficio Neto</span>
                          <span className={`text-xl font-bold ${calculatedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            €{calculatedProfit.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Margen</span>
                          <span className={`font-semibold ${calculatedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formData.price_customer > 0 
                              ? ((calculatedProfit / formData.price_customer) * 100).toFixed(1) 
                              : 0}%
                          </span>
                        </div>
                      </div>
                      
                      {calculatedProfit < 0 && (
                        <div className="mt-4 bg-red-900/20 border border-red-700 rounded-lg p-3 flex items-center gap-2">
                          <AlertTriangle className="text-red-400" size={20} />
                          <span className="text-red-300 text-sm">
                            Esta reparación tiene pérdidas. Revisa los costes y el precio.
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'history' && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <History size={20} className="text-amber-500" />
                      Historial de Cambios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {history.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">No hay cambios registrados</p>
                    ) : (
                      <div className="space-y-4">
                        {history.map((entry) => (
                          <div key={entry.id} className="flex gap-4 p-3 bg-slate-700/50 rounded-lg">
                            <div className="flex-shrink-0 w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                              <History size={18} className="text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${getStatusColor(entry.status_from || '')} border text-xs`}>
                                  {getStatusLabel(entry.status_from || 'Nuevo')}
                                </Badge>
                                <span className="text-slate-500">→</span>
                                <Badge className={`${getStatusColor(entry.status_to)} border text-xs`}>
                                  {getStatusLabel(entry.status_to)}
                                </Badge>
                              </div>
                              {entry.notes && (
                                <p className="text-sm text-slate-300 mt-1">{entry.notes}</p>
                              )}
                              <p className="text-xs text-slate-500 mt-1">
                                {entry.changed_by_name || 'Sistema'} • {formatDate(entry.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'incidents' && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <AlertTriangle size={20} className="text-amber-500" />
                      Incidencias
                    </CardTitle>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      Nueva Incidencia
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {incidents.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">No hay incidencias registradas</p>
                    ) : (
                      <div className="space-y-4">
                        {incidents.map((incident) => (
                          <div key={incident.id} className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-l-red-500">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-slate-100">{incident.incident_type}</span>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  incident.severity === 'critical' ? 'bg-red-900/50 text-red-300 border-red-700' :
                                  incident.severity === 'high' ? 'bg-orange-900/50 text-orange-300 border-orange-700' :
                                  incident.severity === 'medium' ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' :
                                  'bg-slate-700 text-slate-300'
                                }>
                                  {incident.severity.toUpperCase()}
                                </Badge>
                                {incident.is_resolved ? (
                                  <CheckCircle className="text-green-400" size={18} />
                                ) : (
                                  <XCircle className="text-red-400" size={18} />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{incident.description}</p>
                            {incident.resolution && (
                              <p className="text-sm text-green-300 bg-green-900/20 p-2 rounded">
                                <strong>Resolución:</strong> {incident.resolution}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                              Reportado por {incident.reported_by_name || 'Sistema'} • {formatDate(incident.created_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Card */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-base">
                    <User size={18} className="text-amber-500" />
                    Cliente
                    {repair.is_vip && <Star size={14} className="text-amber-400" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-slate-100 font-semibold">{repair.customer_name}</p>
                  {repair.customer_phone && (
                    <a href={`tel:${repair.customer_phone}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-500">
                      <Phone size={14} />
                      {repair.customer_phone}
                    </a>
                  )}
                  {repair.customer_email && (
                    <a href={`mailto:${repair.customer_email}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-500">
                      <Mail size={14} />
                      {repair.customer_email}
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Technician Assignment */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-base">
                    <Wrench size={18} className="text-amber-500" />
                    Técnico Asignado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <select
                    value={formData.technician_id}
                    onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
                    className="w-full bg-slate-700 border-slate-600 rounded-md px-3 py-2 text-slate-100"
                  >
                    <option value="">Sin asignar</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name} {tech.is_internal ? '(Interno)' : '(Externo)'} - {tech.specialization || 'General'}
                      </option>
                    ))}
                  </select>
                  {repair.technician_name && (
                    <div className="pt-2 border-t border-slate-700">
                      <p className="text-slate-100 font-semibold">{repair.technician_name}</p>
                      <p className="text-sm text-slate-400">{repair.technician_specialization}</p>
                      {repair.technician_phone && (
                        <a href={`tel:${repair.technician_phone}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-500 mt-2">
                          <Phone size={14} />
                          {repair.technician_phone}
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dates */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-base">
                    <Calendar size={18} className="text-amber-500" />
                    Fechas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Creada</span>
                    <span className="text-slate-100">{formatDate(repair.created_at)}</span>
                  </div>
                  {repair.assigned_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asignada</span>
                      <span className="text-slate-100">{formatDate(repair.assigned_date)}</span>
                    </div>
                  )}
                  {repair.started_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Iniciada</span>
                      <span className="text-slate-100">{formatDate(repair.started_date)}</span>
                    </div>
                  )}
                  {repair.completion_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Completada</span>
                      <span className="text-green-400">{formatDate(repair.completion_date)}</span>
                    </div>
                  )}
                  {repair.delivery_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entregada</span>
                      <span className="text-emerald-400">{formatDate(repair.delivery_date)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Warranty */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-base">
                    <Shield size={18} className="text-amber-500" />
                    Garantía
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-100">{formData.warranty_months} meses</p>
                  <p className="text-sm text-slate-400">desde la fecha de entrega</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
