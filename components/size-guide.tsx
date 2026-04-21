import { formatSizeLabel, getSizeGuideNote } from "@/lib/size-labels";

type SizeGuideProps = {
  sizeGuidance: string;
  savedTopSize: string;
  sizes: string[];
  highlightedSize?: string;
};

export function SizeGuide({ sizeGuidance, savedTopSize, sizes, highlightedSize }: SizeGuideProps) {
  return (
    <section className="rounded-2xl border border-zinc-900/10 bg-white/90 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Size Recommendation</h2>
        <details className="group w-full max-w-xs text-xs text-zinc-600 sm:w-auto">
          <summary className="inline-flex cursor-pointer list-none items-center rounded-full border border-zinc-300 px-3 py-1 transition hover:border-zinc-500 hover:text-zinc-900">
            Size guide
          </summary>
          <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 leading-5">
            {getSizeGuideNote()}
          </div>
        </details>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{sizeGuidance}</p>
      <p className="mt-3 text-sm text-zinc-700">
        Saved top size: <span className="font-semibold text-zinc-900">{formatSizeLabel(savedTopSize)}</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <span
            key={size}
            className={`rounded-md border px-2 py-1 text-xs font-medium ${
              highlightedSize === size
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-zinc-50 text-zinc-700"
            }`}
          >
            {formatSizeLabel(size)}
          </span>
        ))}
      </div>
    </section>
  );
}