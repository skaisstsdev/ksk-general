export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Отправка форм — POST на `/api/submit-form` (Resend, см. роут).
 *
 * `honeypot`/`elapsedMs` едут в payload вместе с остальными полями —
 * сервер проверяет их тоже (см. роут), не только браузер: бот, который
 * шлёт запрос мимо формы, клиентскую проверку не встретит вообще.
 *
 * `cv` — только у формы с файлом (schnellbewerbung): тогда уходит
 * `multipart/form-data`, иначе — обычный JSON, без причины городить
 * FormData там, где нечего вкладывать.
 */
export async function submitForm(
  formName: string,
  payload: Record<string, unknown>,
  cv?: File | null,
): Promise<SubmitResult> {
  try {
    let response: Response;

    if (cv) {
      const body = new FormData();
      body.set("formName", formName);
      body.set("payload", JSON.stringify(payload));
      body.set("cv", cv);
      response = await fetch("/api/submit-form", { method: "POST", body });
    } else {
      response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formName, payload }),
      });
    }

    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}
