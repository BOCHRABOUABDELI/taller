'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  total_repairs: number
  total_spent: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers')
        if (res.ok) {
          const data = await res.json()
          setCustomers(data)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

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
                <h1 className="text-3xl font-bold text-slate-100">Clientes</h1>
                <p className="text-slate-400">Gestión de clientes y contactos</p>
              </div>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 gap-2">
              <Plus size={18} />
              Nuevo Cliente
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-slate-400">Cargando...</p>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <Card key={customer.id} className="bg-slate-800 border-slate-700 hover:border-amber-600/50 transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-slate-100 text-lg mb-4">{customer.name}</h3>
                    <div className="space-y-3 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <a href={`mailto:${customer.email}`} className="hover:text-amber-500">
                          {customer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <a href={`tel:${customer.phone}`} className="hover:text-amber-500">
                          {customer.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{customer.city}</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Reparaciones</p>
                        <p className="text-amber-500 font-bold">{customer.total_repairs}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Gastado</p>
                        <p className="text-amber-500 font-bold">${customer.total_spent}</p>
                      </div>
                    </div>
                    <Link href={`/customers/${customer.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-4 border-slate-600">
                        Ver Detalles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-slate-400">No hay clientes registrados</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
