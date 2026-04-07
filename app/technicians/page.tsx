'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ArrowLeft, Mail, Phone } from 'lucide-react'

interface Technician {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  is_internal: boolean
  is_active: boolean
  hourly_rate: number
  total_repairs: number
  success_rate: number
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await fetch('/api/technicians')
        if (res.ok) {
          const data = await res.json()
          setTechnicians(data)
        }
      } catch (error) {
        console.error('Error fetching technicians:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  function getStatusColor(isActive: boolean) {
    return isActive
      ? 'bg-green-900/30 text-green-300 border-green-700'
      : 'bg-red-900/30 text-red-300 border-red-700'
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
                <h1 className="text-3xl font-bold text-slate-100">Técnicos</h1>
                <p className="text-slate-400">Gestión del equipo de técnicos</p>
              </div>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 gap-2">
              <Plus size={18} />
              Nuevo Técnico
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-slate-400">Cargando...</p>
            ) : technicians.length > 0 ? (
              technicians.map((tech) => (
                <Card key={tech.id} className="bg-slate-800 border-slate-700 hover:border-amber-600/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-slate-100 text-lg">{tech.name}</h3>
                      <div className="flex gap-2">
                        {tech.is_internal ? (
                          <Badge className="bg-blue-900/30 text-blue-300 border-blue-700 border">Interno</Badge>
                        ) : (
                          <Badge className="bg-purple-900/30 text-purple-300 border-purple-700 border">Externo</Badge>
                        )}
                        <Badge className={`${getStatusColor(tech.is_active)} border`}>
                          {tech.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-amber-500 font-medium mb-4">{tech.specialization || 'Sin especialización'}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="bg-slate-700/50 p-2 rounded">
                        <p className="text-slate-500 text-xs">Reparaciones</p>
                        <p className="text-slate-100 font-bold">{tech.total_repairs || 0}</p>
                      </div>
                      <div className="bg-slate-700/50 p-2 rounded">
                        <p className="text-slate-500 text-xs">Éxito</p>
                        <p className="text-green-400 font-bold">{Number(tech.success_rate || 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-slate-400">
                      {tech.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} />
                          <a href={`mailto:${tech.email}`} className="hover:text-amber-500">
                            {tech.email}
                          </a>
                        </div>
                      )}
                      {tech.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          <a href={`tel:${tech.phone}`} className="hover:text-amber-500">
                            {tech.phone}
                          </a>
                        </div>
                      )}
                      {tech.hourly_rate > 0 && (
                        <p className="text-amber-500 font-medium">${Number(tech.hourly_rate).toFixed(2)}/hora</p>
                      )}
                    </div>
                    <Link href={`/technicians/${tech.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-6 border-slate-600">
                        Ver Detalles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-slate-400">No hay técnicos registrados</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
