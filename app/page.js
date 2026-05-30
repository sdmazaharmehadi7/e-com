"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

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

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Search failed");
      setProducts([]);
    } finally {
      setSearchLoading(false);
    }
  }

  return (
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
          <input onChange={e=>setQuery(e.target.value)} value={query} type="text" placeholder="Search products..." className="mt-6 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:w-auto" />
          <button disabled={searchLoading} className="ml-2 inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-sky-400 disabled:cursor-not-allowed" onClick={handleSearch}>
            {searchLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
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
            {products.map((product) => (
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
                    <span className="font-semibold text-slate-900">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{product.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                    View product
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
