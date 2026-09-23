import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Локализованные Link / redirect / usePathname.
 * Компоненты импортируют Link отсюда, а не из "next/link", —
 * тогда языковой префикс подставляется сам и нигде не собирается руками.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
