import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  clerkId?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
