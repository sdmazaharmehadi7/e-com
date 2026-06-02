'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check if user is authenticated (client-side only)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          setName(parsed.name || "");
          setEmail(parsed.email || "");
        } catch (e) {}
      }
    }
  }, [router]);

  const shippingCost = shippingMethod === "express" ? 15 : shippingMethod === "overnight" ? 25 : 0;
  const discountAmount = discountCode === "SAVE10" ? total * 0.1 : 0;
  const tax = (total - discountAmount) * 0.1;
  const finalTotal = total - discountAmount + tax + shippingCost;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!name.trim() || !email.trim() || !address.trim()) {
      return alert("Please fill out all billing and shipping details.");
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items: cart, name, email, address, total: finalTotal }),
      });
      const json = await resp.json();
      if (json?.success) {
        alert(`Order confirmed! Order id: ${json.orderId}`);
        clearCart();
        router.push('/');
      } else {
        alert("Order failed: " + (json?.error || "Unknown error"));
      }
    } catch (err) {
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthorized(false);
    router.push('/login');
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Checking authorization...</p>
      </div>
    );
  }

  return (
    <>
      {/* Navigation bar matching the Home Page */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
              <h1 className="text-2xl font-bold text-sky-600">ShopHub</h1>
            </div>
            <div className="flex items-center gap-8">
              <a href="/" className="text-slate-700 hover:text-sky-600 font-medium transition">
                Home
              </a>
              {user ? (
                <>
                  <a href="/cart" className="relative inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition">
                    Cart
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {Array.isArray(cart) ? cart.length : 0}
                    </span>
                  </a>
                  {user.role === 'admin' && (
                    <a href="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                      Admin Panel
                    </a>
                  )}
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Login
                  </a>
                  <a href="/register" className="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Cart Content */}
      <main className="min-h-screen bg-slate-50 text-slate-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-800">Your Cart</h2>
              <p className="text-sm text-slate-500 mt-1">Review your selected items and complete your order.</p>
            </div>
            <div className="text-sm text-slate-700 font-medium bg-slate-200/60 px-3 py-1.5 rounded-full">
              {cart.length} item(s)
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="mx-auto h-12 w-12 text-slate-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <p className="text-lg text-slate-600 font-medium">Your cart is empty.</p>
              <button onClick={() => router.push('/')} className="mt-4 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition">
                Start shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center rounded-3xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                    <img src={item.image} alt={item.title} className="h-24 w-24 object-cover rounded-2xl bg-slate-50" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-slate-800 truncate">{item.title}</h3>
                      <p className="text-slate-500 mt-0.5 text-sm font-semibold">${(item.price || 0).toFixed(2)}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="inline-flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                          <button onClick={() => updateQuantity(item.productId, Math.max(1, (item.quantity || 1) - 1))} className="px-3 py-1.5 hover:bg-slate-200 transition text-slate-600 font-bold">-</button>
                          <input 
                            type="number"
                            value={item.quantity} 
                            onChange={(e) => updateQuantity(item.productId, Math.max(1, Number(e.target.value)))} 
                            className="w-12 text-center bg-white border-l border-r border-slate-200 py-1.5 text-sm font-medium text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                          />
                          <button onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)} className="px-3 py-1.5 hover:bg-slate-200 transition text-slate-600 font-bold">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-rose-600 hover:text-rose-700 text-sm font-medium transition">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Subtotal</div>
                      <div className="text-lg font-bold text-slate-800 mt-0.5">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="text-lg font-bold mb-4 text-slate-800">Order Summary</h4>
                  <div className="border-b border-slate-100 pb-4 mb-4 space-y-2.5">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-slate-800">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Total Items</span>
                      <span className="font-semibold text-slate-800">{cart.length}</span>
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <label className="block text-sm text-slate-700 font-medium mb-1.5">Shipping Method</label>
                    <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="standard">Standard Shipping (Free)</option>
                      <option value="express">Express Shipping (+$15.00)</option>
                      <option value="overnight">Overnight Shipping (+$25.00)</option>
                    </select>
                  </div>

                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <label className="block text-sm text-slate-700 font-medium mb-1.5">Promo Code (SAVE10)</label>
                    <input 
                      value={discountCode} 
                      onChange={(e) => setDiscountCode(e.target.value)} 
                      placeholder="Enter code" 
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    />
                  </div>

                  <div className="space-y-2.5 mb-4 pb-4 border-b border-slate-100">
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Discount (10%)</span>
                        <span className="text-emerald-600 font-semibold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-slate-800">${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Tax (10%)</span>
                      <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold mb-6 text-slate-800">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-100 space-y-3">
                    <h5 className="text-sm font-bold text-slate-800">Shipping & Billing Details</h5>
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Full name" 
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    />
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Email address" 
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    />
                    <textarea 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Delivery address" 
                      rows={3}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      disabled={loading} 
                      onClick={handleCheckout} 
                      className="flex-1 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 py-3 text-white font-semibold text-sm transition shadow-lg shadow-sky-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Pay & Place Order'}
                    </button>
                    <button 
                      onClick={clearCart} 
                      className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}