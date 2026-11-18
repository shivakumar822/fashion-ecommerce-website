/**
 * products.js
 * Product catalogue for India Fashion Store.
 * Each product defines: id, name, price (INR), category, colors[], sizes[], image, rating, dateAdded, stock.
 */

const products = [
  {
    id: 1,
    name: "India Shoes",
    price: 2999,
    category: "Shoes",
    colors: ["red", "blue", "white"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://i.postimg.cc/8CmBZH5N/shoes.webp",
    rating: 3,
    dateAdded: "2026-10-15",
    stock: 12
  },
  {
    id: 2,
    name: "India Jacket",
    price: 3499,
    category: "Clothing",
    colors: ["green", "grey", "brown"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.postimg.cc/76X9ZV8m/Screenshot_from_2022-06-03_18-45-12.png",
    rating: 2,
    dateAdded: "2026-11-01",
    stock: 5
  },
  {
    id: 3,
    name: "India Shirt",
    price: 1499,
    category: "Clothing",
    colors: ["brown", "green", "blue"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.postimg.cc/j2FhzSjf/bs2.png",
    rating: 4,
    dateAdded: "2026-10-20",
    stock: 8
  },
  {
    id: 4,
    name: "India Oxford Shoes",
    price: 3799,
    category: "Shoes",
    colors: ["red", "grey", "blue"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://i.postimg.cc/QtjSDzPF/bs3.png",
    rating: 5,
    dateAdded: "2026-10-10",
    stock: 4
  },
  {
    id: 5,
    name: "India Casual T-Shirt",
    price: 899,
    category: "Clothing",
    colors: ["black", "white", "blue", "brown"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.postimg.cc/fbnB2yfj/na1.png",
    rating: 5,
    dateAdded: "2026-11-10",
    stock: 15
  },
  {
    id: 6,
    name: "India Leather Bag",
    price: 1899,
    category: "Accessories",
    colors: ["brown", "red", "green"],
    sizes: ["One Size"],
    image: "https://i.postimg.cc/zD02zJq8/na2.png",
    rating: 2,
    dateAdded: "2026-11-05",
    stock: 2
  },
  {
    id: 7,
    name: "India Aviator Sunglass",
    price: 999,
    category: "Accessories",
    colors: ["grey", "black", "gold"],
    sizes: ["Standard"],
    image: "https://i.postimg.cc/Dfj5VBcz/sunglasses1.jpg",
    rating: 5,
    dateAdded: "2026-11-12",
    stock: 9
  },
  {
    id: 8,
    name: "India Sport Sneakers",
    price: 2799,
    category: "Shoes",
    colors: ["grey", "red", "blue"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://i.postimg.cc/FszW12Kc/na4.png",
    rating: 5,
    dateAdded: "2026-11-14",
    stock: 7
  },
  {
    id: 9,
    name: "India Running Shoes",
    price: 2499,
    category: "Shoes",
    colors: ["grey", "black", "blue"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://i.postimg.cc/jS7pSQLf/na4.png",
    rating: 3,
    dateAdded: "2026-10-25",
    stock: 6
  },
  {
    id: 10,
    name: "India Graphic Tee",
    price: 799,
    category: "Clothing",
    colors: ["black", "white", "blue", "brown"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.postimg.cc/fbnB2yfj/na1.png",
    rating: 4,
    dateAdded: "2026-10-18",
    stock: 10
  },
  {
    id: 11,
    name: "India Polo T-Shirt",
    price: 1199,
    category: "Clothing",
    colors: ["black", "white", "red", "blue"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://i.postimg.cc/RhVP7YQk/hs1.png",
    rating: 5,
    dateAdded: "2026-11-08",
    stock: 3
  },
  {
    id: 12,
    name: "India Urban Backpack",
    price: 2199,
    category: "Accessories",
    colors: ["black", "grey", "brown"],
    sizes: ["One Size"],
    image: "https://i.postimg.cc/zD02zJq8/na2.png",
    rating: 3,
    dateAdded: "2026-10-28",
    stock: 5
  },
  {
    id: 13,
    name: "India Chrono Watch",
    price: 4499,
    category: "Accessories",
    colors: ["black", "brown", "gold"],
    sizes: ["Free Size"],
    image: "https://i.postimg.cc/MHv7KJYp/access.webp",
    rating: 5,
    dateAdded: "2026-11-15",
    stock: 3
  },
  {
    id: 14,
    name: "India Midnight Black Tee",
    price: 999,
    category: "Clothing",
    colors: ["black", "grey", "white"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-16",
    stock: 20
  },
  {
    id: 15,
    name: "India Floral Summer Dress",
    price: 2799,
    category: "Clothing",
    colors: ["red", "white", "blue"],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-12",
    stock: 8
  },
  {
    id: 16,
    name: "India Tailored Linen Blazer",
    price: 4299,
    category: "Clothing",
    colors: ["black", "grey", "brown", "blue"],
    sizes: ["38", "40", "42", "44"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-05",
    stock: 4
  },
  {
    id: 17,
    name: "India Slim Fit Denim Jeans",
    price: 2199,
    category: "Clothing",
    colors: ["blue", "black", "grey"],
    sizes: ["30", "32", "34", "36"],
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=500&auto=format&fit=crop&q=80",
    rating: 4,
    dateAdded: "2026-10-30",
    stock: 12
  },
  {
    id: 18,
    name: "India Leather Chelsea Boots",
    price: 3999,
    category: "Shoes",
    colors: ["black", "brown"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-14",
    stock: 5
  },
  {
    id: 19,
    name: "India Minimalist White Sneakers",
    price: 2899,
    category: "Shoes",
    colors: ["white", "black", "grey"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-17",
    stock: 14
  },
  {
    id: 20,
    name: "India Classic Black Hoodie",
    price: 1899,
    category: "Clothing",
    colors: ["black", "grey", "white"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80",
    rating: 4,
    dateAdded: "2026-11-09",
    stock: 11
  },
  {
    id: 21,
    name: "India Vintage Leather Wallet",
    price: 1299,
    category: "Accessories",
    colors: ["brown", "black"],
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-10-22",
    stock: 9
  },
  {
    id: 22,
    name: "India Evening Satin Dress",
    price: 3299,
    category: "Clothing",
    colors: ["black", "red", "green"],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-18",
    stock: 7
  },
  {
    id: 23,
    name: "India Tailored Formal Trousers",
    price: 1999,
    category: "Clothing",
    colors: ["black", "grey", "brown"],
    sizes: ["30", "32", "34", "36"],
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-16",
    stock: 10
  },
  {
    id: 24,
    name: "India Embroidered Occasion Kurta",
    price: 2899,
    category: "Clothing",
    colors: ["blue", "green", "red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-18",
    stock: 8
  },
  {
    id: 25,
    name: "India Classic Leather Loafers",
    price: 3499,
    category: "Shoes",
    colors: ["black", "brown"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    dateAdded: "2026-11-18",
    stock: 9
  }
];

const PRODUCT_OCCASIONS = {
  1: ["casual", "party"],
  2: ["casual", "office", "party"],
  3: ["casual", "office", "wedding"],
  4: ["office", "party", "wedding"],
  5: ["casual", "party"],
  6: ["office", "party", "wedding"],
  7: ["casual", "party"],
  8: ["casual"],
  9: ["casual"],
  10: ["casual", "party"],
  11: ["casual", "office"],
  12: ["casual", "office"],
  13: ["office", "wedding"],
  14: ["casual", "party"],
  15: ["casual", "party", "wedding"],
  16: ["office", "wedding"],
  17: ["casual"],
  18: ["party"],
  19: ["casual"],
  20: ["casual"],
  21: ["office", "wedding"],
  22: ["party"],
  23: ["office", "wedding"],
  24: ["party", "wedding"],
  25: ["office", "wedding"]
};

products.forEach(product => {
  product.occasions = PRODUCT_OCCASIONS[product.id] || [];
});

function getStylistIntent(userText, colorPreference) {
  const query = String(userText || "").toLowerCase();
  const occasionRules = [
    { name: "wedding", words: ["wedding", "marriage", "bridal", "reception", "ceremony"] },
    { name: "office", words: ["office", "work", "business", "formal", "interview"] },
    { name: "party", words: ["party", "night out", "birthday", "club", "celebration", "date night"] },
    { name: "casual", words: ["casual", "weekend", "everyday", "relaxed", "daily"] }
  ];
  const occasion = occasionRules.find(rule => rule.words.some(word => query.includes(word)))?.name || "";
  const colors = ["black", "white", "red", "blue", "green", "brown", "gold", "grey"]
    .filter(color => query.includes(color));
  const selectedColor = String(colorPreference || "").trim().toLowerCase();
  if (colors.indexOf(selectedColor) === -1 &&
      ["black", "white", "red", "blue", "green", "brown", "gold", "grey"].includes(selectedColor)) {
    colors.push(selectedColor);
  }

  const budgetMatch = query.match(/(?:under|below|less than|up to|within)\s*(?:₹|rs\.?\s*)?([\d,]+)/i) ||
    query.match(/(?:₹|rs\.?\s*)([\d,]+)/i);
  const productTypes = [
    { name: "t-shirt", words: ["t-shirt", "tshirt", "t shirt", "tee"] },
    { name: "shirt", words: ["shirt", "blouse"] },
    { name: "dress", words: ["dress", "gown"] },
    { name: "trousers", words: ["trouser", "pants"] },
    { name: "jeans", words: ["jeans", "denim"] },
    { name: "hoodie", words: ["hoodie", "sweatshirt"] },
    { name: "jacket", words: ["jacket", "blazer", "coat"] },
    { name: "shoes", words: ["shoe", "sneaker", "footwear", "boot", "loafer", "oxford"] },
    { name: "bag", words: ["bag", "backpack", "wallet"] },
    { name: "sunglasses", words: ["sunglass", "glasses", "aviator"] },
    { name: "watch", words: ["watch", "chrono"] },
    { name: "kurta", words: ["kurta"] }
  ];
  const matchedProductType = productTypes.find(type => type.words.some(word => query.includes(word)));

  return {
    occasion,
    colors,
    maxBudget: budgetMatch ? Number(budgetMatch[1].replace(/,/g, "")) : Infinity,
    productType: matchedProductType ? matchedProductType.name : "",
    productTypeWords: matchedProductType ? matchedProductType.words : [],
    wantsOutfit: Boolean(occasion || /\b(outfit|look|wardrobe|style)\b/.test(query))
  };
}

function getStylistRecommendations(userText, colorPreference = "", targetProductId = null, limit = 3) {
  const query = String(userText || "").toLowerCase();
  const intent = getStylistIntent(userText, colorPreference);
  const target = targetProductId == null
    ? null
    : products.find(product => product.id === Number(targetProductId));
  const typeMatches = product => {
    if (!intent.productType) return false;
    if (intent.productType === "shoes") return product.category === "Shoes";
    const name = product.name.toLowerCase();
    return intent.productTypeWords.some(word => name.includes(word));
  };

  let candidates = products.filter(product => !target || product.category !== target.category);
  if (Number.isFinite(intent.maxBudget)) {
    const withinBudget = candidates.filter(product => product.price <= intent.maxBudget);
    if (withinBudget.length) candidates = withinBudget;
  }

  const ranked = candidates.map(product => {
    let score = Number(product.rating || 0) * 2;
    const name = product.name.toLowerCase();

    if (target) {
      const complementaryCategory = target.category === "Clothing"
        ? product.category === "Shoes" || product.category === "Accessories"
        : target.category === "Shoes"
          ? product.category === "Clothing" || product.category === "Accessories"
          : product.category === "Clothing" || product.category === "Shoes";
      if (complementaryCategory) score += 100;
      if ((product.colors || []).some(color => target.colors.includes(color))) score += 20;
    } else {
      if (intent.occasion) {
        score += (product.occasions || []).includes(intent.occasion) ? 100 : -35;
      }
      if (typeMatches(product)) score += 75;
      else if (intent.productType) score -= 10;
    }

    if (intent.colors.length) {
      score += intent.colors.some(color => (product.colors || []).includes(color)) ? 35 : -25;
    }
    if (Number.isFinite(intent.maxBudget)) {
      score += product.price <= intent.maxBudget ? 20 : -60;
    }

    return { product, score, name };
  }).sort((a, b) =>
    b.score - a.score ||
    Number(b.product.rating || 0) - Number(a.product.rating || 0) ||
    String(b.product.dateAdded || "").localeCompare(String(a.product.dateAdded || "")) ||
    a.product.id - b.product.id
  );

  const count = Math.max(1, Math.min(4, Number(limit) || 3));
  const shouldDiversify = Boolean(target || intent.wantsOutfit || !intent.productType);
  const selected = [];
  if (shouldDiversify) {
    const categories = new Set();
    ranked.forEach(item => {
      if (selected.length < count && !categories.has(item.product.category)) {
        selected.push(item);
        categories.add(item.product.category);
      }
    });
  }
  if (!target) {
    ranked.forEach(item => {
      if (selected.length < count && !selected.some(pick => pick.product.id === item.product.id)) {
        selected.push(item);
      }
    });
  }

  return selected.map(({ product }) => {
    let reason;
    if (target) {
      reason = `Pairs with ${target.name} and helps finish the look.`;
    } else if (intent.occasion) {
      const occasionDetail = product.category === "Clothing"
        ? "a polished outfit focal point"
        : product.category === "Shoes"
          ? "a refined finishing touch"
          : "a coordinated accessory";
      reason = `For ${intent.occasion} looks, ${product.name} adds ${occasionDetail}.`;
    } else if (intent.productType) {
      reason = `A highly rated pick that matches your ${intent.productType} request.`;
    } else {
      reason = `A versatile, highly rated pick from our ${product.category.toLowerCase()} collection.`;
    }
    if (intent.colors.some(color => (product.colors || []).includes(color))) {
      reason += ` Available in ${intent.colors.filter(color => product.colors.includes(color)).join(" and ")}.`;
    }
    if (Number.isFinite(intent.maxBudget)) {
      reason += ` Within your ₹${intent.maxBudget} per-item budget.`;
    }
    return { product, reason };
  });
}

// Helper to format currency in Indian Rupees (₹)
function formatPriceINR(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// Support both global browser scope (for file:// protocol without module restrictions) and ES modules
if (typeof window !== "undefined") {
  window.products = products;
  window.formatPriceINR = formatPriceINR;
  window.getStylistIntent = getStylistIntent;
  window.getStylistRecommendations = getStylistRecommendations;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { products, formatPriceINR, getStylistIntent, getStylistRecommendations };
}
