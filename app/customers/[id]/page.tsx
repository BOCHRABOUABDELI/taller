'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Save, Mail, Phone, MapPin, Star, Watch, Wrench, 
  Package, Bell, Edit2, User, CreditCard, FileText
} from 'lucide-react'

interface Watch {
  id: string
  brand: string
  model: string
  serial_number: string
  reference: string
  year: number
  material: string
  condition: string
}

interface Repair {
  id: string
  repair_number: string
  brand: string
  model: string
  status: string
  repair_type: string
  price_customer: number
  profit: number
  technician_name: string
  created_at: string
}

interface SpecialOrder {
  id: string
  order_number: string
  title: string
  status: string
  price_customer: number
  expected_date: string
}

interface CustomerDetail {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
  id_type: string
  id_number: string
  notes: string
  is_vip: boolean
  preferred_contact: string
  total_repairs: number
  total_spent: number
  created_at: string
  watches: Watch[]
  repairs: Repair[]
  special_orders: SpecialOrder[]
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<CustomerDetail>>({})

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setCustomer(data)
          setFormData(data)
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCustomer()
    }
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updated = await res.json()
        setCustomer({ ...customer!, ...updated })
        setEditMode(false)
      }
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-900/30 text-green-300 border-green-700'
      case 'in_progress':
      case 'in_production':
        return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'completed': 'Completada',
      'delivered': 'Entregada',
      'in_progress': 'En Progreso',
      'in_production': 'En Producción',
      'pending': 'Pendiente',
      'assigned': 'Asignada',
      'waiting_parts': 'Esperando Piezas'
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Cargando cliente...</p>
        </main>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Cliente no encontrado</p>
            <Link href="/customers">
              <Button variant="outline" className="border-slate-600">
                Volver a Clientes
              </Button>
            </Link>
          </div>
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
              <Link href="/customers">
                <Button variant="outline" size="icon" className="border-slate-600">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-100">{customer.name}</h1>
                  {customer.is_vip && (
                    <Badge className="bg-amber-600/30 text-amber-300 border-amber-600 border gap-1">
                      <Star size={12} fill="currentColor" />
                      VIP
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400">Cliente desde {new Date(customer.created_at).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {editMode ? (
                <>
                  <Button 
                    variant="outline" 
                    className="border-slate-600"
                    onClick={() => {
                      setEditMode(false)
                      setFormData(customer)
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
                  variant="outline" 
                  className="border-slate-600 gap-2"
                  onClick={() => setEditMode(true)}
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
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-600/20 rounded-lg">
                    <Wrench size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Reparaciones</p>
                    <p className="text-2xl font-bold text-slate-100">{customer.repairs?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    <Watch size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Relojes</p>
                    <p className="text-2xl font-bold text-slate-100">{customer.watches?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600/20 rounded-lg">
                    <Package size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Pedidos Especiales</p>
                    <p className="text-2xl font-bold text-slate-100">{customer.special_orders?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <CreditCard size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Gastado</p>
                    <p className="text-2xl font-bold text-green-400">${Number(customer.total_spent || 0).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="info" className="data-[state=active]:bg-amber-600">
                <User size={16} className="mr-2" />
                Información
              </TabsTrigger>
              <TabsTrigger value="watches" className="data-[state=active]:bg-amber-600">
                <Watch size={16} className="mr-2" />
                Relojes ({customer.watches?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="repairs" className="data-[state=active]:bg-amber-600">
                <Wrench size={16} className="mr-2" />
                Reparaciones ({customer.repairs?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-amber-600">
                <Package size={16} className="mr-2" />
                Pedidos ({customer.special_orders?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Info */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Mail size={20} className="text-amber-500" />
                      Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Nombre Completo</label>
                        {editMode ? (
                          <Input
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100 font-medium">{customer.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Email</label>
                        {editMode ? (
                          <Input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{customer.email || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Teléfono</label>
                        {editMode ? (
                          <Input
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{customer.phone || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Contacto Preferido</label>
                        {editMode ? (
                          <select
                            value={formData.preferred_contact || 'email'}
                            onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                          >
                            <option value="email">Email</option>
                            <option value="phone">Teléfono</option>
                            <option value="whatsapp">WhatsApp</option>
                          </select>
                        ) : (
                          <p className="text-slate-100 capitalize">{customer.preferred_contact || 'Email'}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <label className="text-sm text-slate-400">Cliente VIP</label>
                      {editMode ? (
                        <input
                          type="checkbox"
                          checked={formData.is_vip || false}
                          onChange={(e) => setFormData({ ...formData, is_vip: e.target.checked })}
                          className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                        />
                      ) : (
                        <Badge className={customer.is_vip ? 'bg-amber-600/30 text-amber-300 border-amber-600' : 'bg-slate-700 text-slate-400'}>
                          {customer.is_vip ? 'Sí' : 'No'}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <MapPin size={20} className="text-amber-500" />
                      Dirección
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400">Dirección</label>
                      {editMode ? (
                        <Input
                          value={formData.address || ''}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-slate-100"
                        />
                      ) : (
                        <p className="text-slate-100">{customer.address || '-'}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Ciudad</label>
                        {editMode ? (
                          <Input
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{customer.city || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Código Postal</label>
                        {editMode ? (
                          <Input
                            value={formData.postal_code || ''}
                            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{customer.postal_code || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">País</label>
                        {editMode ? (
                          <Input
                            value={formData.country || ''}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{customer.country || '-'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ID Info */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <CreditCard size={20} className="text-amber-500" />
                      Identificación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">Tipo de Documento</label>
                        {editMode ? (
                          <select
                            value={formData.id_type || 'dni'}
                            onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                          >
                            <option value="dni">DNI</option>
                            <option value="nie">NIE</option>
                            <option value="passport">Pasaporte</option>
                            <option value="cif">CIF</option>
                          </select>
                        ) : (
                          <p className="text-slate-100 uppercase">{customer.id_type || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Número de Documento</label>
                        {editMode ? (
                          <Input
                            value={formData.id_number || ''}
                            onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                          />
                        ) : (
                          <p className="text-slate-100">{customer.id_number || '-'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <FileText size={20} className="text-amber-500" />
                      Notas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <textarea
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 resize-none"
                        placeholder="Notas sobre el cliente..."
                      />
                    ) : (
                      <p className="text-slate-300">{customer.notes || 'Sin notas'}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Watches Tab */}
            <TabsContent value="watches">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-slate-100">Relojes del Cliente</CardTitle>
                  <Button className="bg-amber-600 hover:bg-amber-700 gap-2" size="sm">
                    <Watch size={16} />
                    Añadir Reloj
                  </Button>
                </CardHeader>
                <CardContent>
                  {customer.watches?.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No hay relojes registrados</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {customer.watches?.map((watch) => (
                        <div key={watch.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <h4 className="font-bold text-amber-500">{watch.brand}</h4>
                          <p className="text-slate-100 text-lg">{watch.model}</p>
                          <div className="mt-3 space-y-1 text-sm text-slate-400">
                            <p>S/N: <span className="text-slate-300 font-mono">{watch.serial_number}</span></p>
                            {watch.reference && <p>Ref: <span className="text-slate-300">{watch.reference}</span></p>}
                            {watch.year && <p>Año: <span className="text-slate-300">{watch.year}</span></p>}
                            {watch.material && <p>Material: <span className="text-slate-300">{watch.material}</span></p>}
                          </div>
                          {watch.condition && (
                            <Badge className="mt-3 bg-slate-600 text-slate-300">{watch.condition}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Repairs Tab */}
            <TabsContent value="repairs">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100">Historial de Reparaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  {customer.repairs?.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No hay reparaciones registradas</p>
                  ) : (
                    <div className="space-y-4">
                      {customer.repairs?.map((repair) => (
                        <div key={repair.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-xs text-slate-500">{repair.repair_number}</span>
                              <Badge className={`${getStatusColor(repair.status)} border`}>
                                {getStatusLabel(repair.status)}
                              </Badge>
                            </div>
                            <p className="font-semibold text-slate-100">{repair.brand} {repair.model}</p>
                            <p className="text-sm text-slate-400">{repair.repair_type} - Técnico: {repair.technician_name || 'Sin asignar'}</p>
                            <p className="text-xs text-slate-500">{new Date(repair.created_at).toLocaleDateString('es-ES')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-amber-500">${Number(repair.price_customer || 0).toFixed(2)}</p>
                            <p className="text-xs text-green-400">Beneficio: ${Number(repair.profit || 0).toFixed(2)}</p>
                          </div>
                          <Link href={`/repairs/${repair.id}`} className="ml-4">
                            <Button variant="outline" size="sm" className="border-slate-600">
                              Ver
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-slate-100">Pedidos Especiales</CardTitle>
                  <Button className="bg-amber-600 hover:bg-amber-700 gap-2" size="sm">
                    <Package size={16} />
                    Nuevo Pedido
                  </Button>
                </CardHeader>
                <CardContent>
                  {customer.special_orders?.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No hay pedidos especiales</p>
                  ) : (
                    <div className="space-y-4">
                      {customer.special_orders?.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-xs text-slate-500">{order.order_number}</span>
                              <Badge className={`${getStatusColor(order.status)} border`}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <p className="font-semibold text-slate-100">{order.title}</p>
                            {order.expected_date && (
                              <p className="text-xs text-slate-500">Esperado: {new Date(order.expected_date).toLocaleDateString('es-ES')}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-amber-500">${Number(order.price_customer || 0).toFixed(2)}</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-4 border-slate-600">
                            Ver
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
