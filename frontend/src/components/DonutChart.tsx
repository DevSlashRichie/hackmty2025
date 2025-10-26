import { useEffect, useState } from 'react'

interface DonutChartProps {
  percentage: number
  label: string
  value: string
  color?: string
  size?: number
  strokeWidth?: number
}

export function DonutChart({
  percentage,
  label,
  value,
  color = '#6CC04A',
  size = 200,
  strokeWidth = 20,
}: DonutChartProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, 100)
    return () => clearTimeout(timeout)
  }, [percentage])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedPercentage / 100) * circumference
  const center = size / 2

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-[#323E48]">
            {Math.round(animatedPercentage)}%
          </div>
          <div className="text-sm text-[#5B6670] mt-1">{label}</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-bold text-[#323E48]">{value}</p>
      </div>
    </div>
  )
}
