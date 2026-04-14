import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutSummary } from "@/components/checkout-summary";
import { SavedSizePreferences } from "@/components/saved-size-preferences";
import { SizeSelector } from "@/components/size-selector";
import { getProducts, getSavedSizePreferences } from "@/lib/data";
import { getSupabaseAdminClient } from "@/lib/supabase";

function toNumber(value: FormDataEntryValue | null, fallback: number): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function placeOrder(formData: FormData) {
  "use server";

  const client = getSupabaseAdminClient();
  if (!client) {
    redirect("/orders?success=0");
  }

  const productId = String(formData.get("product") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const quantity = toNumber(formData.get("quantity"), 1);
  const shippingFirstName = String(formData.get("shipping_first_name") ?? "Alex").trim();
  const shippingLastName = String(formData.get("shipping_last_name") ?? "Walker").trim();
  const shippingName = `${shippingFirstName} ${shippingLastName}`.trim();
  const shippingEmail = String(formData.get("shipping_email") ?? "alex@superiorfits.com").trim();
  const shippingAddressLine1 = String(formData.get("shipping_address_line1") ?? "44 Mercer Street").trim();
  const shippingCity = String(formData.get("shipping_city") ?? "Berlin").trim();
  const shippingPostalCode = String(formData.get("shipping_postal_code") ?? "10115").trim();
  const shippingCountry = String(formData.get("shipping_country") ?? "DE").trim();

  if (!productId || !size) {
    redirect("/orders?success=0");
  }

  const { data: product, error: productError } = await client
    .from("products")
    .select("id, name, color, price")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    redirect("/orders?success=0");
  }

  const unitPrice = typeof product.price === "number" ? product.price : Number(product.price);
  const subtotal = unitPrice * quantity;
  const shippingAmount = 7;
  const totalAmount = subtotal + shippingAmount;
  const orderNumber = `SF-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "Processing",
      shipping_name: shippingName,
      shipping_email: shippingEmail,
      shipping_address_line1: shippingAddressLine1,
      shipping_city: shippingCity,
      shipping_postal_code: shippingPostalCode,
      shipping_country: shippingCountry || "DE",
      payment_method: "card",
      subtotal,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect("/orders?success=0");
  }

  const { error: itemError } = await client.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    product_name: product.name,
    color: product.color,
    size,
    quantity,
    unit_price: unitPrice,
  });

  if (itemError) {
    redirect("/orders?success=0");
  }

  redirect(`/orders?success=1&order=${encodeURIComponent(orderNumber)}`);
}

type SearchParams = Promise<{
  product?: string;
  size?: string;
}>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, savedSizePreferences] = await Promise.all([
    getProducts(),
    getSavedSizePreferences(),
  ]);

  const params = await searchParams;
  const selectedProduct = params.product ? products.find((product) => product.id === params.product) : undefined;
  const fallbackProduct = products[0];
  const product = selectedProduct ?? fallbackProduct;
  const size = params.size ?? savedSizePreferences.top;
  const quantity = 1;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-zinc-900/10 bg-white/80 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Superior Fits Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Secure checkout</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Clear order summary, saved sizing, and quick completion for mobile and desktop.
        </p>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <SavedSizePreferences preferences={savedSizePreferences} />

          <form action={placeOrder} id="checkout-form" className="rounded-2xl border border-zinc-800/10 bg-white/85 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Shipping and Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input name="product" type="hidden" value={product.id} />
              <input name="quantity" type="hidden" value={quantity} />
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>First name</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="Alex" name="shipping_first_name" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Last name</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="Walker" name="shipping_last_name" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-2">
                <span>Street address</span>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                  defaultValue="44 Mercer Street"
                  name="shipping_address_line1"
                />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>City</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="Berlin" name="shipping_city" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Postal code</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="10115" name="shipping_postal_code" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Email</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="alex@superiorfits.com" name="shipping_email" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Country</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="DE" name="shipping_country" />
              </label>
              <div className="sm:col-span-2">
                <SizeSelector
                  defaultValue={size}
                  description="US equivalents are approximate so EU sizing feels easier to compare."
                  id="checkout-size"
                  label="Preferred size for this item"
                  name="size"
                  sizes={product.sizes}
                />
              </div>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-2">
                <span>Card number</span>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                  defaultValue="4242 4242 4242 4242"
                  name="payment_card_number"
                />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>Expiry</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="12/28" name="payment_expiry" />
              </label>
              <label className="space-y-1 text-sm text-zinc-700 sm:col-span-1">
                <span>CVC</span>
                <input className="w-full rounded-lg border border-zinc-300 px-3 py-2" defaultValue="123" name="payment_cvc" />
              </label>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <CheckoutSummary product={product} quantity={quantity} size={size} />
          <div className="rounded-2xl border border-zinc-800/10 bg-white/85 p-5 text-sm text-zinc-700">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">Need to adjust?</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                href={`/products/${product.id}`}
              >
                Back to product
              </Link>
              <Link
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
                href="/orders"
              >
                View orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}