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
    <aside className="rounded-2xl border border-zinc-800/10 bg-white/80 p-4 backdrop-blur-sm lg:sticky lg:top-6 lg:h-fit">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Filters</h2>
      <form className="mt-4 space-y-6" method="get">
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Category</legend>
          {TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                className="h-4 w-4 rounded border-zinc-400 accent-zinc-900"
                type="checkbox"
                name="type"
                value={type}
                defaultChecked={isChecked(selectedTypes, type)}
              />
              {type}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Color</legend>
          {COLORS.map((color) => (
            <label key={color} className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                className="h-4 w-4 rounded border-zinc-400 accent-zinc-900"
                type="checkbox"
                name="color"
                value={color}
                defaultChecked={isChecked(selectedColors, color)}
              />
              {color}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Size</legend>
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                className="h-4 w-4 rounded border-zinc-400 accent-zinc-900"
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
            className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
            type="submit"
          >
            Apply
          </button>
          <Link
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            href="/"
          >
            Reset
          </Link>
        </div>
      </form>
    </aside>
  );
}