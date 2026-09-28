"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

/**
 * Итог отправки — заменяет форму, а не всплывает поверх неё: тот же
 * приём, что в старом сайте (карточка формы сменялась текстом),
 * но набран без `innerHTML`, обычным React-состоянием.
 *
 * При успехе — прокрутка к самому себе. Длинные формы (мастер
 * `BewerbungForm` в три шага, `ContactForm` с полем сообщения) читаются
 * с прокруткой вниз; когда форма схлопывается в короткую карточку
 * «Спасибо», страница остаётся на прежней позиции скролла, и карточка
 * может оказаться выше видимой области — снаружи выглядит так, будто
 * отправка ничего не дала. При ошибке не прокручиваем: `FormStatus`
 * там встаёт рядом с уже видимой формой, а не взамен неё.
 */
export function FormStatus({
  tone,
  title,
  text,
}: {
  tone: "success" | "error";
  title: string;
  text: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tone === "success") {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [tone]);

  return (
    <div
      ref={ref}
      role="status"
      className={cn(
        "rounded-xs border px-md py-lg text-center",
        tone === "success"
          ? "border-success/30 bg-success/5"
          : "border-critical/30 bg-critical/5",
      )}
    >
      <p
        className={cn(
          "text-h4",
          tone === "success" ? "text-success" : "text-critical",
        )}
      >
        {title}
      </p>
      <p className="mt-2xs text-ui text-ink-soft">{text}</p>
    </div>
  );
}
