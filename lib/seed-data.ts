import type { Order, Product, SizePreferences } from "@/lib/types";

export const products: Product[] = [
  {
    id: "sf-hoodie-001",
    name: "Concrete Script Hoodie",
    type: "Hoodie",
    color: "Black",
    price: 89,
    imageLabel: "Hoodie",
    imageUrl: "/products/concrete-script-hoodie.svg",
    description:
      "Heavyweight fleece hoodie with a boxy silhouette made for layered streetwear fits.",
    sizes: ["EU XS", "EU S", "EU M", "EU L", "EU XL"],
    sizeGuidance:
      "Runs slightly oversized. Choose your usual EU top size for a relaxed fit, or one size down for a cleaner shape.",
    recommendedWith: ["sf-cargo-001", "sf-tee-001"],
  },
  {
    id: "sf-tee-001",
    name: "Midnight Oversized Tee",
    type: "Tee",
    color: "Charcoal",
    price: 39,
    imageLabel: "Tee",
    imageUrl: "/products/midnight-oversized-tee.svg",
    description:
      "Dropped-shoulder cotton tee with a soft wash treatment for everyday wear.",
    sizes: ["EU XS", "EU S", "EU M", "EU L", "EU XL"],
    sizeGuidance:
      "Designed as oversized. Size down if you prefer a more tailored chest and sleeve length.",
    recommendedWith: ["sf-cargo-002", "sf-outer-001"],
  },
  {
    id: "sf-cargo-001",
    name: "Urban Utility Cargo",
    type: "Cargo",
    color: "Olive",
    price: 79,
    imageLabel: "Cargo",
    imageUrl: "/products/urban-utility-cargo.svg",
    description:
      "Tapered cargo pants with articulated knees and a flexible waist tab.",
    sizes: ["EU 44", "EU 46", "EU 48", "EU 50", "EU 52"],
    sizeGuidance:
      "If you are between sizes, choose the larger EU waist size for comfort in the thigh and seat.",
    recommendedWith: ["sf-hoodie-001", "sf-outer-002"],
  },
  {
    id: "sf-outer-001",
    name: "Transit Windbreaker",
    type: "Outerwear",
    color: "Stone",
    price: 119,
    imageLabel: "Jacket",
    imageUrl: "/products/transit-windbreaker.svg",
    description:
      "Lightweight shell jacket with matte finish and hidden storm pockets.",
    sizes: ["EU S", "EU M", "EU L", "EU XL"],
    sizeGuidance:
      "True to size in shoulders. Consider one size up if layering over thick hoodies.",
    recommendedWith: ["sf-tee-001", "sf-cargo-001"],
  },
  {
    id: "sf-cargo-002",
    name: "Night Runner Cargo",
    type: "Cargo",
    color: "Black",
    price: 84,
    imageLabel: "Cargo",
    imageUrl: "/products/night-runner-cargo.svg",
    description:
      "Slim cargo with ankle adjusters and stretch fabric for all-day movement.",
    sizes: ["EU 44", "EU 46", "EU 48", "EU 50", "EU 52"],
    sizeGuidance:
      "Slim through the calf. If you have athletic legs, go one size up.",
    recommendedWith: ["sf-tee-002", "sf-outer-001"],
  },
  {
    id: "sf-tee-002",
    name: "Box Logo Tee",
    type: "Tee",
    color: "White",
    price: 35,
    imageLabel: "Tee",
    imageUrl: "/products/box-logo-tee.svg",
    description:
      "Premium heavyweight tee with a minimal chest mark and clean drape.",
    sizes: ["EU XS", "EU S", "EU M", "EU L", "EU XL"],
    sizeGuidance:
      "Standard fit in body width. Stay true to size for a crisp profile.",
    recommendedWith: ["sf-cargo-001", "sf-outer-002"],
  },
  {
    id: "sf-outer-002",
    name: "Rail Coach Jacket",
    type: "Outerwear",
    color: "Navy",
    price: 109,
    imageLabel: "Jacket",
    imageUrl: "/products/rail-coach-jacket.svg",
    description:
      "Structured coach jacket with tonal snap buttons and soft lining.",
    sizes: ["EU S", "EU M", "EU L", "EU XL"],
    sizeGuidance:
      "Regular fit. Choose your normal size unless you prefer a looser shoulder line.",
    recommendedWith: ["sf-tee-002", "sf-cargo-002"],
  },
  {
    id: "sf-hoodie-002",
    name: "Afterhours Zip Hoodie",
    type: "Hoodie",
    color: "Grey",
    price: 92,
    imageLabel: "Hoodie",
    imageUrl: "/products/afterhours-zip-hoodie.svg",
    description:
      "Zip hoodie with double-layer hood and brushed interior for cold evenings.",
    sizes: ["EU XS", "EU S", "EU M", "EU L", "EU XL"],
    sizeGuidance:
      "Slightly cropped hem. If you prefer extra body length, size up.",
    recommendedWith: ["sf-cargo-002", "sf-tee-001"],
  },
];

export const savedSizePreferences: SizePreferences = {
  top: "EU M",
  bottom: "EU 48",
  footwear: "EU 42",
};

export const orders: Order[] = [
  {
    id: "SF-20391",
    status: "Shipped",
    trackingNumber: "TRK-88736420",
    eta: "Apr 10, 2026",
    placedAt: "Apr 4, 2026",
    items: [
      {
        productId: "sf-hoodie-001",
        size: "EU M",
        quantity: 1,
      },
    ],
  },
  {
    id: "SF-20120",
    status: "Delivered",
    trackingNumber: "TRK-77424502",
    eta: "Delivered Apr 1, 2026",
    placedAt: "Mar 27, 2026",
    items: [
      {
        productId: "sf-cargo-001",
        size: "EU 48",
        quantity: 1,
      },
    ],
  },
];

export function findProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getRecommendedProducts(product: Product): Product[] {
  return product.recommendedWith
    .map((id) => findProductById(id))
    .filter((item): item is Product => Boolean(item));
}
