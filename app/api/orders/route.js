import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { verifyAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    // Authenticate the user
    const user = verifyAuth(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Access token required or invalid" }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const { items, name, email, address, total } = await request.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    await connectDB();

    const order = new Order({ 
      items, 
      total, 
      name, 
      email, 
      address,
      status: "pending" 
    });
    await order.save();

    return new Response(JSON.stringify({ success: true, orderId: order._id }), { 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err) {
    console.error("/api/orders error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
