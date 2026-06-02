"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  function addToCart(product) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.productId === (product._id || product.id));
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = (next[idx].quantity || 1) + 1;
        return next;
      }
      return [
        ...prev,
        {
          productId: product._id || product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  }

  function updateQuantity(productId, quantity) {
    setCart((prev) => prev.map(p => p.productId === productId ? { ...p, quantity } : p));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
