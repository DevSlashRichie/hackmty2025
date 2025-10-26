import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

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
  const [isScanning, setIsScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

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
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Header */}
      <div className="bg-white border-b border-[#CFD2D3] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/dashboard-prediction' })}
            className="text-[#EB0029] hover:underline"
          >
            ← Volver
          </button>
          <h1 className="text-xl font-bold text-[#323E48]">
            📸 Escanear Electrodoméstico
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto p-6">
        {!scanned ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-[#323E48] mb-2">
                Escanea tu Electrodoméstico
              </h2>
              <p className="text-[#5B6670]">
                Toma una foto de la etiqueta de consumo energético
              </p>
            </div>

            {isScanning ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🤖</div>
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
                Ver opciones con financiamiento Banorte 🏦
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
  )
}
