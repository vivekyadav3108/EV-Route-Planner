"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Zap, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ChargingStationCard from "@/components/charging-station-card"
import GoogleMapComponent from "@/components/map/google-map-component"
import { fetchChargingStations, geocodeAddress, type ChargingStation } from "@/lib/api-services"
import { StatusIndicator } from "@/components/status-indicator"

export default function StationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [radius, setRadius] = useState(25)
  const [sortBy, setSortBy] = useState("distance")
  const [connectorTypes, setConnectorTypes] = useState({
    ccs: true,
    chademo: true,
    tesla: true,
    j1772: true,
    type2: true,
  })
  const [minPower, setMinPower] = useState(50)
  const [amenities, setAmenities] = useState({
    restrooms: false,
    food: false,
    shopping: false,
    wifi: false,
  })
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([])
  const [filteredStations, setFilteredStations] = useState<ChargingStation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lng: -122.4194 }) // Default to San Francisco
  const [hasSearched, setHasSearched] = useState(false)

  // Apply filters when charging stations or filters change
  useEffect(() => {
    if (!chargingStations.length) {
      setFilteredStations([])
      return
    }

    let filtered = [...chargingStations]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (station) => station.name.toLowerCase().includes(query) || station.address.toLowerCase().includes(query),
      )
    }

    // Apply connector types filter
    const enabledConnectors = Object.entries(connectorTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type)

    if (enabledConnectors.length > 0) {
      filtered = filtered.filter((station) => station.connectorTypes.some((type) => enabledConnectors.includes(type)))
    }

    // Apply amenities filter
    const requiredAmenities = Object.entries(amenities)
      .filter(([_, required]) => required)
      .map(([type]) => type)

    if (requiredAmenities.length > 0) {
      filtered = filtered.filter((station) => requiredAmenities.every((amenity) => station.amenities.includes(amenity)))
    }

    // Apply power filter
    if (minPower > 0) {
      filtered = filtered.filter((station) => {
        const power = Number.parseInt(station.chargingSpeed?.replace(" kW", "") || "0")
        return !isNaN(power) && power >= minPower
      })
    }

    // Apply sorting
    if (sortBy === "distance" && filtered.length > 0) {
      filtered.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    } else if (sortBy === "rating" && filtered.length > 0) {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    setFilteredStations(filtered)
  }, [chargingStations, searchQuery, connectorTypes, amenities, minPower, sortBy])

  const toggleAmenity = (amenity) => {
    setAmenities({
      ...amenities,
      [amenity]: !amenities[amenity],
    })
  }

  const toggleConnector = (connector) => {
    setConnectorTypes({
      ...connectorTypes,
      [connector]: !connectorTypes[connector],
    })
  }

  const handleSearch = async () => {
    if (!location) {
      setError("Please enter a location to search for charging stations")
      return
    }

    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const coords = await geocodeAddress(location)
      if (coords) {
        setCoordinates(coords)
        const stations = await fetchChargingStations(coords.lat, coords.lng, radius, {
          connectorTypes,
          amenities,
          minPower,
        })
        setChargingStations(stations)
        setFilteredStations(stations)

        if (stations.length === 0) {
          setError("No charging stations found in this area. Try increasing the search radius or changing filters.")
        }
      } else {
        setError("Could not find the location. Please check the address and try again.")
      }
    } catch (error) {
      console.error("Error searching stations:", error)
      setError("An error occurred while searching for charging stations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white p-4 overflow-y-auto border-r border-gray-200 flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Zap className="mr-2 h-6 w-6 text-green-600" />
              Charging Stations
            </h2>
            <div className="relative mb-4">
              <Input
                placeholder="Search stations by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative mb-4">
              <Input
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Button
                className="absolute right-0 top-0 h-full rounded-l-none bg-green-600 hover:bg-green-700"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
            <div className="flex justify-between mb-4">
              <Button variant="outline" className="flex items-center" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showFilters && (
              <Card className="mb-4">
                <CardContent className="pt-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="distance">
                      <AccordionTrigger className="py-2">Search Radius</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Distance</span>
                            <span className="text-sm font-medium">{radius} miles</span>
                          </div>
                          <Slider
                            value={[radius]}
                            min={5}
                            max={100}
                            step={5}
                            onValueChange={(value) => setRadius(value[0])}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="connectors">
                      <AccordionTrigger className="py-2">Connector Types</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="ccs"
                              checked={connectorTypes.ccs}
                              onCheckedChange={() => toggleConnector("ccs")}
                            />
                            <Label htmlFor="ccs">CCS (Combined Charging System)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="chademo"
                              checked={connectorTypes.chademo}
                              onCheckedChange={() => toggleConnector("chademo")}
                            />
                            <Label htmlFor="chademo">CHAdeMO</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="tesla"
                              checked={connectorTypes.tesla}
                              onCheckedChange={() => toggleConnector("tesla")}
                            />
                            <Label htmlFor="tesla">Tesla Supercharger</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="j1772"
                              checked={connectorTypes.j1772}
                              onCheckedChange={() => toggleConnector("j1772")}
                            />
                            <Label htmlFor="j1772">J1772</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="type2"
                              checked={connectorTypes.type2}
                              onCheckedChange={() => toggleConnector("type2")}
                            />
                            <Label htmlFor="type2">Type 2</Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="power">
                      <AccordionTrigger className="py-2">Charging Power</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Minimum Power</span>
                            <span className="text-sm font-medium">{minPower} kW</span>
                          </div>
                          <Slider
                            value={[minPower]}
                            min={0}
                            max={350}
                            step={10}
                            onValueChange={(value) => setMinPower(value[0])}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="amenities">
                      <AccordionTrigger className="py-2">Amenities</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="restrooms"
                              checked={amenities.restrooms}
                              onCheckedChange={() => toggleAmenity("restrooms")}
                            />
                            <Label htmlFor="restrooms">Restrooms</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="food"
                              checked={amenities.food}
                              onCheckedChange={() => toggleAmenity("food")}
                            />
                            <Label htmlFor="food">Food / Coffee</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="shopping"
                              checked={amenities.shopping}
                              onCheckedChange={() => toggleAmenity("shopping")}
                            />
                            <Label htmlFor="shopping">Shopping</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="wifi"
                              checked={amenities.wifi}
                              onCheckedChange={() => toggleAmenity("wifi")}
                            />
                            <Label htmlFor="wifi">WiFi</Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <StatusIndicator status="loading" message="Searching for charging stations..." />
              </div>
            ) : error ? (
              <div className="py-4">
                <StatusIndicator status="error" message={error} />
              </div>
            ) : filteredStations.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-500 mb-2">Found {filteredStations.length} charging stations</div>
                {filteredStations.map((station) => (
                  <ChargingStationCard key={station.id} station={station} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {hasSearched
                  ? "No charging stations found. Try adjusting your filters or location."
                  : "Enter a location to find charging stations."}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <GoogleMapComponent userLocation={location} radius={radius} />
        </div>
      </div>
    </div>
  )
}
