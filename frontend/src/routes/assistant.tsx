import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { ParticleSphere } from '@/components/ParticleSphere'
import { useState } from 'react'

export const Route = createFileRoute('/assistant')({
  beforeLoad: async () => {
    const token = sessionStorage.getItem('auth_token')
    const onboardingComplete = sessionStorage.getItem('onboarding_complete')
    if (!token) {
      throw redirect({ to: '/' })
    }
    if (!onboardingComplete) {
      throw redirect({ to: '/apply' })
    }
  },
  component: AssistantComponent,
})

function AssistantComponent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: '¡Hola! Soy Sol, tu asistente de energía solar. Puedes preguntarme sobre tu consumo, ahorro, o pedirme consejos. ¿En qué puedo ayudarte?'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'chat' | 'voice'>('chat')
  const [isListening, setIsListening] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')

  const userName = sessionStorage.getItem('user_name') || user?.name
  const companyName = sessionStorage.getItem('company_name')

  const handleLogout = () => {
    logout()
    sessionStorage.removeItem('onboarding_complete')
    sessionStorage.removeItem('user_name')
    sessionStorage.removeItem('company_name')
    sessionStorage.removeItem('company_info')
    navigate({ to: '/' })
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const newMessage = { role: 'user' as const, content: message }
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setIsLoading(true)

    // Simulación de respuestas predefinidas
    setTimeout(() => {
      let response = ''
      const lowerMessage = message.toLowerCase()
      
      if (lowerMessage.includes('ahorro') || lowerMessage.includes('ahorrado')) {
        response = `Has ahorrado $2,847 en tu recibo de luz este mes. Además, Banorte te dio $284 de descuento en tu hipoteca. Total: $3,131.\n\nEstás $230 arriba vs el mes pasado. ¡Excelente trabajo! 🎉`
      } else if (lowerMessage.includes('clima') || lowerMessage.includes('aire')) {
        response = `Mmm... Ahora estás produciendo 2.1 kW y consumiendo 0.8 kW. Sí puedes prender el clima, pero te recomiendo esperar 30 minutos. A las 12pm tendrás pico de producción y será 100% gratis. Ahora te costaría $8. ¿Esperas?`
      } else if (lowerMessage.includes('consumo')) {
        response = `Tu consumo promedio es de 420 kWh/mes. Estás produciendo ~750 kWh/mes con tus paneles, ¡así que tienes un excedente de 330 kWh/mes! 🌟`
      } else {
        response = `Gracias por tu pregunta. Estoy aquí para ayudarte con todo lo relacionado a tu energía solar. Puedes preguntarme sobre ahorro, consumo, o pedir consejos para optimizar tu uso de energía.`
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }])
      setIsLoading(false)
    }, 1500)
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false)
      // Aquí procesarías el transcript
      if (voiceTranscript) {
        setMessages(prev => [...prev, {
          role: 'user',
          content: voiceTranscript
        }])
        setVoiceTranscript('')
        // Simular respuesta
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '¡Entendido! Procesando tu solicitud por voz...'
          }])
        }, 1000)
      }
    } else {
      setIsListening(true)
      // Simular transcripción
      setTimeout(() => {
        setVoiceTranscript('Hey Sol, ¿cuánto he ahorrado este mes?')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#CFD2D3] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <h2 className="font-bold text-[#323E48]">
                {userName}
              </h2>
              <p className="text-xs text-[#5B6670]">{companyName}</p>
            </div>
          </div>

          {/* Toggle Chat/Voice */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: '/dashboard-prediction' })}
              className="px-4 py-2 border border-[#CFD2D3] rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              ← Dashboard
            </button>
            
            <div className="flex items-center bg-[#F6F6F6] rounded-lg p-1">
              <button
                onClick={() => setMode('chat')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'chat'
                    ? 'bg-white text-[#EB0029] shadow-sm'
                    : 'text-[#5B6670] hover:text-[#323E48]'
                }`}
              >
                💬 Chat
              </button>
              <button
                onClick={() => setMode('voice')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'voice'
                    ? 'bg-white text-[#EB0029] shadow-sm'
                    : 'text-[#5B6670] hover:text-[#323E48]'
                }`}
              >
                🎤 Voice
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-[#EB0029] text-white rounded-md hover:bg-[#DB0026] transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel de Insights - 60% */}
        <div className="w-[60%] border-r border-[#CFD2D3] bg-white p-6 overflow-y-auto">
          <h3 className="text-xl font-bold text-[#323E48] mb-4">
            📊 Insights y Análisis
          </h3>
          
          {/* Área de insights - aquí se mostrarán los gráficos generados por el LLM */}
          <div className="space-y-4">
            {messages.filter(m => m.role === 'assistant').length > 0 ? (
              <div className="space-y-4">
                {/* Ejemplo de tarjeta de insight */}
                <div className="bg-[#F6F6F6] rounded-lg p-4 border border-[#CFD2D3]">
                  <h4 className="font-semibold text-[#323E48] mb-2">Análisis de Mercado</h4>
                  <div className="h-48 bg-white rounded-md flex items-center justify-center text-[#5B6670]">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-sm">Gráfico generándose...</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F6F6F6] rounded-lg p-4 border border-[#CFD2D3]">
                  <h4 className="font-semibold text-[#323E48] mb-2">Métricas Clave</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-md">
                      <p className="text-xs text-[#5B6670]">Crecimiento</p>
                      <p className="text-2xl font-bold text-[#EB0029]">+24%</p>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <p className="text-xs text-[#5B6670]">Eficiencia</p>
                      <p className="text-2xl font-bold text-[#4A9EEB]">87%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F6F6F6] rounded-lg p-4 border border-[#CFD2D3]">
                  <h4 className="font-semibold text-[#323E48] mb-2">Recomendaciones</h4>
                  <ul className="space-y-2 text-sm text-[#5B6670]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#EB0029] mt-1">•</span>
                      <span>Optimizar flujo de caja para el próximo trimestre</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EB0029] mt-1">•</span>
                      <span>Considerar expansión en mercados emergentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#EB0029] mt-1">•</span>
                      <span>Implementar estrategias de retención de clientes</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center py-12">
                <div>
                  <div className="text-6xl mb-4">📊</div>
                  <h4 className="text-lg font-semibold text-[#323E48] mb-2">
                    Insights en Tiempo Real
                  </h4>
                  <p className="text-[#5B6670]">
                    Los gráficos y análisis aparecerán aquí mientras el asistente<br />
                    procesa la información de {companyName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Chat/Voice - 40% */}
        <div className="w-[40%] flex flex-col">
          {mode === 'voice' ? (
            // Modo Voice con esfera
            <div className="flex-1 flex flex-col">
              {/* Esfera de partículas */}
              <div className="flex-1 relative bg-[#F6F6F6]">
                <ParticleSphere />
                
                {/* Botón de micrófono flotante */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <button
                    onClick={handleVoiceToggle}
                    className={`pointer-events-auto w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                      isListening
                        ? 'bg-[#EB0029] animate-pulse'
                        : 'bg-white hover:bg-[#EB0029] hover:text-white'
                    }`}
                  >
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Texto pequeño debajo */}
              <div className="bg-white border-t border-[#CFD2D3] p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-[#EB0029] animate-pulse' : 'bg-[#5B6670]'}`}></div>
                  <span className="text-xs text-[#5B6670]">
                    {isListening ? 'Escuchando...' : 'Modo Voice activo - Toca el micrófono para hablar'}
                  </span>
                </div>
                {voiceTranscript && (
                  <p className="text-sm text-[#323E48] italic text-center">
                    "{voiceTranscript}"
                  </p>
                )}
              </div>
            </div>
          ) : (
            // Modo Chat
            <>
              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EB0029]/10 mb-4">
                        <svg className="w-8 h-8 text-[#EB0029]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-[#323E48] mb-2">
                        ¡Hola {userName}!
                      </h3>
                      <p className="text-[#5B6670] text-sm px-4">
                        Estoy aquí para ayudarte con el análisis de {companyName}.
                        <br />
                        ¿En qué puedo ayudarte hoy?
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-[#EB0029] text-white'
                              : 'bg-white text-[#323E48] shadow-md border border-[#CFD2D3]'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-[#CFD2D3]">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input de mensaje */}
              <div className="bg-white border-t border-[#CFD2D3] p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-3 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="px-5 py-3 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
