"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, MapPin, LocateFixed, Zap, Route } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GoogleMapComponent from "@/components/map/google-map-component"
import RouteDetails from "@/components/route-details"
import { useMobile } from "@/hooks/use-mobile"

export default function MapPage() {
  const [startLocation, setStartLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [batteryLevel, setBatteryLevel] = useState(80)
  const [vehicleModel, setVehicleModel] = useState("tesla-model-3")
  const [showRouteDetails, setShowRouteDetails] = useState(false)
  const [showStations, setShowStations] = useState(false)
  const isMobile = useMobile()

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
        from: "San Francisco, CA",
        to: "Mountain View, CA",
        distance: "45 miles",
        duration: "50 min",
        batteryUsage: 15,
      },
      {
        from: "Mountain View, CA",
        to: "Palo Alto, CA",
        distance: "33 miles",
        duration: "40 min",
        batteryUsage: 12,
        chargingStation: "SuperCharger - Mountain View",
        chargingTime: "20 min",
        chargingAmount: 45,
      },
      {
        from: "Palo Alto, CA",
        to: "San Jose, CA",
        distance: "34 miles",
        duration: "45 min",
        batteryUsage: 14,
      },
      {
        from: "San Jose, CA",
        to: "Los Angeles, CA",
        distance: "270 miles",
        duration: "4h 30min",
        batteryUsage: 84,
        chargingStation: "ChargePoint - San Jose",
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
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white p-4 overflow-y-auto border-r border-gray-200 flex flex-col">
          <Card className="mb-4">
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
                  <Select value={vehicleModel} onValueChange={setVehicleModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tesla-model-3">Tesla Model 3</SelectItem>
                      <SelectItem value="tesla-model-y">Tesla Model Y</SelectItem>
                      <SelectItem value="chevy-bolt">Chevy Bolt</SelectItem>
                      <SelectItem value="nissan-leaf">Nissan Leaf</SelectItem>
                      <SelectItem value="ford-mach-e">Ford Mustang Mach-E</SelectItem>
                    </SelectContent>
                  </Select>
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

          {showRouteDetails && <RouteDetails routeData={routeData} />}

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
