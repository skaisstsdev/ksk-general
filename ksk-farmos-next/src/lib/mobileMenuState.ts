/**
 * Открыта ли панель мобильного меню — общее чтение для плавающих
 * элементов (переключатель языка, кнопка чата), которые делят с ней
 * нижние углы экрана. `Header` (владелец состояния) и эти элементы —
 * соседи в `[locale]/layout.tsx`, а не родитель с детьми, поэтому
 * состояние не передать пропсом; здесь то же `useSyncExternalStore`,
 * что и у `mapConsent.ts`, но без `localStorage` — открытость меню
 * не переживает перезагрузку и не должна.
 */
let isOpen = false;
const listeners = new Set<() => void>();

export function subscribeMobileMenu(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getMobileMenuOpen(): boolean {
  return isOpen;
}

export function getServerMobileMenuOpen(): boolean {
  return false;
}

export function setMobileMenuOpen(value: boolean) {
  if (isOpen === value) return;
  isOpen = value;
  listeners.forEach((callback) => callback());
}
