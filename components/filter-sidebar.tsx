import Link from "next/link";

type FilterSidebarProps = {
  selectedTypes: string[];
  selectedColors: string[];
  selectedSizes: string[];
};

const TYPES = ["Hoodie", "Tee", "Cargo", "Outerwear"];
const COLORS = ["Black", "Charcoal", "White", "Grey", "Olive", "Navy", "Stone"];
const SIZES = ["EU XS", "EU S", "EU M", "EU L", "EU XL", "EU 44", "EU 46", "EU 48", "EU 50", "EU 52"];

function isChecked(group: string[], value: string): boolean {
  return group.includes(value);
}

export function FilterSidebar({
  selectedTypes,
  selectedColors,
  selectedSizes,
}: FilterSidebarProps) {
  return (
    <aside className="rounded-3xl border border-zinc-900/10 bg-white/92 p-5 shadow-sm backdrop-blur-sm lg:sticky lg:top-6 lg:h-fit lg:border-zinc-900/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Browse</p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-900">Filter Products</h2>
        </div>
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
          Live
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Narrow the collection by fit, color, or size. Desktop keeps this panel visible while mobile can collapse it.
      </p>
      <form aria-label="Filter products" className="mt-5 space-y-6" method="get">
        <fieldset className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Category</legend>
          {TYPES.map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-zinc-700">
              <input
                className="h-5 w-5 rounded border-zinc-400 accent-zinc-900"
                type="checkbox"
                name="type"
                value={type}
                defaultChecked={isChecked(selectedTypes, type)}
              />
              {type}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Color</legend>
          {COLORS.map((color) => (
            <label key={color} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-zinc-700">
              <input
                className="h-5 w-5 rounded border-zinc-400 accent-zinc-900"
                type="checkbox"
                name="color"
                value={color}
                defaultChecked={isChecked(selectedColors, color)}
              />
              {color}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Size</legend>
          {SIZES.map((size) => (
            <label key={size} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-zinc-700">
              <input
                className="h-5 w-5 rounded border-zinc-400 accent-zinc-900"
                type="checkbox"
                name="size"
                value={size}
                defaultChecked={isChecked(selectedSizes, size)}
              />
              {size}
            </label>
          ))}
        </fieldset>

        <div className="flex gap-2">
          <button
            aria-label="Apply selected filters"
            className="flex-1 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bb3e03]"
            type="submit"
          >
            Apply
          </button>
          <Link
            aria-label="Reset all product filters"
            className="inline-flex items-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            href="/"
          >
            Reset
          </Link>
        </div>
      </form>
    </aside>
  );
}