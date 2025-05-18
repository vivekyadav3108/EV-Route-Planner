export async function GET() {
  // Now we can safely use the environment variable
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN

  if (!mapboxToken) {
    return Response.json({ error: "Mapbox token not configured" }, { status: 500 })
  }

  return Response.json({
    token: mapboxToken,
  })
}
