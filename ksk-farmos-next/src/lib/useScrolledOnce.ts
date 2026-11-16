"use client";

import { useSyncExternalStore } from "react";

/**
 * Прокрутил ли посетитель страницу хоть раз за визит.
 *
 * Плавающие кнопки (`LanguageSwitcher`, `ChatWidget`) на телефоне ждут
 * первого скролла, чтобы не спорить с первым экраном. Флаг один на всю
 * вкладку и не сбрасывается при переходах между страницами: если
 * прокрутили раз, на следующей странице кнопки не прячутся заново —
 * повторное ожидание читалось бы как сбой.
 */
let scrolled = false;
const listeners = new Set<() => void>();

function check() {
  if (scrolled || window.scrollY <= 20) return;
  scrolled = true;
  window.removeEventListener("scroll", check);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!scrolled) {
    window.addEventListener("scroll", check, { passive: true });
    check();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("scroll", check);
  };
}

export function useScrolledOnce() {
  return useSyncExternalStore(
    subscribe,
    () => scrolled,
    () => false,
  );
}
