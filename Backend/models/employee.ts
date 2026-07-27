import { randomUUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  employeeId: number;
  userId: mongoose.Types.ObjectId;
  // userId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  salary: number;
  skills: { _id?: mongoose.Types.ObjectId; name: string; level: number }[];
  attendance: { month: string; daysPresent: number }[];
  experience?: number;
  company: string;
  profileImage: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  role: "employee";
  password: string;
  isFirstLogin: boolean;
  isEmailVerified: boolean;
  designation?: string;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },

    phone: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
        },

        level: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
    attendance: [
      {
        month: String,
        daysPresent: Number,
      },
    ],
    experience: {
      type: Number,
      required: false,
      min: 0,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee"],
      default: "employee",
    },
    password: {
      type: String,
      required: true,
    },

    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    designation: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
employeeSchema.index(
  {
    userId: 1,
    email: 1,
  },
  {
    unique: true,
  },
);
export default mongoose.model<IEmployee>("Employee", employeeSchema);
