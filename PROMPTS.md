# PROMPTS.md

## Assignment 3a – Functional MVP

### Prompt 1
I am building a Next.js + Supabase app for Superior Fits, an online clothing brand. I need you to act as the Senior Developer for this project.

Project context:
Superior Fits currently has a cluttered and confusing online shopping experience, especially on mobile. Users struggle with product browsing, filtering, European sizing, checkout clarity, and order tracking. The redesign should create a cleaner, more intuitive, and more trustworthy experience.

Chosen design:
I selected a web-based personalized dashboard design. The interface should include:
- a left sidebar with filters (size, color, type)
- a central product grid with product cards
- a product detail page with size guidance and recommendations
- saved size preferences
- a checkout flow with order summary
- an orders page with tracking and reorder

Primary tasks:
1. A shopper finds a clothing item, applies filters, views the product, gets size guidance, adds it to cart, and completes checkout.
2. A returning shopper checks order status and quickly reorders a previous item using saved preferences.

Tech requirements:
- Next.js App Router
- Tailwind CSS
- Supabase for database and auth
- lib/supabase.ts for the client
- clean modern streetwear ecommerce vibe
- mobile responsive but web-dashboard first
- simple seed data if needed

Please scaffold the project structure first, then build the pages and components needed for the two primary tasks.

### Prompt 2
Generate the folder structure for this Next.js app. Include:
- app/
- components/
- lib/
- types/
- public/
- app/products
- app/products/[id]
- app/checkout
- app/orders
- app/profile
Also include a clean reusable layout and navigation.

### Prompt 3
Now build the MVP to support these two tasks:

Task 1:
A shopper can browse products, use filters, open a product page, see size guidance, add to cart, and complete checkout.

Task 2:
A returning shopper can open the orders page, view order status, and reorder a previous item quickly using saved preferences.

Requirements:
- Tailwind CSS styling
- modern clean ecommerce dashboard
- product cards with image, price, size availability
- filter sidebar for size, color, and category
- product page with size recommendation section
- checkout page with cart summary and shipping/payment form
- orders page with status badges and reorder button
- use Supabase data with fallback mock data if tables are empty
- create reusable components for ProductCard, FilterSidebar, SizeGuide, OrderCard, Navbar
- keep the UI uncluttered and easy to scan

### Prompt 4
Create the Supabase setup for this project. I need:
1. lib/supabase.ts
2. the environment variables I need in .env.local
3. one complete SQL schema for these tables:
- products
- product_variants
- profiles
- orders
- order_items
- saved_preferences

Also include sample seed data for clothing products, sizes, colors, stock, and order statuses.