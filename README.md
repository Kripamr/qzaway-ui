# 🍽️ Qzaway — Mall Food Court Ordering

A premium, dark-themed food ordering frontend for mall food courts. Browse restaurants, explore menus, manage your cart with GST breakdown, and place orders — all in a sleek, responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-✓-blue)

## Demo

### Desktop
<img src="demo/desktop-demo.webp?v=2" width="800" alt="Desktop demo - full ordering flow" />

### Mobile
<img src="demo/mobile-demo.webp?v=2" width="300" alt="Mobile demo - responsive layout" />

### Seamless Cart Interactions
<img src="demo/cart-updates.webp" width="800" alt="Cart sync demo" />

## Features

- 🏬 **Mall Selection** — Choose your mall to see available restaurants
- 🔍 **Search & Filter** — Search dishes across restaurants, toggle veg-only
- 📋 **Category Menus** — Browse items grouped by category with veg/non-veg indicators
- 🛒 **Smart Cart** — Add items, adjust quantities, view real-time price breakdown
- 💰 **GST Breakdown** — Food GST (5%), platform fee, platform GST (18%)
- 📦 **Order Placement** — Place orders and track history
- 🔄 **Reorder** — Quick reorder from past orders
- 📱 **Responsive** — Works on desktop and mobile with back navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | CSS Modules + CSS Custom Properties |
| State | React Context API |
| Backend | [Qzaway API](https://qzaway-backend.onrender.com/docs) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

Connected to the live backend at `https://qzaway-backend.onrender.com`. See [Swagger Docs](https://qzaway-backend.onrender.com/docs) for all endpoints.

## License

MIT
