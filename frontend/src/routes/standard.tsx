import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SelectField } from '@/components/ui/select-field'
import { useState } from 'react'

export const Route = createFileRoute('/standard')({
  component: StandardComponent,
})

function StandardComponent() {
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
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] text-[#323E48] mb-3 sm:mb-4">
            Estándares de Diseño
          </h1>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#5B6670]">
            Sistema de Diseño Banorte
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h3 className="text-[18px] sm:text-[20px] text-[#323E48] mb-6">Datos del Usuario</h3>

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
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h4 className="text-[16px] sm:text-[18px] text-[#323E48] mb-6">Más Variantes de Botones</h4>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primario</Button>
            <Button variant="outline">Secundario</Button>
            <Button variant="tertiary">Terciario</Button>
            <Button variant="primary" disabled>Deshabilitado</Button>
          </div>
        </div>

        {/* States Examples */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h4 className="text-[16px] sm:text-[18px] text-[#323E48] mb-6">Estados de Input</h4>
          
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

        {/* Color Palette */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h4 className="text-[16px] sm:text-[18px] text-[#323E48] mb-6">Paleta de Colores</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="h-20 bg-[#EB0029] rounded-lg mb-2"></div>
              <p className="text-[12px] text-[#5B6670]">Rojo Banorte</p>
              <p className="text-[11px] text-[#C1C5C8]">#EB0029</p>
            </div>
            
            <div>
              <div className="h-20 bg-[#323E48] rounded-lg mb-2"></div>
              <p className="text-[12px] text-[#5B6670]">Gris Texto</p>
              <p className="text-[11px] text-[#C1C5C8]">#323E48</p>
            </div>
            
            <div>
              <div className="h-20 bg-[#5B6670] rounded-lg mb-2"></div>
              <p className="text-[12px] text-[#5B6670]">Gris Label</p>
              <p className="text-[11px] text-[#C1C5C8]">#5B6670</p>
            </div>
            
            <div>
              <div className="h-20 bg-[#6CC04A] rounded-lg mb-2"></div>
              <p className="text-[12px] text-[#5B6670]">Positivo</p>
              <p className="text-[11px] text-[#C1C5C8]">#6CC04A</p>
            </div>
            
            <div>
              <div className="h-20 bg-[#FF5718] rounded-lg mb-2"></div>
              <p className="text-[12px] text-[#5B6670]">Alertas</p>
              <p className="text-[11px] text-[#C1C5C8]">#FF5718</p>
            </div>
            
            <div>
              <div className="h-20 bg-[#F6F6F6] rounded-lg mb-2 border border-[#CFD2D3]"></div>
              <p className="text-[12px] text-[#5B6670]">Fondo</p>
              <p className="text-[11px] text-[#C1C5C8]">#F6F6F6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
