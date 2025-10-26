import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export const Route = createFileRoute('/onboarding-questions')({
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
  component: OnboardingQuestionsComponent,
})

function OnboardingQuestionsComponent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const [answers, setAnswers] = useState({
    people: '',
    workFromHome: '',
    electricCar: '',
    airConditioning: '',
  })

  const userName = sessionStorage.getItem('user_name') || user?.name
  const companyName = sessionStorage.getItem('company_name')

  const questions = [
    {
      emoji: '👥',
      question: '¿Cuántas personas viven en tu hogar?',
      type: 'number',
      key: 'people',
      placeholder: 'Ej: 3'
    },
    {
      emoji: '💼',
      question: '¿Trabajas desde casa?',
      type: 'select',
      key: 'workFromHome',
      options: ['Sí', 'No', 'A veces']
    },
    {
      emoji: '🚗',
      question: '¿Tienes auto eléctrico?',
      type: 'select',
      key: 'electricCar',
      options: ['Sí', 'No', 'Planeo comprarlo']
    },
    {
      emoji: '❄️',
      question: '¿Usas clima en verano?',
      type: 'select',
      key: 'airConditioning',
      options: ['Sí, todo el día', 'Solo por la noche', 'Ocasionalmente', 'No']
    }
  ]

  const currentQ = questions[currentQuestion - 1]

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.key]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Analizar respuestas
      setIsAnalyzing(true)
      setTimeout(() => {
        setIsAnalyzing(false)
        setShowResults(true)
      }, 3000)
    }
  }

  const handleStart = () => {
    // Guardar datos y navegar al dashboard
    sessionStorage.setItem('energy_profile', JSON.stringify(answers))
    navigate({ to: '/dashboard-prediction' })
  }

  const isAnswered = answers[currentQ.key as keyof typeof answers] !== ''

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-3xl font-bold text-[#323E48] mb-2">
              ¡Perfecto, {userName}!
            </h1>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-[#F6F6F6] rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-[#5B6670] mb-1">Tu casa producirá</p>
                  <p className="text-3xl font-bold text-[#EB0029]">~750 kWh/mes</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#5B6670] mb-1">Tu consumo estimado</p>
                  <p className="text-3xl font-bold text-[#4A9EEB]">420 kWh/mes</p>
                </div>
              </div>

              <div className="border-t border-[#CFD2D3] pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#5B6670]">Excedente:</span>
                  <span className="text-2xl font-bold text-[#6CC04A]">330 kWh/mes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6670]">Tu ahorro proyectado:</span>
                  <span className="text-3xl font-bold text-[#EB0029]">$2,680/mes</span>
                </div>
              </div>
            </div>

            <div className="bg-[#EB0029]/5 border-l-4 border-[#EB0029] rounded-lg p-4">
              <p className="text-[#323E48] font-medium">
                💡 Para maximizarlo, te daré tips personalizados cada semana.
              </p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-[#EB0029] text-white text-lg font-bold rounded-xl hover:bg-[#DB0026] transition-colors"
          >
            ¿Listo para empezar? 🚀
          </button>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">🤖</div>
          <h2 className="text-3xl font-bold text-[#323E48] mb-4">Analizando...</h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-[#EB0029] rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-[#EB0029] rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-[#EB0029] rounded-full animate-bounce opacity-40" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#323E48] mb-4">
              Voy a conocerte para optimizar tu ahorro 💰
            </h1>
            <p className="text-[#5B6670]">📋 Cuéntame sobre tu hogar</p>
          </div>

          {/* Progreso */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    currentQuestion > idx ? 'bg-[#EB0029]' : 'bg-[#CFD2D3]'
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-xs text-[#5B6670] text-center">
              Pregunta {currentQuestion} de {questions.length}
            </p>
          </div>

          {/* Pregunta actual */}
          <div className="mb-8 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentQ.emoji}</div>
              <h2 className="text-2xl font-bold text-[#323E48]">
                {currentQ.question}
              </h2>
            </div>

            {currentQ.type === 'number' ? (
              <input
                type="number"
                value={answers[currentQ.key as keyof typeof answers]}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQ.placeholder}
                className="w-full px-6 py-4 text-center text-2xl border-2 border-[#CFD2D3] rounded-xl focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none"
                autoFocus
              />
            ) : (
              <div className="space-y-3">
                {currentQ.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full py-4 px-6 rounded-xl border-2 transition-all ${
                      answers[currentQ.key as keyof typeof answers] === option
                        ? 'border-[#EB0029] bg-[#EB0029] text-white'
                        : 'border-[#CFD2D3] hover:border-[#EB0029] text-[#323E48]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botones de navegación */}
          <div className="flex gap-3">
            {currentQuestion > 1 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-6 py-3 border-2 border-[#CFD2D3] text-[#323E48] rounded-xl hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1 py-3 bg-[#EB0029] text-white rounded-xl hover:bg-[#DB0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {currentQuestion === questions.length ? 'Ver resultados' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
