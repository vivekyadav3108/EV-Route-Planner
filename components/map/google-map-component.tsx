"use client"

import { useState, useEffect, useCallback } from "react"
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api"
import ChargingStationDetails from "@/components/charging-station-details"
import BatteryRangeIndicator from "@/components/battery-range-indicator"
import MapFilterControls from "@/components/map/map-filter-controls"
import { fetchChargingStations, geocodeAddress, getDirections } from "@/lib/api-services"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import MapFallback from "@/components/map/map-fallback"

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco
}

const libraries = ["places", "geometry", "drawing"]

export default function GoogleMapComponent({
  startLocation = "",
  destination = "",
  routeData = null,
  userLocation = "",
  radius = 25,
  batteryLevel = 80,
  vehicleModel = "tesla-model-3",
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as any,
  })

  const [map, setMap] = useState(null)
  const [center, setCenter] = useState(defaultCenter)
  const [zoom, setZoom] = useState(10)
  const [startCoords, setStartCoords] = useState(null)
  const [destCoords, setDestCoords] = useState(null)
  const [directions, setDirections] = useState(null)
  const [chargingStations, setChargingStations] = useState([])
  const [filteredStations, setFilteredStations] = useState([])
  const [selectedStation, setSelectedStation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mapError, setMapError] = useState(null)
  const [filters, setFilters] = useState({
    connectorTypes: {
      ccs: true,
      chademo: true,
      tesla: true,
      j1772: true,
      type2: true,
    },
    amenities: {
      restrooms: false,
      food: false,
      shopping: false,
      wifi: false,
    },
    minPower: 0,
  })

  // Check for billing error
  useEffect(() => {
    if (loadError) {
      const errorMessage = loadError.message || ""
      if (
        errorMessage.includes("BillingNotEnabledMapError") ||
        errorMessage.includes("billing") ||
        errorMessage.includes("ApiNotActivatedMapError")
      ) {
        setMapError("BillingNotEnabledMapError: You must enable billing on your Google Cloud Project")
      } else {
        setMapError(errorMessage)
      }
    }
  }, [loadError])

  // Handle window errors for Google Maps
  useEffect(() => {
    const handleWindowError = (event) => {
      if (
        event.error &&
        (event.error.message.includes("Google Maps JavaScript API") || event.error.message.includes("billing"))
      ) {
        setMapError(event.error.message)
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleWindowError)

    return () => {
      window.removeEventListener("error", handleWindowError)
    }
  }, [])

  // Load charging stations when the map center changes
  const loadChargingStations = useCallback(async () => {
    if (!map) return

    setIsLoading(true)
    setError(null)
    try {
      const stations = await fetchChargingStations(center.lat, center.lng, radius, filters)
      setChargingStations(stations)
      setFilteredStations(stations)
    } catch (error) {
      console.error("Error loading charging stations:", error)
      setError("Failed to load charging stations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [center, radius, filters, map])

  // Apply filters when charging stations or filters change
  useEffect(() => {
    if (!chargingStations.length) {
      setFilteredStations([])
      return
    }

    const filtered = chargingStations.filter((station) => {
      // Filter by connector types
      const hasConnector = station.connectorTypes?.some((connector) => filters.connectorTypes[connector])
      if (!hasConnector) return false

      // Filter by amenities
      const hasRequiredAmenities = Object.entries(filters.amenities)
        .filter(([_, isRequired]) => isRequired)
        .every(([amenity, _]) => station.amenities?.includes(amenity))
      if (!hasRequiredAmenities) return false

      // Filter by power (if implemented)
      if (filters.minPower > 0) {
        const power = Number.parseInt(station.chargingSpeed?.replace(" kW", "") || "0")
        if (isNaN(power) || power < filters.minPower) return false
      }

      return true
    })

    setFilteredStations(filtered)
  }, [chargingStations, filters])

  // Load charging stations when the map is ready
  useEffect(() => {
    if (map) {
      loadChargingStations()
    }
  }, [map, loadChargingStations])

  // Geocode locations and get directions
  useEffect(() => {
    const loadLocations = async () => {
      if (!isLoaded || mapError) return

      setIsLoading(true)
      setError(null)

      try {
        // If we have both start and destination, get coordinates for both
        if (startLocation && destination) {
          const startResult = await geocodeAddress(startLocation)
          const destResult = await geocodeAddress(destination)

          if (startResult && destResult) {
            setStartCoords(startResult)
            setDestCoords(destResult)

            // Center the map between the two points
            setCenter({
              lat: (startResult.lat + destResult.lat) / 2,
              lng: (startResult.lng + destResult.lng) / 2,
            })
            setZoom(9)

            // Get directions
            const directionsResult = await getDirections(startResult, destResult)
            if (directionsResult && directionsResult.routes && directionsResult.routes.length > 0) {
              setDirections(directionsResult)
            }
          }
        }
        // If we only have user location, center on that
        else if (userLocation) {
          const coords = await geocodeAddress(userLocation)
          if (coords) {
            setCenter(coords)
            setZoom(12)
          }
        }
      } catch (error) {
        console.error("Error loading locations:", error)
        setError("Failed to load location data. Please check your addresses and try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadLocations()
  }, [isLoaded, startLocation, destination, userLocation, mapError])

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Get the user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCenter({ lat: latitude, lng: longitude })
          setZoom(13)
        },
        (error) => {
          console.error("Error getting user location:", error)
          setError("Failed to get your current location. Please check your browser permissions.")
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const onMapLoad = useCallback((map) => {
    setMap(map)
  }, [])

  // If there's a map error, show the fallback component
  if (mapError) {
    return <MapFallback error={mapError} />
  }

  if (loadError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading Google Maps: {loadError.message}. Please check your API key and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {/* Battery Range Indicator */}
        <BatteryRangeIndicator batteryLevel={batteryLevel} vehicleModel={vehicleModel} />

        {/* Filter Controls */}
        <MapFilterControls onFilterChange={handleFilterChange} />

        {/* User Location Button */}
        <button
          onClick={getUserLocation}
          className="absolute top-36 right-2 bg-white p-2 rounded-md shadow-md z-10 hover:bg-gray-100"
          aria-label="Find my location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="1" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        {/* Directions */}
        {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}

        {/* Start location marker */}
        {startCoords && (
          <Marker
            position={startCoords}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              `),
              scaledSize: { width: 32, height: 32 },
              anchor: { x: 16, y: 32 },
            }}
          />
        )}

        {/* Destination marker */}
        {destCoords && (
          <Marker
            position={destCoords}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              `),
              scaledSize: { width: 32, height: 32 },
              anchor: { x: 16, y: 32 },
            }}
          />
        )}

        {/* Charging station markers */}
        {filteredStations.map((station) => (
          <Marker
            key={station.id}
            position={{ lat: station.location.lat, lng: station.location.lng }}
            onClick={() => setSelectedStation(station)}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#10b981" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <path d="M13 10h-2V7h-2v3H7l5 5 5-5h-4z"></path>
                </svg>
              `),
              scaledSize: { width: 32, height: 32 },
              anchor: { x: 16, y: 32 },
            }}
          />
        ))}

        {/* Error message */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md shadow-md z-10 max-w-md">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}

        {/* Station count indicator */}
        {!isLoading && filteredStations.length > 0 && (
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md z-10 text-sm">
            {filteredStations.length} charging stations found
          </div>
        )}

        {/* Detailed panel for selected charging station */}
        {selectedStation && (
          <ChargingStationDetails station={selectedStation} onClose={() => setSelectedStation(null)} />
        )}
      </GoogleMap>
    </div>
  )
}
