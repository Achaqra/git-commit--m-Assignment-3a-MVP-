const alphaSizeMap: Record<string, string> = {
  "EU XS": "US XS",
  "EU S": "US S",
  "EU M": "US M",
  "EU L": "US L",
  "EU XL": "US XL",
};

const numericSizeMap: Record<number, string> = {
  42: "9",
  44: "28",
  46: "30",
  48: "32",
  50: "34",
  52: "36",
};

export function formatSizeLabel(size: string): string {
  const normalizedSize = size.trim();

  if (alphaSizeMap[normalizedSize]) {
    return `${normalizedSize} (${alphaSizeMap[normalizedSize]})`;
  }

  const numericMatch = normalizedSize.match(/^EU\s*(\d+)$/i);
  if (numericMatch) {
    const numericValue = Number(numericMatch[1]);
    const usSize = numericSizeMap[numericValue];

    if (usSize) {
      return `${normalizedSize.toUpperCase()} (US ${usSize})`;
    }
  }

  return normalizedSize;
}

export function getSizeGuideNote(): string {
  return "US equivalents are approximate. Example: EU 42 (US 9) in footwear.";
}