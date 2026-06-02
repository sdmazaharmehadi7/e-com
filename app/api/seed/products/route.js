import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { initialProducts } from "@/lib/seedData";

export async function GET() {
  try {
    await connectDB();
    
    let products = await Product.find();
    
    // Auto-seed if database is empty
    if (products.length === 0) {
      console.log("No products found. Auto-seeding database...");
      await Product.deleteMany({});
      products = await Product.insertMany(initialProducts);

      // Also ensure default admin is created on auto-seed
      const existingAdmin = await User.findOne({ email: "admin@shophub.com" });
      if (!existingAdmin) {
        const admin = new User({
          name: "ShopHub Admin",
          email: "admin@shophub.com",
          password: "adminpassword",
          role: "admin"
        });
        await admin.save();
        console.log("Default admin created successfully on auto-seed.");
      }
    }

    return Response.json(products);
  } catch (error) {
    console.error("Fetch products / auto-seed error:", error);
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}