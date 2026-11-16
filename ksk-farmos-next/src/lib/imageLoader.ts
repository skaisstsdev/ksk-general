import widths from "./imageWidths.json";

/**
 * Загрузчик картинок: отдаёт заранее подготовленные размеры, а не
 * ужатые на лету (см. `scripts/make-image-variants.py` — там объяснено,
 * почему встроенный оптимизатор Next.js теряет резкость).
 *
 * Для фотографии из `imageWidths.json` берётся ближайший размер не меньше
 * запрошенного; самый большой — сам исходник. Остальное (логотип и прочее)
 * отдаётся как есть.
 *
 * `?w=` нужен только чтобы Next не предупреждал в консоли, что загрузчик
 * «не учитывает ширину»: статический файл параметр игнорирует.
 */
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const list = (widths as Record<string, number[]>)[src];
  if (!list) return `${src}?w=${width}`;
  const last = list[list.length - 1];
  const w = list.find((x) => x >= width) ?? last;
  const url = w === last ? src : src.replace(/\.webp$/, `-w${w}.webp`);
  return `${url}?w=${w}`;
}
