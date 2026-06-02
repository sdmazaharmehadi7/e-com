import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyAuth } from "@/lib/auth";

async function checkAdmin(request) {
  const user = verifyAuth(request);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export async function PUT(request, { params }) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;
    const { title, description, price, category, image } = await request.json();

    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (image) product.image = image;

    await product.save();
    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Admin products PUT error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;

    await connectDB();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
