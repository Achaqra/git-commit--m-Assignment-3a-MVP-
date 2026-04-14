import type { SizePreferences } from "@/lib/types";
import { formatSizeLabel } from "@/lib/size-labels";

type SavedSizePreferencesProps = {
  preferences: SizePreferences;
};

export function SavedSizePreferences({ preferences }: SavedSizePreferencesProps) {
  return (
    <section className="rounded-2xl border border-zinc-800/10 bg-white/80 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Saved Size Preferences</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-zinc-100 p-3">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Top</dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900">{formatSizeLabel(preferences.top)}</dd>
        </div>
        <div className="rounded-xl bg-zinc-100 p-3">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Bottom</dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900">{formatSizeLabel(preferences.bottom)}</dd>
        </div>
        <div className="rounded-xl bg-zinc-100 p-3">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Footwear</dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900">{formatSizeLabel(preferences.footwear)}</dd>
        </div>
      </dl>
    </section>
  );
}