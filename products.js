/* =====================================================================
   AURA NAILS – this is the ONLY file you need to edit to change the shop
   ===================================================================== */

const SHOP = {
  name: "Aura Nails",
  email: "hello@yourdomain.com",
  legal: "Operated by Full Name / Company Ltd., Reg. no. 00000000",
  shipping: "Delivery in 7–21 days",
  heroSub: "Pick a set, pay by card and we ship it to your door. No salon, no waiting.",
  info: [
    { t: "Delivery", d: "Sets ship directly from our supplier. Delivery takes 7–21 business days." },
    { t: "Returns", d: "Unopened sets can be returned within 14 days of delivery." },
    { t: "Payment", d: "Card, Apple Pay and Google Pay through a secure payment gateway." }
  ]
};

/* Address of your checkout function (see netlify/functions/checkout.js).
   On Netlify it is: "/.netlify/functions/checkout" */
const CHECKOUT_ENDPOINT = "/.netlify/functions/checkout";

/* =====================================================================
   PRODUCTS – 15 slots are ready. Copy a { ... } block to add more.
   - id       unique, lowercase, no spaces (must match the same id in checkout.js)
   - name     set name
   - price    your selling price in € (the same price must be in checkout.js)
   - desc     short line shown on the card
   - details  longer text shown on the product page (optional)
   - images   ALL photos of the set, as many as you like, in the order they appear:
              images: ["https://.../1.jpg", "https://.../2.jpg", "https://.../3.jpg"]
              (empty = nails are drawn from the colors below)
   - shein    supplier link (Shein / Temu / ...). Customers never see it. It shows
              only when you open the site with ?admin=1 at the end of the address.
   - payLink  optional Stripe Payment Link, used only if CHECKOUT_ENDPOINT is empty
   - shape    almond | coffin | square | round   (for the drawn preview)
   - colors   nail colors (for the drawn preview)
   - tip      tip color for a French manicure (optional)
   ===================================================================== */
const PRODUCTS = [
  {
    id: "cherry-gloss",
    name: "Cherry Gloss",
    price: 9.90,
    desc: "24 pcs · almond · glossy finish",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "almond",
    colors: ["#B3123F","#D6007D","#B3123F","#D6007D","#B3123F"]
  },
  {
    id: "milk-french",
    name: "Milk French",
    price: 8.90,
    desc: "24 pcs · almond · French tip",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "almond",
    colors: ["#F6D9D6"],
    tip: "#FFFFFF"
  },
  {
    id: "lilac-chrome",
    name: "Lilac Chrome",
    price: 10.90,
    desc: "24 pcs · coffin · chrome effect",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "coffin",
    colors: ["#B79BE0","#C9B2EA","#B79BE0","#C9B2EA","#B79BE0"]
  },
  {
    id: "mint-short",
    name: "Mint Short",
    price: 7.90,
    desc: "24 pcs · short square",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "square",
    colors: ["#9FE0C8","#7FD1B3","#9FE0C8","#7FD1B3","#9FE0C8"]
  },
  {
    id: "baby-pink",
    name: "Baby Pink",
    price: 7.90,
    desc: "24 pcs · round · soft gloss",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "round",
    colors: ["#F7C6D9"]
  },
  {
    id: "black-cat",
    name: "Black Cat",
    price: 9.90,
    desc: "24 pcs · coffin · jet black",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "coffin",
    colors: ["#1E1B22"]
  },
  {
    id: "nude-almond",
    name: "Nude Almond",
    price: 8.90,
    desc: "24 pcs · almond · everyday nude",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "almond",
    colors: ["#E8C4B0"]
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    price: 8.90,
    desc: "24 pcs · square · glossy blue",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "square",
    colors: ["#6FA8DC","#8DBCE8","#6FA8DC","#8DBCE8","#6FA8DC"]
  },
  {
    id: "sunset-ombre",
    name: "Sunset Ombre",
    price: 10.90,
    desc: "24 pcs · almond · gradient",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "almond",
    colors: ["#FF8FA3","#FFA48A","#FFB88A","#FFA48A","#FF8FA3"]
  },
  {
    id: "pearl-white",
    name: "Pearl White",
    price: 8.90,
    desc: "24 pcs · round · pearl shine",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "round",
    colors: ["#F5F1EE"]
  },
  {
    id: "berry-wine",
    name: "Berry Wine",
    price: 9.90,
    desc: "24 pcs · almond · deep wine",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "almond",
    colors: ["#7A1F3D"]
  },
  {
    id: "butter-yellow",
    name: "Butter Yellow",
    price: 7.90,
    desc: "24 pcs · square · soft yellow",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "square",
    colors: ["#F8E08E"]
  },
  {
    id: "silver-chrome",
    name: "Silver Chrome",
    price: 10.90,
    desc: "24 pcs · coffin · mirror chrome",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "coffin",
    colors: ["#C9CDD6","#DADDE4","#C9CDD6","#DADDE4","#C9CDD6"]
  },
  {
    id: "lavender-french",
    name: "Lavender French",
    price: 9.90,
    desc: "24 pcs · almond · lilac French tip",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "almond",
    colors: ["#F1E4F7"],
    tip: "#B79BE0"
  },
  {
    id: "hot-pink",
    name: "Hot Pink",
    price: 8.90,
    desc: "24 pcs · round · bright pink",
    details: "",
    images: [],
    shein: "",
    payLink: "",
    shape: "round",
    colors: ["#EB008B"]
  }
];
