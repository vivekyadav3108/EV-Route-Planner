import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extract user data
    const { name, email, password, vehicleModel } = body

    // Validate required fields
    if (!name || !email || !password || !vehicleModel) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // In a real implementation, we would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store user in database
    // 4. Generate JWT token

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user creation
    const user = {
      id: `user_${Date.now()}`,
      name,
      email,
      vehicleModel,
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
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
