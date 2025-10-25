import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Hero Section */}
      <div className="bg-white border-b border-[#CFD2D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#323E48] mb-3 sm:mb-4">
              Préstamos Sostenibles con Banorte
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#5B6670] mb-3 sm:mb-4 max-w-3xl mx-auto">
              Alcanza tus objetivos financieros con soluciones responsables y accesibles
            </p>
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#5B6670] mb-6 sm:mb-8 max-w-3xl mx-auto">
              Financiamiento con tasas preferenciales para empresas y PYMEs comprometidas con indicadores clave de sostenibilidad
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto h-[50px] px-8">
                  Solicitar Préstamo
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-[50px] px-8">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#323E48] mb-3 sm:mb-4">
            Indicadores Clave de Sostenibilidad (KPIs)
          </h2>
          <p className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#5B6670]">
            Cumple con estos objetivos y obtén tasas preferenciales
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* KPI 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-[#6CC04A] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
              Reducción de Consumo
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
              Energía y agua
            </p>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-[#6CC04A] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
              Materiales Reciclables
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
              Uso sostenible de recursos
            </p>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-[#6CC04A] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
              Inclusión Laboral
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
              Equidad y diversidad
            </p>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-[#6CC04A] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#323E48] mb-2">
              Energías Limpias
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#5B6670]">
              Implementación renovable
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#323E48] mb-3 sm:mb-4">
              Beneficios por Cumplimiento
            </h2>
            <p className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#5B6670]">
              Verificado mediante auditorías anuales con transparencia total
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Benefit 1 */}
            <div className="bg-[#F6F6F6] rounded-lg p-6 sm:p-8">
              <div className="w-12 h-12 bg-[#EB0029] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-2">
                Reducción de Tasas
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670]">
                Obtén tasas de interés preferenciales al cumplir tus KPIs de sostenibilidad
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#F6F6F6] rounded-lg p-6 sm:p-8">
              <div className="w-12 h-12 bg-[#6CC04A] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-2">
                Líneas de Crédito Ampliadas
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670]">
                Accede a mayores montos de financiamiento conforme cumples tus objetivos
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#F6F6F6] rounded-lg p-6 sm:p-8">
              <div className="w-12 h-12 bg-[#323E48] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#323E48] mb-2">
                Empresa Verde Banorte
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5B6670]">
                Reconocimiento oficial dentro del ecosistema financiero sostenible
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-[#CFD2D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#323E48] mb-3 sm:mb-4">
              ¿Listo para un préstamo sostenible?
            </h2>
            <p className="text-[15px] sm:text-[16px] lg:text-[18px] text-[#5B6670] mb-6 sm:mb-8">
              Únete a las empresas y PYMEs que ya están construyendo un futuro más verde
            </p>
            <Link to="/signup" className="inline-block w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto h-[50px] px-12">
                Solicitar Préstamo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
