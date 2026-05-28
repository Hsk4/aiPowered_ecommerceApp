import mongoose from 'mongoose'

export interface UserDocument extends mongoose.Document {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
)

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)

export default User
