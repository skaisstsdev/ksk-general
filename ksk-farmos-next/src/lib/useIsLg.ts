"use client";

import { useEffect, useState } from "react";

const QUERY = "(min-width: 64rem)";

/**
 * Брейкпоинт `lg` из Tailwind (`64rem`), но в JS — нужен там, где по
 * разные стороны границы не просто разные токены, а разный код
 * (см. `ExpandingPhoto`, `Photo`). До монтирования сервер и первый
 * клиентский рендер отдают `false` — иначе гидратация разойдётся;
 * на десктопе это на один кадр включает мобильную ветку, `matchMedia`
 * тут же поправляет.
 */
export function useIsLg() {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setIsLg(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isLg;
}
