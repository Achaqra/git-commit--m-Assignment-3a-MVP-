"use client";

import { useState } from "react";

import { FilterSidebar } from "@/components/filter-sidebar";

type MobileFilterToggleProps = {
  selectedTypes: string[];
  selectedColors: string[];
  selectedSizes: string[];
};

export function MobileFilterToggle({ selectedTypes, selectedColors, selectedSizes }: MobileFilterToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={open}
        aria-controls="mobile-filter-panel"
        className="flex w-full items-center justify-between rounded-2xl border border-zinc-900/10 bg-white/95 px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-500 hover:bg-white"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span>Filter Products</span>
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">{open ? "Hide" : "Show"}</span>
      </button>

      {open ? (
        <div id="mobile-filter-panel" className="mt-3">
          <FilterSidebar
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            selectedTypes={selectedTypes}
          />
        </div>
      ) : null}
    </div>
  );
}