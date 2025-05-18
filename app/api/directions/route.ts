import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")

  if (!origin || !destination) {
    return NextResponse.json({ error: "Origin and destination parameters are required" }, { status: 400 })
  }

  // Use the environment variable for the API key
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`Directions API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status === "REQUEST_DENIED") {
      console.error("Directions API request denied:", data.error_message)
      return NextResponse.json({ error: data.error_message || "Directions request denied" }, { status: 403 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Directions error:", error)
    return NextResponse.json({ error: "Failed to get directions" }, { status: 500 })
  }
}
