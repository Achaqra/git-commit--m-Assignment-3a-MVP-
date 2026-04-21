import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/types";
import { formatSizeLabel } from "@/lib/size-labels";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group rounded-2xl border border-zinc-800/10 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex aspect-[4/3] items-end overflow-hidden rounded-xl bg-linear-to-br from-zinc-900 via-zinc-700 to-zinc-500 p-4">
        {product.imageUrl ? (
          <Image
            alt={product.name}
            className="object-cover opacity-90 transition duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={product.imageUrl}
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-zinc-950/20 to-transparent" />
        <span className="relative rounded-md bg-white/85 px-2 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900">
          {product.imageLabel}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{product.type}</p>
        <h3 className="text-lg font-semibold text-zinc-900">{product.name}</h3>
        <p className="text-sm text-zinc-600">{product.color}</p>
        <p className="text-xs text-zinc-500">Sizes: {product.sizes.map(formatSizeLabel).join(", ")}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-semibold text-zinc-900">${product.price}</p>
        <Link
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#bb3e03] group-hover:bg-[#bb3e03]"
          href={`/products/${product.id}`}
        >
          View item
        </Link>
      </div>
    </article>
  );
}