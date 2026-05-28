import connectDB from '../../../lib/db'
import Order from '../../../models/Order'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body || !Array.isArray(body.items) || typeof body.total !== 'number') {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    await connectDB()

    const order = await Order.create({
      clerkId: body.clerkId || '',
      items: body.items,
      total: body.total,
      customer: body.customer || {},
    })

    return NextResponse.json({ order })
  } catch (err: unknown) {
    console.error('Failed to create order', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message || 'Server error' }, { status: 500 })
  }
}
