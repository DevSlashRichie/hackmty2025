import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/scan')({
  beforeLoad: async () => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/' })
    }
  },
  component: ScanComponent,
})

function ScanComponent() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isScanning, setIsScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        handleScan()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setScanned(true)
    }, 2000)
  }

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
          <div className="max-w-4xl mx-auto">
            {!scanned ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#323E48] mb-2">
                    Escanea tu Electrodoméstico
                  </h2>
                  <p className="text-[#5B6670]">
                    Toma una foto de la etiqueta de consumo energético
                  </p>
                </div>

                {isScanning ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 animate-bounce"></div>
                    <p className="text-xl font-bold text-[#323E48] mb-2">Analizando imagen...</p>
                    <p className="text-sm text-[#5B6670]">Detectando modelo y consumo energético</p>
                    {uploadedImage && (
                      <div className="mt-6 max-w-md mx-auto">
                        <img src={uploadedImage} alt="Uploading" className="rounded-lg shadow-md" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {/* Área de carga de imagen */}
                    <label htmlFor="file-upload" className="block">
                      <div className="border-4 border-dashed border-[#CFD2D3] rounded-2xl p-12 hover:border-[#EB0029] transition-colors cursor-pointer">
                        <div className="text-center">
                          <div className="text-6xl mb-4">📷</div>
                          <p className="text-[#323E48] font-medium mb-2">
                            Haz clic para tomar foto o subir imagen
                          </p>
                          <p className="text-xs text-[#A2A9AD]">
                            PNG, JPG hasta 10MB
                          </p>
                        </div>
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="mt-4 text-center">
                      <p className="text-sm text-[#5B6670] mb-4">o usa nuestra demo</p>
                      <button
                        onClick={handleScan}
                        className="w-full py-4 bg-[#EB0029] text-white font-bold rounded-xl hover:bg-[#DB0026] transition-colors"
                      >
                        Probar con Ejemplo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in duration-500">
                {/* Imagen escaneada */}
                {uploadedImage && (
                  <div className="mb-6">
                    <img src={uploadedImage} alt="Scanned" className="w-full rounded-lg shadow-md" />
                  </div>
                )}
                
                {/* Resultado del escaneo */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">🧊</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#323E48]">
                        Refrigerador LG InstaView
                      </h3>
                      <p className="text-[#5B6670]">Modelo: LRFVC2406S</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#F6F6F6] rounded-xl p-4">
                      <p className="text-sm text-[#5B6670] mb-1">Consumo anual</p>
                      <p className="text-2xl font-bold text-[#323E48]">450 kWh/año</p>
                    </div>
                    <div className="bg-[#F6F6F6] rounded-xl p-4">
                      <p className="text-sm text-[#5B6670] mb-1">Eficiencia</p>
                      <p className="text-2xl font-bold text-[#FFA500]">B+ ⚠️</p>
                    </div>
                  </div>
                </div>

                {/* Análisis */}
                <div className="bg-gradient-to-br from-[#EB0029]/5 to-[#4A9EEB]/5 border-2 border-[#EB0029]/20 rounded-2xl p-6 mb-6">
                  <h4 className="text-xl font-bold text-[#323E48] mb-4 flex items-center gap-2">
                    💡 ANÁLISIS
                  </h4>
                  
                  <p className="text-[#323E48] mb-6">
                    Este refrigerador consume <strong className="text-[#EB0029]">$3,200/año</strong>
                  </p>

                  <div className="bg-white rounded-xl p-6 mb-4">
                    <p className="font-bold text-[#323E48] mb-4">
                      Si cambias a uno clase A+++:
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#5B6670]">Consumo:</span>
                        <span className="font-bold text-[#6CC04A]">180 kWh/año</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5B6670]">Ahorro:</span>
                        <span className="font-bold text-[#6CC04A]">$2,100/año</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5B6670]">Recuperas inversión:</span>
                        <span className="font-bold text-[#4A9EEB]">3.2 años</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-[#EB0029] text-white font-bold rounded-xl hover:bg-[#DB0026] transition-colors">
                    Ver opciones con financiamiento Banorte
                  </button>
                </div>

                <button
                  onClick={() => {
                    setScanned(false)
                    setUploadedImage(null)
                  }}
                  className="w-full py-3 border-2 border-[#CFD2D3] text-[#323E48] font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Escanear otro electrodoméstico
                </button>
              </div>
            )}
          </div>
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
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#EB0029]/10 transition-colors text-left border-l-2 border-[#EB0029]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Escanear</p>
                <p className="text-xs text-[#5B6670]">Recibo de luz</p>
              </div>
            </button>

            <button
              onClick={() => navigate({ to: '/gamification' })}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#EB0029]/10 transition-colors text-left border-l-2 border-transparent hover:border-[#EB0029]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Ranking</p>
                <p className="text-xs text-[#5B6670]">Ver posición</p>
              </div>
            </button>

            <button
              onClick={() => navigate({ to: '/assistant' })}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#EB0029]/10 transition-colors text-left border-l-2 border-transparent hover:border-[#EB0029]"
            >
              <div>
                <p className="font-medium text-[#323E48]">Asistente IA</p>
                <p className="text-xs text-[#5B6670]">Pregunta aquí</p>
              </div>
            </button>

            <div className="pt-4 border-t border-[#CFD2D3] mt-4">
              <div className="bg-[#F6F6F6] rounded-lg p-4 border-l-4 border-[#6CC04A]">
                <p className="text-sm font-semibold text-[#323E48] mb-2">Consejo del día</p>
                <p className="text-xs text-[#5B6670]">
                  Escanea tus electrodomésticos para encontrar oportunidades de ahorro.
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
            className="flex flex-col items-center justify-center gap-1 hover:bg-[#F6F6F6] transition-colors border-t-2 border-[#EB0029]"
          >
            <svg className="w-5 h-5 text-[#EB0029]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-[#EB0029]">Ahorra</span>
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
