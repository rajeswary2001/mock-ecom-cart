const express = require("express");
const cors = require("cors");
const app = express();
const port = 5167;

app.use(cors());
app.use(express.json());

// In-memory mock data (replace with DB if you want)
let products = [
  { id: "1", name: "Apple", price: 1.5 },
  { id: "2", name: "Banana", price: 0.9 },
  { id: "3", name: "Carrot", price: 0.6 },
  { id: "4", name: "Doughnut", price: 2.0 },
  { id: "5", name: "Eggplant", price: 1.2 },
];

let cart = []; // [{ cartItemId, productId, qty }]

const generateId = () => Math.random().toString(36).substring(2, 9);

// GET /api/products - return all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// POST /api/cart - add {productId, qty}
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty || qty < 1)
    return res.status(400).json({ message: "Invalid productId or qty" });

  // Check if product exists
  const product = products.find((p) => p.id === productId);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  // Check if item already in cart
  let cartItem = cart.find((item) => item.productId === productId);
  if (cartItem) {
    cartItem.qty += qty;
  } else {
    cartItem = { cartItemId: generateId(), productId, qty };
    cart.push(cartItem);
  }

  res.json({ message: "Added to cart", cartItem });
});

// DELETE /api/cart/:id - remove item by cartItemId
app.delete("/api/cart/:id", (req, res) => {
  const id = req.params.id;
  const initialLength = cart.length;
  cart = cart.filter((item) => item.cartItemId !== id);
  if (cart.length === initialLength) {
    return res.status(404).json({ message: "Cart item not found" });
  }
  res.json({ message: "Removed from cart" });
});

// GET /api/cart - get cart items + total
app.get("/api/cart", (req, res) => {
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      cartItemId: item.cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
    };
  });
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  res.json({ items, total });
});

// POST /api/checkout - mock receipt { total, timestamp }
app.post('/api/checkout', (req, res) => {
  const { name, email, cartItems } = req.body;

  if (!name || !email || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: "Missing required fields or empty cart" });
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const taxRate = 0.1; // 10%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Prepare receipt object
  const receipt = {
    items: cartItems,
    subtotal,
    tax,
    total,
    timestamp: new Date().toISOString(),
    name,
    email,
  };
  res.status(200).json(receipt);
});
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
