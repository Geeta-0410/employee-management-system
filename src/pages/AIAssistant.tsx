import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { sendChatMessage } from "../services/aiService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await sendChatMessage(input);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-slate-600 shadow px-6 py-4">
        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
      </header>

      <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto">
        {/* Scrollable Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {m.content}
            </div>
          ))}

          {loading && <div className="text-gray-400 text-sm">Thinking...</div>}

          <div ref={bottomRef} />
        </div>

        {/* Fixed Input Area */}
        <div className=" bg-white p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your attendance, tasks, skills..."
              className="flex-1 border rounded-lg px-3 py-2"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
