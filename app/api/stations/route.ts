import { NextResponse } from "next/server"

// Mock data for charging stations
const chargingStations = [
  {
    id: 1,
    name: "SuperCharger - Mountain View",
    address: "100 Main St, Mountain View, CA",
    location: {
      lat: 37.386051,
      lng: -122.083855,
    },
    availability: {
      total: 8,
      available: 4,
    },
    rating: 4.7,
    chargingSpeed: "250 kW",
    pricePerKwh: 0.36,
    connectorTypes: ["CCS", "Tesla"],
    amenities: ["Restrooms", "Coffee Shop", "WiFi"],
    reviews: [
      {
        id: 101,
        userId: "user123",
        rating: 5,
        comment: "Fast charging and clean facilities",
        date: "2023-04-15T14:30:00Z",
      },
      {
        id: 102,
        userId: "user456",
        rating: 4,
        comment: "Good location but can get busy",
        date: "2023-03-22T09:15:00Z",
      },
    ],
  },
  {
    id: 2,
    name: "ElectrifyAmerica - Palo Alto",
    address: "200 University Ave, Palo Alto, CA",
    location: {
      lat: 37.444683,
      lng: -122.161479,
    },
    availability: {
      total: 6,
      available: 2,
    },
    rating: 4.2,
    chargingSpeed: "150 kW",
    pricePerKwh: 0.43,
    connectorTypes: ["CCS", "CHAdeMO"],
    amenities: ["Restrooms", "Shopping", "Restaurant"],
    reviews: [
      {
        id: 103,
        userId: "user789",
        rating: 4,
        comment: "Reliable chargers but a bit expensive",
        date: "2023-05-02T16:45:00Z",
      },
    ],
  },
  {
    id: 3,
    name: "ChargePoint - San Jose",
    address: "350 Santana Row, San Jose, CA",
    location: {
      lat: 37.321625,
      lng: -121.947435,
    },
    availability: {
      total: 10,
      available: 5,
    },
    rating: 4.5,
    chargingSpeed: "180 kW",
    pricePerKwh: 0.39,
    connectorTypes: ["CCS", "J1772"],
    amenities: ["Restrooms", "Shopping", "WiFi", "Restaurant"],
    reviews: [
      {
        id: 104,
        userId: "user321",
        rating: 5,
        comment: "Great location with lots of amenities",
        date: "2023-04-28T11:20:00Z",
      },
      {
        id: 105,
        userId: "user654",
        rating: 4,
        comment: "Chargers work well but sometimes there's a wait",
        date: "2023-03-15T13:10:00Z",
      },
    ],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get query parameters
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius") || "25" // Default 25 miles
  const connectorType = searchParams.get("connector")
  const minPower = searchParams.get("minPower")

  // In a real implementation, we would filter based on these parameters
  // For this demo, we'll just return all stations with a small delay to simulate API call

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    data: chargingStations,
    meta: {
      total: chargingStations.length,
      filters: {
        lat,
        lng,
        radius: Number.parseInt(radius),
        connectorType,
        minPower: minPower ? Number.parseInt(minPower) : null,
      },
    },
  })
}
