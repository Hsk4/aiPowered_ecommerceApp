import mongoose from 'mongoose'

export interface CartItem {
  product: mongoose.Types.ObjectId | string
  title: string
  price: number
  quantity: number
}

export interface CartDocument extends mongoose.Document {
  clerkId?: string
  user?: mongoose.Types.ObjectId | string
  items: CartItem[]
}

const cartItemSchema = new mongoose.Schema<CartItem>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema<CartDocument>(
  {
    clerkId: { type: String, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
)

const Cart = mongoose.models.Cart || mongoose.model<CartDocument>('Cart', cartSchema)

export default Cart
