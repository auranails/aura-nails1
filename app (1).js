/* Shared code for index.html and product.html – nothing to edit here. */
(function () {
  const $ = s => document.querySelector(s);
  const MAX_QTY = 10;
  const CART_KEY = "aura-nails-cart";
  const isAdmin = /[?&]admin=1/.test(location.search);

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = u => { try { const x = new URL(u, location.href); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch (e) { return ""; } };
  const eur = n => "€" + n.toFixed(2);
  const byId = id => PRODUCTS.find(p => p.id === id);
  const imgsOf = p => (Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : [])).filter(Boolean);
  const productUrl = p => "product.html?id=" + encodeURIComponent(p.id) + (isAdmin ? "&admin=1" : "");

  /* ---------- drawn nails (used when a set has no photo) ---------- */
  function nailsHTML(colors, tip) {
    const c = colors && colors.length ? colors : ["#EB008B"];
    return [1, 2, 3, 4, 5].map(i => {
      const base = c[(i - 1) % c.length];
      return `<span class="nail n${i}${tip ? " tip" : ""}" style="--base:${esc(base)};${tip ? `--tip:${esc(tip)}` : ""}"></span>`;
    }).join("");
  }
  const drawnHTML = p => `<div class="nails shape-${esc(p.shape || "almond")}">${nailsHTML(p.colors, p.tip)}</div>`;
  const tintOf = p => (p.colors && p.colors[0]) ? `color-mix(in srgb, ${esc(p.colors[0])} 18%, #fff)` : "var(--soft)";
  function bindFallbacks(root) {
    root.querySelectorAll("img[data-fallback]").forEach(img => {
      img.addEventListener("error", () => {
        const p = byId(img.dataset.fallback);
        if (p) img.parentElement.innerHTML = drawnHTML(p);
      });
    });
  }
  function thumbHTML(p) {
    const first = imgsOf(p)[0];
    return first ? `<img src="${esc(first)}" alt="${esc(p.name)}" loading="lazy" data-fallback="${esc(p.id)}">` : drawnHTML(p);
  }

  /* ---------- static texts ---------- */
  const set = (sel, fn) => { const el = $(sel); if (el) fn(el); };
  set("#shipNote", el => el.textContent = SHOP.shipping);
  set("#legal", el => el.textContent = "© " + new Date().getFullYear() + " " + SHOP.name + ". " + SHOP.legal);
  set("#mail", el => { el.textContent = SHOP.email; el.href = "mailto:" + SHOP.email; });

  /* ---------- cart drawer markup ---------- */
  document.body.insertAdjacentHTML("beforeend", `
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" inert>
      <div class="d-head">
        <h2>Your cart</h2>
        <button class="icon-btn" id="closeCart" aria-label="Close cart">✕</button>
      </div>
      <div class="d-items" id="cartItems" aria-live="polite"></div>
      <div class="d-foot" id="cartFoot">
        <div class="sub"><span>Subtotal</span><span class="price" id="subtotal"></span></div>
        <p class="d-note">Shipping is added at checkout.</p>
        <p class="d-err" id="cartErr" hidden></p>
        <button class="btn" id="checkoutBtn">Checkout</button>
      </div>
    </aside>`);

  /* ---------- cart state (shared between pages through localStorage) ---------- */
  let cart = loadCart();
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return raw.filter(i => byId(i.id)).map(i => ({ id: i.id, qty: Math.min(MAX_QTY, Math.max(1, parseInt(i.qty) || 1)) }));
    } catch (e) { return []; }
  }
  function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }
  function addToCart(id) {
    if (!byId(id)) return;
    const line = cart.find(i => i.id === id);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + 1); else cart.push({ id, qty: 1 });
    changed();
  }
  function setQty(id, qty) {
    if (qty <= 0) cart = cart.filter(i => i.id !== id);
    else { const l = cart.find(i => i.id === id); if (l) l.qty = Math.min(MAX_QTY, qty); }
    changed();
  }
  function changed() { saveCart(); renderCart(); }

  function renderCart() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    const total = cart.reduce((n, i) => n + i.qty * (Number(byId(i.id).price) || 0), 0);
    set("#cartCount", el => { el.textContent = count; el.dataset.zero = count === 0; });
    set("#openCart", el => el.setAttribute("aria-label", `Open cart, ${count} item${count === 1 ? "" : "s"}`));
    $("#cartErr").hidden = true;

    if (!cart.length) {
      $("#cartItems").innerHTML = `<div class="d-empty">Your cart is empty.</div>`;
      $("#cartFoot").hidden = true;
      return;
    }
    $("#cartFoot").hidden = false;
    $("#subtotal").textContent = eur(total);
    $("#cartItems").innerHTML = cart.map(i => {
      const p = byId(i.id);
      return `<div class="line">
        <div class="thumb" style="--tint:${tintOf(p)}">${thumbHTML(p)}</div>
        <div>
          <div class="name">${esc(p.name)}</div>
          <div class="unit">${eur(Number(p.price) || 0)} each</div>
          <div class="qty">
            <button data-dec="${esc(p.id)}" aria-label="Remove one ${esc(p.name)}">−</button>
            <span aria-live="polite">${i.qty}</span>
            <button data-inc="${esc(p.id)}" aria-label="Add one ${esc(p.name)}">+</button>
          </div>
        </div>
        <div class="total">${eur(i.qty * (Number(p.price) || 0))}</div>
      </div>`;
    }).join("");
    bindFallbacks($("#cartItems"));
  }
  $("#cartItems").addEventListener("click", e => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (inc) { const l = cart.find(i => i.id === inc.dataset.inc); if (l) setQty(l.id, l.qty + 1); }
    if (dec) { const l = cart.find(i => i.id === dec.dataset.dec); if (l) setQty(l.id, l.qty - 1); }
  });

  /* ---------- drawer open / close ---------- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  let lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    drawer.inert = false;
    drawer.classList.add("open"); scrim.classList.add("open");
    document.body.classList.add("locked");
    $("#closeCart").focus();
  }
  function closeCart() {
    drawer.classList.remove("open"); scrim.classList.remove("open");
    document.body.classList.remove("locked");
    drawer.inert = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  set("#openCart", el => el.addEventListener("click", openCart));
  $("#closeCart").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) closeCart(); });

  /* ---------- checkout ---------- */
  function showErr(msg) { const el = $("#cartErr"); el.textContent = msg; el.hidden = false; }
  $("#checkoutBtn").addEventListener("click", async () => {
    const btn = $("#checkoutBtn");
    $("#cartErr").hidden = true;
    if (!cart.length) return;

    if (!CHECKOUT_ENDPOINT) {
      const link = cart.length === 1 ? safeUrl(byId(cart[0].id).payLink) : "";
      if (link) { location.href = link; return; }
      showErr("Checkout is not available right now. Please email " + SHOP.email + " to order.");
      return;
    }
    btn.disabled = true; btn.textContent = "Redirecting to payment…";
    try {
      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      location.href = data.url;
    } catch (err) {
      showErr("We couldn't start the payment. Please try again in a moment." + (isAdmin ? " [Admin detail: " + err.message + "]" : ""));
      btn.disabled = false; btn.textContent = "Checkout";
    }
  });

  /* ---------- after payment ---------- */
  if (/[?&]paid=1/.test(location.search)) {
    set("#banner", el => el.hidden = false);
    cart = []; saveCart();
    history.replaceState(null, "", location.pathname);
  }

  renderCart();

  window.Aura = { $, esc, safeUrl, eur, byId, imgsOf, productUrl, nailsHTML, drawnHTML, tintOf, bindFallbacks, thumbHTML, addToCart, openCart, isAdmin };
})();
