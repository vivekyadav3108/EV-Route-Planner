import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extract review data
    const { stationId, rating, comment, waitTime } = body

    // Validate required fields
    if (!stationId || !rating) {
      return NextResponse.json({ error: "Station ID and rating are required" }, { status: 400 })
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // In a real implementation, we would:
    // 1. Verify user authentication
    // 2. Store review in database
    // 3. Update station average rating

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock review creation
    const review = {
      id: `review_${Date.now()}`,
      stationId,
      userId: "current_user_id", // In a real app, this would come from the authenticated user
      rating,
      comment: comment || "",
      waitTime: waitTime || null,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: review,
    })
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get station ID
  const stationId = searchParams.get("stationId")

  if (!stationId) {
    return NextResponse.json({ error: "Station ID is required" }, { status: 400 })
  }

  // In a real implementation, we would fetch reviews from the database

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock reviews data
  const reviews = [
    {
      id: "review_1",
      stationId,
      userId: "user123",
      userName: "John D.",
      rating: 5,
      comment: "Great charging station! Fast charging and clean facilities.",
      waitTime: "5 min",
      createdAt: "2023-05-15T14:30:00Z",
    },
    {
      id: "review_2",
      stationId,
      userId: "user456",
      userName: "Sarah M.",
      rating: 4,
      comment: "Good location but can get busy during peak hours.",
      waitTime: "15 min",
      createdAt: "2023-04-22T09:15:00Z",
    },
    {
      id: "review_3",
      stationId,
      userId: "user789",
      userName: "Michael T.",
      rating: 3,
      comment: "Chargers are reliable but the area could use better lighting at night.",
      waitTime: "10 min",
      createdAt: "2023-03-10T18:45:00Z",
    },
  ]

  return NextResponse.json({
    success: true,
    data: reviews,
    meta: {
      total: reviews.length,
      averageRating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    },
  })
}
