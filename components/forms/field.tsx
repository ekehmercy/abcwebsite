"use client";

import { ChevronDown } from "lucide-react";
import type { FieldDef } from "@/lib/validation";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-md bg-white text-[15px] text-n-900 shadow-[0_0_0_1px_var(--n-200)] transition-shadow placeholder:text-n-400 hover:shadow-[0_0_0_1px_var(--n-300)] focus:shadow-[0_0_0_1.5px_var(--brand-500),0_0_0_4px_var(--brand-100)] focus:outline-none";
const invalid = "shadow-[0_0_0_1.5px_var(--st-danger)] hover:shadow-[0_0_0_1.5px_var(--st-danger)]";

/** Accessible labelled field: label, optional hint, inline error wired with aria-describedby. */
export function Field({
  def,
  id,
  value,
  error,
  onChange,
  onBlur,
}: {
  def: FieldDef;
  id: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const hintId = def.hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: def.name,
    value,
    required: def.required,
    "aria-required": def.required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onBlur,
  } as const;

  return (
    <div className={cn(def.half ? "sm:col-span-1" : "sm:col-span-2")}>
      <label htmlFor={id} className="block text-[14px] font-medium text-n-800">
        {def.label}
      </label>
      {def.hint && <p id={hintId} className="mt-1 text-[13px] leading-5 text-n-500">{def.hint}</p>}
      <div className="relative mt-1.5">
        {def.type === "textarea" ? (
          <textarea {...common} rows={4} maxLength={def.max} placeholder={def.placeholder} onChange={(e) => onChange(e.target.value)} className={cn(control, "min-h-[112px] resize-y px-3.5 py-2.5", error && invalid)} />
        ) : def.type === "select" ? (
          <>
            <select {...common} onChange={(e) => onChange(e.target.value)} autoComplete={def.autoComplete} className={cn(control, "h-12 appearance-none pl-3.5 pr-10", !value && "text-n-400", error && invalid)}>
              <option value="">Select…</option>
              {def.options?.map((o) => <option key={o} value={o} className="text-n-900">{o}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-n-500" aria-hidden="true" />
          </>
        ) : (
          <input
            {...common}
            type={def.type}
            inputMode={def.type === "email" ? "email" : undefined}
            autoComplete={def.autoComplete}
            maxLength={def.max}
            placeholder={def.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={cn(control, "h-12 px-3.5", error && invalid)}
          />
        )}
      </div>
      {error && <p id={errId} className="mt-1.5 text-[13px] font-medium text-bad">{error}</p>}
    </div>
  );
}
