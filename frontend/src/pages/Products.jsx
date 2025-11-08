import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products and cart on mount
  useEffect(() => {
    fetch("http://localhost:5167/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);

    fetchCart();
  }, []);

  function fetchCart() {
    fetch("http://localhost:5167/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data.items || []))
      .catch(console.error);
  }

  // Add product to cart
  function addToCart(productId) {
    fetch("http://localhost:5167/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty: 1 }),
    })
      .then((res) => res.json())
      .then(() => fetchCart())
      .catch(console.error);
  }

  // Remove product from cart
  function removeFromCart(productId) {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;

    fetch(`http://localhost:5167/api/cart/${item.cartItemId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => fetchCart())
      .catch(console.error);
  }

  function isInCart(id) {
    return cart.some((item) => item.productId === id);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {products.map((p) => {
          const inCart = isInCart(p.id);
          return (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ marginBottom: 10 }}>{p.name}</h3>
              <p style={{ fontSize: 16, marginBottom: 15 }}>
                Price: <strong>${p.price.toFixed(2)}</strong>
              </p>

              {inCart ? (
                <button
                  onClick={() => removeFromCart(p.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 5,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Remove from Cart
                </button>
              ) : (
                <button
                  onClick={() => addToCart(p.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: 5,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
