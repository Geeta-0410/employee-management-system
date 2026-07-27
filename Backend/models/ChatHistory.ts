import mongoose, { Document, Schema } from "mongoose";

export interface IChatHistory extends Document {
  employeeId: mongoose.Types.ObjectId;
  messages: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }[];
}

const chatHistorySchema = new Schema<IChatHistory>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"] },
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<IChatHistory>("ChatHistory", chatHistorySchema);
