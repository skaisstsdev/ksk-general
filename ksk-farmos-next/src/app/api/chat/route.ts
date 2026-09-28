import { buildChatSystemPrompt } from "@/content/chat";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

/**
 * Тот же контракт, что у старого `site/api/chat.js`: модель `gpt-4o-mini`,
 * `max_tokens` 1024, история обрезается до последних 10 сообщений. Перенесено
 * на Route Handler (`app/api/chat/route.ts`) — в Next 16 это заменяет
 * `pages/api` (см. `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`):
 * `Request`/`Response` вместо `req`/`res`, метод — из имени экспортируемой функции.
 *
 * Дополнено против прямых запросов мимо виджета (виджет всегда шлёт
 * `role: "user"|"assistant"` и текст с разумной длиной — ограничения
 * ниже описывают именно эту форму, а не запрещают что-то, что виджет
 * умеет сам):
 *   - роль каждого сообщения — строго `user`/`assistant`: без этого
 *     запрос с `role: "system"` подменял бы системный промпт целиком;
 *   - длина одного сообщения и их количество ограничены — без этого
 *     один запрос мог разогнать счёт OpenAI на порядки;
 *   - лимит запросов по IP — грубый, но раньше не было вообще никакого;
 *   - таймаут на сам вызов OpenAI — без него зависший запрос к OpenAI
 *     держал бы соединение неограниченно.
 */

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const OPENAI_TIMEOUT_MS = 30_000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function isValidMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const { role, content } = m as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.length > 0 &&
    content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`chat:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const trimmedMessages = messages.slice(-MAX_MESSAGES);
  if (!trimmedMessages.every(isValidMessage)) {
    return Response.json({ error: "Invalid message" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

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
        messages: [
          { role: "system", content: buildChatSystemPrompt() },
          ...(trimmedMessages as ChatMessage[]),
        ],
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return Response.json({ error: "API error" }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content ?? "";
    return Response.json({ message: text });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Chat route timeout");
      return Response.json({ error: "Timeout" }, { status: 504 });
    }
    console.error("Chat route error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
