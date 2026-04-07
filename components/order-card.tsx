import Link from "next/link";

import type { Order, Product } from "@/lib/types";

type OrderCardProps = {
  order: Order;
  product: Product;
};

function badgeStyles(status: Order["status"]): string {
  if (status === "Delivered") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (status === "Shipped") {
    return "bg-sky-100 text-sky-800";
  }
  return "bg-amber-100 text-amber-800";
}

export function OrderCard({ order, product }: OrderCardProps) {
  const firstItem = order.items[0];

  if (!firstItem) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-zinc-800/10 bg-white/85 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.17em] text-zinc-500">Order {order.id}</p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-900">{product.name}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${badgeStyles(order.status)}`}
        >
          {order.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-zinc-700 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-zinc-500">Placed</dt>
          <dd>{order.placedAt}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-zinc-500">Tracking</dt>
          <dd>{order.trackingNumber}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-zinc-500">ETA</dt>
          <dd>{order.eta}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-zinc-500">Size</dt>
          <dd>{firstItem.size}</dd>
        </div>
      </dl>

      <div className="mt-5 flex gap-2">
        <Link
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#bb3e03]"
          href={`/checkout?product=${product.id}&size=${firstItem.size}`}
        >
          Reorder this fit
        </Link>
        <Link
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          href={`/products/${product.id}`}
        >
          View item
        </Link>
      </div>
    </article>
  );
}