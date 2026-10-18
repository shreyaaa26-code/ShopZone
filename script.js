
const products = [
  {
    id: 1,
    name: "Everyday Headphones",
    category: "Tech",
    price: 1499,
    label: "A DAILY ESSENTIAL",
    description: "A clean look for your everyday listening setup.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Style",
    price: 1999,
    label: "OFF-DUTY STYLE",
    description: "A versatile everyday look for casual outfits.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Minimal Watch",
    category: "Style",
    price: 2499,
    label: "TIMELESS DESIGN",
    description: "A simple accessory with an understated finish.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Everyday Backpack",
    category: "Style",
    price: 1299,
    label: "READY TO GO",
    description: "A practical companion for daily essentials.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Desk Headphones",
    category: "Tech",
    price: 1799,
    label: "WORK & UNWIND",
    description: "A simple addition to your desk setup.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Modern Table Lamp",
    category: "Home",
    price: 1199,
    label: "HOME COMFORT",
    description: "A warm, minimal touch for your favorite corner.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Everyday Sunglasses",
    category: "Style",
    price: 899,
    label: "SUNNY DAYS",
    description: "An easy finishing touch for casual outfits.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Wireless Speaker",
    category: "Tech",
    price: 2199,
    label: "SOUND YOUR WAY",
    description: "Bring music into your everyday spaces.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"
  }
];

const $ = (selector) => document.querySelector(selector);

const productGrid = $("#productGrid");
const searchInput = $("#searchInput");
const sortSelect = $("#sortSelect");
const categoryFilters = $("#categoryFilters");
const productCounter = $("#productCounter");
const emptyResults = $("#emptyResults");

let activeCategory = "All";
let wishlistOnly = false;
let toastTimer;

function loadSaved(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

let cart = loadSaved("shopzone-cart", []);
let wishlist = loadSaved("shopzone-wishlist", []);

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(wishlist)) wishlist = [];

cart = cart.filter(item =>
  item &&
  Number.isInteger(item.id) &&
  Number.isInteger(item.qty) &&
  item.qty > 0 &&
  products.some(product => product.id === item.id)
);

wishlist = wishlist.filter(id =>
  Number.isInteger(id) && products.some(product => product.id === id)
);

function saveState() {
  try {
    localStorage.setItem("shopzone-cart", JSON.stringify(cart));
    localStorage.setItem("shopzone-wishlist", JSON.stringify(wishlist));
  } catch {
    showToast("Changes will remain until you leave this session.");
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function getVisibleProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  let result = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    const searchableText =
      `${product.name} ${product.category} ${product.description}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);
    const matchesWishlist =
      !wishlistOnly || wishlist.includes(product.id);

    return matchesCategory && matchesSearch && matchesWishlist;
  });

  switch (sortSelect.value) {
    case "low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productCounter.textContent =
    `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"} found`;

  emptyResults.classList.toggle("hidden", visibleProducts.length > 0);
  productGrid.classList.toggle("hidden", visibleProducts.length === 0);

  productGrid.innerHTML = visibleProducts.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    const safeName = escapeHTML(product.name);

    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <span class="product-label">${escapeHTML(product.label)}</span>
          <img
            class="product-image"
            src="${product.image}"
            alt="${safeName}"
            loading="lazy"
          >
          <button
            class="wishlist-button ${isWishlisted ? "active" : ""}"
            data-action="wishlist"
            data-id="${product.id}"
            aria-label="${isWishlisted ? "Remove from" : "Add to"} wishlist: ${safeName}"
            aria-pressed="${isWishlisted}"
          >${isWishlisted ? "♥" : "♡"}</button>
          <button class="quick-add" data-action="add" data-id="${product.id}">
            Add to bag +
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${escapeHTML(product.category)}</span>
          <h3>${safeName}</h3>
          <p class="product-description">${escapeHTML(product.description)}</p>
          <div class="product-bottom">
            <span class="product-price">${formatPrice(product.price)}</span>
            <button class="add-small" data-action="add" data-id="${product.id}">
              + Add
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function updateCategoryButtons() {
  categoryFilters.querySelectorAll("[data-category]").forEach(button => {
    const selected = button.dataset.category === activeCategory;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function updateWishlistButton() {
  const button = $("#wishlistToggle");
  button.classList.toggle("is-active", wishlistOnly);
  button.textContent = wishlistOnly ? "♥" : "♡";
  button.title = wishlistOnly ? "Show all products" : "Show wishlist";
  button.setAttribute("aria-pressed", String(wishlistOnly));
}

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveState();
  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function toggleWishlist(id) {
  const product = getProduct(id);
  if (!product) return;

  const alreadySaved = wishlist.includes(id);

  wishlist = alreadySaved
    ? wishlist.filter(savedId => savedId !== id)
    : [...wishlist, id];

  saveState();
  renderProducts();
  updateWishlistButton();

  showToast(
    alreadySaved
      ? `${product.name} removed from wishlist.`
      : `${product.name} saved to wishlist.`
  );
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const itemCount = getCartQuantity();
  const cartItems = $("#cartItems");

  $("#cartCount").textContent = itemCount;
  $("#drawerItemCount").textContent = `(${itemCount})`;
  $("#cartSubtotal").textContent = formatPrice(getCartTotal());

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <span>♡</span>
        <h3>Your bag is taking a little break.</h3>
        <p>Explore the collection and add something you like.</p>
        <button class="primary-button" id="emptyCartShop">Explore products ↗</button>
      </div>
    `;

    $("#cartFooter").classList.add("hidden");
    return;
  }

  $("#cartFooter").classList.remove("hidden");

  cartItems.innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return "";

    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${escapeHTML(product.name)}">
        <div>
          <h3>${escapeHTML(product.name)}</h3>
          <span class="cart-category">${escapeHTML(product.category)}</span>
          <div class="cart-line-price">${formatPrice(product.price * item.qty)}</div>
          <div class="quantity-control" aria-label="Quantity for ${escapeHTML(product.name)}">
            <button data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item" data-action="remove" data-id="${product.id}" aria-label="Remove ${escapeHTML(product.name)}">×</button>
      </article>
    `;
  }).join("");
}

function changeQuantity(id, amount) {
  const item = cart.find(cartItem => cartItem.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }

  saveState();
  renderCart();
}

function removeFromCart(id) {
  const product = getProduct(id);
  cart = cart.filter(item => item.id !== id);

  saveState();
  renderCart();

  if (product) showToast(`${product.name} removed from your bag.`);
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $("#closeCart").focus();
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#overlay").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  $("#openCart").focus();
}

function openCheckout() {
  if (cart.length === 0) {
    showToast("Your bag is empty. Explore the collection first.");
    return;
  }

  $("#checkoutTotal").textContent = formatPrice(getCartTotal());
  $("#checkoutModal").classList.remove("hidden");
  $("#closeCheckout").focus();
}

function closeCheckout() {
  $("#checkoutModal").classList.add("hidden");
  $("#checkoutButton").focus();
}

// Product cards: add to cart and wishlist
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "add") addToCart(id);
  if (button.dataset.action === "wishlist") toggleWishlist(id);
});

// Cart controls
$("#cartItems").addEventListener("click", event => {
  if (event.target.id === "emptyCartShop") {
    closeCart();
    $("#products").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "increase") changeQuantity(id, 1);
  if (button.dataset.action === "decrease") changeQuantity(id, -1);
  if (button.dataset.action === "remove") removeFromCart(id);
});

// Search, categories, and sorting
searchInput.addEventListener("input", renderProducts);

categoryFilters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  updateCategoryButtons();
  renderProducts();
});

sortSelect.addEventListener("change", renderProducts);

$("#clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "All";
  wishlistOnly = false;
  sortSelect.value = "featured";

  updateCategoryButtons();
  updateWishlistButton();
  renderProducts();
});

$("#wishlistToggle").addEventListener("click", () => {
  wishlistOnly = !wishlistOnly;
  updateWishlistButton();
  renderProducts();

  $("#products").scrollIntoView({ behavior: "smooth" });

  if (wishlistOnly && wishlist.length === 0) {
    showToast("Your wishlist is empty. Save a favorite product first.");
  }
});

// Cart drawer
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);

// Demo checkout: no real order or payment
$("#checkoutButton").addEventListener("click", openCheckout);
$("#closeCheckout").addEventListener("click", closeCheckout);
$("#finishDemo").addEventListener("click", () => {
  closeCheckout();
  closeCart();
  showToast("Demo complete. No order was placed.");
});

// Mobile navigation
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#mainNav");
  const isOpen = nav.classList.toggle("open");

  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").textContent = isOpen ? "×" : "☰";
});

$("#mainNav").addEventListener("click", event => {
  if (event.target.closest("a")) {
    $("#mainNav").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    $("#menuToggle").textContent = "☰";
  }
});

// Expand the compact search field on mobile
const searchBox = $(".search-box");

searchBox.addEventListener("click", () => {
  if (window.innerWidth <= 700) {
    searchBox.classList.add("expanded");
    searchInput.focus();
  }
});

document.addEventListener("click", event => {
  if (!searchBox.contains(event.target) && window.innerWidth <= 700) {
    searchBox.classList.remove("expanded");
  }
});

// "/" is a keyboard shortcut for search
document.addEventListener("keydown", event => {
  const target = event.target;
  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable;

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchBox.classList.add("expanded");
    searchInput.focus();
  }

  if (event.key === "Escape") {
    if (!$("#checkoutModal").classList.contains("hidden")) {
      closeCheckout();
    } else if ($("#cartDrawer").classList.contains("open")) {
      closeCart();
    } else {
      $("#mainNav").classList.remove("open");
      $("#menuToggle").setAttribute("aria-expanded", "false");
      $("#menuToggle").textContent = "☰";
      searchBox.classList.remove("expanded");
    }
  }
});

$("#currentYear").textContent = new Date().getFullYear();

// Initial page state
updateCategoryButtons();
updateWishlistButton();
renderProducts();
renderCart();
