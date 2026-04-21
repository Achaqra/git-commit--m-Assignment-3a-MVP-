import { formatSizeLabel, getSizeGuideNote } from "@/lib/size-labels";

type SizeSelectorProps = {
  id: string;
  name: string;
  label: string;
  sizes: string[];
  defaultValue: string;
  description?: string;
};

export function SizeSelector({ id, name, label, sizes, defaultValue, description }: SizeSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-zinc-700">{label}</legend>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-zinc-500">{description ?? getSizeGuideNote()}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sizes.map((size) => {
          const inputId = `${id}-${size.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`;

          return (
            <label
              key={size}
              className="group flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:bg-zinc-50"
              htmlFor={inputId}
            >
              <input
                className="peer sr-only"
                defaultChecked={size === defaultValue}
                id={inputId}
                name={name}
                type="radio"
                value={size}
              />
              <span className="rounded-lg px-1 py-0.5 transition peer-checked:bg-zinc-900 peer-checked:text-white peer-checked:shadow-sm peer-focus-visible:outline-3 peer-focus-visible:outline-[#bb3e0347] peer-focus-visible:outline-offset-2">
                {formatSizeLabel(size)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}