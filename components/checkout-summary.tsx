import type { Product } from "@/lib/types";

type CheckoutSummaryProps = {
  product: Product;
  size: string;
};

export function CheckoutSummary({ product, size }: CheckoutSummaryProps) {
  const shipping = 7;
  const total = product.price + shipping;

  return (
    <section className="rounded-2xl border border-zinc-800/10 bg-white/85 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Cart Summary</h2>
      <div className="mt-4 space-y-3 text-sm text-zinc-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-zinc-900">{product.name}</p>
            <p>{product.color}</p>
            <p>Size: {size}</p>
          </div>
          <p className="font-semibold text-zinc-900">${product.price}</p>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-3">
          <p>Shipping</p>
          <p>${shipping}</p>
        </div>
        <div className="flex justify-between text-base font-semibold text-zinc-900">
          <p>Total</p>
          <p>${total}</p>
        </div>
      </div>
      <button
        className="mt-5 w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#bb3e03]"
        type="button"
      >
        Place order
      </button>
    </section>
  );
}