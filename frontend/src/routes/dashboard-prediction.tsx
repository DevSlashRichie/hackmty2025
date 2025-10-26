import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

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
  const { user, logout } = useAuth()
  const [currentProduction, setCurrentProduction] = useState(4.8)
  const [currentConsumption, setCurrentConsumption] = useState(1.2)
  const [showConfig, setShowConfig] = useState(false)

  const userName = sessionStorage.getItem('user_name') || user?.name

  const handleLogout = () => {
    logout()
    sessionStorage.removeItem('user_name')
    sessionStorage.removeItem('company_name')
    sessionStorage.removeItem('company_info')
    sessionStorage.removeItem('energy_profile')
    navigate({ to: '/' })
  }

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
    <div className="min-h-screen bg-[#F6F6F6] pb-20 lg:pb-0">
      {/* Modal de configuración - Móvil */}
      {showConfig && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowConfig(false)}
          />
          <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#323E48]">Configuración</h3>
              <button
                onClick={() => setShowConfig(false)}
                className="p-2 hover:bg-[#F6F6F6] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[#323E48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#F6F6F6] rounded-lg p-4">
                <p className="text-xs text-[#5B6670] mb-1">Usuario</p>
                <p className="font-medium text-[#323E48]">{userName}</p>
                <p className="text-sm text-[#5B6670] mt-1">{user?.email || 'email@ejemplo.com'}</p>
              </div>

              <button
                onClick={() => {
                  handleLogout()
                  setShowConfig(false)
                }}
                className="w-full px-4 py-3 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal */}
      <div className="flex min-h-screen relative">
        {/* Contenido principal */}
        <div className="flex-1 p-4 md:p-6 w-full lg:w-auto lg:mr-64">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8">
              {/* Header con título - Desktop */}
              <div className="mb-4 md:mb-6 hidden lg:block">
                <h1 className="text-2xl md:text-3xl font-bold text-[#323E48] mb-2">
                  ☀️ Tu Energía Hoy
                </h1>
                <p className="text-[#5B6670] text-sm md:text-base">
                  Sábado, {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Gráfica simulada */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-end justify-between h-24 md:h-32 mb-4">
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
                <div className="flex items-center justify-center gap-4 md:gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-[#EB0029] rounded"></div>
                    <span className="text-xs md:text-sm text-[#5B6670]">Producción</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-[#4A9EEB] rounded"></div>
                    <span className="text-xs md:text-sm text-[#5B6670]">Consumo</span>
                  </div>
                </div>
              </div>

              {/* Métricas en tiempo real */}
              <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-8">
                <div className="bg-[#F6F6F6] rounded-lg md:rounded-xl p-3 md:p-6 text-center">
                  <p className="text-xs md:text-sm text-[#5B6670] mb-1 md:mb-2">Produciendo</p>
                  <p className="text-xl md:text-4xl font-bold text-[#EB0029]">{currentProduction.toFixed(1)}</p>
                  <p className="text-xs text-[#5B6670] mt-1">kW</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg md:rounded-xl p-3 md:p-6 text-center">
                  <p className="text-xs md:text-sm text-[#5B6670] mb-1 md:mb-2">Consumiendo</p>
                  <p className="text-xl md:text-4xl font-bold text-[#4A9EEB]">{currentConsumption.toFixed(1)}</p>
                  <p className="text-xs text-[#5B6670] mt-1">kW</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg md:rounded-xl p-3 md:p-6 text-center">
                  <p className="text-xs md:text-sm text-[#5B6670] mb-1 md:mb-2">Excedente</p>
                  <p className="text-xl md:text-4xl font-bold text-[#6CC04A]">+{surplus.toFixed(1)}</p>
                  <p className="text-xs text-[#5B6670] mt-1">kW</p>
                </div>
              </div>

              {/* Predicción IA */}
              <div className="bg-gradient-to-br from-[#EB0029]/5 to-[#4A9EEB]/5 border-2 border-[#EB0029]/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="text-3xl md:text-5xl">🤖</div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-[#323E48] mb-2 md:mb-4">
                      PREDICCIÓN IA
                    </h3>
                    <p className="text-sm md:text-base text-[#323E48] mb-4 md:mb-6">
                      <strong>¡Excelente día!</strong> A las 2pm tendrás pico de producción (5.2 kW). Te sugiero:
                    </p>

                    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4">
                        <span className="text-xl md:text-2xl">💡</span>
                        <div className="flex-1">
                          <p className="text-sm md:text-base font-medium text-[#323E48]">Lavar ropa entre 1-3pm</p>
                          <p className="text-xs md:text-sm text-[#5B6670]">Ahorra $18</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4">
                        <span className="text-xl md:text-2xl">🍽️</span>
                        <div className="flex-1">
                          <p className="text-sm md:text-base font-medium text-[#323E48]">Usar lavavajillas a las 2pm</p>
                          <p className="text-xs md:text-sm text-[#5B6670]">Ahorra $12</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4">
                        <span className="text-xl md:text-2xl">❌</span>
                        <div className="flex-1">
                          <p className="text-sm md:text-base font-medium text-[#323E48]">Evita horno después de 6pm</p>
                          <p className="text-xs md:text-sm text-[#EB0029]">Cuesta $45</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 text-center">
                      <p className="text-xs md:text-sm text-[#5B6670] mb-1">Potencial ahorro hoy</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#6CC04A]">$75 💰</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar derecho - Solo Desktop */}
        <div className="hidden lg:block fixed top-20 right-0 h-[calc(100vh-80px)] w-64 bg-white border-l border-[#CFD2D3] p-6 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#323E48] mb-6">Acciones</h2>
            
            <button
              onClick={() => navigate({ to: '/assistant' })}
              className="w-full flex items-center gap-3 p-4 rounded-lg bg-[#F6F6F6] transition-colors text-left border-l-2 border-[#EB0029]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Asistente</p>
                <p className="text-xs text-[#5B6670]">Pregunta aquí</p>
              </div>
            </button>

            <button
              onClick={() => navigate({ to: '/scan' })}
              className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-[#F6F6F6] transition-colors text-left border-l-2 border-transparent hover:border-[#CFD2D3]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Escanear</p>
                <p className="text-xs text-[#5B6670]">Recibo de luz</p>
              </div>
            </button>

            <button
              onClick={() => navigate({ to: '/gamification' })}
              className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-[#F6F6F6] transition-colors text-left border-l-2 border-transparent hover:border-[#CFD2D3]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Ranking</p>
                <p className="text-xs text-[#5B6670]">Ver posición</p>
              </div>
            </button>

            <div className="pt-6 border-t border-[#CFD2D3] mt-6">
              <div className="bg-[#F6F6F6] rounded-lg p-4">
                <p className="text-sm font-semibold text-[#323E48] mb-2">Consejo del día</p>
                <p className="text-xs text-[#5B6670]">
                  Aprovecha el sol de 12-3pm para usar electrodomésticos de alto consumo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Móvil y Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#CFD2D3] z-30 safe-area-inset-bottom">
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => navigate({ to: '/assistant' })}
            className="flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 border-transparent"
          >
            <svg className="w-5 h-5 text-[#5B6670]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-xs text-[#5B6670]">IA</span>
          </button>

          <button
            onClick={() => navigate({ to: '/scan' })}
            className="flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 border-transparent"
          >
            <svg className="w-5 h-5 text-[#5B6670]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-[#5B6670]">Ahorra</span>
          </button>

          <button
            onClick={() => navigate({ to: '/dashboard-prediction' })}
            className="flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 border-[#EB0029]"
          >
            <svg className="w-5 h-5 text-[#EB0029]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium text-[#EB0029]">Inicio</span>
          </button>

          <button
            onClick={() => navigate({ to: '/gamification' })}
            className="flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 border-transparent"
          >
            <svg className="w-5 h-5 text-[#5B6670]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs text-[#5B6670]">Comunidad</span>
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 ${
              showConfig ? 'border-[#EB0029]' : 'border-transparent'
            }`}
          >
            <svg className={`w-5 h-5 ${showConfig ? 'text-[#EB0029]' : 'text-[#5B6670]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`text-xs ${showConfig ? 'font-medium text-[#EB0029]' : 'text-[#5B6670]'}`}>Config</span>
          </button>
        </div>
      </div>
    </div>
  )
}
