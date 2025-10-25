import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'

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

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] py-8 px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#323E48] mb-4">
            Formulario de Aplicación
          </h1>
          <p className="text-[#5B6670] mb-6">
            Esta es una ruta protegida. Solo los usuarios autenticados pueden acceder aquí.
          </p>

          {/* Aquí puedes agregar tu formulario de aplicación */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323E48] mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-4 py-2 border border-[#CFD2D3] rounded-md focus:ring-2 focus:ring-[#EB0029] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323E48] mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-4 py-2 border border-[#CFD2D3] rounded-md focus:ring-2 focus:ring-[#EB0029] focus:border-transparent"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#323E48] mb-2">
                Mensaje
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-[#CFD2D3] rounded-md focus:ring-2 focus:ring-[#EB0029] focus:border-transparent"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button className="w-full py-3 bg-[#6CC04A] text-white font-medium rounded-md hover:bg-[#5BA839] transition-colors">
              Enviar Aplicación
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
