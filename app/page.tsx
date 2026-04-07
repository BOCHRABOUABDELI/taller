'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await signup(email, password, name)
      }
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center text-slate-100">
            {isLogin ? 'Taller de Relojes' : 'Crear Cuenta'}
          </CardTitle>
          <p className="text-center text-sm text-slate-400">
            {isLogin ? 'Gestión de Reparaciones de Relojes de Lujo' : 'Nuevo Administrador'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="bg-slate-700 border-slate-600 text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-700 border-slate-600 text-slate-100"
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-400">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-amber-500 hover:text-amber-400 font-medium"
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-center text-xs text-slate-500 mb-2">Usuario de prueba</p>
            <button
              type="button"
              onClick={async () => {
                setLoading(true)
                try {
                  await fetch('/api/auth/reset-test-user', { method: 'POST' })
                  setEmail('admin@luxerepair.test')
                  setPassword('Test123!')
                  setError('')
                } catch {
                  setError('Error reseteando usuario')
                } finally {
                  setLoading(false)
                }
              }}
              className="w-full text-xs py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            >
              Cargar credenciales de prueba
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
