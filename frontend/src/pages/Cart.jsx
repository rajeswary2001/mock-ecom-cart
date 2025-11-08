import { useEffect, useState } from "react";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  function fetchCart() {
    fetch("http://localhost:5167/api/cart")
      .then((res) => res.json())
      .then(setCart)
      .catch(console.error);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  function removeItem(cartItemId) {
    fetch(`http://localhost:5167/api/cart/${cartItemId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(fetchCart)
      .catch(console.error);
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-grid">
            {cart.items.map((item) => (
              <div className="cart-card" key={item.cartItemId}>
                <h3>{item.name}</h3>
                <p>Qty: {item.qty}</p>
                <p>Price: ${(item.price * item.qty).toFixed(2)}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.cartItemId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${cart.total.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
}
