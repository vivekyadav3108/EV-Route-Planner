"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MapFilterControls({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("connectors")
  const [connectorTypes, setConnectorTypes] = useState({
    ccs: true,
    chademo: true,
    tesla: true,
    j1772: true,
  })
  const [amenities, setAmenities] = useState({
    restrooms: false,
    food: false,
    shopping: false,
    wifi: false,
  })
  const [minPower, setMinPower] = useState(0)

  // Count active filters
  const activeFiltersCount =
    Object.values(connectorTypes).filter((v) => !v).length +
    Object.values(amenities).filter((v) => v).length +
    (minPower > 0 ? 1 : 0)

  const toggleConnector = (connector) => {
    const newConnectorTypes = {
      ...connectorTypes,
      [connector]: !connectorTypes[connector],
    }
    setConnectorTypes(newConnectorTypes)
    onFilterChange({ connectorTypes: newConnectorTypes, amenities, minPower })
  }

  const toggleAmenity = (amenity) => {
    const newAmenities = {
      ...amenities,
      [amenity]: !amenities[amenity],
    }
    setAmenities(newAmenities)
    onFilterChange({ connectorTypes, amenities: newAmenities, minPower })
  }

  const resetFilters = () => {
    const resetConnectorTypes = {
      ccs: true,
      chademo: true,
      tesla: true,
      j1772: true,
    }
    const resetAmenities = {
      restrooms: false,
      food: false,
      shopping: false,
      wifi: false,
    }
    setConnectorTypes(resetConnectorTypes)
    setAmenities(resetAmenities)
    setMinPower(0)
    onFilterChange({
      connectorTypes: resetConnectorTypes,
      amenities: resetAmenities,
      minPower: 0,
    })
  }

  return (
    <div className="absolute top-20 right-2 z-10">
      <Button
        variant="default"
        size="sm"
        className="bg-white text-gray-800 hover:bg-gray-100 shadow-md border border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter Stations
        {activeFiltersCount > 0 && <Badge className="ml-2 bg-green-600 text-white">{activeFiltersCount}</Badge>}
      </Button>

      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-72 shadow-lg">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-medium">Filter Stations</h3>
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs">
                  Reset
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 p-0 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="connectors">Connectors</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
              </TabsList>

              <TabsContent value="connectors" className="pt-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ccs" checked={connectorTypes.ccs} onCheckedChange={() => toggleConnector("ccs")} />
                    <Label htmlFor="ccs" className="text-sm">
                      CCS (Combined Charging System)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="chademo"
                      checked={connectorTypes.chademo}
                      onCheckedChange={() => toggleConnector("chademo")}
                    />
                    <Label htmlFor="chademo" className="text-sm">
                      CHAdeMO
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tesla"
                      checked={connectorTypes.tesla}
                      onCheckedChange={() => toggleConnector("tesla")}
                    />
                    <Label htmlFor="tesla" className="text-sm">
                      Tesla Supercharger
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="j1772"
                      checked={connectorTypes.j1772}
                      onCheckedChange={() => toggleConnector("j1772")}
                    />
                    <Label htmlFor="j1772" className="text-sm">
                      J1772
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="pt-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="map-restrooms"
                      checked={amenities.restrooms}
                      onCheckedChange={() => toggleAmenity("restrooms")}
                    />
                    <Label htmlFor="map-restrooms" className="text-sm">
                      Restrooms
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="map-food" checked={amenities.food} onCheckedChange={() => toggleAmenity("food")} />
                    <Label htmlFor="map-food" className="text-sm">
                      Food / Coffee
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="map-shopping"
                      checked={amenities.shopping}
                      onCheckedChange={() => toggleAmenity("shopping")}
                    />
                    <Label htmlFor="map-shopping" className="text-sm">
                      Shopping
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="map-wifi" checked={amenities.wifi} onCheckedChange={() => toggleAmenity("wifi")} />
                    <Label htmlFor="map-wifi" className="text-sm">
                      WiFi
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="sm" onClick={() => setIsOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
