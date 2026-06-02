import connectDB from "@/lib/db";
import Product from "@/models/Product";

// Simple in-memory cache for search queries
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to get from cache
function getFromCache(key) {
  const cached = searchCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  // Remove expired entry
  if (cached) {
    searchCache.delete(key);
  }
  return null;
}

// Helper to set in cache
function setToCache(key, data) {
  searchCache.set(key, {
    data,
    timestamp: Date.now()
  });
  // Optional: limit cache size to prevent memory issues
  if (searchCache.size > 100) {
    // Remove oldest entry
    const oldestKey = Array.from(searchCache.keys()).reduce((a, b) =>
      searchCache.get(a).timestamp < searchCache.get(b).timestamp ? a : b
    );
    searchCache.delete(oldestKey);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify([]), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check cache first
    const cacheKey = `search:${query}`;
    const cachedResults = getFromCache(cacheKey);
    if (cachedResults) {
      return new Response(JSON.stringify(cachedResults), {
        headers: { "Content-Type": "application/json" }
      });
    }

    await connectDB();

    // First try text search
    let results = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean();

    // If text search returns no results, try regex fallback
    if (results.length === 0) {
      results = await Product.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } }
        ]
      })
      .limit(20)
      .lean();
    }

    // Cache the results
    setToCache(cacheKey, results);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("/api/products/search error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}