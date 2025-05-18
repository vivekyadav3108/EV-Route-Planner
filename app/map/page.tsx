"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, MapPin, LocateFixed, Zap, Route, AlertCircle } from "lucide-react"
import GoogleMapComponent from "@/components/map/google-map-component"
import RouteDetails from "@/components/route-details"
import { useMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VehicleSelector } from "@/components/vehicle-selector"
import { VehicleDetails } from "@/components/vehicle-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRangeEstimate } from "@/data/india-ev-models"

export default function MapPage() {
  const [startLocation, setStartLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [batteryLevel, setBatteryLevel] = useState(80)
  const [vehicleModel, setVehicleModel] = useState("tata-nexon-ev-max") // Default to a popular Indian EV
  const [showRouteDetails, setShowRouteDetails] = useState(false)
  const [showStations, setShowStations] = useState(false)
  const [apiKeyAvailable, setApiKeyAvailable] = useState(true)
  const [activeTab, setActiveTab] = useState("route")
  const isMobile = useMobile()

  // Check if the API key is available
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setApiKeyAvailable(false)
    }
  }, [])

  // Get range estimate based on selected vehicle and battery level
  const rangeEstimate = getRangeEstimate(vehicleModel, batteryLevel)

  // Mock route data
  const routeData = {
    distance: "382 miles",
    duration: "6h 45min",
    batteryStart: batteryLevel,
    batteryEnd: 15,
    chargingStops: 2,
    chargingTime: "45 min",
    totalTime: "7h 30min",
    segments: [
      {
        from: "Mumbai, Maharashtra",
        to: "Pune, Maharashtra",
        distance: "95 miles",
        duration: "2h 10min",
        batteryUsage: 25,
      },
      {
        from: "Pune, Maharashtra",
        to: "Satara, Maharashtra",
        distance: "68 miles",
        duration: "1h 30min",
        batteryUsage: 18,
        chargingStation: "Tata Power Charging Station - Pune",
        chargingTime: "20 min",
        chargingAmount: 45,
      },
      {
        from: "Satara, Maharashtra",
        to: "Kolhapur, Maharashtra",
        distance: "76 miles",
        duration: "1h 45min",
        batteryUsage: 20,
      },
      {
        from: "Kolhapur, Maharashtra",
        to: "Belgaum, Karnataka",
        distance: "143 miles",
        duration: "3h 20min",
        batteryUsage: 37,
        chargingStation: "IOCL EV Charging - Kolhapur",
        chargingTime: "25 min",
        chargingAmount: 60,
      },
    ],
  }

  const handlePlanRoute = () => {
    if (startLocation && destination) {
      setShowRouteDetails(true)
      setShowStations(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!apiKeyAvailable && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment
            variables.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white p-4 overflow-y-auto border-r border-gray-200 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="route">Plan Route</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            </TabsList>

            <TabsContent value="route">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Route className="mr-2 h-5 w-5 text-green-600" />
                    Plan Your Route
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Start Location</label>
                      <div className="relative">
                        <Input
                          placeholder="Enter start location"
                          value={startLocation}
                          onChange={(e) => setStartLocation(e.target.value)}
                          className="pl-10"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Destination</label>
                      <div className="relative">
                        <Input
                          placeholder="Enter destination"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="pl-10"
                        />
                        <LocateFixed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Vehicle Model</label>
                      <VehicleSelector value={vehicleModel} onChange={setVehicleModel} />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium">Current Battery Level</label>
                        <span className="text-sm font-medium flex items-center">
                          <Battery className="mr-1 h-4 w-4 text-green-600" />
                          {batteryLevel}%
                        </span>
                      </div>
                      <Slider
                        value={[batteryLevel]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setBatteryLevel(value[0])}
                        className="my-2"
                      />
                      <div className="text-sm text-gray-500 text-center">Estimated Range: {rangeEstimate} miles</div>
                    </div>

                    <Button
                      onClick={handlePlanRoute}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!startLocation || !destination}
                    >
                      Plan Route
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showRouteDetails && (
                <div className="mt-4">
                  <RouteDetails routeData={routeData} />
                </div>
              )}

              {showStations && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-green-600" />
                      Charging Stations
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {/* Charging station cards will be populated dynamically */}
                    <div className="text-center py-4 text-gray-500">
                      Charging stations will appear here based on your route
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="vehicle">
              <VehicleDetails vehicleId={vehicleModel} batteryLevel={batteryLevel} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <GoogleMapComponent
            startLocation={startLocation}
            destination={destination}
            routeData={showRouteDetails ? routeData : null}
            batteryLevel={batteryLevel}
            vehicleModel={vehicleModel}
          />
        </div>
      </div>
    </div>
  )
}
