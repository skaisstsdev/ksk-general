import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * В Next 16 файл `middleware` переименован в `proxy`, а экспорт —
 * из `middleware` в `proxy`. Сама функция та же.
 */
export const proxy = createMiddleware(routing);

export const config = {
  matcher: [
    // Всё, кроме служебных путей, API, статики и файлов с расширением.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
