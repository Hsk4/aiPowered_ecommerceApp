import { NextResponse } from 'next/server'
import connectDB from '../../../lib/db'
import Cart from '../../../models/Cart'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const clerkId = body?.clerkId
    const items = body?.items

    if (!clerkId || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing cart data' }, { status: 400 })
    }

    await connectDB()

    const cart = await Cart.findOneAndUpdate(
      { clerkId },
      { clerkId, items },
      { upsert: true, new: true }
    )

    return NextResponse.json({ cart })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to sync cart'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
