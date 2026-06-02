import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyAuth } from "@/lib/auth";

// Middleware to check admin role
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
    const products = await Product.find().sort({ _id: -1 });
    return Response.json(products);
  } catch (error) {
    console.error("Admin products GET error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { title, description, price, category, image } = await request.json();

    if (!title || !price || !category || !image) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const product = new Product({
      title,
      description,
      price: Number(price),
      category,
      image
    });

    await product.save();
    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
