"use client";

import { useEffect } from "react";

import { ADS_ID, GA_ID, trackEmailClick, trackPhoneClick } from "@/lib/analytics";
import { CONSENT_CHANGE_EVENT, readConsent } from "@/lib/consent";

/**
 * Google Analytics 4 + Google Ads, строго после согласия посетителя.
 *
 * Пока решения нет или оно «отклонено», скрипт Google не запрашивается
 * вообще — ни одного обращения к чужим серверам. Это единственное
 * место на сайте, кроме карты (`ConsentMap.tsx`), где что-то грузится
 * не с нашего домена; CSP в `next.config.ts` открыт ровно под него.
 *
 * Consent Mode v2: до загрузки выставлены все четыре сигнала в `denied`,
 * при согласии три из них — `granted`. `ad_personalization` остаётся
 * `denied` всегда: реклама на медицинскую тематику в Google Ads всё
 * равно ограничена правилом «Персонализированная реклама: здоровье»,
 * ремаркетинг по посетителям сайта по здоровью запрещён.
 *
 * Клики по `tel:`/`mailto:` ловятся одним делегированным слушателем,
 * а не обработчиками в каждой кнопке и ссылке — номер и почта стоят
 * в шапке, футере, карточках и на странице контактов.
 */
export function GoogleTag() {
  useEffect(() => {
    if (!GA_ID && !ADS_ID) return;

    window.dataLayer = window.dataLayer ?? [];
    if (!window.gtag) {
      window.gtag = function gtag() {
        // gtag.js ждёт именно объект `arguments`, не массив.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }

    let loaded = false;

    function apply() {
      const consent = readConsent();
      const gtag = window.gtag;
      if (!gtag) return;

      if (consent !== "granted") {
        if (loaded) {
          gtag("consent", "update", {
            ad_storage: "denied",
            ad_user_data: "denied",
            analytics_storage: "denied",
          });
        }
        return;
      }

      if (!loaded) {
        loaded = true;
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID ?? ADS_ID}`;
        document.head.appendChild(script);
        gtag("js", new Date());
        gtag("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "denied",
          analytics_storage: "granted",
        });
        if (GA_ID) gtag("config", GA_ID);
        if (ADS_ID) gtag("config", ADS_ID);
      } else {
        gtag("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          analytics_storage: "granted",
        });
      }
    }

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackPhoneClick(href);
      else trackEmailClick(href);
    }

    apply();
    window.addEventListener(CONSENT_CHANGE_EVENT, apply);
    window.addEventListener("storage", apply);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, apply);
      window.removeEventListener("storage", apply);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
