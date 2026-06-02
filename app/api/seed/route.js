import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { initialProducts } from "@/lib/seedData";

export async function GET() {
  try {
    await connectDB();
    
    // Seed products
    await Product.deleteMany({});
    const products = await Product.insertMany(initialProducts);

    // Seed admin user
    await User.deleteMany({ email: "admin@shophub.com" });
    const admin = new User({
      name: "ShopHub Admin",
      email: "admin@shophub.com",
      password: "adminpassword",
      role: "admin"
    });
    await admin.save();

    return Response.json({ 
      success: true, 
      message: "Database seeded successfully", 
      productsCount: products.length,
      adminCreated: true
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}