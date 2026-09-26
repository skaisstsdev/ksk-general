"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";

import {
  COOKIE_NOTICE_DISMISS_EVENT,
  COOKIE_NOTICE_STORAGE_KEY,
} from "@/components/layout/CookieBanner";
import { ChatBubble, Close, Send } from "@/components/ui/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { pagesWithHero } from "@/content/navigation";
import { routing } from "@/i18n/routing";
import { company, contact } from "@/content/site";
import { cn } from "@/lib/cn";
import { useOnDark } from "@/lib/useOnDark";

type Message = { role: "user" | "assistant"; content: string };

/** Кнопка-ссылка внутри ответа бота — тот же фиолетовый заполненный вид,
 *  что у `Button` variant="primary", уменьшенный до размера строки чата. */
const LINK_CHIP_CLASS =
  "mx-3xs my-3xs inline-flex items-center rounded-xs bg-violet px-xs py-3xs text-caption font-medium text-white-pure transition-colors hover:bg-violet-mid";

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const INTERNAL_PATH_RE = /^\/[a-z0-9-]*$/i;
const EXTERNAL_RE = /^(https?:|tel:|mailto:)/;

/**
 * Внутренние пути из системного промпта (`/beratung`, `/leistungen`…)
 * приходят без языкового префикса — его добавляет `@/i18n/navigation`
 * для ссылок в разметке, а здесь префикс приходится считать самим:
 * ответ бота — обычный текст, а не JSX, ссылку из него нельзя провести
 * через компонент `Link`.
 */
function localizeInternalPath(path: string, locale: string) {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Разбор ответа бота на текст и кнопки-ссылки без `dangerouslySetInnerHTML`.
 *
 * Старый виджет собирал HTML строкой (экранируя текст, но не саму ссылку)
 * и вставлял её через `innerHTML` — в `href` можно было вписать кавычку
 * и вырваться из атрибута. Здесь адрес ссылки сверяется с разрешённым
 * списком схем (`/путь`, `tel:`, `mailto:`, `http(s)://`) и попадает
 * в JSX-атрибут напрямую; всё остальное React экранирует сам.
 */
function renderMessage(text: string, locale: string) {
  return text.split("\n").map((line, lineIndex, lines) => {
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    for (const match of line.matchAll(LINK_RE)) {
      const index = match.index ?? 0;
      if (index > lastIndex) nodes.push(line.slice(lastIndex, index));
      const [full, label, url] = match;

      if (EXTERNAL_RE.test(url)) {
        const isHttp = url.startsWith("http");
        nodes.push(
          <a
            key={key++}
            href={url}
            className={LINK_CHIP_CLASS}
            {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>,
        );
      } else if (INTERNAL_PATH_RE.test(url)) {
        nodes.push(
          <a key={key++} href={localizeInternalPath(url, locale)} className={LINK_CHIP_CLASS}>
            {label}
          </a>,
        );
      } else {
        nodes.push(full);
      }
      lastIndex = index + full.length;
    }
    if (lastIndex < line.length) nodes.push(line.slice(lastIndex));

    return (
      <Fragment key={lineIndex}>
        {nodes}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </Fragment>
    );
  });
}

function LoaderDots() {
  return (
    <span className="flex items-center gap-3xs px-3xs py-3xs" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-ink-muted"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/**
 * Тот же ИИ-ассистент, что был на старом сайте (`_source/chat-widget.js`,
 * `chat-system-prompt.md`): модель, промпт и правила языка не изменились
 * (см. `src/content/chat.ts` и `src/app/api/chat/route.ts`) — переоформлена
 * только витрина, под токены нового дизайна вместо фиолетового стекла.
 *
 * Смонтирован один раз в `[locale]/layout.tsx`, как `Header`/`Footer`:
 * состояние (открыт ли чат, история переписки) переживает переходы между
 * страницами внутри одной локали.
 */
export function ChatWidget() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  // Только на страницах с хиро во весь экран (та же `pagesWithHero`, что
  // и у `Header`) кнопка ждёт первый скролл, чтобы не спорить с кадром.
  // На остальных высоты для конфликта нет — кнопка нужна сразу.
  const hasHero = pagesWithHero.includes(pathname);

  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const visible = !hasHero || hasScrolledOnce;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookieNoticeVisible, setCookieNoticeVisible] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const onDark = useOnDark(triggerRef);

  // На страницах без хиро `visible` уже `true` (см. выше) — здесь только
  // догоняем случай `pagesWithHero`: кнопка ждёт первый скролл, чтобы не
  // спорить с кадром, так же, как на старом сайте. Once-флаг: если
  // прокрутили хоть раз за сессию, на следующей хиро-странице кнопка
  // не прячется заново — `ChatWidget` один на весь сайт, переживает
  // переходы между страницами, и повторное ожидание читалось бы как сбой.
  useEffect(() => {
    if (hasScrolledOnce) return;
    function onScroll() {
      if (window.scrollY > 20) {
        setHasScrolledOnce(true);
        window.removeEventListener("scroll", onScroll);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasScrolledOnce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Пока баннер cookie не закрыт, он занимает тот же нижний угол
  // (`CookieBanner.tsx`) — кнопка чата поднимается над ним, чтобы не наложиться.
  useEffect(() => {
    function sync() {
      try {
        setCookieNoticeVisible(localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === null);
      } catch {
        setCookieNoticeVisible(false);
      }
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(COOKIE_NOTICE_DISMISS_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(COOKIE_NOTICE_DISMISS_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.message || t("chat.errorFallback", { phone: contact.phone.display }),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t("chat.errorFallback", { phone: contact.phone.display }) },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  const quickReplies = t.raw("chat.quickReplies") as string[];

  return (
    <div
      className={cn(
        "fixed end-md z-40 flex flex-col items-end gap-sm",
        cookieNoticeVisible ? "bottom-[9rem]" : "bottom-md",
      )}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label={company.shortName}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-[min(32rem,70vh)] w-[calc(100vw-2rem)] max-w-[23rem] flex-col overflow-hidden rounded-xs border border-white-pure bg-paper shadow-lifted"
          >
            <div className="flex shrink-0 items-center justify-between gap-sm bg-violet px-sm py-xs">
              <div className="flex items-center gap-xs">
                <ChatBubble className="size-6 shrink-0 text-white-pure" />
                <div>
                  <p className="text-meta font-semibold text-white-pure">{company.shortName}</p>
                  <p className="flex items-center gap-3xs text-caption text-white-pure/75">
                    <span className="size-2 rounded-full bg-success" aria-hidden="true" />
                    {t("chat.status")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("dialog.close")}
                className="flex size-8 shrink-0 items-center justify-center rounded-xs text-white-pure/80 transition-colors hover:bg-white-pure/15 hover:text-white-pure"
              >
                <Close className="size-4" />
              </button>
            </div>

            <div ref={messagesRef} className="flex flex-1 flex-col gap-xs overflow-y-auto p-sm">
              <div className="max-w-[85%] self-start rounded-xs border border-line bg-surface px-sm py-xs text-meta text-ink-soft">
                {renderMessage(t("chat.welcome"), locale)}
              </div>

              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-xs px-sm py-xs text-meta",
                    message.role === "user"
                      ? "self-end bg-violet text-white-pure"
                      : "self-start border border-line bg-surface text-ink-soft",
                  )}
                >
                  {renderMessage(message.content, locale)}
                </div>
              ))}

              {loading ? (
                <div className="self-start rounded-xs border border-line bg-surface">
                  <LoaderDots />
                </div>
              ) : null}

              {messages.length === 0 ? (
                <div className="mt-3xs flex flex-wrap gap-3xs">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => send(reply)}
                      className="rounded-xs border border-line-strong bg-paper px-xs py-3xs text-caption font-medium text-ink transition-colors hover:border-ink hover:bg-surface"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex shrink-0 items-center gap-2xs border-t border-line p-sm"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                aria-label={t("chat.placeholder")}
                maxLength={500}
                // `text-body`, не `text-ui`, на телефоне: ниже 16px Safari
                // сам зумит экран при фокусе на поле (см. `fields.tsx`).
                className="w-full rounded-xs border border-line-strong bg-surface px-sm py-2xs text-body text-ink placeholder:text-ink-muted transition-colors focus:border-ink-muted lg:text-ui"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t("chat.sendAria")}
                className="flex size-9 shrink-0 items-center justify-center rounded-xs bg-violet text-white-pure transition-colors hover:bg-violet-mid disabled:pointer-events-none disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>

            <p className="shrink-0 px-sm pb-sm text-caption text-ink-muted">
              {t("chat.disclaimerPrefix")} ·{" "}
              <Link
                href="/datenschutz"
                className="underline decoration-line-strong hover:text-ink hover:decoration-ink"
              >
                {t("legalNav.datenschutz")}
              </Link>
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Только контур значка, без плашки под ним: круглая заливка была
          единственным круглым элементом на сайте (см. комментарий
          у `Button` про радиус 2px — крупное скругление и тень читаются
          как шаблон конструктора). Значок сам говорит, что это чат;
          цвет — как у `LanguageSwitcher`, через `useOnDark`: фиолетовый
          на светлом поле, `paper` на фото и футере, где фиолетовый
          потерялся бы. */}
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("dialog.close") : t("chat.openAria")}
        className={cn(
          "flex size-12 shrink-0 items-center justify-center transition-colors",
          onDark ? "text-paper hover:text-paper/70" : "text-violet hover:text-violet-mid",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            {open ? <Close className="size-9" /> : <ChatBubble className="size-9" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
