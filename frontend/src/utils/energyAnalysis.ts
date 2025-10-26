// Utilidades para análisis de consumo energético

export interface EnergyProfile {
  people: string
  workFromHome: string
  electricCar: string
  airConditioning: string
  electricBill: File | null
}

export interface EnergyAnalysisResult {
  monthlyConsumption: number // kWh/mes
  monthlyCost: number // pesos/mes
  recommendedPanels: number
  panelProduction: number // kWh/mes
  monthlySavings: number // pesos/mes
  yearlySavings: number // pesos/año
  surplus: number // kWh/mes
  breakEvenYears: number
  carbonOffset: number // kg CO2/año
}

// Tarifas promedio de CFE (pesos por kWh)
const CFE_RATES = {
  basic: 0.801, // Tarifa básica promedio
  intermediate: 1.093, // Tarifa intermedia
  high: 3.043, // Tarifa DAC (alto consumo)
}

// Características de paneles solares
const PANEL_SPECS = {
  wattage: 450, // Watts por panel (panel estándar)
  efficiency: 0.85, // 85% eficiencia
  sunHoursPerDay: 5.5, // Horas sol promedio en México
  costPerPanel: 4500, // Costo aproximado por panel instalado
}

/**
 * Calcula el consumo mensual estimado basado en el perfil del usuario
 */
export function estimateMonthlyConsumption(profile: EnergyProfile): number {
  let baseConsumption = 0

  // Consumo base por número de personas
  const people = parseInt(profile.people) || 1
  baseConsumption = people * 100 // 100 kWh por persona base

  // Ajuste por trabajo desde casa
  if (profile.workFromHome === 'Sí') {
    baseConsumption += people * 80 // +80 kWh por persona que trabaja en casa
  } else if (profile.workFromHome === 'A veces') {
    baseConsumption += people * 40 // +40 kWh por persona (trabajo híbrido)
  }

  // Ajuste por auto eléctrico
  if (profile.electricCar === 'Sí') {
    baseConsumption += 300 // +300 kWh/mes para cargar auto eléctrico
  } else if (profile.electricCar === 'Planeo comprarlo') {
    // No afecta consumo actual
  }

  // Ajuste por aire acondicionado
  switch (profile.airConditioning) {
    case 'Sí, todo el día':
      baseConsumption += 400 // +400 kWh/mes
      break
    case 'Solo por la noche':
      baseConsumption += 200 // +200 kWh/mes
      break
    case 'Ocasionalmente':
      baseConsumption += 100 // +100 kWh/mes
      break
    case 'No':
      // No se agrega consumo adicional
      break
  }

  return Math.round(baseConsumption)
}

/**
 * Calcula la tarifa CFE aplicable según el consumo
 */
function getCFERate(monthlyConsumption: number): number {
  if (monthlyConsumption <= 300) {
    return CFE_RATES.basic
  } else if (monthlyConsumption <= 600) {
    return CFE_RATES.intermediate
  } else {
    return CFE_RATES.high
  }
}

/**
 * Calcula cuántos paneles se necesitan para cubrir el consumo
 */
function calculateRequiredPanels(monthlyConsumption: number): number {
  // Producción mensual de un panel
  const monthlyProductionPerPanel =
    (PANEL_SPECS.wattage * PANEL_SPECS.sunHoursPerDay * 30 * PANEL_SPECS.efficiency) / 1000

  const requiredPanels = Math.ceil(monthlyConsumption / monthlyProductionPerPanel)
  return requiredPanels
}

/**
 * Analiza el perfil energético y devuelve recomendaciones
 */
export function analyzeEnergyProfile(profile: EnergyProfile): EnergyAnalysisResult {
  // Calcular consumo mensual
  const monthlyConsumption = estimateMonthlyConsumption(profile)

  // Determinar tarifa CFE aplicable
  const cfeRate = getCFERate(monthlyConsumption)

  // Calcular costo mensual actual
  const monthlyCost = monthlyConsumption * cfeRate

  // Calcular paneles recomendados
  const recommendedPanels = calculateRequiredPanels(monthlyConsumption)

  // Producción mensual total de los paneles recomendados
  const panelProduction =
    (recommendedPanels *
      PANEL_SPECS.wattage *
      PANEL_SPECS.sunHoursPerDay *
      30 *
      PANEL_SPECS.efficiency) /
    1000

  // Calcular excedente
  const surplus = panelProduction - monthlyConsumption

  // Ahorro mensual (considerando que el excedente se vende a CFE al 50% del precio)
  const monthlySavings = monthlyCost + (surplus > 0 ? surplus * cfeRate * 0.5 : 0)

  // Ahorro anual
  const yearlySavings = monthlySavings * 12

  // Calcular años para recuperar inversión
  const totalInvestment = recommendedPanels * PANEL_SPECS.costPerPanel
  const breakEvenYears = parseFloat((totalInvestment / yearlySavings).toFixed(1))

  // Calcular reducción de huella de carbono (0.5 kg CO2 por kWh)
  const carbonOffset = panelProduction * 12 * 0.5

  return {
    monthlyConsumption,
    monthlyCost: Math.round(monthlyCost),
    recommendedPanels,
    panelProduction: Math.round(panelProduction),
    monthlySavings: Math.round(monthlySavings),
    yearlySavings: Math.round(yearlySavings),
    surplus: Math.round(surplus),
    breakEvenYears,
    carbonOffset: Math.round(carbonOffset),
  }
}

