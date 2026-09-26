"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Check, ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Поля формы.
 *
 * Общий язык: подпись над полем, тонкая граница `line-strong`,
 * заливка `surface` (не `paper` — поле должно читаться отдельно от
 * страницы), радиус `xs`, без тени. Невалидное поле красится в
 * `critical` и получает `aria-describedby` на текст ошибки — тот же
 * текст, что видит зрячий пользователь, доступен и озвучке.
 */

const inputBase =
  "w-full rounded-xs border bg-surface px-sm py-xs text-ui text-ink placeholder:text-ink-muted transition-colors";

function borderClass(invalid: boolean) {
  return invalid
    ? "border-critical"
    : "border-line-strong focus:border-ink-muted";
}

type FieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
};

export function Field({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  error,
  autoComplete,
}: FieldProps) {
  const invalid = Boolean(error);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-3xs">
      <label htmlFor={id} className="text-meta text-ink-soft">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        className={cn(inputBase, borderClass(invalid))}
      />
      {invalid ? (
        <p id={errorId} className="text-meta text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Textarea({
  id,
  label,
  required,
  value,
  onChange,
  error,
  placeholder,
  rows = 5,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}) {
  const invalid = Boolean(error);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-3xs">
      <label htmlFor={id} className="text-meta text-ink-soft">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        className={cn(inputBase, borderClass(invalid), "resize-none")}
      />
      {invalid ? (
        <p id={errorId} className="text-meta text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Свой выпадающий список вместо нативного `<select>` — у него на macOS/iOS
 * нет способа задать стиль (шрифт, радиус, рамку), поэтому единственное
 * невёрстанное поле сайта. Устройство — то же, что у `LanguageSwitcher.tsx`:
 * клик вне поля и Escape закрывают список, рамка вместо тени, чек-иконка
 * на выбранном пункте вместо заливки.
 */
export function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex flex-col gap-3xs">
      <span id={labelId} className="text-meta text-ink-soft">
        {label}
      </span>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${labelId} ${id}`}
        className={cn(
          inputBase,
          borderClass(false),
          "flex items-center justify-between gap-sm text-start",
          !selected && "text-ink-muted",
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-labelledby={labelId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-10 mt-2xs rounded-xs border border-line-strong bg-paper py-xs"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-sm px-sm py-2xs text-start text-ui transition-colors hover:bg-ink/5",
                    option.value === value ? "text-ink" : "text-ink-soft",
                  )}
                >
                  <span>{option.label}</span>
                  {option.value === value ? (
                    <Check className="size-4 shrink-0 text-violet" />
                  ) : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Checkbox({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  const invalid = Boolean(error);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-3xs">
      <label htmlFor={id} className="flex items-start gap-xs text-meta text-ink-soft">
        <input
          id={id}
          name={id}
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          className={cn(
            "mt-3xs size-4 shrink-0 rounded-xs border bg-surface accent-violet",
            borderClass(invalid),
          )}
        />
        <span>{children}</span>
      </label>
      {invalid ? (
        <p id={errorId} className="text-meta text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Ловушка для спам-ботов: поле вне экрана, которое человек не увидит
 * и не заполнит, а автозаполнение форм — заполняет. Не `display:none`
 * (часть ботов его пропускает) — вынесено за пределы видимой области.
 */
export function Honeypot({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      {label}
      <input
        type="text"
        name="firma"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
