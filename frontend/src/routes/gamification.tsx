import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FloatingChat } from '@/components/FloatingChat'

export const Route = createFileRoute('/gamification')({
  beforeLoad: async () => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/' })
    }
  },
  component: GamificationComponent,
})

function GamificationComponent() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'year'>('week')
  const [showChat, setShowChat] = useState(false)
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

  const ranking = [
    { position: 1, house: 47, name: 'Los Hernández', energy: 850, efficiency: 95, streak: 8, emoji: '🥇' },
    { position: 2, house: 89, name: 'Los Martínez', energy: 840, efficiency: 93, streak: 5, emoji: '🥈' },
    { position: 3, house: 12, name: 'Los López', energy: 830, efficiency: 91, streak: 3, emoji: '🥉' },
    { position: 4, house: 56, name: 'Los García', energy: 810, efficiency: 90, streak: 2, emoji: '' },
    { position: 5, house: 78, name: 'Los Rodríguez', energy: 795, efficiency: 89, streak: 4, emoji: '' },
    { position: 6, house: 21, name: 'Los Pérez', energy: 785, efficiency: 88, streak: 1, emoji: '' },
    { position: 7, house: 33, name: 'Los Sánchez', energy: 775, efficiency: 88, streak: 2, emoji: '' },
    { position: 23, house: 34, name: 'Tú', energy: 745, efficiency: 87, streak: 1, isUser: true, emoji: '👤' },
  ]

  const leaderTips = [
    {
      leader: 'Los Hernández',
      tip: 'Limpiaron sus paneles hace 3 días. ¿Cuándo limpiaste los tuyos?',
      category: 'mantenimiento'
    },
    {
      leader: 'Los Martínez', 
      tip: 'Usan lavadora y lavavajillas solo entre 12pm-3pm cuando hay máxima producción',
      category: 'optimización'
    },
    {
      leader: 'Los López',
      tip: 'Configuraron su AC en modo eco y solo lo prenden después de las 11am',
      category: 'consumo'
    }
  ]

  const [currentTip, setCurrentTip] = useState(0)

  return (
    <div className="h-screen bg-[#F6F6F6] flex flex-col overflow-hidden">
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
      <div className="flex flex-1 relative">
        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0 lg:mr-64">
          <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header de colonia */}
            <div className="bg-[#EB0029] text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">
                TU COLONIA: VALLE VERDE
              </h2>
              <p className="text-white/90"> LIGA SOLAR - Semana 42</p>
            </div>

            <div className="p-8">

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('week')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'week'
                  ? 'bg-[#EB0029] text-white'
                  : 'bg-[#F6F6F6] text-[#5B6670] hover:bg-[#CFD2D3]'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setActiveTab('month')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'month'
                  ? 'bg-[#EB0029] text-white'
                  : 'bg-[#F6F6F6] text-[#5B6670] hover:bg-[#CFD2D3]'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setActiveTab('year')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'year'
                  ? 'bg-[#EB0029] text-white'
                  : 'bg-[#F6F6F6] text-[#5B6670] hover:bg-[#CFD2D3]'
              }`}
            >
              Año
            </button>
          </div>

          {/* Ranking */}
          <div className="space-y-4 mb-8">
            {ranking.map((entry, idx) => {
              // Mostrar top 3 y luego "..." antes del usuario si no está en top
              if (idx > 2 && idx < ranking.length - 1 && !entry.isUser) {
                if (idx === 3) {
                  return (
                    <div key="separator" className="text-center py-3">
                      <span className="text-3xl text-[#A2A9AD]">⋮</span>
                    </div>
                  )
                }
                return null
              }

              return (
                <div
                  key={entry.position}
                  className={`rounded-2xl p-6 transition-all transform hover:scale-[1.02] ${
                    entry.isUser
                      ? 'bg-gradient-to-br from-[#EB0029]/10 via-[#FF6B6B]/5 to-[#4A9EEB]/10 border-2 border-[#EB0029] shadow-xl'
                      : entry.position === 1
                      ? 'bg-gradient-to-br from-[#FFD700]/30 via-[#FFA500]/20 to-[#FFD700]/10 border-2 border-[#FFD700] shadow-lg'
                      : entry.position === 2
                      ? 'bg-gradient-to-br from-[#C0C0C0]/30 via-[#E8E8E8]/20 to-[#C0C0C0]/10 border-2 border-[#C0C0C0] shadow-lg'
                      : entry.position === 3
                      ? 'bg-gradient-to-br from-[#CD7F32]/30 via-[#D4A574]/20 to-[#CD7F32]/10 border-2 border-[#CD7F32] shadow-lg'
                      : 'bg-white border-2 border-[#E5E7EB] hover:border-[#CFD2D3] shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    {/* Posición con emoji y efecto */}
                    <div className="flex flex-col items-center min-w-[70px]">
                      <div className={`text-5xl mb-2 ${entry.position <= 3 ? 'animate-pulse' : ''}`}>
                        {entry.emoji || `#${entry.position}`}
                      </div>
                      {entry.position <= 3 && !entry.isUser && (
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                          entry.position === 1 ? 'bg-[#FFD700] text-[#323E48]' :
                          entry.position === 2 ? 'bg-[#C0C0C0] text-[#323E48]' :
                          'bg-[#CD7F32] text-white'
                        }`}>
                          TOP {entry.position}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`font-bold text-xl ${entry.isUser ? 'text-[#EB0029]' : 'text-[#323E48]'}`}>
                          Casa {entry.house}
                        </span>
                        <span className={`text-lg ${entry.isUser ? 'text-[#EB0029]' : 'text-[#5B6670]'}`}>
                          "{entry.name}"
                        </span>
                      </div>
                      
                      {/* Métricas mejoradas */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/80 rounded-lg px-3 py-2 border border-[#E5E7EB]">
                          <div className="flex items-center gap-2 mb-1">

                            <span className="text-xs text-[#5B6670] font-medium">Energía</span>
                          </div>
                          <span className="font-bold text-lg text-[#323E48]">{entry.energy} kWh</span>
                        </div>
                        <div className="bg-white/80 rounded-lg px-3 py-2 border border-[#E5E7EB]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[#5B6670] font-medium">Eficiencia</span>
                          </div>
                          <span className="font-bold text-lg text-[#6CC04A]">{entry.efficiency}%</span>
                        </div>
                        <div className="bg-white/80 rounded-lg px-3 py-2 border border-[#E5E7EB]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🔥</span>
                            <span className="text-xs text-[#5B6670] font-medium">Racha</span>
                          </div>
                          <span className="font-bold text-lg text-[#EB0029]">{entry.streak} {entry.streak === 1 ? 'sem' : 'sems'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Consejo de líderes rotativo */}
          <div className="bg-gradient-to-br from-[#6CC04A]/10 to-[#4A9EEB]/10 border-2 border-[#6CC04A]/30 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-bold text-[#323E48] text-lg flex items-center gap-2">
                CONSEJO DE LOS LÍDERES
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentTip((currentTip - 1 + leaderTips.length) % leaderTips.length)}
                  className="w-8 h-8 rounded-full bg-white border border-[#CFD2D3] flex items-center justify-center hover:bg-[#F6F6F6] transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentTip((currentTip + 1) % leaderTips.length)}
                  className="w-8 h-8 rounded-full bg-white border border-[#CFD2D3] flex items-center justify-center hover:bg-[#F6F6F6] transition-colors"
                >
                  →
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">

                <span className="font-semibold text-[#323E48]">{leaderTips[currentTip].leader}</span>
                <span className="text-xs bg-[#6CC04A] text-white px-2 py-1 rounded">
                  {leaderTips[currentTip].category}
                </span>
              </div>
              <p className="text-[#323E48]">
                {leaderTips[currentTip].tip}
              </p>
            </div>
          </div>
        </div>
        </div>
        </div>

        {/* Modal de Chat */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="bg-[#EB0029] text-white p-4 flex items-center justify-between">
                <h3 className="font-bold text-lg">💬 Chat Vecinos - Valle Verde</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-[#F6F6F6] rounded-lg p-3 max-w-[80%]">
                  <div className="font-semibold text-sm text-[#323E48] mb-1">Los Hernández 🥇</div>
                  <p className="text-sm text-[#5B6670]">
                    ¡Buenos días! Limpié mis paneles ayer y subió la producción 12%. Se los recomiendo 😊
                  </p>
                  <span className="text-xs text-[#A2A9AD]">Hace 2 horas</span>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg p-3 max-w-[80%]">
                  <div className="font-semibold text-sm text-[#323E48] mb-1">Los López 🥉</div>
                  <p className="text-sm text-[#5B6670]">
                    ¿Alguien sabe qué es mejor, limpiar en la mañana o en la tarde?
                  </p>
                  <span className="text-xs text-[#A2A9AD]">Hace 1 hora</span>
                </div>
                <div className="bg-[#4A9EEB]/10 border border-[#4A9EEB]/30 rounded-lg p-3 max-w-[80%] ml-auto">
                  <div className="font-semibold text-sm text-[#323E48] mb-1">Tú 👤</div>
                  <p className="text-sm text-[#5B6670]">
                    Gracias por el tip! ¿Cada cuánto recomiendan limpiar?
                  </p>
                  <span className="text-xs text-[#A2A9AD]">Hace 30 min</span>
                </div>
              </div>
              <div className="border-t border-[#CFD2D3] p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none"
                  />
                  <button className="px-6 py-2 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors">
                    Enviar
                  </button>
                </div>
              </div>
            </div>          </div>
        )}
        </div>

        {/* Sidebar derecho - Solo Desktop */}
        <div className="hidden lg:block fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white border-l border-[#CFD2D3] p-6 overflow-y-auto">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#323E48] mb-4">Acciones</h2>
            
            <button
              onClick={() => navigate({ to: '/dashboard-prediction' })}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#EB0029]/10 transition-colors text-left border-l-2 border-transparent hover:border-[#EB0029]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Dashboard</p>
                <p className="text-xs text-[#5B6670]">Ver energía</p>
              </div>
            </button>

            <button
              onClick={() => navigate({ to: '/scan' })}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#EB0029]/10 transition-colors text-left border-l-2 border-transparent hover:border-[#EB0029]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Ahorrar</p>
                <p className="text-xs text-[#5B6670]">Calcula el costo de tus electrodomésticos</p>
              </div>
            </button>

            <button
              onClick={() => navigate({ to: '/gamification' })}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#EB0029]/10 transition-colors text-left border-l-2 border-[#EB0029]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Ranking</p>
                <p className="text-xs text-[#5B6670]">Ver posición</p>
              </div>
            </button>

            <div className="pt-4 border-t border-[#CFD2D3] mt-4">
              <div className="bg-[#F6F6F6] rounded-lg p-4 border-l-4 border-[#6CC04A]">
                <p className="text-sm font-semibold text-[#323E48] mb-2">Consejo del día</p>
                <p className="text-xs text-[#5B6670]">
                  Compite con tus vecinos y aprende de los mejores para mejorar tu eficiencia energética.
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
            className="flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 border-transparent"
          >
            <svg className="w-5 h-5 text-[#5B6670]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs text-[#5B6670]">Inicio</span>
          </button>

          <button
            onClick={() => navigate({ to: '/gamification' })}
            className="flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 border-[#EB0029]"
          >
            <svg className="w-5 h-5 text-[#EB0029]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium text-[#EB0029]">Comunidad</span>
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

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
