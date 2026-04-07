'use client'

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, Users, DollarSign, Clock } from 'lucide-react'

const monthlyData = [
  { month: 'Enero', revenue: 4000, repairs: 24, costs: 2400 },
  { month: 'Febrero', revenue: 3000, repairs: 13, costs: 2210 },
  { month: 'Marzo', revenue: 2000, repairs: 9, costs: 2290 },
  { month: 'Abril', revenue: 2780, repairs: 39, costs: 2000 },
  { month: 'Mayo', revenue: 1890, repairs: 23, costs: 2181 },
  { month: 'Junio', revenue: 2390, repairs: 34, costs: 2500 },
]

const repairStatus = [
  { name: 'Completadas', value: 45, fill: '#10b981' },
  { name: 'En Progreso', value: 30, fill: '#3b82f6' },
  { name: 'Pendientes', value: 15, fill: '#f59e0b' },
]

const technicianPerformance = [
  { name: 'Juan Pérez', repairs: 28, satisfaction: 4.8 },
  { name: 'María García', repairs: 34, satisfaction: 4.9 },
  { name: 'Carlos López', repairs: 22, satisfaction: 4.7 },
  { name: 'Sofia Martínez', repairs: 31, satisfaction: 4.8 },
]

export default function ReportsPage() {
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
              <h1 className="text-3xl font-bold text-slate-100">Reportes & Analítica</h1>
              <p className="text-slate-400">Análisis detallado del desempeño del taller</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-slate-100 mt-2">$48,500</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg text-green-400">
                    <DollarSign size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Reparaciones</p>
                    <p className="text-2xl font-bold text-slate-100 mt-2">420</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg text-blue-400">
                    <TrendingUp size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Clientes</p>
                    <p className="text-2xl font-bold text-slate-100 mt-2">185</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg text-purple-400">
                    <Users size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Tiempo Promedio</p>
                    <p className="text-2xl font-bold text-slate-100 mt-2">3.2 días</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg text-amber-400">
                    <Clock size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Ingresos vs Costos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#d4af37" name="Ingresos" strokeWidth={2} />
                    <Line type="monotone" dataKey="costs" stroke="#ef4444" name="Costos" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Estado de Reparaciones</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={repairStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {repairStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-slate-100">Desempeño de Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={technicianPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Bar dataKey="repairs" fill="#3b82f6" name="Reparaciones" />
                    <Bar dataKey="satisfaction" fill="#d4af37" name="Satisfacción (0-5)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Resumen de Reparaciones Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Mes</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Ingresos</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Costos</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Ganancia</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Margen</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Reparaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((row, idx) => {
                      const profit = row.revenue - row.costs
                      const margin = ((profit / row.revenue) * 100).toFixed(1)
                      return (
                        <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="py-3 px-4 text-slate-300">{row.month}</td>
                          <td className="py-3 px-4 text-green-400 font-semibold">${row.revenue}</td>
                          <td className="py-3 px-4 text-red-400">${row.costs}</td>
                          <td className="py-3 px-4 text-slate-300 font-semibold">${profit}</td>
                          <td className="py-3 px-4 text-amber-400 font-semibold">{margin}%</td>
                          <td className="py-3 px-4 text-slate-300">{row.repairs}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
