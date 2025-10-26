import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: '¡Hola! Soy Sol, tu asistente de energía solar impulsado por IA 🤖\n\nPuedes preguntarme sobre tu consumo, ahorro, o pedirme consejos para optimizar tu uso de energía. ¿En qué puedo ayudarte?'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'bg-[#323E48]' : 'bg-[#EB0029] hover:bg-[#DB0026]'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Pop-up del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[min(500px,calc(100vh-8rem))] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#CFD2D3]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#EB0029] to-[#FF8C00] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
              ☀️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Sol - Asistente IA</h3>
              <p className="text-xs text-white/80">🤖 Inteligencia Artificial • Energía Solar</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F6F6F6]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-[#EB0029] text-white'
                      : 'bg-white text-[#323E48] border border-[#CFD2D3]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 border border-[#CFD2D3]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-[#CFD2D3]">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="px-4 py-2 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
