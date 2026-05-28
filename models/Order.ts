import mongoose from 'mongoose'

export interface OrderItem {
  product: mongoose.Types.ObjectId | string
  title: string
  price: number
  quantity: number
}

export interface OrderDocument extends mongoose.Document {
  clerkId?: string
  items: OrderItem[]
  total: number
  status: string
  customer?: {
    name?: string
    email?: string
    address?: string
  }
}

const orderItemSchema = new mongoose.Schema<OrderItem>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    clerkId: { type: String, index: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    customer: {
      name: { type: String },
      email: { type: String },
      address: { type: String },
    },
  },
  { timestamps: true }
)

const Order = mongoose.models.Order || mongoose.model<OrderDocument>('Order', orderSchema)

export default Order
