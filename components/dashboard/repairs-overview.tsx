import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const repairs = [
  {
    id: 'REP001',
    customer: 'Carlos Mendez',
    watch: 'Rolex Submariner',
    status: 'in_progress',
    date: '2024-04-01',
    price: '$450'
  },
  {
    id: 'REP002',
    customer: 'Sofia García',
    watch: 'Omega Seamaster',
    status: 'pending',
    date: '2024-04-02',
    price: '$380'
  },
  {
    id: 'REP003',
    customer: 'Miguel López',
    watch: 'TAG Heuer Carrera',
    status: 'completed',
    date: '2024-03-30',
    price: '$520'
  }
]

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-900/30 text-green-300 border-green-700'
    case 'in_progress':
      return 'bg-blue-900/30 text-blue-300 border-blue-700'
    case 'pending':
      return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
    default:
      return 'bg-slate-700 text-slate-300'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'completed':
      return 'Completada'
    case 'in_progress':
      return 'En Progreso'
    case 'pending':
      return 'Pendiente'
    default:
      return status
  }
}

export default function RepairsOverview() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100">Reparaciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Reloj</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Estado</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Fecha</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Precio</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair) => (
                <tr key={repair.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-slate-300 font-mono">{repair.id}</td>
                  <td className="py-3 px-4 text-slate-300">{repair.customer}</td>
                  <td className="py-3 px-4 text-slate-300">{repair.watch}</td>
                  <td className="py-3 px-4">
                    <Badge className={`${getStatusColor(repair.status)} border`}>
                      {getStatusLabel(repair.status)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{repair.date}</td>
                  <td className="py-3 px-4 text-slate-300 font-semibold">{repair.price}</td>
                  <td className="py-3 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
