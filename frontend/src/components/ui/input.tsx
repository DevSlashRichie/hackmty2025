import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  showCounter?: boolean
}

function Input({ 
  className, 
  type, 
  label, 
  error, 
  helperText, 
  maxLength, 
  showCounter = false,
  ...props 
}: InputProps) {
  const [value, setValue] = React.useState("")
  const isError = !!error
  const isDisabled = props.disabled

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[12px] font-medium text-[#5B6670] mb-[5px]">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          data-slot="input"
          maxLength={maxLength}
          className={cn(
            // Base styles
            "w-full h-[50px] px-[12px] rounded-[6px] text-[15px] font-medium",
            "bg-[#F6F6F6] border-b-2 border-transparent",
            "transition-all duration-200 outline-none",
            
            // Placeholder
            "placeholder:text-[#C1C5C8] placeholder:font-medium",
            
            // Focus state
            "focus:border-b-[#323E48] focus:bg-white",
            
            // Filled state (when has value)
            value && !isError && !isDisabled && "bg-white border-b-[#323E48]",
            
            // Error state
            isError && "border-b-[#EB0029] bg-white text-[#323E48]",
            
            // Disabled state
            isDisabled && "bg-[#F6F6F6] text-[#C1C5C8] cursor-not-allowed border-b-transparent",
            
            className
          )}
          onChange={handleChange}
          aria-invalid={isError}
          {...props}
        />
        
        {/* Clear/Icon button */}
        {(value || isError) && !isDisabled && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] flex items-center justify-center text-[#323E48] hover:text-[#EB0029] transition-colors"
            aria-label="Clear input"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="6" fill="currentColor"/>
              <path d="M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Helper text or character counter */}
      <div className="mt-[10px] flex justify-between items-center min-h-[16px]">
        {error ? (
          <span className="text-[12px] text-[#EB0029] font-normal">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-[12px] text-[#5B6670] font-normal">
            {helperText}
          </span>
        ) : (
          <span />
        )}
        
        {showCounter && maxLength && (
          <span className="text-[12px] text-[#5B6670] font-normal">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

export { Input }
