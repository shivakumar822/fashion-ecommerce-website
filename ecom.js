/**
 * ecom.js
 * Comprehensive front-end application script for India Fashion Store.
 *
 * Features:
 * - Pure Vanilla JS (ES6+) with zero frameworks or jQuery
 * - Safe localStorage state (Cart, Wishlist, Analytics, Theme, Orders, Coupon)
 * - Dynamic product catalog rendering with Badges (New, Bestseller, Low Stock)
 * - Live Search, Category filtering, Color filtering, Price slider, and Sorting
 * - Slide-in Cart Drawer with Free Shipping progress bar & Coupon system
 * - Interactive Wishlist toggle with count badges
 * - Quick View Modal with color & size selector
 * - Trending Now section with client-side demo score tracking
 * - Recently Viewed strip (last 4 products)
 * - Floating AI Stylist panel with quick chips, color preference & complete the look
 * - Dark mode toggle with system preference auto-detection
 * - Demo checkout with field validations and order history
 * - Toast notifications & PWA service worker registration
 */

// ==========================================
// 1. SAFE STORAGE & STATE MANAGEMENT
// ==========================================

const STORAGE_KEYS = {
  CART: "ps_cart",
  WISHLIST: "ps_wishlist",
  ANALYTICS: "ps_analytics",
  RECENT: "ps_recently_viewed",
  THEME: "ps_theme",
  ORDERS: "ps_orders",
  COUPON: "ps_coupon",
  AUTH_USERS: "india_auth_users",
  AUTH_SESSION: "india_auth_session"
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.warn(`Corrupted localStorage key "${key}", falling back:`, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Unable to save key "${key}" to localStorage:`, e);
  }
}

// Initial demo seed for trending analytics (views + 3 * cartAdds)
function getAnalytics() {
  const defaultAnalytics = {
    views: { 1: 42, 2: 18, 3: 35, 4: 58, 5: 64, 6: 12, 7: 50, 8: 62, 9: 28, 10: 22, 11: 49, 12: 16, 13: 40 },
    cartAdds: { 1: 14, 2: 4, 3: 9, 4: 21, 5: 25, 6: 2, 7: 18, 8: 24, 9: 8, 10: 6, 11: 17, 12: 5, 13: 13 }
  };
  const current = safeGet(STORAGE_KEYS.ANALYTICS, null);
  if (!current) {
    safeSet(STORAGE_KEYS.ANALYTICS, defaultAnalytics);
    return defaultAnalytics;
  }
  return current;
}

function trackEvent(productId, eventType) {
  const analytics = getAnalytics();
  const id = Number(productId);
  if (eventType === "view") {
    analytics.views[id] = (analytics.views[id] || 0) + 1;
  } else if (eventType === "cart") {
    analytics.cartAdds[id] = (analytics.cartAdds[id] || 0) + 1;
  }
  safeSet(STORAGE_KEYS.ANALYTICS, analytics);
}

function getProductScore(productId) {
  const analytics = getAnalytics();
  const id = Number(productId);
  const views = analytics.views[id] || 0;
  const cartAdds = analytics.cartAdds[id] || 0;
  return views + 3 * cartAdds;
}

// ==========================================
// 2. TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "error" ? "toast-error" : ""}`;

  const icon = type === "success" ? "bx-check-circle" : type === "error" ? "bx-error-circle" : "bx-info-circle";
  toast.innerHTML = `<i class='bx ${icon}' aria-hidden="true"></i> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(15px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 3. CART SYSTEM & FREE SHIPPING BAR
// ==========================================

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_FEE = 150;

function getCart() {
  return safeGet(STORAGE_KEYS.CART, []);
}

function saveCart(cart) {
  safeSet(STORAGE_KEYS.CART, cart);
  updateCartUI();
}

function addToCart(productId, qty = 1, options = {}) {
  const catalog = window.products || [];
  const product = catalog.find(p => p.id === Number(productId));
  if (!product) return null;

  const color = options.color || product.colors[0] || "Standard";
  const size = options.size || product.sizes[0] || "Standard";

  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.id === product.id && item.selectedColor === color && item.selectedSize === size
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      selectedColor: color,
      selectedSize: size
    });
  }

  saveCart(cart);
  trackEvent(product.id, "cart");
  showToast(`Added "${product.name}" to your cart!`, "success");
  return product;
}

function updateCartQuantity(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
    showToast("Item removed from cart.", "info");
  }
  saveCart(cart);
}

function removeCartItem(index) {
  const cart = getCart();
  if (cart[index]) {
    const item = cart.splice(index, 1)[0];
    saveCart(cart);
    showToast(`Removed "${item.name}" from cart.`, "info");
  }
}

function getCoupon() {
  return safeGet(STORAGE_KEYS.COUPON, null);
}

function applyCouponCode(code) {
  const clean = String(code).trim().toUpperCase();
  if (clean === "WELCOME10") {
    const coupon = { code: "WELCOME10", discountPercent: 10 };
    safeSet(STORAGE_KEYS.COUPON, coupon);
    showToast("Coupon WELCOME10 applied! 10% discount added.", "success");
    updateCartUI();
    return true;
  } else {
    showToast("Invalid coupon code. Try WELCOME10 for 10% off.", "error");
    return false;
  }
}

function removeCoupon() {
  safeSet(STORAGE_KEYS.COUPON, null);
  showToast("Coupon removed.", "info");
  updateCartUI();
}

function updateCartUI() {
  const cart = getCart();
  const formatPrice = window.formatPriceINR || (val => `₹${Number(val).toLocaleString("en-IN")}`);

  // Update Navbar Badge
  const countBadge = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  if (countBadge) {
    countBadge.textContent = totalItems;
    countBadge.setAttribute("aria-label", `${totalItems} items in cart`);
  }

  // Update Drawer Items Container
  const container = document.getElementById("cart-items-container");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <i class='bx bx-shopping-bag' aria-hidden="true"></i>
        <h4>Your cart is empty</h4>
        <p style="font-size:13px; margin-top:6px;">Browse our collection and add your favorite pieces.</p>
      </div>
    `;
  } else {
    container.innerHTML = cart
      .map((item, idx) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-item-img" />
          <div class="cart-item-info">
            <h5 class="cart-item-title">${escapeHtml(item.name)}</h5>
            <div class="cart-item-variants">Color: ${escapeHtml(item.selectedColor)} &bull; Size: ${escapeHtml(item.selectedSize)}</div>
            <div class="cart-item-bottom">
              <div class="qty-control">
                <button type="button" class="qty-btn" onclick="updateCartQuantity(${idx}, -1)" aria-label="Decrease quantity">&minus;</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="updateCartQuantity(${idx}, 1)" aria-label="Increase quantity">&plus;</button>
              </div>
              <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
          </div>
          <button type="button" class="cart-remove-btn" onclick="removeCartItem(${idx})" aria-label="Remove ${escapeHtml(item.name)}">&times;</button>
        </div>
      `)
      .join("");
  }

  // Calculate Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = getCoupon();
  const discountAmount = coupon ? Math.round(subtotal * (coupon.discountPercent / 100)) : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  // Update Free Shipping Progress Bar
  const progressText = document.getElementById("shipping-progress-text");
  const progressFill = document.getElementById("shipping-progress-fill");
  if (progressText && progressFill) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      progressText.innerHTML = `<strong>Congratulations!</strong> You have unlocked <strong>FREE Delivery</strong>!`;
      progressFill.style.width = "100%";
      progressFill.style.backgroundColor = "#10b981";
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      progressText.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more for <strong>FREE Delivery</strong>!`;
      progressFill.style.width = `${pct}%`;
      progressFill.style.backgroundColor = "var(--primary-color)";
    }
  }

  // Update Totals Summary
  const subtotalEl = document.getElementById("cart-subtotal");
  const discountRow = document.getElementById("cart-discount-row");
  const discountEl = document.getElementById("cart-discount");
  const shippingEl = document.getElementById("cart-shipping");
  const grandTotalEl = document.getElementById("cart-grand-total");
  const appliedCouponContainer = document.getElementById("applied-coupon-container");

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : formatPrice(shipping);
  if (grandTotalEl) grandTotalEl.textContent = formatPrice(grandTotal);

  if (discountRow && discountEl) {
    if (coupon && discountAmount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = `-${formatPrice(discountAmount)} (${coupon.discountPercent}%)`;
    } else {
      discountRow.style.display = "none";
    }
  }

  if (appliedCouponContainer) {
    if (coupon) {
      appliedCouponContainer.innerHTML = `
        <div class="applied-coupon-tag">
          <span><i class='bx bx-check'></i> Code <strong>${coupon.code}</strong> applied</span>
          <button type="button" onclick="removeCoupon()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-weight:700;">&times;</button>
        </div>
      `;
    } else {
      appliedCouponContainer.innerHTML = "";
    }
  }
}

// Drawer Toggle Controller
function setupCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("drawer-overlay");
  const openBtn = document.getElementById("nav-cart-btn");
  const closeBtn = document.getElementById("drawer-close-btn");
  const checkoutBtn = document.getElementById("drawer-checkout-btn");
  const applyCouponBtn = document.getElementById("apply-coupon-btn");
  const couponInput = document.getElementById("coupon-input");

  function openDrawer() {
    if (drawer && overlay) {
      updateCartUI();
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast("Your cart is empty. Please add items before checking out.", "error");
        return;
      }
      closeDrawer();
      openCheckoutModal();
    });
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", () => {
      applyCouponCode(couponInput.value);
      couponInput.value = "";
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("active")) {
      closeDrawer();
    }
  });

  return { open: openDrawer, close: closeDrawer };
}

// ==========================================
// 4. WISHLIST SYSTEM
// ==========================================

function getWishlist() {
  return safeGet(STORAGE_KEYS.WISHLIST, []);
}

function toggleWishlist(productId) {
  const id = Number(productId);
  let wishlist = getWishlist();
  const exists = wishlist.includes(id);

  if (exists) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed item from wishlist.", "info");
  } else {
    wishlist.push(id);
    showToast("Saved item to your wishlist!", "success");
  }

  safeSet(STORAGE_KEYS.WISHLIST, wishlist);
  updateWishlistBadge();
  refreshWishlistCardIcons();
  return !exists;
}

function updateWishlistBadge() {
  const badge = document.getElementById("wishlist-badge");
  const wishlist = getWishlist();
  if (badge) {
    badge.textContent = wishlist.length;
    badge.setAttribute("aria-label", `${wishlist.length} saved items`);
  }
}

function refreshWishlistCardIcons() {
  const wishlist = getWishlist();
  document.querySelectorAll(".card-wishlist-btn").forEach(btn => {
    const id = Number(btn.getAttribute("data-id"));
    const isSaved = wishlist.includes(id);
    btn.classList.toggle("active", isSaved);
    const icon = btn.querySelector("i");
    if (icon) {
      icon.className = isSaved ? "bx bxs-heart" : "bx bx-heart";
    }
  });
}

// ==========================================
// 5. PRODUCT RENDERING & BADGES
// ==========================================

function calculateCardBadges(product, topTrendingId) {
  const badges = [];
  const now = new Date("2026-11-18");
  const addedDate = new Date(product.dateAdded);
  const diffDays = Math.floor((now - addedDate) / (1000 * 60 * 60 * 24));

  if (product.id === topTrendingId) {
    badges.push(`<span class="badge badge-bestseller">Bestseller</span>`);
  }
  if (diffDays >= 0 && diffDays <= 30) {
    badges.push(`<span class="badge badge-new">New</span>`);
  }
  if (Number(product.stock) <= 3) {
    badges.push(`<span class="badge badge-lowstock">Low Stock</span>`);
  }

  return badges.join("");
}

function renderProductCards(list, containerId = "product-grid") {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="no-products" role="status">
        <i class='bx bx-search-alt'></i>
        <h3>No matching products found</h3>
        <p>Try loosening your search query, adjusting your price range, or selecting "All Categories".</p>
      </div>
    `;
    return;
  }

  const formatPrice = window.formatPriceINR || (val => `₹${Number(val).toLocaleString("en-IN")}`);
  const wishlist = getWishlist();

  // Determine top trending product ID for bestseller badge
  const allProducts = window.products || [];
  let topTrendingId = 1;
  let highestScore = -1;
  allProducts.forEach(p => {
    const sc = getProductScore(p.id);
    if (sc > highestScore) {
      highestScore = sc;
      topTrendingId = p.id;
    }
  });

  const cardsHtml = list
    .map(product => {
      const isWishlisted = wishlist.includes(product.id);
      const badgesHtml = calculateCardBadges(product, topTrendingId);

      const colorIcons = (product.colors || [])
        .map(c => `<i class='bx bxs-circle ${c.toLowerCase()}' title='${c}'></i>`)
        .join("");

      let starsHtml = "";
      for (let i = 1; i <= 5; i++) {
        starsHtml += `<i class='bx ${i <= Math.round(product.rating) ? "bxs-star" : "bx-star"}'></i>`;
      }

      return `
        <article class="best-p1" data-id="${product.id}" tabindex="0" aria-label="${escapeHtml(product.name)}">
          <div class="card-img-wrap">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" />
            <div class="card-badges">${badgesHtml}</div>
            <button type="button" class="card-wishlist-btn ${isWishlisted ? "active" : ""}" data-id="${product.id}" aria-label="Toggle wishlist for ${escapeHtml(product.name)}">
              <i class='bx ${isWishlisted ? "bxs-heart" : "bx-heart"}'></i>
            </button>
            <button type="button" class="card-quickview-btn" data-id="${product.id}">
              <i class='bx bx-show'></i> Quick View
            </button>
          </div>
          <div class="best-p1-txt">
            <div class="name-of-p">
              <p title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</p>
            </div>
            <div class="rating" aria-label="Rating: ${product.rating} out of 5 stars">
              ${starsHtml}
            </div>
            <div class="price">
              <span class="amount">${formatPrice(product.price)}</span>
              <div class="colors">${colorIcons}</div>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-add-cart" data-id="${product.id}">Add To Cart</button>
              <button type="button" class="btn-buy-now" data-id="${product.id}">Buy Now</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  container.innerHTML = cardsHtml;
}

// ==========================================
// 6. TRENDING NOW SECTION & RECENTLY VIEWED
// ==========================================

function renderTrendingSection() {
  const container = document.getElementById("trending-grid");
  if (!container) return;

  const catalog = [...(window.products || [])];
  // Sort by (views + 3 * cartAdds) descending, pick top 4
  catalog.sort((a, b) => getProductScore(b.id) - getProductScore(a.id));
  const top4 = catalog.slice(0, 4);

  renderProductCards(top4, "trending-grid");
}

function addToRecentlyViewed(productId) {
  const id = Number(productId);
  let recent = safeGet(STORAGE_KEYS.RECENT, []);
  recent = recent.filter(item => item !== id);
  recent.unshift(id);
  recent = recent.slice(0, 4);
  safeSet(STORAGE_KEYS.RECENT, recent);
  renderRecentlyViewedStrip();
}

function renderRecentlyViewedStrip() {
  const section = document.getElementById("recently-viewed-section");
  const container = document.getElementById("recently-viewed-grid");
  if (!section || !container) return;

  const recentIds = safeGet(STORAGE_KEYS.RECENT, []);
  if (recentIds.length === 0) {
    section.style.display = "none";
    return;
  }

  const catalog = window.products || [];
  const recentProducts = recentIds
    .map(id => catalog.find(p => p.id === id))
    .filter(Boolean);

  if (recentProducts.length === 0) {
    section.style.display = "none";
    return;
  }

  const formatPrice = window.formatPriceINR || (val => `₹${Number(val).toLocaleString("en-IN")}`);

  container.innerHTML = recentProducts
    .map(p => `
      <div class="recent-item-card" onclick="openQuickView(${p.id})">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <div class="recent-item-info">
          <h5>${escapeHtml(p.name)}</h5>
          <span>${formatPrice(p.price)}</span>
        </div>
      </div>
    `)
    .join("");

  section.style.display = "block";
}

// ==========================================
// 7. FILTER, LIVE SEARCH & SORT TOOLBAR
// ==========================================

let filterState = {
  search: "",
  category: "All",
  color: "All",
  maxPrice: 5000,
  sortBy: "default",
  wishlistOnly: false
};

function applyFiltersAndRender() {
  const catalog = window.products || [];
  let filtered = [...catalog];

  // 1. Search Query
  if (filterState.search.trim()) {
    const q = filterState.search.toLowerCase().trim();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }

  // 2. Category
  if (filterState.category !== "All") {
    filtered = filtered.filter(
      p => p.category.toLowerCase() === filterState.category.toLowerCase()
    );
  }

  // 3. Color
  if (filterState.color !== "All") {
    filtered = filtered.filter(p =>
      (p.colors || []).some(c => c.toLowerCase() === filterState.color.toLowerCase())
    );
  }

  // 4. Max Price
  filtered = filtered.filter(p => p.price <= filterState.maxPrice);

  // 5. Wishlist Only Filter
  if (filterState.wishlistOnly) {
    const wishlist = getWishlist();
    filtered = filtered.filter(p => wishlist.includes(p.id));
  }

  // 6. Sorting
  switch (filterState.sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "date-desc":
      filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    default:
      filtered.sort((a, b) => a.id - b.id);
      break;
  }

  renderProductCards(filtered, "product-grid");

  const countText = document.getElementById("catalogue-count-text");
  if (countText) {
    countText.textContent = `Showing ${filtered.length} of ${catalog.length} products`;
  }
}

function filterByCategory(category) {
  filterState.category = category;
  filterState.wishlistOnly = false;

  document.querySelectorAll(".chip-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-category") === category);
  });

  const target = document.getElementById("sellers");
  if (target) target.scrollIntoView({ behavior: "smooth" });

  applyFiltersAndRender();
}

function setupShopToolbar() {
  const searchInput = document.getElementById("search-input");
  const colorSelect = document.getElementById("color-filter");
  const priceRange = document.getElementById("price-range");
  const priceDisplay = document.getElementById("price-range-val");
  const sortSelect = document.getElementById("sort-select");
  const resetBtn = document.getElementById("reset-filters-btn");
  const navWishlistBtn = document.getElementById("nav-wishlist-btn");

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      filterState.search = e.target.value;
      applyFiltersAndRender();
    });
  }

  document.querySelectorAll(".chip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterState.category = btn.getAttribute("data-category");
      filterState.wishlistOnly = false;
      applyFiltersAndRender();
    });
  });

  if (colorSelect) {
    colorSelect.addEventListener("change", e => {
      filterState.color = e.target.value;
      applyFiltersAndRender();
    });
  }

  if (priceRange && priceDisplay) {
    priceRange.addEventListener("input", e => {
      filterState.maxPrice = Number(e.target.value);
      priceDisplay.textContent = (window.formatPriceINR || (val => `₹${val}`))(filterState.maxPrice);
      applyFiltersAndRender();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", e => {
      filterState.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      filterState = {
        search: "",
        category: "All",
        color: "All",
        maxPrice: 5000,
        sortBy: "default",
        wishlistOnly: false
      };
      if (searchInput) searchInput.value = "";
      if (colorSelect) colorSelect.value = "All";
      if (priceRange) priceRange.value = "5000";
      if (priceDisplay) priceDisplay.textContent = "₹5,000";
      if (sortSelect) sortSelect.value = "default";
      document.querySelectorAll(".chip-btn").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-category") === "All");
      });
      applyFiltersAndRender();
      showToast("Filters reset to default.", "info");
    });
  }

  if (navWishlistBtn) {
    navWishlistBtn.addEventListener("click", () => {
      filterState.wishlistOnly = !filterState.wishlistOnly;
      const title = document.getElementById("catalogue-title");
      if (filterState.wishlistOnly) {
        if (title) title.textContent = "Your Saved Wishlist";
        showToast("Filtering catalog by your saved wishlist items.", "info");
      } else {
        if (title) title.textContent = "Catalogue Collection";
      }
      const target = document.getElementById("sellers");
      if (target) target.scrollIntoView({ behavior: "smooth" });
      applyFiltersAndRender();
    });
  }
}

// ==========================================
// 8. QUICK VIEW MODAL
// ==========================================

let activeQuickViewProduct = null;
let selectedQvColor = "";
let selectedQvSize = "";

function openQuickView(productId) {
  const catalog = window.products || [];
  const product = catalog.find(p => p.id === Number(productId));
  if (!product) return;

  activeQuickViewProduct = product;
  selectedQvColor = product.colors[0] || "";
  selectedQvSize = product.sizes[0] || "";

  trackEvent(product.id, "view");
  addToRecentlyViewed(product.id);

  const modal = document.getElementById("quickview-modal");
  const overlay = document.getElementById("quickview-overlay");
  const formatPrice = window.formatPriceINR || (val => `₹${val}`);

  const imgEl = document.getElementById("qv-img");
  const titleEl = document.getElementById("qv-title");
  const priceEl = document.getElementById("qv-price");
  const ratingEl = document.getElementById("qv-rating");
  const colorsWrap = document.getElementById("qv-colors-group");
  const sizesWrap = document.getElementById("qv-sizes-group");

  if (imgEl) { imgEl.src = product.image; imgEl.alt = product.name; }
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = formatPrice(product.price);

  if (ratingEl) {
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<i class='bx ${i <= Math.round(product.rating) ? "bxs-star" : "bx-star"}'></i>`;
    }
    ratingEl.innerHTML = starsHtml;
  }

  if (colorsWrap) {
    colorsWrap.innerHTML = product.colors
      .map((c, i) => `
        <button type="button" class="quickview-pill ${i === 0 ? "active" : ""}" data-type="color" data-val="${c}">
          ${c}
        </button>
      `)
      .join("");
  }

  if (sizesWrap) {
    sizesWrap.innerHTML = product.sizes
      .map((s, i) => `
        <button type="button" class="quickview-pill ${i === 0 ? "active" : ""}" data-type="size" data-val="${s}">
          ${s}
        </button>
      `)
      .join("");
  }

  if (modal && overlay) {
    modal.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeQuickView() {
  const modal = document.getElementById("quickview-modal");
  const overlay = document.getElementById("quickview-overlay");
  if (modal && overlay) {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function setupQuickView() {
  const closeBtn = document.getElementById("quickview-close-btn");
  const overlay = document.getElementById("quickview-overlay");
  const colorsWrap = document.getElementById("qv-colors-group");
  const sizesWrap = document.getElementById("qv-sizes-group");
  const addCartBtn = document.getElementById("qv-add-cart-btn");
  const buyNowBtn = document.getElementById("qv-buy-now-btn");

  if (closeBtn) closeBtn.addEventListener("click", closeQuickView);
  if (overlay) overlay.addEventListener("click", closeQuickView);

  if (colorsWrap) {
    colorsWrap.addEventListener("click", e => {
      const btn = e.target.closest(".quickview-pill");
      if (btn) {
        colorsWrap.querySelectorAll(".quickview-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedQvColor = btn.getAttribute("data-val");
      }
    });
  }

  if (sizesWrap) {
    sizesWrap.addEventListener("click", e => {
      const btn = e.target.closest(".quickview-pill");
      if (btn) {
        sizesWrap.querySelectorAll(".quickview-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedQvSize = btn.getAttribute("data-val");
      }
    });
  }

  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      if (activeQuickViewProduct) {
        addToCart(activeQuickViewProduct.id, 1, {
          color: selectedQvColor,
          size: selectedQvSize
        });
        closeQuickView();
      }
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      if (activeQuickViewProduct) {
        addToCart(activeQuickViewProduct.id, 1, {
          color: selectedQvColor,
          size: selectedQvSize
        });
        closeQuickView();
        openCheckoutModal();
      }
    });
  }

  document.addEventListener("keydown", e => {
    const modal = document.getElementById("quickview-modal");
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeQuickView();
    }
  });
}

// ==========================================
// 9. DEMO CHECKOUT & ORDER HISTORY
// ==========================================

function openCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  const overlay = document.getElementById("checkout-overlay");
  if (!modal || !overlay) return;

  const formView = document.getElementById("checkout-form-container");
  const successView = document.getElementById("checkout-success-container");
  if (formView) formView.style.display = "block";
  if (successView) successView.style.display = "none";

  const cart = getCart();
  const formatPrice = window.formatPriceINR || (val => `₹${Number(val).toLocaleString("en-IN")}`);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = getCoupon();
  const discountAmount = coupon ? Math.round(subtotal * (coupon.discountPercent / 100)) : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const itemsEl = document.getElementById("co-summary-items");
  const totalEl = document.getElementById("co-summary-total");
  const payableEl = document.getElementById("co-summary-payable");

  if (itemsEl) itemsEl.textContent = `${cart.reduce((s, i) => s + i.quantity, 0)} item(s)`;
  if (totalEl) totalEl.textContent = formatPrice(subtotal);
  if (payableEl) payableEl.textContent = formatPrice(grandTotal);

  modal.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  const overlay = document.getElementById("checkout-overlay");
  if (modal && overlay) {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");
  const closeBtn = document.getElementById("checkout-close-btn");
  const overlay = document.getElementById("checkout-overlay");

  if (closeBtn) closeBtn.addEventListener("click", closeCheckoutModal);
  if (overlay) overlay.addEventListener("click", closeCheckoutModal);

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const nameInput = document.getElementById("co-name");
    const phoneInput = document.getElementById("co-phone");
    const pinInput = document.getElementById("co-pin");
    const addressInput = document.getElementById("co-address");

    const errName = document.getElementById("err-name");
    const errPhone = document.getElementById("err-phone");
    const errPin = document.getElementById("err-pin");
    const errAddress = document.getElementById("err-address");

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      if (errName) errName.textContent = "Please enter a valid full name (min 3 characters).";
      isValid = false;
    } else {
      if (errName) errName.textContent = "";
    }

    // Validate Phone (10-digit Indian mobile number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
      if (errPhone) errPhone.textContent = "Please enter a valid 10-digit Indian phone number.";
      isValid = false;
    } else {
      if (errPhone) errPhone.textContent = "";
    }

    // Validate PIN code (6 digits)
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(pinInput.value.trim())) {
      if (errPin) errPin.textContent = "Please enter a valid 6-digit Indian PIN code.";
      isValid = false;
    } else {
      if (errPin) errPin.textContent = "";
    }

    // Validate Address
    if (!addressInput.value.trim() || addressInput.value.trim().length < 10) {
      if (errAddress) errAddress.textContent = "Please provide your full delivery address (min 10 characters).";
      isValid = false;
    } else {
      if (errAddress) errAddress.textContent = "";
    }

    if (!isValid) return;

    // Create Order Record
    const cart = getCart();
    const orderId = `PS-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const coupon = getCoupon();
    const discountAmount = coupon ? Math.round(subtotal * (coupon.discountPercent / 100)) : 0;
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

    const orderRecord = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      subtotal,
      discount: discountAmount,
      total: grandTotal,
      recipient: {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        pin: pinInput.value.trim(),
        address: addressInput.value.trim()
      }
    };

    // Save to Orders History
    const orders = safeGet(STORAGE_KEYS.ORDERS, []);
    orders.unshift(orderRecord);
    safeSet(STORAGE_KEYS.ORDERS, orders);

    // Empty Cart
    saveCart([]);

    // Show Success Screen
    const formView = document.getElementById("checkout-form-container");
    const successView = document.getElementById("checkout-success-container");
    const orderIdDisplay = document.getElementById("success-order-id");

    if (formView) formView.style.display = "none";
    if (successView) successView.style.display = "block";
    if (orderIdDisplay) orderIdDisplay.textContent = orderId;

    showToast(`Order ${orderId} confirmed successfully!`, "success");
    form.reset();
  });
}

function setupOrderHistoryModal() {
  const modal = document.getElementById("order-history-modal");
  const overlay = document.getElementById("orders-overlay");
  const openBtn = document.getElementById("nav-orders-btn");
  const closeBtn = document.getElementById("orders-close-btn");
  const container = document.getElementById("orders-list-container");

  function openOrders() {
    if (!modal || !overlay) return;
    const orders = safeGet(STORAGE_KEYS.ORDERS, []);
    const formatPrice = window.formatPriceINR || (val => `₹${val}`);

    if (container) {
      if (orders.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding:40px 10px; color:var(--text-secondary);">
            <i class='bx bx-package' style="font-size:42px; display:block; margin-bottom:10px;"></i>
            <p>No previous orders found. When you place a demo order, it will appear here!</p>
          </div>
        `;
      } else {
        container.innerHTML = orders
          .map(order => `
            <div class="order-history-item">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <strong>Order ${escapeHtml(order.id)}</strong>
                <span style="color:#10b981; font-weight:600;"><i class='bx bx-check-circle'></i> Confirmed</span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">
                Placed on: ${new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div style="font-size:13px; margin-bottom:8px;">
                ${order.items.map(it => `${escapeHtml(it.name)} (&times;${it.quantity})`).join(", ")}
              </div>
              <div style="display:flex; justify-content:space-between; font-weight:700; border-top:1px dashed var(--border-color); padding-top:6px;">
                <span>Total Paid (COD):</span>
                <span>${formatPrice(order.total)}</span>
              </div>
            </div>
          `)
          .join("");
      }
    }

    modal.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeOrders() {
    if (modal && overlay) {
      modal.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (openBtn) openBtn.addEventListener("click", openOrders);
  if (closeBtn) closeBtn.addEventListener("click", closeOrders);
  if (overlay) overlay.addEventListener("click", closeOrders);
}

// ==========================================
// 10. AI FASHION STYLIST (PHASE 4)
// ==========================================

function setupAIStylist() {
  const fab = document.getElementById("ai-stylist-fab");
  const panel = document.getElementById("ai-panel");
  const closeBtn = document.getElementById("ai-close-btn");
  const form = document.getElementById("ai-input-form");
  const input = document.getElementById("ai-user-query");
  const thread = document.getElementById("ai-chat-thread");
  const colorPrefSelect = document.getElementById("ai-color-pref");
  const chips = document.querySelectorAll(".ai-chip");

  function togglePanel() {
    if (panel) {
      panel.classList.toggle("active");
      if (panel.classList.contains("active") && input) {
        input.focus();
      }
    }
  }

  if (fab) fab.addEventListener("click", togglePanel);
  if (closeBtn) closeBtn.addEventListener("click", () => panel && panel.classList.remove("active"));

  // Chips click handlers
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt");
      if (prompt) {
        submitStylistQuery(prompt);
      }
    });
  });

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        submitStylistQuery(query);
        input.value = "";
      }
    });
  }

  async function submitStylistQuery(userText, targetProductId = null) {
    if (!thread) return;

    // Append user bubble (using textContent for security)
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = userText;
    thread.appendChild(userBubble);

    // Append loading bot indicator
    const botLoading = document.createElement("div");
    botLoading.className = "chat-bubble bot";
    botLoading.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Consulting India AI Stylist...`;
    thread.appendChild(botLoading);
    thread.scrollTop = thread.scrollHeight;

    const colorPref = colorPrefSelect ? colorPrefSelect.value : "";

    try {
      // Attempt to call serverless backend /api/stylist
      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText.slice(0, 300),
          colourPreference: colorPref,
          productId: targetProductId
        })
      });

      if (response.ok) {
        const data = await response.json();
        renderStylistResponse(botLoading, data);
      } else {
        // Smart client-side fallback matching catalogue when running without Vercel CLI
        const fallbackData = getLocalStylistRecommendation(userText, colorPref, targetProductId);
        renderStylistResponse(botLoading, fallbackData);
      }
    } catch (err) {
      // Local fallback heuristic for local file:// testing
      const fallbackData = getLocalStylistRecommendation(userText, colorPref, targetProductId);
      renderStylistResponse(botLoading, fallbackData);
    }
  }

  function renderStylistResponse(containerEl, data) {
    const catalog = window.products || [];
    const formatPrice = window.formatPriceINR || (val => `₹${val}`);

    containerEl.innerHTML = "";

    // Advice paragraph safely assigned via textContent
    const adviceP = document.createElement("p");
    adviceP.style.marginBottom = "8px";
    adviceP.textContent = data.colourAdvice || "Here are my handpicked recommendations for your look:";
    containerEl.appendChild(adviceP);

    if (Array.isArray(data.picks) && data.picks.length > 0) {
      const picksWrap = document.createElement("div");
      picksWrap.className = "ai-picks-container";

      data.picks.forEach(pick => {
        const prod = catalog.find(p => p.id === Number(pick.id));
        if (!prod) return;

        const card = document.createElement("div");
        card.className = "ai-pick-card";

        const img = document.createElement("img");
        img.src = prod.image;
        img.alt = prod.name;
        card.appendChild(img);

        const info = document.createElement("div");
        info.className = "ai-pick-info";

        const title = document.createElement("h5");
        title.textContent = prod.name;
        info.appendChild(title);

        const reason = document.createElement("p");
        reason.className = "ai-pick-reason";
        reason.textContent = pick.reason; // Safe assignment using textContent
        info.appendChild(reason);

        const price = document.createElement("div");
        price.className = "ai-pick-price";
        price.textContent = formatPrice(prod.price);
        info.appendChild(price);

        card.appendChild(info);

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "btn-buy-now";
        addBtn.style.padding = "6px 10px";
        addBtn.style.fontSize = "11px";
        addBtn.style.alignSelf = "center";
        addBtn.textContent = "Add";
        addBtn.addEventListener("click", () => addToCart(prod.id, 1));
        card.appendChild(addBtn);

        picksWrap.appendChild(card);
      });

      containerEl.appendChild(picksWrap);
    }

    if (thread) thread.scrollTop = thread.scrollHeight;
  }

  function getLocalStylistRecommendation(userText, colorPref, targetProductId) {
    const catalog = window.products || [];
    const intent = window.getStylistIntent(userText, colorPref);
    const recommendations = window.getStylistRecommendations(userText, colorPref, targetProductId, 3);
    const target = targetProductId && catalog.find(product => product.id === Number(targetProductId));
    let advice = "Here are recommendations selected from our catalogue for your style:";

    if (target) {
      advice = `These pieces complete the look with ${target.name}.`;
    } else if (intent.occasion) {
      const occasionAdvice = {
        party: "A party-ready mix of standout pieces with polished finishing touches.",
        office: "A refined, work-ready mix of tailored pieces and smart accessories.",
        casual: "An easy, comfortable mix for relaxed everyday wear.",
        wedding: "An elegant wedding-guest mix with occasion-ready details."
      };
      advice = occasionAdvice[intent.occasion];
    }

    if (intent.colors.length) {
      advice += ` Styled around ${intent.colors.join(" and ")} tones.`;
    }
    if (Number.isFinite(intent.maxBudget)) {
      advice += ` Every pick is within ₹${intent.maxBudget}.`;
    }

    return {
      colourAdvice: advice,
      picks: recommendations.map(({ product, reason }) => ({ id: product.id, reason }))
    };
  }

  window.triggerStylistForProduct = function(productId) {
    if (panel) panel.classList.add("active");
    const catalog = window.products || [];
    const prod = catalog.find(p => p.id === Number(productId));
    const query = prod ? `Complete the look for: ${prod.name}` : "Help me complete my outfit look";
    submitStylistQuery(query, productId);
  };
}

// ==========================================
// 11. DARK MODE TOGGLE & PERSISTENCE
// ==========================================

function setupDarkMode() {
  const toggleBtn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");

  function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    if (icon) icon.className = isDark ? "bx bx-sun" : "bx bx-moon";
    if (label) label.textContent = isDark ? "Light Mode" : "Dark Mode";
    safeSet(STORAGE_KEYS.THEME, isDark ? "dark" : "light");
  }

  const savedTheme = safeGet(STORAGE_KEYS.THEME, null);
  if (savedTheme) {
    applyTheme(savedTheme === "dark");
  } else {
    // Respect OS preference
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isCurrentlyDark = document.body.classList.contains("dark-mode");
      applyTheme(!isCurrentlyDark);
      showToast(`Switched to ${!isCurrentlyDark ? "Dark" : "Light"} mode.`, "info");
    });
  }
}

// ==========================================
// 12. SALE COUNTDOWN TIMER
// ==========================================

function setupSaleCountdown() {
  // Constant sale end timestamp: 14 days from initialization or fixed date
  const saleEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  function update() {
    const now = new Date();
    const diff = saleEndDate - now;

    if (diff <= 0) {
      const timerEl = document.getElementById("countdown-timer");
      if (timerEl) timerEl.textContent = "SALE ENDED";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-mins");
    const sEl = document.getElementById("cd-secs");

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(mins).padStart(2, "0");
    if (sEl) sEl.textContent = String(secs).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// 13. GLOBAL EVENT DELEGATION
// ==========================================

function setupEventDelegation() {
  document.addEventListener("click", e => {
    // 1. Add to Cart Button on Card
    const addCartBtn = e.target.closest(".btn-add-cart");
    if (addCartBtn) {
      const id = addCartBtn.getAttribute("data-id");
      addToCart(id, 1);
      return;
    }

    // 2. Buy Now Button on Card
    const buyNowBtn = e.target.closest(".btn-buy-now");
    if (buyNowBtn) {
      const id = buyNowBtn.getAttribute("data-id");
      addToCart(id, 1);
      openCheckoutModal();
      return;
    }

    // 3. Wishlist Heart Button
    const wishBtn = e.target.closest(".card-wishlist-btn");
    if (wishBtn) {
      const id = wishBtn.getAttribute("data-id");
      toggleWishlist(id);
      return;
    }

    // 4. Quick View Trigger
    const qvBtn = e.target.closest(".card-quickview-btn");
    if (qvBtn) {
      const id = qvBtn.getAttribute("data-id");
      openQuickView(id);
      return;
    }
  });

  // Smooth scroll and mobile menu close
  const checkbox = document.getElementById("checkbox");
  document.querySelectorAll(".menu-items a").forEach(link => {
    link.addEventListener("click", () => {
      if (checkbox) checkbox.checked = false;
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (event) {
      const targetHash = this.getAttribute("href");
      if (!targetHash || targetHash === "#") return;
      const targetEl = document.querySelector(targetHash);
      if (targetEl) {
        event.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
        if (checkbox) checkbox.checked = false;
      }
    });
  });
}

// ==========================================
// 14. LOCAL DEMO AUTHENTICATION
// ==========================================

function openAuthModal(mode) {
  const modal = document.getElementById(mode === "signup" ? "signup-modal" : "signin-modal");
  const otherModal = document.getElementById(mode === "signup" ? "signin-modal" : "signup-modal");
  const overlay = document.getElementById("auth-modal-overlay");
  if (!modal || !otherModal || !overlay) return;

  otherModal.classList.remove("active");
  otherModal.setAttribute("aria-hidden", "true");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  modal.querySelector("input")?.focus();
}

function switchAuthModal(mode) {
  document.querySelectorAll(".auth-error").forEach(error => {
    error.textContent = "";
  });
  openAuthModal(mode);
}

function closeAuthModal() {
  const overlay = document.getElementById("auth-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
  }
  ["signin-modal", "signup-modal"].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
  });
  ["signin-form", "signup-form"].forEach(id => {
    const form = document.getElementById(id);
    if (form) form.reset();
  });
  document.querySelectorAll(".auth-error").forEach(error => {
    error.textContent = "";
  });
}

function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input || !button) return;

  const showPassword = input.type === "password";
  input.type = showPassword ? "text" : "password";
  button.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
  const icon = button.querySelector("i");
  if (icon) icon.className = showPassword ? "bx bx-hide" : "bx bx-show";
}

function readAuthUsers() {
  let users;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USERS);
    users = raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Unable to read saved demo accounts:", error);
    throw new Error("Saved account data could not be read in this browser.");
  }

  if (!Array.isArray(users) || users.some(user =>
    !user || typeof user.email !== "string" || typeof user.name !== "string" ||
    typeof user.salt !== "string" || typeof user.passwordHash !== "string"
  )) {
    throw new Error("Saved account data is invalid. Clear this site's saved data and try again.");
  }
  return users;
}

function saveAuthUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_USERS, JSON.stringify(users));
  } catch (error) {
    console.error("Unable to save demo accounts:", error);
    throw new Error("Your account could not be saved. Check this browser's storage settings and try again.");
  }
}

function createAuthSalt() {
  if (!window.crypto || !window.crypto.getRandomValues) {
    throw new Error("Secure password storage is unavailable in this browser.");
  }
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

async function hashAuthPassword(password, salt) {
  if (!window.crypto || !window.crypto.subtle || typeof TextEncoder === "undefined") {
    throw new Error("Secure password storage is unavailable. Try a modern browser over HTTPS or localhost.");
  }

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await window.crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: new TextEncoder().encode(salt),
    iterations: 100000,
    hash: "SHA-256"
  }, keyMaterial, 256);
  return Array.from(new Uint8Array(derivedBits), byte => byte.toString(16).padStart(2, "0")).join("");
}

function setAuthError(formId, message) {
  const error = document.getElementById(`${formId}-error`);
  if (error) error.textContent = message;
}

function setAuthSubmitting(formId, isSubmitting) {
  const button = document.querySelector(`#${formId} button[type="submit"]`);
  if (!button) return;

  if (isSubmitting) {
    button.dataset.originalText = button.textContent;
    button.textContent = "Please wait...";
  } else if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
  }
  button.disabled = isSubmitting;
}

function saveAuthSession(email) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, email);
  } catch (error) {
    console.error("Unable to save demo sign-in state:", error);
    throw new Error("Sign-in could not be saved. Check this browser's storage settings and try again.");
  }
}

async function handleSignUp() {
  const formId = "signup";
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmation = document.getElementById("signup-confirm").value;
  setAuthError(formId, "");

  if (password !== confirmation) {
    setAuthError(formId, "Passwords do not match.");
    return;
  }

  setAuthSubmitting(formId, true);
  try {
    const users = readAuthUsers();
    if (users.some(user => user.email.toLowerCase() === email)) {
      setAuthError(formId, "An account with this email already exists. Please sign in.");
      return;
    }

    const salt = createAuthSalt();
    const passwordHash = await hashAuthPassword(password, salt);
    users.push({ name, email, phone, salt, passwordHash });
    saveAuthUsers(users);
    saveAuthSession(email);
    updateAuthUI();
    closeAuthModal();
    showToast("Your account has been created.", "success");
  } catch (error) {
    console.error("Unable to create demo account:", error);
    setAuthError(formId, error.message || "Account creation failed. Please try again.");
  } finally {
    setAuthSubmitting(formId, false);
  }
}

async function handleSignIn() {
  const formId = "signin";
  const email = document.getElementById("signin-email").value.trim().toLowerCase();
  const password = document.getElementById("signin-password").value;
  setAuthError(formId, "");
  setAuthSubmitting(formId, true);

  try {
    const user = readAuthUsers().find(account => account.email.toLowerCase() === email);
    if (!user || await hashAuthPassword(password, user.salt) !== user.passwordHash) {
      setAuthError(formId, "Email or password is incorrect.");
      return;
    }

    saveAuthSession(email);
    updateAuthUI();
    closeAuthModal();
    showToast(`Welcome back, ${user.name}!`, "success");
  } catch (error) {
    console.error("Unable to sign in to demo account:", error);
    setAuthError(formId, error.message || "Sign-in failed. Please try again.");
  } finally {
    setAuthSubmitting(formId, false);
  }
}

function updateAuthUI() {
  const authArea = document.getElementById("auth-area");
  const loggedInArea = document.getElementById("user-logged-area");
  const displayName = document.getElementById("user-display-name");
  if (!authArea || !loggedInArea || !displayName) return;

  try {
    const email = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    const user = email && readAuthUsers().find(account => account.email === email);
    if (email && !user) localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);

    authArea.style.display = user ? "none" : "";
    loggedInArea.style.display = user ? "flex" : "none";
    displayName.textContent = user ? user.name : "";
  } catch (error) {
    console.error("Unable to restore demo sign-in state:", error);
    authArea.style.display = "";
    loggedInArea.style.display = "none";
    displayName.textContent = "";
    showToast(error.message || "Saved account data could not be loaded.", "error");
  }
}

function logoutUser() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    updateAuthUI();
    showToast("You have been signed out.", "info");
  } catch (error) {
    console.error("Unable to sign out of demo account:", error);
    showToast("Sign-out failed. Check this browser's storage settings and try again.", "error");
  }
}

function setupAuthModal() {
  const overlay = document.getElementById("auth-modal-overlay");
  if (overlay) overlay.addEventListener("click", closeAuthModal);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay && overlay.classList.contains("active")) {
      closeAuthModal();
    }
  });
  updateAuthUI();
}

// ==========================================
// 15. SERVICE WORKER REGISTRATION (PWA)
// ==========================================

function registerServiceWorker() {
  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(reg => console.log("PWA Service Worker registered with scope:", reg.scope))
      .catch(err => console.warn("PWA Service Worker registration failed:", err));
  }
}

// ==========================================
// 16. INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  setupDarkMode();
  setupEventDelegation();
  setupAuthModal();
  setupCartDrawer();
  setupQuickView();
  setupCheckoutForm();
  setupOrderHistoryModal();
  setupShopToolbar();
  setupAIStylist();
  setupSaleCountdown();

  // Initial catalogue and trending renders
  const catalog = window.products || [];
  renderProductCards(catalog, "product-grid");
  renderTrendingSection();
  renderRecentlyViewedStrip();

  // Badges and counts
  updateCartUI();
  updateWishlistBadge();

  // Service Worker
  registerServiceWorker();
});
