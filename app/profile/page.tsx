import { SavedSizePreferences } from "@/components/saved-size-preferences";
import { getSavedSizePreferences } from "@/lib/data";

export default async function ProfilePage() {
  const savedSizePreferences = await getSavedSizePreferences();

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-zinc-900/10 bg-white/88 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Profile</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage your fit preferences to speed up future checkouts and reorders.
        </p>
      </header>

      <section className="mt-6">
        <SavedSizePreferences preferences={savedSizePreferences} />
      </section>
    </div>
  );
}