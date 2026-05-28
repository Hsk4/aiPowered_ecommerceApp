import { NextResponse } from 'next/server'
import connectDB from '../../../lib/db'
import User from '../../../models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const clerkId = body?.clerkId
    const email = body?.email

    if (!clerkId || !email) {
      return NextResponse.json({ error: 'Missing Clerk user data' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        clerkId,
        email,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        imageUrl: body.imageUrl || '',
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({ user })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to sync user'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
