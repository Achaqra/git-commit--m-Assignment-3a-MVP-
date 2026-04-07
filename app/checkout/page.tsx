import Link from "next/link";

import { CheckoutSummary } from "@/components/checkout-summary";
import { SavedSizePreferences } from "@/components/saved-size-preferences";
import { getProducts, getSavedSizePreferences } from "@/lib/data";

type SearchParams = Promise<{
  product?: string;
  size?: string;
}>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, savedSizePreferences] = await Promise.all([
    getProducts(),
    getSavedSizePreferences(),
  ]);

  const params = await searchParams;
  const selectedProduct = params.product ? products.find((product) => product.id === params.product) : undefined;
  const fallbackProduct = products[0];
  const product = selectedProduct ?? fallbackProduct;
  const size = params.size ?? savedSizePreferences.top;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-zinc-900/10 bg-white/80 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Superior Fits Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Secure checkout</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Clear order summary, saved sizing, and quick completion for mobile and desktop.
        </p>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <SavedSizePreferences preferences={savedSizePreferences} />

          <div className="rounded-2xl border border-zinc-800/10 bg-white/85 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Shipping and Payment</h2>
            <form className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>First name</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="Alex" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Last name</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="Walker" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-2">
                <span>Street address</span>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                  defaultValue="44 Mercer Street"
                />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>City</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="Berlin" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Postal code</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="10115" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-2">
                <span>Preferred size for this item</span>
                <select className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue={size}>
                  {product.sizes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-2">
                <span>Card number</span>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                  defaultValue="4242 4242 4242 4242"
                />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Expiry</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="12/28" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>CVC</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="123" />
              </label>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <CheckoutSummary product={product} size={size} />
          <div className="rounded-2xl border border-zinc-800/10 bg-white/85 p-5 text-sm text-zinc-700">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Need to adjust?</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                href={`/products/${product.id}`}
              >
                Back to product
              </Link>
              <Link
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                href="/orders"
              >
                View orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}