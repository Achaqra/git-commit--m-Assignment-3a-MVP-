import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-10 text-center">
        <p className="text-lg font-semibold text-zinc-800">No matching products yet</p>
        <p className="mt-2 text-sm text-zinc-600">
          Try removing one filter to see more Superior Fits pieces.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}