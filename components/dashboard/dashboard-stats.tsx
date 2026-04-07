import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Clock, DollarSign, AlertCircle } from 'lucide-react'

export default function DashboardStats() {
  const stats = [
    {
      title: 'Reparaciones Activas',
      value: '12',
      change: '+2 hoy',
      icon: Wrench,
      color: 'text-blue-400'
    },
    {
      title: 'Ingresos Este Mes',
      value: '$8,450',
      change: '+15% vs mes pasado',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Tiempo Promedio',
      value: '3.2 días',
      change: '-0.5 días',
      icon: Clock,
      color: 'text-purple-400'
    },
    {
      title: 'Incidentes',
      value: '2',
      change: 'Requieren atención',
      icon: AlertCircle,
      color: 'text-red-400'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-100 mt-2">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
              </div>
              <div className={`p-3 bg-slate-700 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { Wrench } from 'lucide-react'
