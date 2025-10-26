import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { ParticleSphere } from '@/components/ParticleSphere'

// Proteger la ruta - verificar autenticación antes de renderizar
export const Route = createFileRoute('/apply')({
  beforeLoad: async () => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/' })
    }
  },
  component: ApplyComponent,
})

function ApplyComponent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    companyName: '',
    industry: '',
    companySize: '',
    description: '',
  })

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setCurrentStep(4)
    
    // Guardar datos en sessionStorage
    sessionStorage.setItem('user_name', formData.name)
    sessionStorage.setItem('company_name', formData.companyName)
    sessionStorage.setItem('company_info', JSON.stringify({
      industry: formData.industry,
      size: formData.companySize,
      description: formData.description
    }))
    sessionStorage.setItem('onboarding_complete', 'true')

    // Simular carga y luego ir a la página de preguntas de energía
    setTimeout(() => {
      navigate({ to: '/onboarding-questions' })
    }, 3000)
  }

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0
      case 2:
        return formData.companyName.trim().length > 0
      case 3:
        return formData.industry.trim().length > 0 && 
               formData.companySize.trim().length > 0 &&
               formData.description.trim().length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] py-8 px-4 sm:px-6 lg:px-8">
      {/* Pantalla de carga a pantalla completa */}
      {currentStep === 4 ? (
        <div className="fixed inset-0 bg-[#F6F6F6] z-50 flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Esfera de partículas sin restricciones */}
            <div className="w-full max-w-2xl h-[500px] mb-8">
              <ParticleSphere />
            </div>
            
            {/* Texto debajo de la esfera */}
            <div className="text-center px-4">
              <h1 className="text-4xl font-bold text-[#323E48] mb-4">
                Hola {formData.name}
              </h1>
              <p className="text-xl text-[#5B6670] mb-8">
                Estamos preparando todo para <span className="font-semibold text-[#323E48]">{formData.companyName}</span> para conocerte mejor
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-[#EB0029] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#EB0029] rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-[#EB0029] rounded-full animate-bounce opacity-40" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      <div className="max-w-4xl mx-auto">
        {/* Header con información del usuario */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-[#323E48]">
                  Bienvenido, {user?.name}
                </h2>
                <p className="text-sm text-[#5B6670]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#EB0029] text-white rounded-md hover:bg-[#DB0026] transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Indicador de pasos - Solo líneas */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex-1 h-2 rounded-full transition-colors ${currentStep >= 1 ? 'bg-[#EB0029]' : 'bg-[#CFD2D3]'}`}></div>
              <div className={`flex-1 h-2 rounded-full transition-colors ${currentStep >= 2 ? 'bg-[#EB0029]' : 'bg-[#CFD2D3]'}`}></div>
              <div className={`flex-1 h-2 rounded-full transition-colors ${currentStep >= 3 ? 'bg-[#EB0029]' : 'bg-[#CFD2D3]'}`}></div>
            </div>
            <div className="flex justify-between text-xs text-[#5B6670]">
              <span>Nombre</span>
              <span>Empresa</span>
              <span>Detalles</span>
            </div>
          </div>

          {/* Paso 1: Nombre */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#323E48] mb-2">
                  ¿Cómo te llamas?
                </h1>
                <p className="text-[#5B6670]">
                  Queremos conocerte mejor para personalizar tu experiencia
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#323E48] mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-3 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Paso 2: Empresa */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#323E48] mb-2">
                  ¿Cuál es el nombre de tu empresa?
                </h1>
                <p className="text-[#5B6670]">
                  Esto nos ayudará a personalizar el análisis
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#323E48] mb-2">
                  Nombre de la empresa *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="Ej: Acme Inc."
                  className="w-full px-4 py-3 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Paso 3: Detalles de la empresa */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#323E48] mb-2">
                  Cuéntanos más sobre tu empresa
                </h1>
                <p className="text-[#5B6670]">
                  Esta información nos ayudará a brindarte un mejor servicio
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#323E48] mb-2">
                  Nicho o industria *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="retail">Retail / Comercio</option>
                  <option value="servicios">Servicios</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="alimentos">Alimentos y Bebidas</option>
                  <option value="salud">Salud</option>
                  <option value="educacion">Educación</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#323E48] mb-2">
                  Tamaño de la empresa *
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => updateFormData('companySize', e.target.value)}
                  className="w-full px-4 py-3 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="500+">Más de 500 empleados</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#323E48] mb-2">
                  Descripción breve *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                  placeholder="Describe brevemente tu empresa, sus productos/servicios principales y objetivos..."
                  className="w-full px-4 py-3 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Paso 4: Pantalla de carga - SIN contenedor para la esfera */}
          {currentStep === 4 && null}

          {/* Botones de navegación */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-[#CFD2D3]">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-[#CFD2D3] text-[#323E48] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Atrás
              </button>
              <button
                onClick={currentStep === 3 ? handleSubmit : handleNext}
                disabled={!isStepValid()}
                className="px-6 py-3 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {currentStep === 3 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
