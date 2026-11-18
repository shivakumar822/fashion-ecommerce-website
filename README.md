# India Fashion E-Commerce Website

A responsive fashion-store demo built with HTML, CSS, and browser JavaScript. It includes a 25-product catalogue, shopping cart, wishlist, filters, occasion-aware AI Stylist, browser-local demo accounts, demo checkout, dark mode, and a Progressive Web App (PWA) service worker. The optional Gemini integration runs through a Vercel serverless function; the storefront and local stylist fallback do not require a build step.

> **Demo and privacy notes:** This is not a production commerce or identity system. Cart, wishlist, browsing analytics, orders, demo account details, and sign-in state are stored in the current browser's `localStorage`. Passwords are stored as salted PBKDF2 hashes, not as plain text, but browser-local authentication is not a substitute for a server-side identity provider. No customer photos are requested. When the Gemini backend is configured, the user's stylist prompt and selected colour preference are sent through the serverless function to Google Gemini for processing; do not enter sensitive personal information in a stylist prompt.

---

## 🌟 Comprehensive Feature List

### 1. Foundation & Architecture
- **Zero Framework Overhead**: Built with pure vanilla HTML5, CSS3, and JavaScript (no jQuery, no React/Vue).
- **Simple Front-End Loading**: `index.html` loads `products.js` and `ecom.js` as browser scripts. No front-end package installation or compilation is required.
- **Indian Rupee (₹) Formatting**: All prices formatted via `Number(val).toLocaleString("en-IN")`.
- **Accessible & Semantic Markup**: Uses semantic page structure, labels, live regions, modal roles, keyboard dismissal, and visible focus styling. This does not claim full WCAG conformance.

### 2. Core Shop Experience
- **Dynamic Catalogue Rendering**: 25 hand-curated fashion items across Clothing, Shoes, and Accessories rendered via `renderProductCards()`.
  - Current mix: 13 clothing items, 7 pairs of shoes, and 5 accessories.
  - Occasion-focused additions include an evening dress, formal trousers, an embroidered kurta, and leather loafers.
- **Slide-in Cart Drawer**:
  - Live quantity adjustment (`+` and `-`) with real-time subtotal and grand total calculation.
  - Dynamic **Free Shipping progress bar** (threshold: ₹2,000, displaying real-time "Add ₹X more" messages).
  - Promo code system: Apply coupon code `WELCOME10` for an instant 10% discount.
  - Safe persistence in `localStorage` guarded by `try...catch` against corrupted data.
- **Live Search, Filter & Sort Toolbar**:
  - Real-time search by product title.
  - Category pill filter: *All*, *Clothing*, *Shoes*, *Accessories*.
  - Color filter dropdown (Red, Blue, White, Green, Grey, Brown, Black, Gold).
  - Price range slider up to ₹5,000 with real-time value badge.
  - Multi-attribute sorting: Price (Low to High, High to Low), Highest Rated, and Newest Added.
  - Wishlist filter mode to view only saved items.
  - Reset filters button with empty-state feedback.
- **Wishlist System**: Heart toggle on every card, synced to a navbar counter badge with toast alerts.
- **Quick View Modal**: Enlarged product image, star rating, color selector, size selector, and direct Add to Cart / Buy Now actions. Dismissible via X button, Escape key, or backdrop click.

### 3. Trending Features
- **Trending Now Algorithm**: Tracks client-side views and cart additions:
  $$\text{Trending Score} = \text{Views} + 3 \times \text{Cart Additions}$$
  *Note: Initial trending numbers are seeded with demo data stored locally on the client.*
- **Dynamic Product Badges**:
  - **New**: Items added within the last 30 days.
  - **Bestseller**: Top-ranked product by trending popularity.
  - **Low Stock**: Inventory threshold alert when stock $\le 3$.
- **Recently Viewed Strip**: Automatically tracks and displays the last 4 unique products explored during the session.

### 4. AI Fashion Stylist (No Photos)
- **Floating AI Stylist Drawer**: Collapsible interactive stylist powered by the Google Gemini API.
- **Quick-Pick Chips**: Pre-filled requests for *Party*, *Office*, *Casual*, *Wedding*, and *items under ₹1500 each*.
- **Occasion-Aware Recommendations**: Products have occasion metadata, so party, office, casual, and wedding requests rank different products. Ranking also considers product-type words, colour preference, per-item budget, rating, and category variety.
- **Shared Recommendation Rules**: The browser fallback and serverless backend use the same matcher in `products.js`. The backend gives Gemini a ranked shortlist and only returns those shortlisted product IDs, avoiding unrelated or unavailable recommendations.
- **Optional Colour Palette Selector**: Customizes recommendations to the user's preferred hue.
- **"Complete the Look" Feature**: For a selected product, recommends items from complementary categories and avoids suggesting another item in the same category.
- **Vercel Serverless Backend (`/api/stylist.js`)**:
  - Validates and sanitizes input (string, 1–300 chars).
  - Bounds the request to the 25-product catalogue and the matcher-generated shortlist.
  - Requests JSON containing recommendation IDs, reasons, and colour advice; validates recommendation IDs before returning results.
  - Includes an in-memory limit of 15 requests per minute per client IP. This is a demo safeguard, not a distributed rate-limiting system.
  - Uses the front-end matcher when the API route is unavailable, the key is missing, or a request fails.
  - Renders user and recommendation text through text nodes / `textContent` rather than treating it as HTML.

### 5. Extras, Checkout & PWA
- **Dark Mode**: System preference auto-detection (`prefers-color-scheme`) with manual toggle and `localStorage` persistence.
- **Demo Account Sign-In/Sign-Up**: Accounts are stored only in the current browser, with passwords protected by salted PBKDF2 hashes. This is a front-end demo, not production authentication; use a server-side identity provider for real accounts.
  - Sign-up checks the name, email, password length, password confirmation, and optional 10-digit phone number. A successful sign-up signs in automatically; sign-in checks the saved hash and logout clears the local session.
- **Toast Notifications**: Non-intrusive floating feedback for cart, wishlist, coupon, and error events.
- **Limited Seasonal Sale Countdown**: Real-time timer on the hero banner showing days, hours, minutes, and seconds.
- **Demo Checkout Flow**:
  - Validated form fields: Full Name, 10-digit Indian mobile number (`/^[6-9]\d{9}$/`), 6-digit PIN code (`/^\d{6}$/`), and Address.
  - Clearly labeled: *"Demo checkout – no real payment"*.
  - Order confirmation screen with unique order ID (`PS-XXXXXX`).
  - Order history saved to `localStorage` and viewable via the top navigation receipt icon.
- **PWA & Performance**: `manifest.json` and basic service worker (`sw.js`) for static asset caching and offline resilience.

### 6. Browser Data and Limitations

The storefront uses `localStorage` so demo state remains available after a page reload in the same browser profile. These values are not synced between devices or browsers.

| Data | Storage key |
| --- | --- |
| Cart | `ps_cart` |
| Wishlist | `ps_wishlist` |
| Product views and cart-add counts | `ps_analytics` |
| Recently viewed products | `ps_recently_viewed` |
| Theme | `ps_theme` |
| Demo orders | `ps_orders` |
| Coupon | `ps_coupon` |
| Demo account records | `india_auth_users` |
| Current demo sign-in | `india_auth_session` |

Important limitations:

- Checkout records a demo order only. It does not collect or process payment details.
- Demo accounts are stored in the browser and do not have password recovery, account verification, or server-side sessions.
- The ₹1,500 quick pick means **each recommended item** is at or below ₹1,500; it does not cap the combined price of all picks.
- Product imagery is loaded from external image hosts and requires an internet connection.
- The service worker caches the static storefront files. It does not cache the `/api/` endpoint.

---

## 📁 Target File Structure

```text
fashion-ecommerce-website-main/
├── index.html            # Storefront, forms, dialogs, and AI Stylist markup
├── ecom.css              # Layout, responsive styles, themes, and component states
├── ecom.js               # Cart, filters, wishlist, checkout, authentication, and UI logic
├── products.js           # 25 products, occasion metadata, recommendation matcher, INR formatter
├── manifest.json         # PWA name, launch URL, colours, and icons
├── sw.js                 # Static asset caching and old-cache cleanup
├── .gitignore            # Excludes local environment files and generated directories
├── api/
│   └── stylist.js        # Vercel serverless endpoint for Gemini
└── README.md             # Setup, architecture, feature, and troubleshooting guide
```

The README is intentionally listed last in this project tree.

---

## 🚀 How to Run Locally

### Option 1: Open the Static Storefront

Open `index.html` directly in a modern browser. Shopping, catalogue filtering, the local stylist matcher, and the demo checkout run without a build step. Browser-local account creation also requires Web Crypto support; if the browser reports that secure password storage is unavailable, use localhost or HTTPS.

### Option 2: VS Code Live Server

1. Open the project folder in **Visual Studio Code**.
2. Right-click on `index.html` and select **"Open with Live Server"**.

### Option 3: Python Static Server

From the project directory, run:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. This serves static files only; it does not run `/api/stylist.js`. The stylist will use its local recommendation fallback.

### Option 4: Run the Vercel API Locally

The Gemini endpoint is a Vercel serverless function. To run it locally, install the Vercel CLI, configure the environment variables described below, and run:

```bash
vercel dev
```

Then open the local URL printed by the CLI.

---

## ☁️ How to Deploy to Vercel & Configure the AI Stylist

1. **Install the Vercel CLI or import the project through Vercel's Git integration**:
   ```bash
   npm i -g vercel
   ```
2. **Obtain a Google Gemini API key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and generate a free API key.
3. **Deploy the project**:
   ```bash
   vercel --prod
   ```
4. In the Vercel project dashboard, open **Settings > Environment Variables** and add:
   - `GEMINI_API_KEY`: the API key. Keep it server-side; never add it to HTML or browser JavaScript.
   - `GEMINI_MODEL`: optional model name supported by your Gemini API account. The current code default is `gemini-1.5-flash`.
5. Redeploy after changing environment variables. The API route is `/api/stylist`; if the key is missing or the model request fails, the browser falls back to local catalogue recommendations.

The repository's `.gitignore` excludes `.env` and related local environment files. Do not commit API keys.

---

## 🧭 How the AI Stylist Works

1. A user selects an occasion chip or types a request (up to 300 characters) and may choose a colour preference.
2. `products.js` identifies the occasion, colour, product type, and budget, then ranks products using occasion tags, category, rating, and the requested constraints.
3. For an outfit request, the matcher tries to vary product categories. For “Complete the look,” it excludes the selected product's category and returns complementary categories.
4. The browser sends the request to `/api/stylist` when that endpoint is available. The backend imports the same product catalogue and matcher, then gives Gemini the ranked shortlist rather than the whole internet.
5. The backend only returns IDs from its shortlist. If Gemini omits a recommendation or returns an unapproved ID, the ranked product is still returned with a local reason.
6. If the endpoint is unavailable (for example, when using Python's static server), the browser uses the same matcher without Gemini.

The stylist does not inspect photos. Its suggestions are limited to the products in `products.js`. Budget phrases such as “under ₹1500” apply to each item, not the combined total of all recommendations.

---

## 🧪 Validation and Manual Smoke Test

There is no package-based automated test runner configured. With Node.js installed, run syntax checks from the project directory:

```powershell
node --check .\products.js
node --check .\ecom.js
node --check .\api\stylist.js
```

Recommended browser smoke test:

1. Load the page and confirm the catalogue appears.
2. Try Party, Office, Casual, and Wedding in the AI Stylist; verify the products differ by occasion.
3. Try the colour selector and the per-item budget chip.
4. Open “Complete the look” from a product and confirm it suggests other categories.
5. Add an item to the cart, update its quantity, apply `WELCOME10`, and verify the cart totals.
6. Create a demo account, sign out, sign back in, then refresh to confirm browser-local persistence.
7. Submit the checkout form and confirm it produces a demo order without requesting payment details.

For live Gemini testing, use a Vercel deployment or `vercel dev` with valid environment variables. A static server's unsupported `/api/` POST response is expected to trigger the local fallback.

---

## 🛠️ Troubleshooting

- **Stylist works but does not call Gemini:** Check that `/api/stylist` is served by Vercel or `vercel dev`, and that `GEMINI_API_KEY` and `GEMINI_MODEL` are configured on the server.
- **Stylist shows no network-generated response locally:** This is expected with `file://`, Live Server, or Python's static server; the matcher still returns catalogue recommendations locally.
- **Sign-in does not appear on another device/browser:** Demo accounts are stored in the current browser profile only. They are not server accounts and do not sync.
- **Sign-up says secure password storage is unavailable:** Use a modern browser over localhost or HTTPS so the Web Crypto API is available.
- **Old storefront files appear after an update:** Reload the app. The service worker uses a versioned cache (`india-cache-v5`) and removes older caches when its new version activates.
- **Product images are missing:** The catalogue uses externally hosted images; check the network connection and the image host.

---

## 🎙️ 5 Most Important Things to Explain in an Interview About This Project

1. **Vanilla JavaScript Architecture & State Management without Frameworks**:
   - Explain how complex application state (cart with quantity modifiers, wishlist, filters, dark mode, recently viewed, and order history) is coordinated purely with native DOM APIs, custom event delegation, and robust `localStorage` abstraction layers guarded with `try...catch` and fallback defaults.

2. **Secure AI Integration & Prompt Injection Defense (`api/stylist.js`)**:
   - Explain that the Gemini API key stays on the serverless backend, inputs are length/type checked, the model is prompted with a catalogue-bounded shortlist, and only shortlisted IDs are returned. The endpoint also has an in-memory per-IP request limit; the frontend inserts recommendation text as text rather than HTML.

3. **Performance & PWA Strategy**:
   - Describe lazy-loaded product images, initial product-card skeletons, and the service worker's cached-first response with background network refresh for static assets.

4. **Algorithmic Personalization & Social Proof (Trending Now)**:
   - Discuss how the client-side engagement algorithm ($\text{Score} = \text{Views} + 3 \times \text{Cart Adds}$) surfaces trending products dynamically, and how calculated time differences and inventory thresholds drive informative badges (*New*, *Bestseller*, *Low Stock*) to elevate user engagement.

5. **Accessibility (a11y) & Defensive Front-End Engineering**:
   - Walk through labels, ARIA roles/live regions, keyboard Escape and backdrop dismissal, system dark-mode preference handling, and checkout validation for phone numbers and PIN codes.
