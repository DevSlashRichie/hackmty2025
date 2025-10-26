import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Hero Section */}
      <div 
        className="bg-white border-b border-[#CFD2D3] relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/BG.jpg)' }}
      >
        {/* Overlay para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#fff] mb-3 sm:mb-4">
              Desarrollo <span className="text-[#EB0029]">Inteligente</span>
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#fff] mb-3 sm:mb-4 max-w-3xl mx-auto">
              Financiamiento inteligente para desarrolladores inmobiliarios con Banorte
            </p>
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#fff] mb-6 sm:mb-8 max-w-3xl mx-auto">
              Instala paneles solares en tu desarrollo y ofrece energía limpia a tus residentes. Tasas preferenciales y beneficios exclusivos.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto h-[50px] px-8">
                  Solicitar Financiamiento
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/dashboard-prediction" : "/login"} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-[50px] px-8">
                  {isAuthenticated ? "Acceder" : "Iniciar sesión"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#EB0029] mb-3 sm:mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#5B6670]">
            Modelo innovador para desarrolladores y residentes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative">
            <div className="absolute -top-4 left-6 w-12 h-12 bg-[#EB0029] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              1
            </div>
            <div className="mt-6">
              <div className="w-16 h-16 bg-[#EB0029]/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[#EB0029]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-3 text-center">
                Desarrollador Solicita
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670] text-center">
                El desarrollador inmobiliario solicita financiamiento con Banorte para instalar paneles solares en su desarrollo
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative">
            <div className="absolute -top-4 left-6 w-12 h-12 bg-[#FF8C00] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              2
            </div>
            <div className="mt-6">
              <div className="w-16 h-16 bg-[#FF8C00]/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[#FF8C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-3 text-center">
                Instalación de Paneles
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670] text-center">
                Banorte financia la instalación completa de paneles solares en todas las viviendas del desarrollo
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative">
            <div className="absolute -top-4 left-6 w-12 h-12 bg-[#6CC04A] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              3
            </div>
            <div className="mt-6">
              <div className="w-16 h-16 bg-[#6CC04A]/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-[#6CC04A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-3 text-center">
                Residentes Ahorran
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670] text-center">
                Los residentes pagan una renta fija mensual menor a su recibo de luz y acceden a la app con IA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#323E48] mb-3 sm:mb-4">
              Beneficios para Desarrolladores
            </h2>
            <p className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#5B6670]">
              Tasas preferenciales y valor agregado para tu proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Benefit 1 */}
            <div className="bg-[#F6F6F6] rounded-xl p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#EB0029] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-3">
                Tasas Preferenciales
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670] mb-4">
                Obtén financiamiento con tasas de interés competitivas para proyectos sustentables
              </p>
              <ul className="space-y-2 text-[13px] sm:text-[14px] text-[#5B6670]">
                <li className="flex items-start">
                  <span className="text-[#6CC04A] mr-2">✓</span>
                  <span>Tasa fija durante todo el plazo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6CC04A] mr-2">✓</span>
                  <span>Sin penalización por pago anticipado</span>
                </li>
              </ul>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#F6F6F6] rounded-xl p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#FF8C00] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-3">
                Valor Agregado al Desarrollo
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670] mb-4">
                Incrementa el valor de venta y atractivo de tu proyecto inmobiliario
              </p>
              <ul className="space-y-2 text-[13px] sm:text-[14px] text-[#5B6670]">
                <li className="flex items-start">
                  <span className="text-[#FF8C00] mr-2">✓</span>
                  <span>Diferenciación en el mercado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF8C00] mr-2">✓</span>
                  <span>Certificación sustentable</span>
                </li>
              </ul>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#F6F6F6] rounded-xl p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#6CC04A] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-3">
                Financiamiento Flexible
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670] mb-4">
                Crédito adaptado a las necesidades de tu proyecto inmobiliario
              </p>
              <ul className="space-y-2 text-[13px] sm:text-[14px] text-[#5B6670]">
                <li className="flex items-start">
                  <span className="text-[#6CC04A] mr-2">✓</span>
                  <span>Plazos extendidos de pago</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6CC04A] mr-2">✓</span>
                  <span>Desembolsos programados por avance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Resident Benefits Section */}
      <div className="bg-gradient-to-br from-[#F6F6F6] to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#323E48] mb-3 sm:mb-4">
              Beneficios para los Residentes
            </h2>
            <p className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#5B6670]">
              Experiencia completa con tecnología y ahorro garantizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
                App Inteligente
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
                Monitorea tu consumo y producción de energía en tiempo real
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
                Asistente IA
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
                Recibe consejos personalizados para maximizar tu ahorro
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
                Ahorro Real
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
                Paga menos que tu recibo de luz tradicional con tarifa fija
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
                Gamificación
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
                Compite con tus vecinos y gana recompensas por ahorrar
              </p>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-[22px] sm:text-[26px] font-bold text-[#323E48] mb-4">
                  Dashboard Inteligente
                </h3>
                <p className="text-[14px] sm:text-[16px] text-[#5B6670] mb-6">
                  Los residentes tienen acceso a una plataforma completa donde pueden:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#6CC04A] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[14px] sm:text-[15px] text-[#323E48]">
                      <strong>Monitorear</strong> producción solar y consumo en tiempo real
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#6CC04A] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[14px] sm:text-[15px] text-[#323E48]">
                      <strong>Visualizar</strong> ahorro mensual y anual con gráficas interactivas
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#6CC04A] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[14px] sm:text-[15px] text-[#323E48]">
                      <strong>Recibir consejos</strong> personalizados de IA para optimizar consumo
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#6CC04A] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[14px] sm:text-[15px] text-[#323E48]">
                      <strong>Competir</strong> en rankings comunitarios por eficiencia energética
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#EB0029]/10 to-[#6CC04A]/10 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-[18px] font-bold text-[#323E48] mb-2">
                  Transparencia Total
                </p>
                <p className="text-[14px] text-[#5B6670]">
                  Toda la información de tu energía solar en la palma de tu mano
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-[#CFD2D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-gradient-to-br from-[#EB0029] to-[#FF6B6B] rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold mb-4">
              ¿Listo para hacer tu desarrollo más sustentable?
            </h2>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] mb-2 opacity-90">
              Únete a los desarrolladores que están construyendo el futuro
            </p>
            <p className="text-[14px] sm:text-[16px] mb-8 opacity-80">
              Financiamiento flexible • App para residentes • Tasas preferenciales • Soporte continuo
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="inline-block w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-[54px] px-12 bg-white text-[#EB0029] hover:bg-gray-50 border-2 border-white font-bold text-lg">
                  Solicitar Financiamiento
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/dashboard-prediction" : "/login"} className="inline-block w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-[54px] px-12 bg-transparent text-white hover:bg-white/10 border-2 border-white font-bold text-lg">
                  {isAuthenticated ? "Acceder" : "Iniciar Sesión"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
