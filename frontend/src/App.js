import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import "./App.css";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <nav
          style={{
            width: "200px",
            backgroundColor: "#f2f2f2",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
            borderRight: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginBottom: "30px" }}>Menu</h2>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/products" style={linkStyle}>
            Products
          </Link>
          <Link to="/cart" style={linkStyle}>
            Cart
          </Link>
          <Link to="/checkout" style={linkStyle}>
            Checkout
          </Link>
        </nav>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: "18px",
  fontWeight: "500",
  transition: "color 0.2s ease",
};

export default App;
