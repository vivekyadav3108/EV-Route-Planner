"use client"

import { useEffect, useState } from "react"
import Map, { Marker, Source, Layer, NavigationControl, Popup } from "react-map-gl"
import { Zap, MapPin } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"

// You'll need to get a Mapbox access token from https://account.mapbox.com/
// In a real app, this would be an environment variable
const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN"

export default function MapComponent({
  startLocation = "",
  destination = "",
  chargingStations = [],
  routeData = null,
  userLocation = "",
  radius = 25,
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

  // Geocode locations to get coordinates
  useEffect(() => {
    const geocodeLocation = async (location, setter) => {
      if (!location) return

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location,
          )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`,
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
  }, [startLocation, destination, userLocation])

  // Get route between two points
  const getRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
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

  // Generate mock coordinates for charging stations if they don't have real ones
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
      const position = Math.floor((coordinates.length / (chargingStations.length + 1)) * (index + 1))
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

  if (isLoading) {
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
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" />

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
      {chargingStations.map((station, index) => {
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

      {/* Popup for selected charging station */}
      {selectedStation && (
        <Popup
          longitude={getStationCoordinates(selectedStation, chargingStations.indexOf(selectedStation)).longitude}
          latitude={getStationCoordinates(selectedStation, chargingStations.indexOf(selectedStation)).latitude}
          anchor="top"
          onClose={() => setSelectedStation(null)}
          closeButton={true}
          closeOnClick={false}
          className="z-10"
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-sm">{selectedStation.name}</h3>
            <p className="text-xs text-gray-600 mb-2">{selectedStation.address}</p>
            <div className="flex items-center text-xs mb-1">
              <Zap className="h-3 w-3 text-green-600 mr-1" />
              <span>{selectedStation.chargingSpeed}</span>
              <span className="mx-2">•</span>
              <span>{selectedStation.availability}</span>
            </div>
            <div className="mt-2 flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                Details
              </Button>
              <Button size="sm" className="text-xs h-7 px-2 bg-green-600 hover:bg-green-700">
                Navigate
              </Button>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  )
}
