// Backend/services/aiService.ts

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  throw new Error("MISTRAL_API_KEY is not set");
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface MistralResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

export const askAI = async (
  userMessage: string,
  contextData: Record<string, any>,
  history: ChatMessage[] = [],
): Promise<string> => {
  try {
    const systemPrompt = `
You are an internal HR assistant for an employee management system.

Answer ONLY using the employee data provided below.
Be concise and friendly.

If asked something not covered by the data, say:
"I don't have that information."

Employee Data:
${JSON.stringify(contextData, null, 2)}
`;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...history.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();

      console.error("=== MISTRAL ERROR ===");
      console.error("Status:", response.status);
      console.error("Body:", errText);

      return `Mistral API Error (${response.status})`;
    }

    const data = (await response.json()) as MistralResponse;

    return (
      data?.choices?.[0]?.message?.content ??
      "Sorry, I couldn't process that right now."
    );
  } catch (error) {
    console.error("Mistral Request Failed:", error);
    return "AI service is unavailable.";
  }
};
