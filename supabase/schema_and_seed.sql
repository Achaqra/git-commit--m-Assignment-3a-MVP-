-- Superior Fits schema + seed
-- Run this file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create type product_category as enum ('Hoodie', 'Tee', 'Cargo', 'Outerwear');
create type order_status as enum ('Processing', 'Shipped', 'Delivered', 'Cancelled');

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type product_category not null,
  color text not null,
  description text not null,
  image_url text,
  image_label text not null default 'Fit',
  size_guidance text not null,
  sizes text[] not null default '{}',
  recommended_with uuid[] not null default '{}',
  price numeric(10,2) not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  color text not null,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  price_override numeric(10,2) check (price_override is null or price_override >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, color, size)
);

create table if not exists profiles (
  id uuid primary key,
  email text unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  profile_id uuid references profiles(id) on delete set null,
  status order_status not null default 'Processing',
  tracking_number text,
  eta_date date,
  shipping_name text not null,
  shipping_email text not null,
  shipping_address_line1 text not null,
  shipping_city text not null,
  shipping_postal_code text not null,
  shipping_country text not null default 'DE',
  payment_method text not null default 'card',
  subtotal numeric(10,2) not null default 0,
  shipping_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  placed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid references product_variants(id),
  product_name text not null,
  color text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists saved_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  top text not null,
  bottom text not null,
  footwear text not null,
  preferred_fit text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_type on products(type);
create index if not exists idx_products_color on products(color);
create index if not exists idx_product_variants_product on product_variants(product_id);
create index if not exists idx_product_variants_stock on product_variants(stock);
create index if not exists idx_orders_profile on orders(profile_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order on order_items(order_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
before update on products
for each row
execute function set_updated_at();

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
before update on profiles
for each row
execute function set_updated_at();

drop trigger if exists trg_saved_preferences_updated_at on saved_preferences;
create trigger trg_saved_preferences_updated_at
before update on saved_preferences
for each row
execute function set_updated_at();

alter table products enable row level security;
alter table product_variants enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table saved_preferences enable row level security;

drop policy if exists products_public_read on products;
create policy products_public_read
on products
for select
to anon, authenticated
using (is_active = true);

drop policy if exists product_variants_public_read on product_variants;
create policy product_variants_public_read
on product_variants
for select
to anon, authenticated
using (true);

drop policy if exists profiles_self_select on profiles;
create policy profiles_self_select
on profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update
on profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists orders_self_read on orders;
create policy orders_self_read
on orders
for select
to authenticated
using (auth.uid() = profile_id);

drop policy if exists order_items_self_read on order_items;
create policy order_items_self_read
on order_items
for select
to authenticated
using (
  exists (
    select 1
    from orders
    where orders.id = order_items.order_id
      and orders.profile_id = auth.uid()
  )
);

drop policy if exists saved_preferences_self_read on saved_preferences;
create policy saved_preferences_self_read
on saved_preferences
for select
to authenticated
using (auth.uid() = profile_id);

drop policy if exists saved_preferences_self_write on saved_preferences;
create policy saved_preferences_self_write
on saved_preferences
for all
to authenticated
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

-- Seed data
insert into profiles (id, email, full_name, phone)
values
  ('f6a794cf-3d38-4237-a98f-84f0c0f6d001', 'alex@superiorfits.com', 'Alex Walker', '+49-151-2003001'),
  ('bc752ca8-0f2c-4cd9-a095-6f661f9c2002', 'jordan@superiorfits.com', 'Jordan Miles', '+49-151-2003002')
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  phone = excluded.phone;

insert into products (
  id, slug, name, type, color, description, image_url, image_label,
  size_guidance, sizes, recommended_with, price, is_active
)
values
  (
    '9f6ed22a-86c0-4da8-8cb0-d46e71320001',
    'concrete-script-hoodie',
    'Concrete Script Hoodie',
    'Hoodie',
    'Black',
    'Heavyweight fleece hoodie with a boxy silhouette made for layered streetwear fits.',
    '/products/concrete-script-hoodie.svg',
    'Hoodie',
    'Runs slightly oversized. Choose your usual EU top size for relaxed fit or one size down for cleaner shape.',
    array['EU XS','EU S','EU M','EU L','EU XL'],
    array['c377deec-50f0-4d69-8e2d-49966d450003'::uuid,'57175f9d-017f-4f49-b2a4-d7ea63e90002'::uuid],
    89.00,
    true
  ),
  (
    '57175f9d-017f-4f49-b2a4-d7ea63e90002',
    'midnight-oversized-tee',
    'Midnight Oversized Tee',
    'Tee',
    'Charcoal',
    'Dropped-shoulder cotton tee with a soft wash treatment for everyday wear.',
    '/products/midnight-oversized-tee.svg',
    'Tee',
    'Designed oversized. Size down for a more tailored chest and sleeve length.',
    array['EU XS','EU S','EU M','EU L','EU XL'],
    array['ffdf0bd6-1297-4c48-9cfa-787dcc8b0004'::uuid],
    39.00,
    true
  ),
  (
    'c377deec-50f0-4d69-8e2d-49966d450003',
    'urban-utility-cargo',
    'Urban Utility Cargo',
    'Cargo',
    'Olive',
    'Tapered cargo pants with articulated knees and flexible waist tab.',
    '/products/urban-utility-cargo.svg',
    'Cargo',
    'If between sizes, choose the larger EU waist size for comfort in thigh and seat.',
    array['EU 44','EU 46','EU 48','EU 50','EU 52'],
    array['9f6ed22a-86c0-4da8-8cb0-d46e71320001'::uuid],
    79.00,
    true
  ),
  (
    'ffdf0bd6-1297-4c48-9cfa-787dcc8b0004',
    'transit-windbreaker',
    'Transit Windbreaker',
    'Outerwear',
    'Stone',
    'Lightweight shell jacket with matte finish and hidden storm pockets.',
    '/products/transit-windbreaker.svg',
    'Jacket',
    'True to size in shoulders. Consider one size up if layering over thick hoodies.',
    array['EU S','EU M','EU L','EU XL'],
    array['57175f9d-017f-4f49-b2a4-d7ea63e90002'::uuid],
    119.00,
    true
  )
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  type = excluded.type,
  color = excluded.color,
  description = excluded.description,
  image_url = excluded.image_url,
  image_label = excluded.image_label,
  size_guidance = excluded.size_guidance,
  sizes = excluded.sizes,
  recommended_with = excluded.recommended_with,
  price = excluded.price,
  is_active = excluded.is_active;

insert into product_variants (id, product_id, sku, color, size, stock, price_override)
values
  ('98757f86-eec1-4a9b-b556-d3d6380a1001', '9f6ed22a-86c0-4da8-8cb0-d46e71320001', 'SF-HOOD-BLK-XS', 'Black', 'EU XS', 8, null),
  ('2d0eb3b7-f87f-4dc2-9f58-bbc2456e1002', '9f6ed22a-86c0-4da8-8cb0-d46e71320001', 'SF-HOOD-BLK-S', 'Black', 'EU S', 11, null),
  ('05cc8658-e80f-4ece-ae16-c0f74f221003', '9f6ed22a-86c0-4da8-8cb0-d46e71320001', 'SF-HOOD-BLK-M', 'Black', 'EU M', 14, null),
  ('f7f22726-4da7-4dd1-b9ca-dbc31e431004', '9f6ed22a-86c0-4da8-8cb0-d46e71320001', 'SF-HOOD-BLK-L', 'Black', 'EU L', 9, null),
  ('0729f75c-1937-436d-a2ce-c753f0781005', '9f6ed22a-86c0-4da8-8cb0-d46e71320001', 'SF-HOOD-BLK-XL', 'Black', 'EU XL', 5, null),

  ('7535dd4e-7dc5-4e76-b2bc-35ec91fd2001', '57175f9d-017f-4f49-b2a4-d7ea63e90002', 'SF-TEE-CHR-XS', 'Charcoal', 'EU XS', 17, null),
  ('10982784-26dd-4d15-b657-03d773632002', '57175f9d-017f-4f49-b2a4-d7ea63e90002', 'SF-TEE-CHR-S', 'Charcoal', 'EU S', 22, null),
  ('f994f4cc-5aa8-4f7a-aa5d-d089fc4f2003', '57175f9d-017f-4f49-b2a4-d7ea63e90002', 'SF-TEE-CHR-M', 'Charcoal', 'EU M', 20, null),
  ('00e302b0-01f0-4455-9200-4d0e9a252004', '57175f9d-017f-4f49-b2a4-d7ea63e90002', 'SF-TEE-CHR-L', 'Charcoal', 'EU L', 13, null),
  ('95f88545-a6c7-4a28-9f0e-6710f0ae2005', '57175f9d-017f-4f49-b2a4-d7ea63e90002', 'SF-TEE-CHR-XL', 'Charcoal', 'EU XL', 7, null),

  ('0d826b09-f9c0-4d3f-96c4-2ceff7d53001', 'c377deec-50f0-4d69-8e2d-49966d450003', 'SF-CAR-OLV-44', 'Olive', 'EU 44', 6, null),
  ('f6580f99-4516-4fce-8c2c-8240f1413002', 'c377deec-50f0-4d69-8e2d-49966d450003', 'SF-CAR-OLV-46', 'Olive', 'EU 46', 10, null),
  ('35e8af06-a913-45fc-b94e-ee886d353003', 'c377deec-50f0-4d69-8e2d-49966d450003', 'SF-CAR-OLV-48', 'Olive', 'EU 48', 12, null),
  ('64a1c2e0-cef0-4aad-a5f8-4919aa713004', 'c377deec-50f0-4d69-8e2d-49966d450003', 'SF-CAR-OLV-50', 'Olive', 'EU 50', 9, null),
  ('fb6d9d89-6d75-4eb2-b9da-5f8ea0973005', 'c377deec-50f0-4d69-8e2d-49966d450003', 'SF-CAR-OLV-52', 'Olive', 'EU 52', 4, null),

  ('73eb58a4-e444-4428-8f4e-58b438904001', 'ffdf0bd6-1297-4c48-9cfa-787dcc8b0004', 'SF-WIND-STN-S', 'Stone', 'EU S', 8, null),
  ('7e7f8a43-0c0e-45aa-b5c6-ca2326614002', 'ffdf0bd6-1297-4c48-9cfa-787dcc8b0004', 'SF-WIND-STN-M', 'Stone', 'EU M', 9, null),
  ('d8df7b72-6aef-4fd7-b39b-9978d4d64003', 'ffdf0bd6-1297-4c48-9cfa-787dcc8b0004', 'SF-WIND-STN-L', 'Stone', 'EU L', 6, null),
  ('31bce0d9-0eef-4f66-b0e4-8478f54d4004', 'ffdf0bd6-1297-4c48-9cfa-787dcc8b0004', 'SF-WIND-STN-XL', 'Stone', 'EU XL', 3, null)
on conflict (sku) do update
set
  product_id = excluded.product_id,
  color = excluded.color,
  size = excluded.size,
  stock = excluded.stock,
  price_override = excluded.price_override;

insert into saved_preferences (id, profile_id, top, bottom, footwear, preferred_fit)
values
  ('574565ff-d4c8-4b47-9827-7bb95d518001', 'f6a794cf-3d38-4237-a98f-84f0c0f6d001', 'EU M', 'EU 48', 'EU 42', 'Relaxed top, tapered bottom'),
  ('30d2f324-5ced-44ca-8f4f-fce0c1a58002', 'bc752ca8-0f2c-4cd9-a095-6f661f9c2002', 'EU L', 'EU 50', 'EU 43', 'Oversized tops, standard bottoms')
on conflict (profile_id) do update
set
  top = excluded.top,
  bottom = excluded.bottom,
  footwear = excluded.footwear,
  preferred_fit = excluded.preferred_fit;

insert into orders (
  id, order_number, profile_id, status, tracking_number, eta_date,
  shipping_name, shipping_email, shipping_address_line1, shipping_city,
  shipping_postal_code, shipping_country, payment_method,
  subtotal, shipping_amount, total_amount, placed_at
)
values
  (
    'be0f71f3-4bca-44f2-a637-51dd53ba9001',
    'SF-20391',
    'f6a794cf-3d38-4237-a98f-84f0c0f6d001',
    'Shipped',
    'TRK-88736420',
    current_date + 3,
    'Alex Walker',
    'alex@superiorfits.com',
    '44 Mercer Street',
    'Berlin',
    '10115',
    'DE',
    'card',
    89.00,
    7.00,
    96.00,
    now() - interval '3 days'
  ),
  (
    '8f86fcf8-1462-40af-82c2-82166cf79002',
    'SF-20120',
    'f6a794cf-3d38-4237-a98f-84f0c0f6d001',
    'Delivered',
    'TRK-77424502',
    current_date - 2,
    'Alex Walker',
    'alex@superiorfits.com',
    '44 Mercer Street',
    'Berlin',
    '10115',
    'DE',
    'card',
    79.00,
    7.00,
    86.00,
    now() - interval '10 days'
  ),
  (
    'f2f393cc-3d3d-4d8f-b5fd-c5f1db4b9003',
    'SF-20452',
    'bc752ca8-0f2c-4cd9-a095-6f661f9c2002',
    'Processing',
    null,
    current_date + 5,
    'Jordan Miles',
    'jordan@superiorfits.com',
    '19 Alte Jakobstrasse',
    'Berlin',
    '10969',
    'DE',
    'card',
    119.00,
    0.00,
    119.00,
    now() - interval '1 day'
  )
on conflict (order_number) do update
set
  profile_id = excluded.profile_id,
  status = excluded.status,
  tracking_number = excluded.tracking_number,
  eta_date = excluded.eta_date,
  shipping_name = excluded.shipping_name,
  shipping_email = excluded.shipping_email,
  shipping_address_line1 = excluded.shipping_address_line1,
  shipping_city = excluded.shipping_city,
  shipping_postal_code = excluded.shipping_postal_code,
  shipping_country = excluded.shipping_country,
  payment_method = excluded.payment_method,
  subtotal = excluded.subtotal,
  shipping_amount = excluded.shipping_amount,
  total_amount = excluded.total_amount,
  placed_at = excluded.placed_at;

insert into order_items (
  id, order_id, product_id, variant_id,
  product_name, color, size, quantity, unit_price
)
values
  (
    '047f36f2-a8f3-4d0f-a8f5-68d7db23a001',
    'be0f71f3-4bca-44f2-a637-51dd53ba9001',
    '9f6ed22a-86c0-4da8-8cb0-d46e71320001',
    '05cc8658-e80f-4ece-ae16-c0f74f221003',
    'Concrete Script Hoodie',
    'Black',
    'EU M',
    1,
    89.00
  ),
  (
    '3fddd4d9-2f36-4f26-aad7-ef2de047a002',
    '8f86fcf8-1462-40af-82c2-82166cf79002',
    'c377deec-50f0-4d69-8e2d-49966d450003',
    '35e8af06-a913-45fc-b94e-ee886d353003',
    'Urban Utility Cargo',
    'Olive',
    'EU 48',
    1,
    79.00
  ),
  (
    '1c8fd2b0-31af-4aa0-acbf-0607af5da003',
    'f2f393cc-3d3d-4d8f-b5fd-c5f1db4b9003',
    'ffdf0bd6-1297-4c48-9cfa-787dcc8b0004',
    '7e7f8a43-0c0e-45aa-b5c6-ca2326614002',
    'Transit Windbreaker',
    'Stone',
    'EU M',
    1,
    119.00
  )
on conflict (id) do update
set
  order_id = excluded.order_id,
  product_id = excluded.product_id,
  variant_id = excluded.variant_id,
  product_name = excluded.product_name,
  color = excluded.color,
  size = excluded.size,
  quantity = excluded.quantity,
  unit_price = excluded.unit_price;
