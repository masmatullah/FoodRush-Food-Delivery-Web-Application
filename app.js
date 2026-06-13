// ==========================================
// FOODRUSH – APP JAVASCRIPT
// ==========================================

// DATA
const MENU_ITEMS = [
  { id:1, name:"Margherita Pizza", emoji:"🍕", price:850, category:"pizza", rating:4.8, reviews:234, desc:"Classic tomato base with fresh mozzarella, basil & oregano on our thin crispy crust.", time:"25 min", tags:["Vegetarian","Bestseller"], badge:"popular" },
  { id:2, name:"BBQ Chicken Burger", emoji:"🍔", price:650, category:"burger", rating:4.7, reviews:189, desc:"Juicy grilled chicken with smoky BBQ sauce, cheddar, and crunchy slaw.", time:"20 min", tags:["Spicy","Grilled"], badge:"new" },
  { id:3, name:"Salmon Sushi Roll", emoji:"🍣", price:1200, category:"sushi", rating:4.9, reviews:312, desc:"Premium fresh salmon with avocado, cucumber, and spicy mayo.", time:"15 min", tags:["Fresh","Premium"], badge:"popular" },
  { id:4, name:"Creamy Pasta Alfredo", emoji:"🍝", price:750, category:"pasta", rating:4.6, reviews:156, desc:"Fettuccine tossed in rich parmesan cream sauce with garlic butter.", time:"22 min", tags:["Vegetarian","Creamy"], badge:null },
  { id:5, name:"Caesar Salad", emoji:"🥗", price:550, category:"salad", rating:4.5, reviews:98, desc:"Crisp romaine, croutons, parmesan with our signature caesar dressing.", time:"10 min", tags:["Healthy","Light"], badge:null },
  { id:6, name:"Chocolate Lava Cake", emoji:"🍰", price:450, category:"dessert", rating:4.9, reviews:421, desc:"Warm chocolate cake with a gooey molten center, served with vanilla ice cream.", time:"18 min", tags:["Sweet","Hot"], badge:"popular" },
  { id:7, name:"Mango Smoothie", emoji:"🥤", price:300, category:"drinks", rating:4.4, reviews:77, desc:"Fresh Alphonso mangoes blended with milk and a hint of cardamom.", time:"5 min", tags:["Cold","Fresh"], badge:null },
  { id:8, name:"Pepperoni Pizza", emoji:"🍕", price:950, category:"pizza", rating:4.7, reviews:267, desc:"Double pepperoni on a rich tomato sauce base with mozzarella cheese.", time:"25 min", tags:["Spicy","Meat"], badge:"new" },
  { id:9, name:"Classic Smash Burger", emoji:"🍔", price:700, category:"burger", rating:4.8, reviews:344, desc:"Double smashed patty with American cheese, pickles, and secret sauce.", time:"18 min", tags:["Juicy","Classic"], badge:"popular" },
  { id:10, name:"Penne Arrabbiata", emoji:"🍝", price:680, category:"pasta", rating:4.5, reviews:132, desc:"Penne with fiery tomato sauce, garlic, chilli flakes, and fresh basil.", time:"20 min", tags:["Spicy","Vegan"], badge:null },
  { id:11, name:"Dragon Roll", emoji:"🍣", price:1350, category:"sushi", rating:4.9, reviews:189, desc:"Shrimp tempura topped with avocado, eel sauce, and sesame seeds.", time:"20 min", tags:["Premium","Chef's Pick"], badge:"popular" },
  { id:12, name:"Chocolate Milkshake", emoji:"🥤", price:380, category:"drinks", rating:4.6, reviews:203, desc:"Thick and creamy chocolate shake topped with whipped cream and sprinkles.", time:"8 min", tags:["Cold","Sweet"], badge:null },
];

const REVIEWS_DATA = [
  { name:"Sara Ahmed", rating:5, text:"Absolutely love FoodRush! The pizza arrived hot in under 25 minutes. Will definitely order again!", avatar:"SA", time:"2 hours ago" },
  { name:"Usman Khan", rating:4, text:"Great selection of restaurants. The checkout was smooth and tracking was super helpful!", avatar:"UK", time:"5 hours ago" },
  { name:"Fatima Malik", rating:5, text:"Best food delivery app in the city. The sushi was incredibly fresh. Highly recommend!", avatar:"FM", time:"1 day ago" },
  { name:"Ali Hassan", rating:5, text:"The dark mode is a lifesaver at night. Interface is clean and easy to use. 10/10!", avatar:"AH", time:"2 days ago" },
  { name:"Zara Iqbal", rating:4, text:"Delivery was on time and the order tracking gave real peace of mind. Loved it.", avatar:"ZI", time:"3 days ago" },
  { name:"Bilal Sheikh", rating:5, text:"Ordered for the whole office. Everyone was impressed. FoodRush never disappoints!", avatar:"BS", time:"4 days ago" },
];

// STATE
let cart = [];
let wishlist = [];
let currentFilter = "all";
let selectedRating = 0;
let currentModalQty = 1;
let currentModalItem = null;

// INIT
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hidden"), 1800);
  renderMenu("all");
  renderReviews();
  setupNavScroll();
  setupStarPicker();
});

// NAVBAR
function setupNavScroll() {
  window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 40);
    updateActiveNavLink();
  });
}
function updateActiveNavLink() {
  const sections = ["home","menu","track","reviews"];
  let current = "home";
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll(".nav-link").forEach(l => {
    l.classList.toggle("active", l.getAttribute("href") === "#" + current);
  });
}
function toggleMobileMenu() {
  document.getElementById("navLinks").classList.toggle("open");
  document.getElementById("hamburger").classList.toggle("open");
}
function closeMobileMenu() {
  document.getElementById("navLinks").classList.remove("open");
  document.getElementById("hamburger").classList.remove("open");
}

// THEME
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  document.querySelector("#themeBtn i").className = isDark ? "fas fa-moon" : "fas fa-sun";
  showToast(isDark ? "☀️ Light mode on" : "🌙 Dark mode on", "info");
}

// TOAST
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// MENU
function renderMenu(filter) {
  currentFilter = filter;
  const grid = document.getElementById("menuGrid");
  const items = filter === "all" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === filter);
  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text2)"><div style="font-size:48px;margin-bottom:12px">🍽️</div><p>No items in this category yet</p></div>`;
    return;
  }
  grid.innerHTML = items.map(item => {
    const inWish = wishlist.some(w => w.id === item.id);
    return `
    <div class="menu-card" onclick="openItemModal(${item.id})">
      <div class="menu-card-img">
        ${item.badge ? `<div class="menu-card-badge ${item.badge==='popular'?'popular':''}">${item.badge==='popular'?'🔥 Popular':'✨ New'}</div>` : ''}
        ${item.emoji}
      </div>
      <div class="menu-card-body">
        <div class="menu-card-top">
          <div class="menu-card-name">${item.name}</div>
          <div class="menu-card-rating">⭐ ${item.rating}</div>
        </div>
        <div class="menu-card-meta">
          <span><i class="fas fa-clock"></i> ${item.time}</span>
          <span><i class="fas fa-comment"></i> ${item.reviews}</span>
        </div>
        <div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer">
          <div class="menu-price">Rs ${item.price}</div>
          <div class="menu-card-actions" onclick="event.stopPropagation()">
            <button class="btn-wish ${inWish?'active':''}" onclick="toggleWishlist(${item.id})"><i class="fas fa-heart"></i></button>
            <button class="btn-add" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
}

function filterMenu(category) {
  renderMenu(category);
  const cats = ["pizza","burger","sushi","pasta","salad","dessert","drinks","all"];
  document.querySelectorAll(".cat-card").forEach((c, i) => c.classList.toggle("active", cats[i] === category));
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}

// ITEM MODAL
function openItemModal(id) {
  const item = MENU_ITEMS.find(i => i.id === id);
  if (!item) return;
  currentModalItem = item;
  currentModalQty = 1;
  document.getElementById("itemModalContent").innerHTML = `
    <div class="item-modal-emoji">${item.emoji}</div>
    <div class="item-modal-name">${item.name}</div>
    <div style="display:flex;gap:16px;margin-bottom:12px;font-size:13px;color:var(--text2)">
      <span>⭐ ${item.rating} (${item.reviews} reviews)</span>
      <span>⏱️ ${item.time}</span>
    </div>
    <div class="item-modal-desc">${item.desc}</div>
    <div class="item-modal-tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    <div class="item-modal-actions">
      <div class="item-modal-price">Rs ${item.price}</div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="qty-control">
          <button onclick="changeModalQty(-1)">−</button>
          <span id="modalQty">1</span>
          <button onclick="changeModalQty(1)">+</button>
        </div>
        <button class="btn-primary" onclick="addToCartFromModal()">Add to Cart</button>
      </div>
    </div>`;
  openModal("itemModal");
}
function changeModalQty(delta) {
  currentModalQty = Math.max(1, currentModalQty + delta);
  document.getElementById("modalQty").textContent = currentModalQty;
}
function addToCartFromModal() {
  for (let i = 0; i < currentModalQty; i++) addToCart(currentModalItem.id, true);
  closeModal("itemModal");
  showToast(`🛒 ${currentModalItem.name} added to cart!`, "success");
}

// CART
function addToCart(id, silent = false) {
  const item = MENU_ITEMS.find(i => i.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  updateBadges();
  if (!silent) showToast(`🛒 ${item.name} added!`, "success");
  renderMenu(currentFilter);
}
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateBadges();
  renderCartModal();
  updateCartTotals();
}
function updateCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) removeFromCart(id);
  else { renderCartModal(); updateCartTotals(); }
}
function openCart() { renderCartModal(); openModal("cartModal"); }
function renderCartModal() {
  const container = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");
  if (cart.length === 0) { container.innerHTML = ""; empty.style.display = "flex"; footer.style.display = "none"; return; }
  empty.style.display = "none"; footer.style.display = "block";
  container.innerHTML = cart.map(item => `
    <div class="side-item">
      <div class="side-item-emoji">${item.emoji}</div>
      <div class="side-item-info"><strong>${item.name}</strong><span>Rs ${item.price * item.qty}</span></div>
      <div class="side-item-actions">
        <button class="qty-btn" onclick="updateCartQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="updateCartQty(${item.id},1)">+</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>`).join("");
  updateCartTotals();
}
function updateCartTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + 50;
  const s1 = document.getElementById("cartSubtotal"); if(s1) s1.textContent = `Rs ${subtotal}`;
  const t1 = document.getElementById("cartTotal"); if(t1) t1.textContent = `Rs ${total}`;
  const s2 = document.getElementById("coSubtotal"); if(s2) s2.textContent = `Rs ${subtotal}`;
  const t2 = document.getElementById("coTotal"); if(t2) t2.textContent = `Rs ${total}`;
}

// WISHLIST
function toggleWishlist(id) {
  const item = MENU_ITEMS.find(i => i.id === id);
  if (!item) return;
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx > -1) { wishlist.splice(idx, 1); showToast("💔 Removed from wishlist", "info"); }
  else { wishlist.push(item); showToast("❤️ Added to wishlist!", "success"); }
  updateBadges();
  renderMenu(currentFilter);
}
function openWishlist() { renderWishlistModal(); openModal("wishlistModal"); }
function renderWishlistModal() {
  const container = document.getElementById("wishlistItems");
  const empty = document.getElementById("wishlistEmpty");
  if (wishlist.length === 0) { container.innerHTML = ""; empty.style.display = "flex"; return; }
  empty.style.display = "none";
  container.innerHTML = wishlist.map(item => `
    <div class="side-item">
      <div class="side-item-emoji">${item.emoji}</div>
      <div class="side-item-info"><strong>${item.name}</strong><span>Rs ${item.price}</span></div>
      <div class="side-item-actions">
        <button class="btn-add" onclick="addToCartFromWish(${item.id})" title="Add to cart"><i class="fas fa-cart-plus"></i></button>
        <button class="remove-btn" onclick="removeFromWishlist(${item.id})"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>`).join("");
}
function addToCartFromWish(id) { addToCart(id); showToast("🛒 Moved to cart!", "success"); }
function removeFromWishlist(id) { wishlist = wishlist.filter(w => w.id !== id); updateBadges(); renderWishlistModal(); renderMenu(currentFilter); }
function updateBadges() {
  document.getElementById("cartBadge").textContent = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("wishlistBadge").textContent = wishlist.length;
}

// CHECKOUT
function openCheckout() {
  closeModal("cartModal");
  const container = document.getElementById("checkoutItems");
  if (container) container.innerHTML = cart.map(i => `<div class="co-item"><span>${i.emoji} ${i.name} x${i.qty}</span><span>Rs ${i.price*i.qty}</span></div>`).join("");
  updateCartTotals();
  openModal("checkoutModal");
}
function selectPayment(el) {
  document.querySelectorAll(".payment-opt").forEach(o => o.classList.remove("active"));
  el.classList.add("active");
  const cardFields = document.getElementById("cardFields");
  if (cardFields) cardFields.style.display = el.querySelector("input").value === "card" ? "block" : "none";
}
function formatCard(input) {
  let v = input.value.replace(/\D/g,"").slice(0,16);
  input.value = v.match(/.{1,4}/g)?.join(" ") || v;
}
function applyPromo() {
  const code = document.getElementById("promoCode").value.trim().toUpperCase();
  const valid = { "RUSH10":10, "FOOD20":20, "FIRST50":50 };
  if (valid[code]) showToast(`🎉 ${valid[code]}% discount applied!`, "success");
  else showToast("❌ Invalid promo code", "error");
}
function placeOrder() {
  const name = document.getElementById("coName").value.trim();
  const phone = document.getElementById("coPhone").value.trim();
  const address = document.getElementById("coAddress").value.trim();
  if (!name || !phone || !address) { showToast("⚠️ Please fill in all delivery details", "error"); return; }
  if (cart.length === 0) { showToast("🛒 Cart is empty", "error"); return; }
  const orderId = "FR-" + new Date().getFullYear() + "-" + Math.floor(Math.random()*900+100);
  closeModal("checkoutModal");
  cart = []; updateBadges(); renderMenu(currentFilter);
  showToast(`✅ Order ${orderId} placed!`, "success");
  setTimeout(() => { document.getElementById("trackInput").value = orderId; trackOrder(); document.getElementById("track").scrollIntoView({behavior:"smooth"}); }, 1500);
}

// TRACKING
function trackOrder() {
  const input = document.getElementById("trackInput").value.trim();
  if (!input) { showToast("⚠️ Please enter an Order ID", "error"); return; }
  const statuses = ["Order Placed","Preparing","On the Way","Delivered"];
  const etas = ["40 min","30 min","15 min","Delivered!"];
  const stepNum = Math.floor(Math.random() * 4);
  document.getElementById("trackOrderId").textContent = input;
  document.getElementById("trackETA").textContent = etas[stepNum];
  const statusEl = document.getElementById("trackStatus");
  statusEl.textContent = statuses[stepNum];
  statusEl.style.color = stepNum===3 ? "var(--accent)" : "var(--primary)";
  statusEl.style.background = stepNum===3 ? "rgba(46,204,113,0.1)" : "var(--primary-light)";
  ["step1","step2","step3","step4"].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove("done","active");
    if (i < stepNum) el.classList.add("done");
    else if (i === stepNum) el.classList.add("active");
  });
  document.getElementById("trackingResult").classList.remove("hidden");
  showToast(`📦 Status: ${statuses[stepNum]}`, "success");
}

// REVIEWS
function renderReviews() {
  document.getElementById("reviewsGrid").innerHTML = REVIEWS_DATA.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.avatar}</div>
        <div class="review-meta">
          <strong>${r.name}</strong>
          <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div>
          <small>${r.time}</small>
        </div>
      </div>
      <p class="review-text">${r.text}</p>
    </div>`).join("");
}
function setupStarPicker() {
  const stars = document.querySelectorAll(".star-picker i");
  stars.forEach((star, i) => {
    star.addEventListener("mouseover", () => stars.forEach((s,j) => s.classList.toggle("active", j<=i)));
    star.addEventListener("click", () => { selectedRating = i+1; stars.forEach((s,j) => s.classList.toggle("active", j<=i)); });
  });
  document.querySelector(".star-picker").addEventListener("mouseleave", () => stars.forEach((s,j) => s.classList.toggle("active", j<selectedRating)));
}
function submitReview() {
  const name = document.getElementById("reviewName").value.trim();
  const text = document.getElementById("reviewText").value.trim();
  if (!name || !text) { showToast("⚠️ Please fill name and review", "error"); return; }
  if (selectedRating === 0) { showToast("⭐ Please select a rating", "error"); return; }
  REVIEWS_DATA.unshift({ name, rating: selectedRating, text, avatar: name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2), time:"Just now" });
  renderReviews();
  document.getElementById("reviewName").value = "";
  document.getElementById("reviewText").value = "";
  selectedRating = 0;
  document.querySelectorAll(".star-picker i").forEach(s => s.classList.remove("active"));
  showToast("✅ Review submitted! Thank you 🙏", "success");
}

// AUTH
function openAuthModal(tab) { switchAuth(tab); openModal("authModal"); }
function switchAuth(tab) {
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("signupForm").classList.toggle("hidden", tab !== "signup");
  document.getElementById("loginTab").classList.toggle("active", tab === "login");
  document.getElementById("signupTab").classList.toggle("active", tab === "signup");
}
function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  if (!email || !pass) { showToast("⚠️ Please fill all fields", "error"); return; }
  if (!email.includes("@")) { showToast("⚠️ Enter a valid email", "error"); return; }
  closeModal("authModal");
  showToast(`👋 Welcome back, ${email.split("@")[0]}!`, "success");
  document.querySelector(".nav-actions .btn-primary").textContent = email.split("@")[0];
}
function handleSignup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const pass = document.getElementById("signupPass").value.trim();
  const agree = document.getElementById("agreeTerms").checked;
  if (!name || !email || !pass) { showToast("⚠️ Please fill all fields", "error"); return; }
  if (pass.length < 8) { showToast("⚠️ Password must be 8+ characters", "error"); return; }
  if (!agree) { showToast("⚠️ Please agree to Terms", "error"); return; }
  closeModal("authModal");
  showToast(`🎉 Welcome to FoodRush, ${name.split(" ")[0]}!`, "success");
  document.querySelector(".nav-actions .btn-primary").textContent = name.split(" ")[0];
}
function socialLogin(provider) {
  closeModal("authModal");
  showToast(`✅ Signed in with ${provider}!`, "success");
}
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isPass = input.type === "password";
  input.type = isPass ? "text" : "password";
  btn.querySelector("i").className = isPass ? "fas fa-eye-slash" : "fas fa-eye";
}

// MODAL HELPERS
function openModal(id) { document.getElementById(id).classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal(id) { document.getElementById(id).classList.remove("open"); document.body.style.overflow = ""; }
function closeOnOverlay(event, id) { if (event.target === event.currentTarget) closeModal(id); }

// ESC KEY
document.addEventListener("keydown", e => {
  if (e.key === "Escape") ["authModal","wishlistModal","cartModal","checkoutModal","itemModal"].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.classList.contains("open")) closeModal(id);
  });
});