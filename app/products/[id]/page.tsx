import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { SizeSelector } from "@/components/size-selector";
import { SizeGuide } from "@/components/size-guide";
import { getProducts, getSavedSizePreferences } from "@/lib/data";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [products, savedSizePreferences] = await Promise.all([
    getProducts(),
    getSavedSizePreferences(),
  ]);

  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const recommended = products.filter((item) => product.recommendedWith.includes(item.id));

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-zinc-800/10 bg-white/90 p-6 shadow-sm">
          <div className="flex aspect-[16/10] items-end rounded-2xl bg-linear-to-br from-zinc-900 via-zinc-700 to-zinc-500 p-5">
            <span className="rounded-md bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-900">
              {product.imageLabel}
            </span>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-zinc-500">{product.type}</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-900">{product.name}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{product.description}</p>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-800/10 bg-white/90 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Price</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-900">${product.price}</p>
            <p className="mt-3 text-sm text-zinc-600">Color: {product.color}</p>
            <p className="text-sm text-zinc-600">Available: {product.sizes.join(", ")}</p>
          </div>

          <SizeGuide
            savedTopSize={savedSizePreferences.top}
            sizeGuidance={product.sizeGuidance}
            highlightedSize={savedSizePreferences.top}
            sizes={product.sizes}
          />

          <div className="rounded-2xl border border-zinc-800/10 bg-white/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Add to cart</h2>
            <form action="/checkout" className="mt-4 grid gap-3" method="get">
              <input name="product" type="hidden" value={product.id} />
              <SizeSelector
                defaultValue={savedSizePreferences.top}
                description="US equivalents are shown to make EU sizing easier to compare."
                id="product-size"
                label="Choose size"
                name="size"
                sizes={product.sizes}
              />
              <button
                aria-label={`Add ${product.name} to cart and proceed to checkout`}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#bb3e03]"
                type="submit"
              >
                Add to cart and checkout
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                href="/"
              >
                Back to browse
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900">Recommended with this fit</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {recommended.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}