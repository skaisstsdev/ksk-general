/**
 * HTML-письмо для заявок с форм.
 *
 * Цвета и радиус — буквально те же значения, что и в `globals.css`
 * (`--color-violet`, `--color-paper`, `--color-ink`, `--radius-xs`),
 * но вписаны как есть: почтовые клиенты не читают ни Tailwind, ни
 * CSS-переменные, только инлайновые стили и таблицы для вёрстки —
 * единственное место сайта, где токены приходится продублировать
 * руками, а не подключить.
 */

const COLOR = {
  paper: "#f2f0eb",
  ink: "#17171a",
  inkSoft: "#45444c",
  inkMuted: "#6b6a73",
  line: "#dcd9d1",
  violet: "#6b3fa0",
  white: "#ffffff",
} as const;

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const FORM_TITLES: Record<string, string> = {
  kontakt: "Neue Kontaktanfrage",
  beratung: "Neue Beratungsanfrage",
  schnellbewerbung: "Neue Bewerbung",
};

const FIELD_LABELS: Record<string, string> = {
  vorname: "Vorname",
  nachname: "Nachname",
  email: "E-Mail",
  telefon: "Telefon",
  betreff: "Betreff",
  qualifikation: "Qualifikation",
  erfahrung: "Berufserfahrung",
  fuehrerschein: "Führerschein",
  nachricht: "Nachricht",
};

const FIELD_ORDER: Record<string, string[]> = {
  kontakt: ["vorname", "nachname", "email", "telefon", "betreff", "nachricht"],
  beratung: ["vorname", "nachname", "email", "telefon", "nachricht"],
  schnellbewerbung: [
    "vorname",
    "nachname",
    "email",
    "telefon",
    "qualifikation",
    "erfahrung",
    "fuehrerschein",
    "nachricht",
  ],
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fields(formName: string, payload: Record<string, unknown>) {
  const order = FIELD_ORDER[formName] ?? Object.keys(payload);
  return order
    .map((key) => ({ key, value: payload[key] }))
    .filter((f): f is { key: string; value: string } => typeof f.value === "string" && f.value.trim() !== "");
}

/**
 * Тема письма — единственное место, где значение из формы попадает
 * в позицию, чувствительную к переносу строки: `\r\n` внутри `subject`
 * теоретически открывает внедрение собственного заголовка письма
 * (получатель, копия и т.п.), если сама библиотека Resend этого не
 * фильтрует. `vorname`/`nachname` — свободный текст без такой проверки
 * (в отличие от `email`, чей `EMAIL_RE` уже отсеивает пробельные символы,
 * включая `\r`/`\n`, через `\s`) — здесь то же самое сделано явно,
 * а не в расчёте на фильтр стороннего API.
 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}

export function buildEmailSubject(formName: string, payload: Record<string, unknown>) {
  const name = [payload.vorname, payload.nachname].filter(Boolean).join(" ");
  const title = FORM_TITLES[formName] ?? formName;
  return sanitizeHeaderValue(name ? `${title} — ${name}` : title);
}

export function buildEmailText(formName: string, payload: Record<string, unknown>) {
  const lines = fields(formName, payload).map(
    ({ key, value }) => `${FIELD_LABELS[key] ?? key}: ${value}`,
  );
  return `${FORM_TITLES[formName] ?? formName}\n\n${lines.join("\n")}`;
}

export function buildEmailHtml(formName: string, payload: Record<string, unknown>) {
  const rows = fields(formName, payload)
    .map(({ key, value }) => {
      const label = escapeHtml(FIELD_LABELS[key] ?? key);
      const isMultiline = key === "nachricht";
      const safeValue = escapeHtml(value).replace(/\n/g, "<br>");
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${COLOR.line};vertical-align:top;width:140px;">
            <span style="font-family:${FONT_STACK};font-size:13px;color:${COLOR.inkMuted};">${label}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid ${COLOR.line};vertical-align:top;">
            <span style="font-family:${FONT_STACK};font-size:15px;line-height:${isMultiline ? "1.6" : "1.4"};color:${COLOR.ink};white-space:${isMultiline ? "normal" : "nowrap"};">${safeValue}</span>
          </td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
  <body style="margin:0;padding:32px 16px;background-color:${COLOR.paper};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:${COLOR.white};border-radius:2px;overflow:hidden;">
            <tr>
              <td style="background-color:${COLOR.violet};padding:20px 28px;">
                <span style="font-family:${FONT_STACK};font-size:17px;font-weight:600;color:${COLOR.white};">
                  ${escapeHtml(FORM_TITLES[formName] ?? formName)}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background-color:${COLOR.paper};">
                <span style="font-family:${FONT_STACK};font-size:12px;color:${COLOR.inkMuted};">
                  Gesendet über das Formular auf ksk-farmos.de
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
