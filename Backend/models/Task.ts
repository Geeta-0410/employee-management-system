import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  priority: string;
  status: string;
  dueDate: string;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["High", "Normal", "Low"],
      default: "Normal",
    },

    status: {
      type: String,
      enum: ["In Progress", "To Do", "Completed"],
      default: "To Do",
    },

    dueDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITask>("Task", taskSchema);
