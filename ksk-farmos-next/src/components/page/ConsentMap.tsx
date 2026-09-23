"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/Button";
import { Pin } from "@/components/ui/icons";
import {
  getMapConsent,
  getServerMapConsent,
  setMapConsent,
  subscribeMapConsent,
} from "./mapConsent";

/**
 * Google Maps — только по клику пользователя.
 *
 * В старом сайте это уже было исправлено (карта не грузилась сама),
 * но согласие нигде не сохранялось: посетитель нажимал «загрузить
 * карту» заново при каждом визите, и отозвать его было нельзя. Здесь
 * выбор помнится (`mapConsent.ts`) и его можно отменить прямо под
 * картой — то и другое требует DSGVO для согласия на передачу IP
 * третьей стороне.
 */
export function ConsentMap({
  query,
  label,
  consentText,
  loadLabel,
  revokeLabel,
}: {
  /** Строка адреса для Google Maps, уже готовая к `encodeURIComponent`. */
  query: string;
  /** Заголовок iframe для скринридера. */
  label: string;
  consentText: string;
  loadLabel: string;
  revokeLabel: string;
}) {
  const consent = useSyncExternalStore(
    subscribeMapConsent,
    getMapConsent,
    getServerMapConsent,
  );

  return (
    <div className="flex flex-col gap-2xs">
      <div className="relative aspect-video overflow-hidden rounded-xs bg-sunken">
        {consent ? (
          <iframe
            title={label}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            className="size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-sm px-lg text-center">
            <Pin className="size-8 text-ink-muted" />
            <p className="max-w-[42ch] text-meta text-ink-soft">{consentText}</p>
            <Button type="button" onClick={() => setMapConsent(true)} size="sm">
              {loadLabel}
            </Button>
          </div>
        )}
      </div>

      {consent ? (
        <button
          type="button"
          onClick={() => setMapConsent(false)}
          className="self-start text-meta text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
        >
          {revokeLabel}
        </button>
      ) : null}
    </div>
  );
}
