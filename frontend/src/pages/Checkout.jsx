import { useEffect, useState } from "react";

export default function Checkout() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5167/api/cart")
      .then((res) => res.json())
      .then(setCart)
      .catch(console.error);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setLoading(true);

    // Send name, email, and cart items to backend
    fetch("http://localhost:5167/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        cartItems: cart.items,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReceipt(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Error during checkout");
        setLoading(false);
      });
  }

  if (receipt) {
    return (
      <div className="receipt-modal" style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
        <h3>Receipt</h3>
        <div>
          {receipt.items?.map((item) => (
            <div key={item.cartItemId} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>{item.name} (x{item.qty})</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <h4>Total: ${receipt.total?.toFixed(2) ?? "0.00"}</h4>
        <p><strong>Name:</strong> {receipt.name}</p>
        <p><strong>Email:</strong> {receipt.email}</p>
        <p><small>{new Date(receipt.timestamp).toLocaleString()}</small></p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h2>Checkout</h2>

      {/* Show current cart items before checkout */}
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={{ marginBottom: 20 }}>
          {cart.items.map((item) => (
            <div key={item.cartItemId} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>{item.name} (x{item.qty})</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <h4>Total: ${cart.total.toFixed(2)}</h4>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: 8, fontSize: 16 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: 8, fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            fontSize: 18,
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            alignSelf: "center",
            width: "50%",
            borderRadius: 4,
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
