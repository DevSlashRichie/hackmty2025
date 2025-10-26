import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/dashboard-prediction')({
  beforeLoad: async () => {
    const token = sessionStorage.getItem('auth_token')
    const energyProfile = sessionStorage.getItem('energy_profile')
    if (!token || !energyProfile) {
      throw redirect({ to: '/' })
    }
  },
  component: DashboardPredictionComponent,
})

function DashboardPredictionComponent() {
  const navigate = useNavigate()
  const [currentProduction, setCurrentProduction] = useState(4.8)
  const [currentConsumption, setCurrentConsumption] = useState(1.2)

  // Simular actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProduction(prev => prev + (Math.random() - 0.5) * 0.3)
      setCurrentConsumption(prev => Math.max(0.5, prev + (Math.random() - 0.5) * 0.2))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const surplus = currentProduction - currentConsumption

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Header */}
      <div className="bg-white border-b border-[#CFD2D3] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#323E48]">
            ☀️ Tu Energía Hoy
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: '/scan' })}
              className="px-4 py-2 border border-[#CFD2D3] rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              📸 Escanear
            </button>
            <button
              onClick={() => navigate({ to: '/gamification' })}
              className="px-4 py-2 border border-[#CFD2D3] rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              🏆 Ranking
            </button>
            <button
              onClick={() => navigate({ to: '/assistant' })}
              className="px-4 py-2 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors text-sm"
            >
              🎤 Asistente
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Fecha y hora */}
          <div className="mb-6">
            <p className="text-[#5B6670]">
              Sábado, {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Gráfica simulada */}
          <div className="mb-8">
            <div className="flex items-end justify-between h-32 mb-4">
              {[...Array(20)].map((_, i) => {
                const height = Math.sin(i * 0.5) * 50 + 50
                return (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#EB0029] to-[#FF6B6B] rounded-t mx-0.5"
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
            
            {/* Leyenda */}
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#EB0029] rounded"></div>
                <span className="text-sm text-[#5B6670]">Producción</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#4A9EEB] rounded"></div>
                <span className="text-sm text-[#5B6670]">Consumo</span>
              </div>
            </div>
          </div>

          {/* Métricas en tiempo real */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#F6F6F6] rounded-xl p-6 text-center">
              <p className="text-sm text-[#5B6670] mb-2">Produciendo ahora</p>
              <p className="text-4xl font-bold text-[#EB0029]">{currentProduction.toFixed(1)} kW</p>
            </div>
            <div className="bg-[#F6F6F6] rounded-xl p-6 text-center">
              <p className="text-sm text-[#5B6670] mb-2">Consumiendo ahora</p>
              <p className="text-4xl font-bold text-[#4A9EEB]">{currentConsumption.toFixed(1)} kW</p>
            </div>
            <div className="bg-[#F6F6F6] rounded-xl p-6 text-center">
              <p className="text-sm text-[#5B6670] mb-2">Excedente</p>
              <p className="text-4xl font-bold text-[#6CC04A]">+{surplus.toFixed(1)} kW</p>
            </div>
          </div>

          {/* Predicción IA */}
          <div className="bg-gradient-to-br from-[#EB0029]/5 to-[#4A9EEB]/5 border-2 border-[#EB0029]/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🤖</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#323E48] mb-4">
                  PREDICCIÓN IA
                </h3>
                <p className="text-[#323E48] mb-6">
                  <strong>¡Excelente día!</strong> A las 2pm tendrás pico de producción (5.2 kW). Te sugiero:
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <p className="font-medium text-[#323E48]">Lavar ropa entre 1-3pm</p>
                      <p className="text-sm text-[#5B6670]">Ahorra $18</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                    <span className="text-2xl">🍽️</span>
                    <div className="flex-1">
                      <p className="font-medium text-[#323E48]">Usar lavavajillas a las 2pm</p>
                      <p className="text-sm text-[#5B6670]">Ahorra $12</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                    <span className="text-2xl">❌</span>
                    <div className="flex-1">
                      <p className="font-medium text-[#323E48]">Evita horno después de 6pm</p>
                      <p className="text-sm text-[#EB0029]">Cuesta $45</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-[#5B6670] mb-1">Potencial ahorro hoy</p>
                  <p className="text-3xl font-bold text-[#6CC04A]">$75 💰</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
