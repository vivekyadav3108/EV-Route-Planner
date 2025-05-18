"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Route, Battery, Clock, Zap, ChevronDown, ChevronUp } from "lucide-react"

export default function RouteDetails({ routeData }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Route className="mr-2 h-5 w-5 text-green-600" />
          Route Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="font-medium">{routeData.distance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{routeData.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Charging Stops</p>
              <p className="font-medium">{routeData.chargingStops}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Charging Time</p>
              <p className="font-medium">{routeData.chargingTime}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <Battery className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-sm font-medium">Battery Level</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Start: {routeData.batteryStart}%
              </Badge>
              <span className="text-gray-400">→</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                End: {routeData.batteryEnd}%
              </Badge>
            </div>
          </div>

          {expanded && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium mb-3">Route Segments</h4>
              <div className="space-y-4">
                {routeData.segments.map((segment, index) => (
                  <div key={index} className="relative pl-6 pb-4">
                    {index < routeData.segments.length - 1 && (
                      <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">{index + 1}</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {segment.from} → {segment.to}
                          </p>
                          <p className="text-sm text-gray-500">
                            {segment.distance} • {segment.duration}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          -{segment.batteryUsage}%
                        </Badge>
                      </div>

                      {segment.chargingStation && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-green-600 mr-1" />
                            <p className="text-sm font-medium text-green-700">{segment.chargingStation}</p>
                          </div>
                          <div className="flex justify-between mt-1 text-sm text-green-600">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{segment.chargingTime}</span>
                            </div>
                            <div className="flex items-center">
                              <Battery className="h-3 w-3 mr-1" />
                              <span>+{segment.chargingAmount}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                View Details
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
