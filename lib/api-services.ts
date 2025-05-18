// API service for Open Charge Map API
const OPEN_CHARGE_MAP_API_KEY = process.env.NEXT_PUBLIC_OPEN_CHARGE_MAP_API_KEY || ""
const OPEN_CHARGE_MAP_BASE_URL = "https://api.openchargemap.io/v3"

export interface ChargingStation {
  id: number
  name: string
  address: string
  distance?: string
  distanceKm?: number
  availability?: string
  rating?: number
  chargingSpeed?: string
  pricePerKwh?: string
  connectorTypes: string[]
  amenities: string[]
  location: {
    lat: number
    lng: number
  }
}

// Transform Open Charge Map data to our app's format
function transformStationData(data: any[]): ChargingStation[] {
  if (!data || !Array.isArray(data)) return []

  return data.map((item) => {
    // Extract connector types
    const connectorTypes =
      item.Connections?.map((conn) => {
        const connectionType = conn.ConnectionType?.Title?.toLowerCase() || ""
        if (connectionType.includes("ccs")) return "ccs"
        if (connectionType.includes("chademo")) return "chademo"
        if (connectionType.includes("tesla")) return "tesla"
        if (connectionType.includes("j1772") || connectionType.includes("type 1")) return "j1772"
        if (connectionType.includes("type 2")) return "type2"
        return connectionType
      }).filter(Boolean) || []

    // Extract power level
    const maxPower = Math.max(...(item.Connections?.map((conn) => conn.PowerKW || 0) || [0]))

    // Extract amenities
    const amenities: string[] = []
    if (item.AddressInfo?.RelatedURL) amenities.push("wifi")
    if (item.UsageType?.Title?.includes("Public")) amenities.push("restrooms")

    // Add more amenities based on POI data if available
    const poiTypes = new Set(item.AddressInfo?.AddressInfoURL?.split(",").map((s) => s.trim().toLowerCase()) || [])
    if (poiTypes.has("restaurant") || poiTypes.has("cafe")) amenities.push("food")
    if (poiTypes.has("shopping") || poiTypes.has("retail")) amenities.push("shopping")

    return {
      id: item.ID,
      name: item.AddressInfo?.Title || "Unknown Station",
      address: [
        item.AddressInfo?.AddressLine1,
        item.AddressInfo?.Town,
        item.AddressInfo?.StateOrProvince,
        item.AddressInfo?.Postcode,
      ]
        .filter(Boolean)
        .join(", "),
      distanceKm: item.AddressInfo?.Distance,
      distance: item.AddressInfo?.Distance ? `${(item.AddressInfo.Distance).toFixed(1)} km` : undefined,
      availability: item.StatusType?.IsOperational ? "Available" : "Unknown",
      rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating since API doesn't provide this
      chargingSpeed: maxPower > 0 ? `${maxPower} kW` : "Unknown",
      pricePerKwh: item.UsageCost ? item.UsageCost : "Unknown",
      connectorTypes: [...new Set(connectorTypes)],
      amenities: [...new Set(amenities)],
      location: {
        lat: item.AddressInfo?.Latitude || 0,
        lng: item.AddressInfo?.Longitude || 0,
      },
    }
  })
}

// Fetch charging stations near a location
export async function fetchChargingStations(
  latitude: number,
  longitude: number,
  radius = 25, // radius in miles
  filters?: {
    connectorTypes?: Record<string, boolean>
    amenities?: Record<string, boolean>
    minPower?: number
  },
): Promise<ChargingStation[]> {
  try {
    if (!OPEN_CHARGE_MAP_API_KEY) {
      console.error("Open Charge Map API key is not configured")
      return []
    }

    // Convert radius from miles to kilometers
    const radiusKm = radius * 1.60934

    const url = new URL(`${OPEN_CHARGE_MAP_BASE_URL}/poi`)
    url.searchParams.append("key", OPEN_CHARGE_MAP_API_KEY)
    url.searchParams.append("latitude", latitude.toString())
    url.searchParams.append("longitude", longitude.toString())
    url.searchParams.append("distance", radiusKm.toString())
    url.searchParams.append("distanceunit", "km")
    url.searchParams.append("maxresults", "100")
    url.searchParams.append("compact", "true")
    url.searchParams.append("verbose", "false")

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch charging stations: ${response.statusText}`)
    }

    const data = await response.json()
    let stations = transformStationData(data)

    // Apply filters if provided
    if (filters) {
      if (filters.connectorTypes) {
        const enabledConnectors = Object.entries(filters.connectorTypes)
          .filter(([_, enabled]) => enabled)
          .map(([type]) => type)

        if (enabledConnectors.length > 0) {
          stations = stations.filter((station) =>
            station.connectorTypes.some((type) => enabledConnectors.includes(type)),
          )
        }
      }

      if (filters.amenities) {
        const requiredAmenities = Object.entries(filters.amenities)
          .filter(([_, required]) => required)
          .map(([type]) => type)

        if (requiredAmenities.length > 0) {
          stations = stations.filter((station) =>
            requiredAmenities.every((amenity) => station.amenities.includes(amenity)),
          )
        }
      }

      if (filters.minPower && filters.minPower > 0) {
        stations = stations.filter((station) => {
          const power = Number.parseInt(station.chargingSpeed?.replace(" kW", "") || "0")
          return !isNaN(power) && power >= filters.minPower
        })
      }
    }

    return stations
  } catch (error) {
    console.error("Error fetching charging stations:", error)
    return []
  }
}

// Google Maps API service
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`)
    }
    const data = await response.json()
    return data.results[0]?.geometry?.location || null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<any> {
  try {
    const response = await fetch(
      `/api/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`,
    )
    if (!response.ok) {
      throw new Error(`Directions request failed: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Directions error:", error)
    return null
  }
}
