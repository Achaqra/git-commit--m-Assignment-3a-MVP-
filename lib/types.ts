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
  productName?: string;
  color?: string;
  size: string;
  quantity: number;
  unitPrice?: number;
};

export type Order = {
  id: string;
  orderNumber?: string;
  status: "Processing" | "Shipped" | "Delivered";
  trackingNumber?: string;
  eta?: string;
  placedAt: string;
  subtotal?: number;
  shippingAmount?: number;
  totalAmount?: number;
  items: OrderItem[];
};