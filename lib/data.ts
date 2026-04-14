import { orders as mockOrders, products as mockProducts, savedSizePreferences as mockSavedSizePreferences } from "@/lib/seed-data";
import { getSupabaseAdminClient, getSupabaseClient } from "@/lib/supabase";
import type { Order, OrderItem, Product, SizePreferences } from "@/lib/types";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toOrderItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<OrderItem>;
      if (
        typeof candidate.productId !== "string" ||
        typeof candidate.size !== "string" ||
        typeof candidate.quantity !== "number"
      ) {
        return null;
      }

      return {
        productId: candidate.productId,
        productName: typeof candidate.productName === "string" ? candidate.productName : undefined,
        color: typeof candidate.color === "string" ? candidate.color : undefined,
        size: candidate.size,
        quantity: candidate.quantity,
        unitPrice: toNumber(candidate.unitPrice) ?? undefined,
      };
    })
    .filter((item): item is OrderItem => Boolean(item));
}

function normalizeProduct(row: Record<string, unknown>): Product | null {
  const id = typeof row.id === "string" ? row.id : null;
  const name = typeof row.name === "string" ? row.name : null;
  const type = typeof row.type === "string" ? row.type : null;
  const color = typeof row.color === "string" ? row.color : null;
  const price = toNumber(row.price);

  if (!id || !name || !type || !color || price === null) {
    return null;
  }

  return {
    id,
    name,
    type: type as Product["type"],
    color,
    price,
    imageLabel: typeof row.imageLabel === "string" ? row.imageLabel : typeof row.image_label === "string" ? row.image_label : "Fit",
    imageUrl:
      typeof row.imageUrl === "string"
        ? row.imageUrl
        : typeof row.image_url === "string"
          ? row.image_url
          : undefined,
    description:
      typeof row.description === "string"
        ? row.description
        : "Streetwear staple built for everyday movement.",
    sizes: toStringArray(row.sizes),
    sizeGuidance:
      typeof row.sizeGuidance === "string"
        ? row.sizeGuidance
        : typeof row.size_guidance === "string"
          ? row.size_guidance
          : "Choose your usual EU size for a balanced fit.",
    recommendedWith:
      toStringArray(row.recommendedWith).length > 0
        ? toStringArray(row.recommendedWith)
        : toStringArray(row.recommended_with),
  };
}

function normalizeOrder(row: Record<string, unknown>): Order | null {
  const id = typeof row.id === "string" ? row.id : null;
  const status = typeof row.status === "string" ? row.status : null;

  if (!id || !status) {
    return null;
  }

  const parsedStatus =
    status === "Processing" || status === "Shipped" || status === "Delivered"
      ? status
      : "Processing";

  return {
    id,
    orderNumber: typeof row.orderNumber === "string" ? row.orderNumber : typeof row.order_number === "string" ? row.order_number : undefined,
    status: parsedStatus,
    trackingNumber:
      typeof row.trackingNumber === "string"
        ? row.trackingNumber
        : typeof row.tracking_number === "string"
          ? row.tracking_number
          : "Pending",
    eta: typeof row.eta === "string" ? row.eta : "TBD",
    placedAt:
      typeof row.placedAt === "string"
        ? row.placedAt
        : typeof row.placed_at === "string"
          ? row.placed_at
          : "Recently",
    subtotal: toNumber(row.subtotal) ?? undefined,
    shippingAmount: toNumber(row.shippingAmount) ?? toNumber(row.shipping_amount) ?? undefined,
    totalAmount: toNumber(row.totalAmount) ?? toNumber(row.total_amount) ?? undefined,
    items: toOrderItems(row.items ?? row.order_items),
  };
}

export async function getProducts(): Promise<Product[]> {
  const client = getSupabaseAdminClient() ?? getSupabaseClient();
  if (!client) {
    return mockProducts;
  }

  const { data, error } = await client.from("products").select("*");
  if (error || !data || !data.length) {
    return mockProducts;
  }

  const normalized = data
    .map((row) => normalizeProduct(row as Record<string, unknown>))
    .filter((row): row is Product => Boolean(row));

  return normalized.length ? normalized : mockProducts;
}

export async function getSavedSizePreferences(): Promise<SizePreferences> {
  const client = getSupabaseAdminClient() ?? getSupabaseClient();
  if (!client) {
    return mockSavedSizePreferences;
  }

  const { data, error } = await client
    .from("saved_preferences")
    .select("top,bottom,footwear")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return mockSavedSizePreferences;
  }

  if (
    typeof data.top !== "string" ||
    typeof data.bottom !== "string" ||
    typeof data.footwear !== "string"
  ) {
    return mockSavedSizePreferences;
  }

  return {
    top: data.top,
    bottom: data.bottom,
    footwear: data.footwear,
  };
}

export async function getOrders(): Promise<Order[]> {
  const client = getSupabaseAdminClient() ?? getSupabaseClient();
  if (!client) {
    return mockOrders;
  }

  const { data, error } = await client
    .from("orders")
    .select("*, order_items(id, product_id, product_name, color, size, quantity, unit_price)")
    .order("created_at", { ascending: false });
  if (error || !data || !data.length) {
    return mockOrders;
  }

  const normalized = data
    .map((row) => normalizeOrder(row as Record<string, unknown>))
    .filter((row): row is Order => Boolean(row));

  return normalized.length ? normalized : mockOrders;
}
