'use client';
import { useState } from "react";
import { useRouter } from 'next/router';
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const router = useRouter();

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return null; // Prevent rendering while redirecting
  }

  const shippingCost = shippingMethod === "express" ? 15 : shippingMethod === "overnight" ? 25 : 0;
  const discountAmount = discountCode === "SAVE10" ? total * 0.1 : 0;
  const tax = (total - discountAmount) * 0.1;
  const finalTotal = total - discountAmount + tax + shippingCost;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    setLoading(true);
    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, name, email, address, total }),
      });
      const json = await resp.json();
      if (json?.orderId) {
        alert(`Order confirmed! Order id: ${json.orderId}`);
        clearCart();
      } else {
        alert("Order failed: " + (json?.error || "Unknown error"));
      }
    } catch (err) {
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-black">Your Cart</h2>
        <div className="text-sm text-slate-700 font-medium">{cart.length} item(s)</div>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg text-slate-600">Your cart is empty. Start adding products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="flex gap-4 items-center rounded-2xl bg-white p-4 shadow-sm border">
                <img src={item.image} alt={item.title} className="h-28 w-28 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-black">{item.title}</h3>
                  <p className="text-slate-700 mt-1 font-semibold">${(item.price || 0).toFixed(2)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md border overflow-hidden">
                      <button onClick={() => updateQuantity(item.productId, Math.max(1, (item.quantity || 1) - 1))} className="px-3 py-2 bg-slate-100">-</button>
                      <input value={item.quantity} onChange={(e)=>updateQuantity(item.productId, Math.max(1, Number(e.target.value)))} className="w-14 text-center border-l border-r px-2 py-2" />
                      <button onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)} className="px-3 py-2 bg-slate-100">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.productId)} className="text-rose-600 text-sm">Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-700">Subtotal</div>
                  <div className="text-lg font-semibold text-black">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow">
              <h4 className="text-lg font-medium mb-4 text-black">Order Summary</h4>
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between text-sm text-slate-700 mb-2">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-700 mb-2">
                  <span>Items</span>
                  <span className="font-semibold text-black">{cart.length}</span>
                </div>
              </div>
              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm text-slate-700 font-medium mb-2">Shipping Method</label>
                <select value={shippingMethod} onChange={(e)=>setShippingMethod(e.target.value)} className="w-full rounded-md border px-3 py-2 text-slate-900">
                  <option value="standard">Standard (Free)</option>
                  <option value="express">Express ($15)</option>
                  <option value="overnight">Overnight ($25)</option>
                </select>
              </div>
              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm text-slate-700 font-medium mb-2">Promo Code (SAVE10)</label>
                <input value={discountCode} onChange={(e)=>setDiscountCode(e.target.value)} placeholder="Enter code" className="w-full rounded-md border px-3 py-2" />
              </div>
              <div className="space-y-2 mb-4 pb-4 border-b">
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-slate-700">
                    <span>Discount (10%)</span>
                    <span className="text-emerald-600 font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-700">
                  <span>Shipping</span>
                  <span className="font-semibold text-black">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-black">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold mb-4">
                <span className="text-black">Total</span>
                <span className="text-black">${finalTotal.toFixed(2)}</span>
              </div>

              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm text-slate-700 font-medium mb-2">Billing Details</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full rounded-md border px-3 py-2 mb-2 text-slate-900" />
                <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md border px-3 py-2 mb-2 text-slate-900" />
                <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Address" className="w-full rounded-md border px-3 py-2 text-slate-900" />
              </div>

              <div className="flex gap-2">
                <button disabled={loading} onClick={handleCheckout} className="flex-1 rounded-md bg-sky-600 px-4 py-2 text-white font-semibold disabled:opacity-60">{loading ? 'Processing...' : 'Pay & Place Order'}</button>
                <button onClick={clearCart} className="rounded-md border px-4 py-2">Clear</button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
    </div>
  );
}