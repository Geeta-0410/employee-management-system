import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<ICounter>("Counter", counterSchema);
