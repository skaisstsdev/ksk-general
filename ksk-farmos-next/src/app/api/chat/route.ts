import { buildChatSystemPrompt } from "@/content/chat";

/**
 * Тот же контракт, что у старого `site/api/chat.js`: модель `gpt-4o-mini`,
 * `max_tokens` 1024, история обрезается до последних 10 сообщений. Перенесено
 * на Route Handler (`app/api/chat/route.ts`) — в Next 16 это заменяет
 * `pages/api` (см. `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`):
 * `Request`/`Response` вместо `req`/`res`, метод — из имени экспортируемой функции.
 */
export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const trimmedMessages = messages.slice(-10);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [{ role: "system", content: buildChatSystemPrompt() }, ...trimmedMessages],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return Response.json({ error: "API error" }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content ?? "";
    return Response.json({ message: text });
  } catch (error) {
    console.error("Chat route error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
