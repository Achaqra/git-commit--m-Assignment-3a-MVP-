import Link from "next/link";

import { OrderCard } from "@/components/order-card";
import { SavedSizePreferences } from "@/components/saved-size-preferences";
import { getOrders, getProducts, getSavedSizePreferences } from "@/lib/data";

export default async function OrdersPage() {
  const [orders, products, savedSizePreferences] = await Promise.all([
    getOrders(),
    getProducts(),
    getSavedSizePreferences(),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-zinc-900/10 bg-white/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Superior Fits</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Orders and tracking</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Quickly check status and reorder with your saved size preferences.
            </p>
          </div>
          <Link
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#bb3e03]"
            href="/"
          >
            Continue shopping
          </Link>
        </div>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const product = firstItem ? products.find((item) => item.id === firstItem.productId) : undefined;

            if (!product) {
              return null;
            }

            return <OrderCard key={order.id} order={order} product={product} />;
          })}
        </div>
        <SavedSizePreferences preferences={savedSizePreferences} />
      </section>
    </div>
  );
}