'use client';
import { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetch("/api/seed/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message || "Unable to fetch products"))
      .finally(() => setLoading(false));
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        // If parsing fails, clear the data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Debounced search function
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Search failed");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const query = e.target.value;
    setQuery(query);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounce (300ms)
    setSearchTimeout(setTimeout(() => {
      handleSearch(query);
    }, 300));
  };

  // Initialize timeout variable
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-sky-600">ShopHub</h1>
            </div>
            <div className="flex items-center gap-8">
              <a href="/" className="text-slate-700 hover:text-sky-600 font-medium transition">
                Home
              </a>
              <a href="/about" className="text-slate-700 hover:text-sky-600 font-medium transition">
                About
              </a>
              {user ? (
                <>
                  <a href="/cart" className="relative inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition">
                    Cart
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {Array.isArray(cart) ? cart.length : 0}
                    </span>
                  </a>
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
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

      <main className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Shop the collection
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Featured products
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Browse our latest items with image, category, and price details. Tap any product card to explore it further.
          </p>
          <input
            onChange={handleInputChange}
            value={query}
            type="text"
            placeholder="Search products..."
            className="mt-6 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:w-auto"
          />
        </section>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">Loading products…</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" >
            {query.trim() ? (
              // Show search results when there's a query
              searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <article
                    key={product._id || product.title}
                    className="cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-64 bg-slate-100" >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                          {product.category}
                        </span>
                        <span className="font-semibold text-slate-800">
                          ${product.price?.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800">{product.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={()=>addToCart(product)} className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                          Add to cart
                        </button>
                        <button className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                          View product
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                // No results found
                <div className="col-span-3 text-center py-12">
                  <p className="text-center text-slate-500">No products found for "{query}"</p>
                </div>
              )
            ) : (
              // Show featured products when no query
              products.map((product) => (
                <article
                  key={product._id || product.title}
                  className="cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-64 bg-slate-100" >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                        {product.category}
                      </span>
                      <span className="font-semibold text-slate-800">
                        ${product.price?.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">{product.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>addToCart(product)} className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                        Add to cart
                      </button>
                      <button className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                        View product
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </main>
    </>
  );
}