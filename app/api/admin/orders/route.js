import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { verifyAuth } from "@/lib/auth";

async function checkAdmin(request) {
  const user = verifyAuth(request);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export async function GET(request) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return Response.json(orders);
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return Response.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("Admin orders PUT error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
