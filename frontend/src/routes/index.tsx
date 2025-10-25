import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SelectField } from '@/components/ui/select-field'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  const options = [
    { value: 'opcion1', label: 'Opción 1' },
    { value: 'opcion2', label: 'Opción 2' },
    { value: 'opcion3', label: 'Opción 3' },
  ]

  const handleSubmit = () => {
    console.log('Email:', email)
    console.log('Selected:', selectedOption)
    alert(`Email: ${email}\nOpción seleccionada: ${selectedOption}`)
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#323E48] mb-4">Ejemplo de Formulario</h1>
          <p className="text-[20px] text-[#5B6670]">
            Sistema de Diseño Banorte
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-[#323E48] mb-6">Datos del Usuario</h3>

          <div className="space-y-6">
            {/* Input Example */}
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Select Example */}
            <SelectField
              label="Tipo de operación"
              placeholder="Selecciona una opción"
              options={options}
              value={selectedOption}
              onValueChange={setSelectedOption}
            />

            {/* Buttons Example */}
            <div className="flex gap-4 pt-4">
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                className="flex-1"
              >
                Continuar
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setEmail('')
                  setSelectedOption('')
                }}
              >
                Limpiar
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Examples */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h4 className="text-[#323E48] mb-6">Más Variantes de Botones</h4>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primario</Button>
            <Button variant="outline">Secundario</Button>
            <Button variant="tertiary">Terciario</Button>
            <Button variant="primary" disabled>Deshabilitado</Button>
          </div>
        </div>

        {/* States Examples */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h4 className="text-[#323E48] mb-6">Estados de Input</h4>
          
          <div className="space-y-6">
            <Input
              label="Input con valor"
              type="text"
              defaultValue="Texto de ejemplo"
            />

            <Input
              label="Input con error"
              type="email"
              error="Este campo es obligatorio"
              placeholder="correo@ejemplo.com"
            />

            <Input
              label="Input con contador"
              type="text"
              helperText="Máximo 20 caracteres"
              maxLength={20}
              showCounter
              placeholder="Escribe algo..."
            />

            <Input
              label="Input deshabilitado"
              type="text"
              disabled
              placeholder="Este campo está bloqueado"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
