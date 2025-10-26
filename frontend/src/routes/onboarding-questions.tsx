import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { ParticleSphere } from '@/components/ParticleSphere'
import { DonutChart } from '@/components/DonutChart'
import { analyzeEnergyProfile, analyzeElectricBill, type EnergyAnalysisResult } from '@/utils/energyAnalysis'

export const Route = createFileRoute('/onboarding-questions')({
  beforeLoad: async () => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/' })
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
  const [analysisResult, setAnalysisResult] = useState<EnergyAnalysisResult | null>(null)
  
  const [answers, setAnswers] = useState({
    people: '',
    workFromHome: '',
    electricCar: '',
    airConditioning: '',
    electricBill: null as File | null,
  })

  const userName = user?.name || 'Usuario'

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
    },
    {
      emoji: '📄',
      question: 'Sube tu recibo de luz para un análisis más preciso',
      type: 'file',
      key: 'electricBill',
      description: 'PDF, JPG o PNG (máx. 5MB)'
    }
  ]

  const currentQ = questions[currentQuestion - 1]

  const handleAnswer = (value: string | File) => {
    setAnswers(prev => ({ ...prev, [currentQ.key]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es muy grande. Máximo 5MB.')
        return
      }
      // Validar tipo
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        alert('Tipo de archivo no válido. Usa PDF, JPG o PNG.')
        return
      }
      handleAnswer(file)
    }
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Guardar respuestas y mostrar pantalla de análisis
      sessionStorage.setItem('energy_profile', JSON.stringify(answers))
      setIsAnalyzing(true)
      
      // Si hay recibo, intentar analizarlo
      if (answers.electricBill) {
        await analyzeElectricBill(answers.electricBill)
      }
      
      // Analizar perfil energético
      const result = analyzeEnergyProfile({
        people: answers.people,
        workFromHome: answers.workFromHome,
        electricCar: answers.electricCar,
        airConditioning: answers.airConditioning,
        electricBill: answers.electricBill,
      })
      
      setAnalysisResult(result)
      
      // Guardar resultado en sessionStorage
      sessionStorage.setItem('energy_analysis', JSON.stringify(result))
      
      setTimeout(() => {
        setIsAnalyzing(false)
        setShowResults(true)
      }, 3000)
    }
  }

  const handleStart = () => {
    // Navegar al dashboard
    navigate({ to: '/dashboard-prediction' })
  }

  const isAnswered = currentQ.type === 'file' 
    ? answers[currentQ.key as keyof typeof answers] !== null
    : answers[currentQ.key as keyof typeof answers] !== ''

  if (showResults && analysisResult) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-3xl font-bold text-[#323E48] mb-2">
              ¡Perfecto, {userName}!
            </h1>
            <p className="text-[#5B6670]">Aquí está tu análisis personalizado</p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Consumo actual */}
            <div className="bg-[#4A9EEB]/10 rounded-xl p-6 border-2 border-[#4A9EEB]">
              <h3 className="text-lg font-bold text-[#323E48] mb-4">📊 Tu consumo actual</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#5B6670] mb-1">Consumo mensual</p>
                  <p className="text-3xl font-bold text-[#4A9EEB]">{analysisResult.monthlyConsumption} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-[#5B6670] mb-1">Costo mensual CFE</p>
                  <p className="text-3xl font-bold text-[#EB0029]">${analysisResult.monthlyCost.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Recomendación de paneles */}
            <div className="bg-[#6CC04A]/10 rounded-xl p-6 border-2 border-[#6CC04A]">
              <h3 className="text-lg font-bold text-[#323E48] mb-4">☀️ Nuestra recomendación</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6670]">Paneles solares necesarios:</span>
                  <span className="text-3xl font-bold text-[#6CC04A]">{analysisResult.recommendedPanels}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6670]">Producción mensual:</span>
                  <span className="text-2xl font-bold text-[#323E48]">{analysisResult.panelProduction} kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6670]">Excedente mensual:</span>
                  <span className="text-2xl font-bold text-[#6CC04A]">+{analysisResult.surplus} kWh</span>
                </div>
              </div>
            </div>

            {/* Ahorro económico */}
            <div className="bg-[#EB0029]/10 rounded-xl p-6 border-2 border-[#EB0029]">
              <h3 className="text-lg font-bold text-[#323E48] mb-4">💰 Tu ahorro económico</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6670]">Ahorro mensual:</span>
                  <span className="text-3xl font-bold text-[#EB0029]">${analysisResult.monthlySavings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6670]">Ahorro anual:</span>
                  <span className="text-2xl font-bold text-[#EB0029]">${analysisResult.yearlySavings.toLocaleString()}</span>
                </div>
                <div className="border-t border-[#CFD2D3] pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B6670]">Recuperación de inversión:</span>
                    <span className="text-xl font-bold text-[#323E48]">{analysisResult.breakEvenYears} años</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impacto ambiental con gráfica donut */}
            <div className="bg-gradient-to-br from-[#6CC04A]/10 to-[#4A9EEB]/10 rounded-xl p-6 border-2 border-[#6CC04A]">
              <h3 className="text-lg font-bold text-[#323E48] mb-6 text-center">🌱 Impacto Ambiental</h3>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Gráfica Donut */}
                <div className="flex justify-center">
                  <DonutChart
                    percentage={95}
                    label="Reducción"
                    value={`${analysisResult.carbonOffset.toLocaleString()} kg CO₂/año`}
                    color="#6CC04A"
                    size={220}
                    strokeWidth={24}
                  />
                </div>

                {/* Información adicional */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">🌳</div>
                    <div>
                      <p className="font-bold text-[#323E48]">Equivalente a plantar</p>
                      <p className="text-2xl font-bold text-[#6CC04A]">
                        {Math.round(analysisResult.carbonOffset / 20)} árboles
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">🚗</div>
                    <div>
                      <p className="font-bold text-[#323E48]">Ahorro equivalente a</p>
                      <p className="text-lg font-bold text-[#4A9EEB]">
                        {Math.round(analysisResult.carbonOffset / 2.3)} km menos en auto
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">💧</div>
                    <div>
                      <p className="font-bold text-[#323E48]">Agua ahorrada</p>
                      <p className="text-lg font-bold text-[#4A9EEB]">
                        {Math.round(analysisResult.panelProduction * 12 * 0.5).toLocaleString()} litros/año
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#CFD2D3]">
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-sm text-[#323E48]">
                    💡 <strong>Tip:</strong> Con paneles solares, tu recibo de luz puede bajar hasta un <strong className="text-[#6CC04A]">95%</strong>.
                    {' '}Además, el excedente de energía se vende automáticamente a CFE, generándote ingresos adicionales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-[#EB0029] text-white text-lg font-bold rounded-xl hover:bg-[#DB0026] transition-colors"
          >
            ¡Quiero empezar a ahorrar! 🚀
          </button>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Esfera de partículas */}
          <div className="w-full max-w-2xl h-[500px] mb-8">
            <ParticleSphere />
          </div>
          
          {/* Texto debajo de la esfera */}
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold text-[#323E48] mb-4">
              Bienvenido {userName}
            </h1>
            <p className="text-xl text-[#5B6670]">
              Estamos calculando tu gasto energético...
            </p>
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
                value={(answers[currentQ.key as keyof typeof answers] as string) || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQ.placeholder}
                className="w-full px-6 py-4 text-center text-2xl border-2 border-[#CFD2D3] rounded-xl focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none"
                autoFocus
              />
            ) : currentQ.type === 'file' ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#CFD2D3] rounded-xl p-8 text-center hover:border-[#EB0029] transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    {answers.electricBill ? (
                      <div className="space-y-2">
                        <div className="text-5xl">✅</div>
                        <p className="text-lg font-medium text-[#6CC04A]">
                          Archivo cargado
                        </p>
                        <p className="text-sm text-[#5B6670]">
                          {(answers.electricBill as File).name}
                        </p>
                        <p className="text-xs text-[#EB0029] underline mt-2">
                          Cambiar archivo
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-5xl">📤</div>
                        <p className="text-lg font-medium text-[#323E48]">
                          Haz clic para subir tu recibo
                        </p>
                        <p className="text-sm text-[#5B6670]">
                          {currentQ.description}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="bg-[#4A9EEB]/10 border-l-4 border-[#4A9EEB] rounded-lg p-4">
                  <p className="text-sm text-[#323E48]">
                    💡 <strong>Tip:</strong> Con tu recibo puedo analizar tu consumo real y darte recomendaciones más precisas.
                  </p>
                </div>
                {!answers.electricBill && (
                  <button
                    onClick={handleNext}
                    className="w-full py-3 text-[#5B6670] text-sm hover:text-[#323E48] transition-colors"
                  >
                    Saltar (opcional)
                  </button>
                )}
              </div>
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
          {currentQ.type !== 'file' && (
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
          )}
          {currentQ.type === 'file' && answers.electricBill && (
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
                className="flex-1 py-3 bg-[#EB0029] text-white rounded-xl hover:bg-[#DB0026] transition-colors font-medium"
              >
                {currentQuestion === questions.length ? 'Analizar recibo 🔍' : 'Siguiente'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
