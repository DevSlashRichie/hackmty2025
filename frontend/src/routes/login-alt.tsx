import { createFileRoute, Link } from '@tanstack/react-router'
import { GoogleAuthButton } from '@/components/ui/google-auth-button'

export const Route = createFileRoute('/login-alt')({
  component: LoginAltComponent,
})

function LoginAltComponent() {
  const handleGoogleSuccess = (tokenResponse: any) => {
    console.log('Google Login Success:', tokenResponse)
    console.log('Access Token:', tokenResponse.access_token)
    
    // Aquí puedes enviar el token a tu backend
    // fetch('/api/auth/google', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ access_token: tokenResponse.access_token })
    // })
  }

  const handleGoogleError = () => {
    console.error('Google Login Failed')
    alert('Error al iniciar sesión con Google. Por favor, intenta de nuevo.')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-[#323E48] mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-[15px] text-[#5B6670]">
              Ingresa con tu cuenta de Google
            </p>
          </div>

          {/* Google Sign In Button (Custom) */}
          <div className="space-y-4">
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin"
            />
          </div>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-[#F6F6F6] rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <svg className="text-[#6CC04A]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#323E48] mb-1">
                  Conexión segura
                </p>
                <p className="text-[12px] text-[#5B6670]">
                  Tu información está protegida con encriptación de extremo a extremo
                </p>
              </div>
            </div>
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
                to="/signup-alt"
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
