import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Crear partículas en forma de esfera
    const particles: Particle[] = []
    const particleCount = 1500
    const radius = 150

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      particles.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
      })
    }

    let rotation = 0
    let mouseX = 0
    let mouseY = 0

    // Seguir el mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.01
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.01
    }
    canvas.addEventListener('mousemove', handleMouseMove)

    // Animar
    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      
      ctx.fillStyle = 'rgba(246, 246, 246, 0.1)'
      ctx.fillRect(0, 0, width, height)

      rotation += 0.002

      // Dibujar partículas
      particles.forEach((particle) => {
        // Rotar partícula
        const rotY = rotation + mouseX
        const rotX = mouseY

        let x = particle.x
        let y = particle.y
        let z = particle.z

        // Rotación en Y
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY

        // Rotación en X
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        const y1 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        // Proyección 3D a 2D
        const scale = 300 / (300 + z2)
        const x2d = x1 * scale + width / 2
        const y2d = y1 * scale + height / 2

        // Tamaño basado en profundidad
        const size = scale * 2

        // Color basado en profundidad
        const alpha = (z2 + radius) / (radius * 2)
        const hue = 220 + alpha * 60 // De azul a púrpura
        
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha * 0.8})`
        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fill()

        // Mover partícula ligeramente
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // Mantener en la esfera
        const dist = Math.sqrt(
          particle.x * particle.x +
          particle.y * particle.y +
          particle.z * particle.z
        )
        if (dist > radius + 20 || dist < radius - 20) {
          particle.x = (particle.x / dist) * radius
          particle.y = (particle.y / dist) * radius
          particle.z = (particle.z / dist) * radius
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: '#F6F6F6' }}
    />
  )
}
