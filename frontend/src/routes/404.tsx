import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/404')({
  component: NotFoundComponent,
})

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full">
        {/* Card de 404 */}
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
          {/* Ilustración de Error */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#F6F6F6] mb-6">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-[#EB0029]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-[80px] sm:text-[120px] font-bold text-[#323E48] leading-none mb-2">
              404
            </h1>
          </div>

          {/* Mensaje de Error */}
          <div className="mb-8">
            <h2 className="text-[24px] sm:text-[32px] font-bold text-[#323E48] mb-3">
              Página no encontrada
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#5B6670] mb-2">
              Lo sentimos, la página que buscas no existe.
            </p>
            <p className="text-[14px] sm:text-[16px] text-[#5B6670]">
              Es posible que el enlace esté roto o que la página haya sido eliminada.
            </p>
          </div>

          {/* Sugerencias */}
          <div className="bg-[#F6F6F6] rounded-lg p-6 mb-8">
            <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#323E48] mb-4">
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-left space-y-3">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <svg className="text-[#6CC04A]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-[14px] sm:text-[15px] text-[#5B6670]">
                  Verifica que la URL esté escrita correctamente
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <svg className="text-[#6CC04A]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-[14px] sm:text-[15px] text-[#5B6670]">
                  Regresa a la página principal y explora desde ahí
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <svg className="text-[#6CC04A]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-[14px] sm:text-[15px] text-[#5B6670]">
                  Usa el menú de navegación para encontrar lo que buscas
                </p>
              </li>
            </ul>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto h-[50px] px-8">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Volver al Inicio
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto h-[50px] px-8">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Página Anterior
              </Button>
            </button>
          </div>
        </div>

        {/* Enlaces Útiles */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-[#5B6670] mb-3">
            Enlaces útiles:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="text-[14px] text-[#EB0029] hover:text-[#DB0026] font-medium"
            >
              Inicio
            </Link>
            <span className="text-[#CFD2D3]">•</span>
            <Link
              to="/login"
              className="text-[14px] text-[#EB0029] hover:text-[#DB0026] font-medium"
            >
              Iniciar Sesión
            </Link>
            <span className="text-[#CFD2D3]">•</span>
            <Link
              to="/signup"
              className="text-[14px] text-[#EB0029] hover:text-[#DB0026] font-medium"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
