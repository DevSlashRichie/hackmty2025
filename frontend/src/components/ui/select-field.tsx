import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectFieldProps {
  label?: string
  placeholder?: string
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  error?: string
  helperText?: string
}

export function SelectField({
  label,
  placeholder = "Selecciona una opción",
  options,
  value,
  onValueChange,
  disabled,
  error,
  helperText,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[12px] font-normal text-[#5B6670] mb-[5px]">
          {label}
        </label>
      )}

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Helper text or error message */}
      {(error || helperText) && (
        <div className="mt-[10px] min-h-[16px]">
          {error ? (
            <span className="text-[12px] text-[#EB0029] font-normal">
              {error}
            </span>
          ) : helperText ? (
            <span className="text-[12px] text-[#5B6670] font-normal">
              {helperText}
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
