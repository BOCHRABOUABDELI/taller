'use client'

import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bell, Lock, Palette } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="border-slate-600">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Configuración</h1>
              <p className="text-slate-400">Administra los parámetros de tu taller</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Bell size={20} />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300">Alertas de reparaciones</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-slate-300">Recordatorios de pedidos</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-slate-300">Notificaciones por email</label>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Lock size={20} />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                  Sesiones Activas
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                  Autenticación de Dos Factores
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Palette size={20} />
                  Información del Taller
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Nombre del Taller</label>
                  <input
                    type="text"
                    placeholder="Tu Taller de Relojes"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email de Contacto</label>
                  <input
                    type="email"
                    placeholder="contacto@taller.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder-slate-500"
                  />
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
