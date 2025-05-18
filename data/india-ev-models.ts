export interface EVModel {
  id: string
  brand: string
  model: string
  variant?: string
  batteryCapacity: number // in kWh
  range: number // in km
  efficiency: number // Wh/km
  fastChargeSpeed?: number // kW
  fastChargeTime?: string // time to charge from 10% to 80%
  acChargeSpeed?: number // kW
  acChargeTime?: string // time for full charge
  connectorTypes: string[]
  topSpeed?: number // km/h
  acceleration?: string // 0-100 km/h
  price?: string // in INR
  imageUrl?: string
  year: number
}

export const indianEVModels: EVModel[] = [
  // Tata Motors
  {
    id: "tata-nexon-ev-max",
    brand: "Tata",
    model: "Nexon EV",
    variant: "Max",
    batteryCapacity: 40.5,
    range: 437,
    efficiency: 92.7,
    fastChargeSpeed: 50,
    fastChargeTime: "60 min",
    acChargeSpeed: 7.2,
    acChargeTime: "6-7 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 140,
    acceleration: "9.0s",
    price: "₹14.49 - 19.54 Lakh",
    year: 2023,
  },
  {
    id: "tata-nexon-ev-prime",
    brand: "Tata",
    model: "Nexon EV",
    variant: "Prime",
    batteryCapacity: 30.2,
    range: 312,
    efficiency: 96.8,
    fastChargeSpeed: 50,
    fastChargeTime: "60 min",
    acChargeSpeed: 3.3,
    acChargeTime: "9-10 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 120,
    acceleration: "9.9s",
    price: "₹14.49 - 16.99 Lakh",
    year: 2023,
  },
  {
    id: "tata-tiago-ev",
    brand: "Tata",
    model: "Tiago EV",
    batteryCapacity: 24,
    range: 315,
    efficiency: 76.2,
    fastChargeSpeed: 50,
    fastChargeTime: "60 min",
    acChargeSpeed: 3.3,
    acChargeTime: "8.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 120,
    price: "₹8.49 - 11.79 Lakh",
    year: 2023,
  },
  {
    id: "tata-tigor-ev",
    brand: "Tata",
    model: "Tigor EV",
    batteryCapacity: 26,
    range: 306,
    efficiency: 85,
    fastChargeSpeed: 50,
    fastChargeTime: "60 min",
    acChargeSpeed: 3.3,
    acChargeTime: "8.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 120,
    price: "₹12.49 - 13.75 Lakh",
    year: 2023,
  },
  {
    id: "tata-punch-ev",
    brand: "Tata",
    model: "Punch EV",
    batteryCapacity: 35,
    range: 421,
    efficiency: 83.1,
    fastChargeSpeed: 50,
    fastChargeTime: "56 min",
    acChargeSpeed: 7.2,
    acChargeTime: "5-6 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 140,
    price: "₹10.99 - 15.49 Lakh",
    year: 2024,
  },

  // Mahindra
  {
    id: "mahindra-xuv400",
    brand: "Mahindra",
    model: "XUV400",
    batteryCapacity: 39.4,
    range: 456,
    efficiency: 86.4,
    fastChargeSpeed: 50,
    fastChargeTime: "50 min",
    acChargeSpeed: 7.2,
    acChargeTime: "6.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 150,
    acceleration: "8.3s",
    price: "₹15.49 - 19.39 Lakh",
    year: 2023,
  },
  {
    id: "mahindra-be-05",
    brand: "Mahindra",
    model: "BE.05",
    batteryCapacity: 60,
    range: 450,
    efficiency: 133.3,
    fastChargeSpeed: 175,
    fastChargeTime: "30 min",
    connectorTypes: ["ccs"],
    topSpeed: 180,
    price: "₹25 - 30 Lakh (expected)",
    year: 2025,
  },

  // MG
  {
    id: "mg-zs-ev",
    brand: "MG",
    model: "ZS EV",
    batteryCapacity: 50.3,
    range: 461,
    efficiency: 109.1,
    fastChargeSpeed: 50,
    fastChargeTime: "60 min",
    acChargeSpeed: 7.4,
    acChargeTime: "8-9 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 140,
    acceleration: "8.5s",
    price: "₹22.98 - 27.30 Lakh",
    year: 2023,
  },
  {
    id: "mg-comet-ev",
    brand: "MG",
    model: "Comet EV",
    batteryCapacity: 17.3,
    range: 230,
    efficiency: 75.2,
    acChargeSpeed: 3.3,
    acChargeTime: "7 hours",
    connectorTypes: ["type2"],
    topSpeed: 100,
    price: "₹7.98 - 9.98 Lakh",
    year: 2023,
  },

  // Hyundai
  {
    id: "hyundai-kona-electric",
    brand: "Hyundai",
    model: "Kona Electric",
    batteryCapacity: 39.2,
    range: 452,
    efficiency: 86.7,
    fastChargeSpeed: 50,
    fastChargeTime: "57 min",
    acChargeSpeed: 7.2,
    acChargeTime: "6 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 167,
    acceleration: "9.7s",
    price: "₹23.84 - 24.03 Lakh",
    year: 2023,
  },
  {
    id: "hyundai-ioniq-5",
    brand: "Hyundai",
    model: "IONIQ 5",
    batteryCapacity: 72.6,
    range: 631,
    efficiency: 115.1,
    fastChargeSpeed: 350,
    fastChargeTime: "18 min",
    acChargeSpeed: 11,
    acChargeTime: "7 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 185,
    acceleration: "7.4s",
    price: "₹44.95 Lakh",
    year: 2023,
  },

  // Kia
  {
    id: "kia-ev6",
    brand: "Kia",
    model: "EV6",
    batteryCapacity: 77.4,
    range: 708,
    efficiency: 109.3,
    fastChargeSpeed: 350,
    fastChargeTime: "18 min",
    acChargeSpeed: 11,
    acChargeTime: "7.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 192,
    acceleration: "5.2s",
    price: "₹60.95 - 65.95 Lakh",
    year: 2023,
  },

  // BYD
  {
    id: "byd-e6",
    brand: "BYD",
    model: "e6",
    batteryCapacity: 71.7,
    range: 520,
    efficiency: 137.9,
    fastChargeSpeed: 60,
    fastChargeTime: "1.5 hours",
    acChargeSpeed: 6.6,
    acChargeTime: "12 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 130,
    price: "₹29.15 Lakh",
    year: 2023,
  },
  {
    id: "byd-atto-3",
    brand: "BYD",
    model: "Atto 3",
    batteryCapacity: 60.48,
    range: 521,
    efficiency: 116.1,
    fastChargeSpeed: 80,
    fastChargeTime: "50 min",
    acChargeSpeed: 7,
    acChargeTime: "10 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 160,
    acceleration: "7.3s",
    price: "₹33.99 Lakh",
    year: 2023,
  },

  // Mercedes-Benz
  {
    id: "mercedes-eqb",
    brand: "Mercedes-Benz",
    model: "EQB",
    batteryCapacity: 66.5,
    range: 423,
    efficiency: 157.2,
    fastChargeSpeed: 100,
    fastChargeTime: "32 min",
    acChargeSpeed: 11,
    acChargeTime: "6.25 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 160,
    acceleration: "8.0s",
    price: "₹74.50 Lakh",
    year: 2023,
  },
  {
    id: "mercedes-eqe",
    brand: "Mercedes-Benz",
    model: "EQE",
    batteryCapacity: 90.6,
    range: 669,
    efficiency: 135.4,
    fastChargeSpeed: 170,
    fastChargeTime: "32 min",
    acChargeSpeed: 11,
    acChargeTime: "8.25 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 210,
    acceleration: "6.4s",
    price: "₹1.39 Crore",
    year: 2023,
  },
  {
    id: "mercedes-eqs",
    brand: "Mercedes-Benz",
    model: "EQS",
    batteryCapacity: 107.8,
    range: 857,
    efficiency: 125.8,
    fastChargeSpeed: 200,
    fastChargeTime: "31 min",
    acChargeSpeed: 11,
    acChargeTime: "10 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 210,
    acceleration: "4.3s",
    price: "₹1.55 - 2.45 Crore",
    year: 2023,
  },

  // BMW
  {
    id: "bmw-i4",
    brand: "BMW",
    model: "i4",
    batteryCapacity: 83.9,
    range: 590,
    efficiency: 142.2,
    fastChargeSpeed: 200,
    fastChargeTime: "31 min",
    acChargeSpeed: 11,
    acChargeTime: "8.25 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 190,
    acceleration: "5.7s",
    price: "₹69.90 - 72.50 Lakh",
    year: 2023,
  },
  {
    id: "bmw-ix",
    brand: "BMW",
    model: "iX",
    batteryCapacity: 76.6,
    range: 425,
    efficiency: 180.2,
    fastChargeSpeed: 150,
    fastChargeTime: "31 min",
    acChargeSpeed: 11,
    acChargeTime: "7 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 200,
    acceleration: "6.1s",
    price: "₹1.16 - 1.39 Crore",
    year: 2023,
  },
  {
    id: "bmw-i7",
    brand: "BMW",
    model: "i7",
    batteryCapacity: 101.7,
    range: 625,
    efficiency: 162.7,
    fastChargeSpeed: 195,
    fastChargeTime: "34 min",
    acChargeSpeed: 11,
    acChargeTime: "9.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 240,
    acceleration: "4.7s",
    price: "₹1.95 - 2.50 Crore",
    year: 2023,
  },

  // Audi
  {
    id: "audi-e-tron-gt",
    brand: "Audi",
    model: "e-tron GT",
    batteryCapacity: 93.4,
    range: 500,
    efficiency: 186.8,
    fastChargeSpeed: 270,
    fastChargeTime: "23 min",
    acChargeSpeed: 11,
    acChargeTime: "9.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 245,
    acceleration: "4.1s",
    price: "₹1.80 - 2.05 Crore",
    year: 2023,
  },
  {
    id: "audi-q8-e-tron",
    brand: "Audi",
    model: "Q8 e-tron",
    batteryCapacity: 114,
    range: 582,
    efficiency: 195.9,
    fastChargeSpeed: 170,
    fastChargeTime: "31 min",
    acChargeSpeed: 11,
    acChargeTime: "11.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 200,
    acceleration: "5.6s",
    price: "₹1.14 - 1.26 Crore",
    year: 2023,
  },

  // Porsche
  {
    id: "porsche-taycan",
    brand: "Porsche",
    model: "Taycan",
    batteryCapacity: 93.4,
    range: 513,
    efficiency: 182.1,
    fastChargeSpeed: 270,
    fastChargeTime: "23 min",
    acChargeSpeed: 11,
    acChargeTime: "9 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 260,
    acceleration: "4.0s",
    price: "₹1.50 - 2.31 Crore",
    year: 2023,
  },

  // Volvo
  {
    id: "volvo-xc40-recharge",
    brand: "Volvo",
    model: "XC40 Recharge",
    batteryCapacity: 78,
    range: 418,
    efficiency: 186.6,
    fastChargeSpeed: 150,
    fastChargeTime: "33 min",
    acChargeSpeed: 11,
    acChargeTime: "8 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 180,
    acceleration: "4.9s",
    price: "₹56.90 Lakh",
    year: 2023,
  },
  {
    id: "volvo-c40-recharge",
    brand: "Volvo",
    model: "C40 Recharge",
    batteryCapacity: 78,
    range: 530,
    efficiency: 147.2,
    fastChargeSpeed: 150,
    fastChargeTime: "33 min",
    acChargeSpeed: 11,
    acChargeTime: "8 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 180,
    acceleration: "4.7s",
    price: "₹61.25 Lakh",
    year: 2023,
  },

  // MINI
  {
    id: "mini-cooper-se",
    brand: "MINI",
    model: "Cooper SE",
    batteryCapacity: 32.6,
    range: 270,
    efficiency: 120.7,
    fastChargeSpeed: 50,
    fastChargeTime: "36 min",
    acChargeSpeed: 11,
    acChargeTime: "3.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 150,
    acceleration: "7.3s",
    price: "₹52.50 Lakh",
    year: 2023,
  },

  // Citroen
  {
    id: "citroen-ec3",
    brand: "Citroen",
    model: "eC3",
    batteryCapacity: 29.2,
    range: 320,
    efficiency: 91.3,
    fastChargeSpeed: 50,
    fastChargeTime: "57 min",
    acChargeSpeed: 3.3,
    acChargeTime: "10.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 107,
    price: "₹11.50 - 12.43 Lakh",
    year: 2023,
  },

  // Jaguar
  {
    id: "jaguar-i-pace",
    brand: "Jaguar",
    model: "I-PACE",
    batteryCapacity: 90,
    range: 470,
    efficiency: 191.5,
    fastChargeSpeed: 100,
    fastChargeTime: "45 min",
    acChargeSpeed: 11,
    acChargeTime: "8.5 hours",
    connectorTypes: ["ccs", "type2"],
    topSpeed: 200,
    acceleration: "4.8s",
    price: "₹1.20 - 1.25 Crore",
    year: 2023,
  },
]

// Helper function to convert km range to miles
export function kmToMiles(km: number): number {
  return km * 0.621371
}

// Helper function to get range in miles
export function getRangeInMiles(vehicleId: string): number {
  const vehicle = indianEVModels.find((v) => v.id === vehicleId)
  if (!vehicle) return 0
  return kmToMiles(vehicle.range)
}

// Helper function to get miles per % of battery
export function getMilesPerPercent(vehicleId: string): number {
  const vehicle = indianEVModels.find((v) => v.id === vehicleId)
  if (!vehicle) return 0
  return kmToMiles(vehicle.range) / 100
}

// Helper function to get range estimate based on battery level
export function getRangeEstimate(vehicleId: string, batteryLevel: number): number {
  const milesPerPercent = getMilesPerPercent(vehicleId)
  return Math.round(milesPerPercent * batteryLevel)
}

// Group vehicles by brand for easier selection
export function getVehiclesByBrand() {
  const brandGroups = {}

  indianEVModels.forEach((vehicle) => {
    if (!brandGroups[vehicle.brand]) {
      brandGroups[vehicle.brand] = []
    }
    brandGroups[vehicle.brand].push(vehicle)
  })

  return brandGroups
}
