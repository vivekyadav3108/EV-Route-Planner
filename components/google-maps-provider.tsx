"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { LoadScript } from "@react-google-maps/api"

type GoogleMapsContextType = {
  isLoaded: boolean
  loadError: Error | undefined
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
})

const libraries = ["places", "geometry", "drawing"]

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | undefined>(undefined)

  // Get the API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries as any}
      onLoad={() => setIsLoaded(true)}
      onError={(error) => setLoadError(error as Error)}
      loadingElement={<div>Loading Google Maps...</div>}
    >
      <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>{children}</GoogleMapsContext.Provider>
    </LoadScript>
  )
}

export function useGoogleMaps() {
  return useContext(GoogleMapsContext)
}
