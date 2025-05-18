"use client"

import { Battery, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getRangeEstimate } from "@/data/india-ev-models"

export default function BatteryRangeIndicator({ batteryLevel, vehicleModel }) {
  // Get range estimate based on selected vehicle and battery level
  const currentRange = getRangeEstimate(vehicleModel, batteryLevel)

  // Determine battery color based on level
  const getBatteryColor = () => {
    if (batteryLevel > 50) return "text-green-600"
    if (batteryLevel > 20) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="absolute top-4 left-4 z-10 w-64">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Battery className={`h-5 w-5 mr-2 ${getBatteryColor()}`} />
            <span className="font-medium">Battery Status</span>
          </div>
          <span className={`font-bold ${getBatteryColor()}`}>{batteryLevel}%</span>
        </div>
        <Progress value={batteryLevel} className="h-2 mb-2" />
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-green-600 mr-1" />
            <span>Estimated Range</span>
          </div>
          <span className="font-medium">{currentRange} miles</span>
        </div>
      </CardContent>
    </Card>
  )
}
