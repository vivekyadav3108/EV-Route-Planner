"use client"

import { createContext, useContext, useEffect, useState } from "react"

const MapboxContext = createContext(null)

export function MapboxProvider({ children }) {
  const [mapboxToken, setMapboxToken] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/mapbox-token")
        const data = await response.json()
        setMapboxToken(data.token)
      } catch (error) {
        console.error("Failed to fetch Mapbox token:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  return <MapboxContext.Provider value={{ mapboxToken, isLoading }}>{children}</MapboxContext.Provider>
}

export function useMapbox() {
  const context = useContext(MapboxContext)
  if (context === undefined) {
    throw new Error("useMapbox must be used within a MapboxProvider")
  }
  return context
}
