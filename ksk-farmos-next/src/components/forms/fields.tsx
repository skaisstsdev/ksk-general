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
  return (
    <div className="flex flex-col gap-3xs">
      <label htmlFor={id} className="text-meta text-ink-soft">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, borderClass(false))}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      Firma
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
