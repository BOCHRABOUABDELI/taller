'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trash2 } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  function getTypeColor(type: string) {
    switch (type) {
      case 'alert':
        return 'bg-red-900/30 text-red-300 border-red-700'
      case 'warning':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
      case 'info':
        return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'success':
        return 'bg-green-900/30 text-green-300 border-green-700'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotifications(notifications.filter(n => n.id !== id))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

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
              <h1 className="text-3xl font-bold text-slate-100">Notificaciones</h1>
              <p className="text-slate-400">Centro de alertas y mensajes importantes</p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400">Cargando...</p>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <Card key={notif.id} className={`bg-slate-800 border-slate-700 ${!notif.read ? 'border-amber-600/50' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-slate-100">{notif.title}</h3>
                          <Badge className={`${getTypeColor(notif.type)} border text-xs`}>
                            {notif.type}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-2">{notif.message}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notif.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-slate-400">No hay notificaciones</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
