"use client"

import { useEffect, useState } from "react"
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl"
import { Zap, MapPin } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapbox } from "@/components/mapbox-provider"
import ChargingStationDetails from "@/components/charging-station-details"
import BatteryRangeIndicator from "@/components/battery-range-indicator"
import MapFilterControls from "@/components/map/map-filter-controls"

export default function MapComponent({
  startLocation = "",
  destination = "",
  chargingStations = [],
  routeData = null,
  userLocation = "",
  radius = 25,
  batteryLevel = 80,
  vehicleModel = "tesla-model-3",
}) {
  const [viewState, setViewState] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 10,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [routeGeoJson, setRouteGeoJson] = useState(null)
  const [selectedStation, setSelectedStation] = useState(null)
  const [startCoords, setStartCoords] = useState(null)
  const [destCoords, setDestCoords] = useState(null)
  const [filteredStations, setFilteredStations] = useState(chargingStations)
  const [filters, setFilters] = useState({
    connectorTypes: {
      ccs: true,
      chademo: true,
      tesla: true,
      j1772: true,
    },
    amenities: {
      restrooms: false,
      food: false,
      shopping: false,
      wifi: false,
    },
    minPower: 0,
  })
  const { mapboxToken } = useMapbox()

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
      // This would require the station data to include a numeric power value
      // const power = parseInt(station.chargingSpeed);
      // if (!isNaN(power) && power < filters.minPower) return false;

      return true
    })

    setFilteredStations(filtered)
  }, [chargingStations, filters])

  // Geocode locations to get coordinates
  useEffect(() => {
    if (!mapboxToken) return

    const geocodeLocation = async (location, setter) => {
      if (!location) return

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location,
          )}.json?access_token=${mapboxToken}&limit=1`,
        )
        const data = await response.json()

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center
          setter({ longitude: lng, latitude: lat })
          return { longitude: lng, latitude: lat }
        }
      } catch (error) {
        console.error("Geocoding error:", error)
      }
      return null
    }

    const loadLocations = async () => {
      setIsLoading(true)

      // If we have both start and destination, get coordinates for both
      if (startLocation && destination) {
        const start = await geocodeLocation(startLocation, setStartCoords)
        const dest = await geocodeLocation(destination, setDestCoords)

        if (start && dest) {
          // Center the map between the two points
          setViewState({
            longitude: (start.longitude + dest.longitude) / 2,
            latitude: (start.latitude + dest.latitude) / 2,
            zoom: 8,
          })

          // Get the route between the two points
          await getRoute(start, dest)
        }
      }
      // If we only have user location, center on that
      else if (userLocation) {
        const coords = await geocodeLocation(userLocation, () => {})
        if (coords) {
          setViewState({
            longitude: coords.longitude,
            latitude: coords.latitude,
            zoom: 11,
          })
        }
      }

      setIsLoading(false)
    }

    loadLocations()
  }, [startLocation, destination, userLocation, mapboxToken])

  // Get route between two points
  const getRoute = async (start, end) => {
    if (!mapboxToken) return
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${mapboxToken}`,
      )
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        // Create GeoJSON for the route
        const route = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: data.routes[0].geometry.coordinates,
          },
        }

        setRouteGeoJson({
          type: "FeatureCollection",
          features: [route],
        })
      }
    } catch (error) {
      console.error("Routing error:", error)
    }
  }

  // Generate coordinates for charging stations
  const getStationCoordinates = (station, index) => {
    if (station.location && station.location.lat && station.location.lng) {
      return {
        longitude: station.location.lng,
        latitude: station.location.lat,
      }
    }

    // If we have a route, place stations along the route
    if (routeGeoJson && routeGeoJson.features[0].geometry.coordinates.length > 0) {
      const coordinates = routeGeoJson.features[0].geometry.coordinates
      const position = Math.floor((coordinates.length / (filteredStations.length + 1)) * (index + 1))
      return {
        longitude: coordinates[position][0],
        latitude: coordinates[position][1],
      }
    }

    // Fallback to random positions around the center of the map
    return {
      longitude: viewState.longitude + (Math.random() - 0.5) * 0.2,
      latitude: viewState.latitude + (Math.random() - 0.5) * 0.1,
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Get the user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          setViewState({
            longitude,
            latitude,
            zoom: 13,
          })
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  if (isLoading || !mapboxToken) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={mapboxToken}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Battery Range Indicator */}
      <BatteryRangeIndicator batteryLevel={batteryLevel} vehicleModel={vehicleModel} />

      {/* Map Controls */}
      <NavigationControl position="top-right" />

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

      {/* Route line */}
      {routeGeoJson && (
        <Source id="route" type="geojson" data={routeGeoJson}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": "#10b981",
              "line-width": 4,
              "line-opacity": 0.8,
            }}
          />
        </Source>
      )}

      {/* Start location marker */}
      {startCoords && (
        <Marker longitude={startCoords.longitude} latitude={startCoords.latitude} anchor="bottom">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
        </Marker>
      )}

      {/* Destination marker */}
      {destCoords && (
        <Marker longitude={destCoords.longitude} latitude={destCoords.latitude} anchor="bottom">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
        </Marker>
      )}

      {/* Charging station markers */}
      {filteredStations.map((station, index) => {
        const coords = getStationCoordinates(station, index)
        return (
          <Marker
            key={station.id}
            longitude={coords.longitude}
            latitude={coords.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setSelectedStation(station)
            }}
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-500 transition-colors">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </Marker>
        )
      })}

      {/* Detailed panel for selected charging station */}
      {selectedStation && <ChargingStationDetails station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </Map>
  )
}
