"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, MapPin, Star, Clock, DollarSign, X, ThumbsUp, ThumbsDown, MessageSquare, User } from "lucide-react"

export default function ChargingStationDetails({ station, onClose }) {
  const [activeTab, setActiveTab] = useState("info")

  // Map connector types to display names
  const connectorLabels = {
    ccs: "CCS",
    chademo: "CHAdeMO",
    tesla: "Tesla",
    j1772: "J1772",
  }

  // Map amenities to display names
  const amenityLabels = {
    restrooms: "Restrooms",
    food: "Food/Coffee",
    shopping: "Shopping",
    wifi: "WiFi",
  }

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Great charging station! Fast charging and clean facilities.",
      waitTime: "5 min",
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      date: "1 month ago",
      comment: "Good location but can get busy during peak hours.",
      waitTime: "15 min",
    },
    {
      id: 3,
      user: "Michael T.",
      rating: 3,
      date: "2 months ago",
      comment: "Chargers are reliable but the area could use better lighting at night.",
      waitTime: "10 min",
    },
  ]

  return (
    <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-10 max-h-[80vh] overflow-auto">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">{station.name}</CardTitle>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{station.address}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{station.rating}</span>
                  <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {station.availability}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Charging Speed</p>
                  <div className="flex items-center mt-1">
                    <Zap className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">{station.chargingSpeed}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">{station.pricePerKwh}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">{station.distance}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wait Time</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-green-600 mr-1" />
                    <p className="font-medium">~5-10 min</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Connector Types</p>
                <div className="flex flex-wrap gap-2">
                  {station.connectorTypes?.map((connector, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {connectorLabels[connector] || connector}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {station.amenities?.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {amenityLabels[amenity] || amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Directions
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Reserve
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{station.rating}</span>
                  <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-full p-1 mr-2">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.user}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{review.comment}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Wait time: {review.waitTime}</span>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </button>
                      <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Not helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="photos" className="pt-4">
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=200&width=200&text=Station+Photo+${i}`}
                    alt={`Charging station photo ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Photos
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
