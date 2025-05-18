"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Zap, Timer, Gauge } from "lucide-react"
import { indianEVModels, getRangeEstimate } from "@/data/india-ev-models"

interface VehicleDetailsProps {
  vehicleId: string
  batteryLevel: number
}

export function VehicleDetails({ vehicleId, batteryLevel }: VehicleDetailsProps) {
  const vehicle = indianEVModels.find((v) => v.id === vehicleId)

  if (!vehicle) {
    return null
  }

  const rangeEstimate = getRangeEstimate(vehicleId, batteryLevel)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Zap className="mr-2 h-5 w-5 text-green-600" />
          Vehicle Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">
              {vehicle.brand} {vehicle.model} {vehicle.variant}
            </h3>
            <p className="text-sm text-gray-500">{vehicle.year} Model</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Battery Capacity</p>
              <div className="flex items-center mt-1">
                <Battery className="h-4 w-4 text-green-600 mr-1" />
                <p className="font-medium">{vehicle.batteryCapacity} kWh</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Range</p>
              <div className="flex items-center mt-1">
                <Gauge className="h-4 w-4 text-green-600 mr-1" />
                <p className="font-medium">
                  {vehicle.range} km ({Math.round(vehicle.range * 0.621371)} mi)
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Range</p>
              <div className="flex items-center mt-1">
                <Gauge className="h-4 w-4 text-green-600 mr-1" />
                <p className="font-medium">
                  {Math.round((vehicle.range * batteryLevel) / 100)} km ({rangeEstimate} mi)
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Efficiency</p>
              <div className="flex items-center mt-1">
                <Zap className="h-4 w-4 text-green-600 mr-1" />
                <p className="font-medium">{vehicle.efficiency} Wh/km</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h4 className="font-medium mb-2">Charging Information</h4>
            <div className="grid grid-cols-2 gap-4">
              {vehicle.fastChargeSpeed && (
                <div>
                  <p className="text-sm text-gray-500">Fast Charging</p>
                  <div className="flex items-center mt-1">
                    <Zap className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">{vehicle.fastChargeSpeed} kW</p>
                  </div>
                </div>
              )}
              {vehicle.fastChargeTime && (
                <div>
                  <p className="text-sm text-gray-500">Fast Charge Time (10-80%)</p>
                  <div className="flex items-center mt-1">
                    <Timer className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">{vehicle.fastChargeTime}</p>
                  </div>
                </div>
              )}
              {vehicle.acChargeSpeed && (
                <div>
                  <p className="text-sm text-gray-500">AC Charging</p>
                  <div className="flex items-center mt-1">
                    <Zap className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">{vehicle.acChargeSpeed} kW</p>
                  </div>
                </div>
              )}
              {vehicle.acChargeTime && (
                <div>
                  <p className="text-sm text-gray-500">AC Charge Time (0-100%)</p>
                  <div className="flex items-center mt-1">
                    <Timer className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">{vehicle.acChargeTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {vehicle.price && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">Price Range</p>
              <p className="font-medium">{vehicle.price}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
