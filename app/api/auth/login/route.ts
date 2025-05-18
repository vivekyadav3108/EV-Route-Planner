import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extract login credentials
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In a real implementation, we would:
    // 1. Find user by email
    // 2. Verify password hash
    // 3. Generate JWT token

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock user data (in a real app, this would come from the database)
    // For demo purposes, accept any email/password combination
    const user = {
      id: `user_${Date.now()}`,
      name: email.split("@")[0],
      email,
      vehicleModel: "tesla-model-3",
      createdAt: new Date().toISOString(),
    }

    // Mock token
    const token = `mock_jwt_token_${user.id}`

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          vehicleModel: user.vehicleModel,
        },
        token,
      },
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}
