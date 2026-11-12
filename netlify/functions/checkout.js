// Creates a Stripe Checkout session for the whole cart.
// Prices live HERE (not in the browser) so nobody can change them.
// Keep ids and prices in sync with PRODUCTS in index.html. Prices are in cents.

const PRODUCTS = {
  "cherry-gloss": { name: "Cherry Gloss", price: 990 },
  "milk-french": { name: "Milk French", price: 890 },
  "lilac-chrome": { name: "Lilac Chrome", price: 1090 },
  "mint-short": { name: "Mint Short", price: 790 },
  "baby-pink": { name: "Baby Pink", price: 790 },
  "black-cat": { name: "Black Cat", price: 990 },
  "nude-almond": { name: "Nude Almond", price: 890 },
  "ocean-blue": { name: "Ocean Blue", price: 890 },
  "sunset-ombre": { name: "Sunset Ombre", price: 1090 },
  "pearl-white": { name: "Pearl White", price: 890 },
  "berry-wine": { name: "Berry Wine", price: 990 },
  "butter-yellow": { name: "Butter Yellow", price: 790 },
  "silver-chrome": { name: "Silver Chrome", price: 1090 },
  "lavender-french": { name: "Lavender French", price: 990 },
  "hot-pink": { name: "Hot Pink", price: 890 }
};

const CURRENCY = "eur";
const SHIPPING_CENTS = 299; // flat shipping fee, set 0 for free shipping
const COUNTRIES = ["SK", "CZ", "PL", "HU", "AT", "DE"]; // where you ship
const MAX_QTY = 10;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return json(500, { error: "Stripe key is not configured" });

  let items;
  try { items = JSON.parse(event.body || "{}").items; } catch (e) { items = null; }
  if (!Array.isArray(items) || !items.length) return json(400, { error: "Cart is empty" });

  const origin = process.env.SITE_URL || event.headers.origin || `https://${event.headers.host}`;

  const p = new URLSearchParams();
  p.append("mode", "payment");
  p.append("success_url", `${origin}/?paid=1`);
  p.append("cancel_url", `${origin}/`);
  p.append("phone_number_collection[enabled]", "true");
  COUNTRIES.forEach((c, i) => p.append(`shipping_address_collection[allowed_countries][${i}]`, c));

  let n = 0;
  for (const it of items) {
    const prod = PRODUCTS[it && it.id];
    const qty = Math.min(MAX_QTY, Math.max(1, parseInt(it && it.qty, 10) || 0));
    if (!prod || !qty) return json(400, { error: "Invalid item in cart" });
    p.append(`line_items[${n}][quantity]`, String(qty));
    p.append(`line_items[${n}][price_data][currency]`, CURRENCY);
    p.append(`line_items[${n}][price_data][unit_amount]`, String(prod.price));
    p.append(`line_items[${n}][price_data][product_data][name]`, prod.name);
    n++;
  }

  if (SHIPPING_CENTS > 0) {
    p.append("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    p.append("shipping_options[0][shipping_rate_data][display_name]", "Standard shipping");
    p.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(SHIPPING_CENTS));
    p.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]", CURRENCY);
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: p
    });
    const data = await res.json();
    if (!res.ok) return json(502, { error: (data.error && data.error.message) || "Stripe error" });
    return json(200, { url: data.url });
  } catch (e) {
    return json(502, { error: "Could not reach Stripe" });
  }
};
