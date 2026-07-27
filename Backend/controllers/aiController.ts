// Backend/controllers/aiController.ts
import { Request, Response } from "express";
import { askAI } from "../services/aiService";
import { buildEmployeeContext } from "../services/aiContext";
import ChatHistory from "../models/ChatHistory";

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // ✅ fixed — was req.user?.id
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { message } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ success: false, message: "Message is required" });
      return;
    }

    const context = await buildEmployeeContext(userId);

    const chatDoc = await ChatHistory.findOne({ employeeId: userId });
    const history = chatDoc?.messages?.slice(-10) ?? [];

    const reply = await askAI(message, context, history);

    await ChatHistory.findOneAndUpdate(
      { employeeId: userId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: message },
              { role: "assistant", content: reply },
            ],
          },
        },
      },
      { upsert: true },
    );

    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ success: false, message: "AI service failed" });
  }
};
