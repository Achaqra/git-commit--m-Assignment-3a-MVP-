export type ProductType = "Hoodie" | "Tee" | "Cargo" | "Outerwear";

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  color: string;
  price: number;
  imageLabel: string;
  imageUrl?: string;
  description: string;
  sizes: string[];
  sizeGuidance: string;
  recommendedWith: string[];
};

export type SizePreferences = {
  top: string;
  bottom: string;
  footwear: string;
};

export type OrderItem = {
  productId: string;
  size: string;
  quantity: number;
};

export type Order = {
  id: string;
  status: "Processing" | "Shipped" | "Delivered";
  trackingNumber: string;
  eta: string;
  placedAt: string;
  items: OrderItem[];
};