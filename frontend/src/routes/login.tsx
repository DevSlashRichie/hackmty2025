import { createFileRoute, Link, useNavigate, redirect } from '@tanstack/react-router'
import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // Si ya está autenticado, redirigir a /apply
    const token = sessionStorage.getItem('auth_token')
    if (token) {
      throw redirect({ to: '/apply' })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        await login(credentialResponse.credential)
        // Redirigir a la página de aplicación
        navigate({ to: '/apply' })
      } catch (error) {
        console.error('Error during login:', error)
      }
    }
  }

  const handleGoogleError = () => {
    console.error('Google Login Failed')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#323E48] mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[#5B6670]">
              Ingresa con tu cuenta de Google
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CFD2D3]"></div>
            </div>
          </div>

          {/* Link a Signup */}
          <div className="text-center">
            <p className="text-[15px] text-[#5B6670]">
              ¿No tienes cuenta?{' '}
              <Link
                to="/signup"
                className="text-[#EB0029] font-medium hover:text-[#DB0026] transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-6 text-center">
          <p className="text-[12px] text-[#5B6670]">
            Al iniciar sesión, aceptas nuestros{' '}
            <a href="#" className="text-[#EB0029] hover:text-[#DB0026]">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="text-[#EB0029] hover:text-[#DB0026]">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
