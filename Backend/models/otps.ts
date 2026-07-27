import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  name: string;
  email: string;
  password: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOtp>(
  "Otp",
  otpSchema
);