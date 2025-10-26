import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate({ to: '/' })
  }

  return (
    <nav className="bg-white border-b border-[#CFD2D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/logo.png" 
              alt="Banorte Tech Logo" 
              className="h-6 sm:h-8 w-auto"
            />
            <span className="text-[14px] sm:text-[16px] lg:text-[18px] font-bold text-[#323E48] hidden xs:block">
              Banorte Tech
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/"
              className="text-[14px] lg:text-[15px] text-[#5B6670] hover:text-[#EB0029] transition-colors"
            >
              Inicio
            </Link>
            <Link 
              to="/#"
              className="text-[14px] lg:text-[15px] text-[#5B6670] hover:text-[#EB0029] transition-colors"
            >
              Solicitar prestamo
            </Link>
            <Link 
              to="/#"
              className="text-[14px] lg:text-[15px] text-[#5B6670] hover:text-[#EB0029] transition-colors"
            >
              Certificación
            </Link>
            <Link 
              to="/#"
              className="text-[14px] lg:text-[15px] text-[#5B6670] hover:text-[#EB0029] transition-colors"
            >
              Nuestros programas
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  {user?.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-[14px] text-[#323E48] font-medium">
                    {user?.name}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-[13px] lg:text-[14px]">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-[13px] lg:text-[14px]">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="text-[13px] lg:text-[14px]">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-md text-[#323E48] hover:bg-[#F6F6F6] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-4 border-t border-[#CFD2D3]">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              <Link 
                to="/"
                className="text-[15px] text-[#5B6670] hover:text-[#EB0029] transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/"
                className="text-[15px] text-[#5B6670] hover:text-[#EB0029] transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Aplica
              </Link>
              <Link 
                to="/"
                className="text-[15px] text-[#5B6670] hover:text-[#EB0029] transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Certificación
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-[#CFD2D3]">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-2">
                      {user?.picture && (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-[14px] text-[#323E48] font-medium">{user?.name}</p>
                        <p className="text-[12px] text-[#5B6670]">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" className="w-full">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
