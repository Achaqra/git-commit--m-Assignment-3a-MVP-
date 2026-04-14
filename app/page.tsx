import Link from "next/link";

import { FilterSidebar } from "@/components/filter-sidebar";
import { MobileFilterToggle } from "@/components/mobile-filter-toggle";
import { ProductGrid } from "@/components/product-grid";
import { SavedSizePreferences } from "@/components/saved-size-preferences";
import { getProducts, getSavedSizePreferences } from "@/lib/data";
import { hasSupabaseConfig } from "@/lib/supabase";

type SearchParams = Promise<{
  type?: string | string[];
  color?: string | string[];
  size?: string | string[];
}>;

function asArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, savedSizePreferences] = await Promise.all([
    getProducts(),
    getSavedSizePreferences(),
  ]);

  const filters = await searchParams;
  const selectedTypes = asArray(filters.type);
  const selectedColors = asArray(filters.color);
  const selectedSizes = asArray(filters.size);

  const filteredProducts = products.filter((product) => {
    const typeMatch = !selectedTypes.length || selectedTypes.includes(product.type);
    const colorMatch = !selectedColors.length || selectedColors.includes(product.color);
    const sizeMatch = !selectedSizes.length || product.sizes.some((size) => selectedSizes.includes(size));
    return typeMatch && colorMatch && sizeMatch;
  });

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-zinc-900/10 bg-white/80 p-5 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Superior Fits</p>
            <h1 className="mt-1 text-3xl font-semibold text-zinc-900 sm:text-4xl">Streetwear Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Browse clean product cards, use filters fast, and check out with confidence using saved EU sizing.
            </p>
          </div>
          <nav className="flex gap-2">
            <Link
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              href="/orders"
            >
              Orders
            </Link>
            <Link
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#bb3e03]"
              href="/checkout"
            >
              Checkout
            </Link>
          </nav>
        </div>
      </header>

      {!hasSupabaseConfig() ? (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Supabase env vars are not configured yet. Showing local seed data for the MVP flow.
        </div>
      ) : null}

      <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3 lg:hidden">
          <MobileFilterToggle
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            selectedTypes={selectedTypes}
          />
        </div>
        <div className="hidden lg:block">
          <FilterSidebar
            selectedTypes={selectedTypes}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
          />
        </div>
        <div className="space-y-5">
          <SavedSizePreferences preferences={savedSizePreferences} />
          <ProductGrid products={filteredProducts} />
        </div>
      </section>
    </div>
  );
}
