"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, MapPin, Star, DollarSign, ChevronDown, ChevronUp, Navigation } from "lucide-react"
import type { ChargingStation } from "@/lib/api-services"

export default function ChargingStationCard({ station }: { station: ChargingStation }) {
  const [expanded, setExpanded] = useState(false)

  // Map connector types to display names
  const connectorLabels = {
    ccs: "CCS",
    chademo: "CHAdeMO",
    tesla: "Tesla",
    j1772: "J1772",
    type2: "Type 2",
  }

  // Map amenities to display names
  const amenityLabels = {
    restrooms: "Restrooms",
    food: "Food/Coffee",
    shopping: "Shopping",
    wifi: "WiFi",
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{station.name}</h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{station.address}</span>
            </div>
          </div>
          {station.availability && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {station.availability}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          {station.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-medium">{station.rating}</span>
            </div>
          )}
          {station.distance && <div className="text-sm text-gray-500">{station.distance}</div>}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {station.chargingSpeed && (
            <div className="flex items-center text-sm">
              <Zap className="h-4 w-4 text-green-600 mr-1" />
              <span>{station.chargingSpeed}</span>
            </div>
          )}
          {station.pricePerKwh && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 text-green-600 mr-1" />
              <span>{station.pricePerKwh}</span>
            </div>
          )}
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {station.connectorTypes && station.connectorTypes.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Connector Types</h4>
                <div className="flex flex-wrap gap-2">
                  {station.connectorTypes.map((connector, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {connectorLabels[connector] || connector}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {station.amenities && station.amenities.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {station.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {amenityLabels[amenity] || amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2 mt-4">
              <Button variant="outline" className="flex-1 h-9">
                <Navigation className="h-4 w-4 mr-2" />
                Navigate
              </Button>
              <Button className="flex-1 h-9 bg-green-600 hover:bg-green-700">
                <Zap className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
