type SizeGuideProps = {
  sizeGuidance: string;
  savedTopSize: string;
  sizes: string[];
};

export function SizeGuide({ sizeGuidance, savedTopSize, sizes }: SizeGuideProps) {
  return (
    <section className="rounded-2xl border border-zinc-800/10 bg-white/85 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Size Recommendation</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{sizeGuidance}</p>
      <p className="mt-3 text-sm text-zinc-700">
        Saved top size: <span className="font-semibold text-zinc-900">{savedTopSize}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <span
            key={size}
            className="rounded-md border border-zinc-300 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700"
          >
            {size}
          </span>
        ))}
      </div>
    </section>
  );
}