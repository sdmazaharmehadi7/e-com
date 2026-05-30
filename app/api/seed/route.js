import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
    await connectDB();
    
    const products = await Product.find();
   await Product.deleteMany();

   await Product.insertMany([
  {
    title: "Premium Sky Blue Oversized Cotton T-Shirt for Men and Women",
    description: "High-quality oversized cotton t-shirt with breathable fabric, stylish streetwear design, soft material, and all-day comfort perfect for casual fashion and daily wear.",
    price: 19.99,
    category: "Clothing",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Classic Dark Red Casual Round Neck T-Shirt for Everyday Fashion",
    description: "Trendy round neck red t-shirt made with premium cotton blend, lightweight material, durable stitching, modern fit, and comfortable design for daily use.",
    price: 24.99,
    category: "Clothing",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Stylish Olive Green Printed Summer T-Shirt for Young Adults",
    description: "Fashionable green summer t-shirt featuring soft cotton fabric, modern printed style, relaxed fit, breathable comfort, and trendy casual streetwear appearance.",
    price: 21.99,
    category: "Clothing",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Premium Black Pullover Hoodie with Warm Fleece Inner Material",
    description: "Comfortable black hoodie with soft fleece lining, adjustable hood, modern oversized fit, winter streetwear style, and durable premium fabric construction.",
    price: 49.99,
    category: "Fashion",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Lightweight White Running Sneakers with Comfortable Cushion Sole",
    description: "Modern white sneakers designed for walking, running, gym workouts, and casual daily fashion with lightweight construction and breathable material.",
    price: 59.99,
    category: "Footwear",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "RGB Gaming Mouse with Adjustable DPI and Ergonomic Grip Design",
    description: "Professional gaming mouse featuring customizable RGB lighting, ultra-fast response time, ergonomic grip, adjustable DPI settings, and smooth tracking sensor.",
    price: 34.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Wireless Bluetooth Mechanical Keyboard for Gaming and Office Work",
    description: "Compact wireless keyboard with mechanical keys, RGB lighting effects, smooth typing experience, Bluetooth connectivity, and long-lasting battery backup.",
    price: 69.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Portable Bluetooth Speaker with Deep Bass and HD Sound Quality",
    description: "Wireless portable speaker with powerful bass, crystal clear sound, long battery life, waterproof design, and modern compact build for travel.",
    price: 39.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Advanced Smart Watch with Fitness Tracking and Heart Rate Monitor",
    description: "Feature-packed smartwatch with sleep tracking, fitness monitoring, heart rate sensor, waterproof design, Bluetooth calling, and long battery life.",
    price: 89.99,
    category: "Gadgets",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Premium Genuine Leather Wallet with Multiple Card Holder Slots",
    description: "Elegant leather wallet designed with premium materials, RFID protection, spacious compartments, modern slim design, and durable craftsmanship.",
    price: 29.99,
    category: "Accessories",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Large Waterproof Travel Backpack with Laptop Storage Compartment",
    description: "Durable travel backpack with spacious storage, padded laptop sleeve, waterproof material, ergonomic straps, and stylish modern outdoor design.",
    price: 54.99,
    category: "Bags",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Professional Running Shoes with Air Cushion and Breathable Mesh",
    description: "High-performance sports shoes designed for running, walking, gym workouts, and fitness activities with soft cushioning and anti-slip sole.",
    price: 74.99,
    category: "Footwear",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Adjustable Aluminum Laptop Stand for Better Ergonomic Workspace",
    description: "Premium aluminum laptop stand with adjustable height, foldable design, cooling support, and ergonomic posture improvement for office setups.",
    price: 29.99,
    category: "Accessories",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Modern LED Desk Lamp with Brightness Control and USB Charging",
    description: "Energy-efficient LED desk lamp featuring adjustable brightness levels, touch controls, eye protection lighting, and built-in USB charging support.",
    price: 27.99,
    category: "Home",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Elegant Ceramic Coffee Mug with Heat Resistant Premium Design",
    description: "Stylish ceramic coffee mug perfect for tea, coffee, and beverages featuring durable material, heat resistance, and minimalist modern design.",
    price: 12.99,
    category: "Kitchen",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Insulated Stainless Steel Water Bottle for Gym and Outdoor Travel",
    description: "Premium stainless steel bottle with vacuum insulation technology, leakproof lid, durable body, and temperature retention for hot and cold drinks.",
    price: 17.99,
    category: "Fitness",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Professional Non-Slip Yoga Mat for Exercise and Home Workouts",
    description: "Comfortable yoga mat designed with anti-slip texture, durable material, lightweight portability, and extra cushioning for fitness activities.",
    price: 26.99,
    category: "Fitness",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Stylish UV Protection Sunglasses with Premium Black Frame Design",
    description: "Modern sunglasses featuring UV400 eye protection, lightweight frame, fashionable style, scratch-resistant lenses, and comfortable all-day wear.",
    price: 22.99,
    category: "Accessories",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Classic Blue Denim Jacket with Vintage Casual Fashion Style",
    description: "Premium denim jacket featuring durable stitching, comfortable fit, stylish vintage look, and modern casual streetwear design for all seasons.",
    price: 64.99,
    category: "Fashion",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Warm Winter Knitted Beanie Cap with Soft Stretchable Fabric",
    description: "Comfortable winter beanie made with soft knitted fabric, modern casual design, stretchable fit, and lightweight warmth for cold weather.",
    price: 14.99,
    category: "Fashion",
    image: "https://picsum.photos/500/300"
  }
    ,
  {
    title: "Apple iPhone 15 Pro Max 256GB Natural Titanium Smartphone",
    description: "Premium flagship smartphone featuring A17 Pro chip, advanced triple camera system, titanium design, long battery life, and ultra smooth performance.",
    price: 1399.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Samsung 55 Inch 4K Ultra HD Smart LED Television",
    description: "Modern smart television with crystal clear 4K display, HDR support, built-in streaming apps, immersive audio, and slim premium design.",
    price: 799.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Nike Air Zoom Lightweight Running Shoes for Men",
    description: "Professional running shoes with breathable mesh fabric, responsive air cushioning, anti-slip sole, and lightweight athletic comfort.",
    price: 129.99,
    category: "Footwear",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Premium Wooden Office Study Table with Storage Drawers",
    description: "Spacious wooden study table featuring modern minimalist design, multiple storage drawers, durable construction, and ergonomic workspace comfort.",
    price: 249.99,
    category: "Furniture",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Sony Wireless Noise Cancelling Bluetooth Headphones",
    description: "Premium over-ear headphones with industry-leading noise cancellation, deep bass audio, soft ear cushions, and long battery backup.",
    price: 299.99,
    category: "Electronics",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Adidas Black Cotton Hoodie for Winter Casual Fashion",
    description: "Comfortable cotton hoodie featuring warm fleece lining, adjustable hood, stylish streetwear appearance, and premium durable stitching.",
    price: 59.99,
    category: "Fashion",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Dell Inspiron 15 Laptop with Intel i7 Processor and SSD",
    description: "Powerful laptop with fast Intel processor, Full HD display, SSD storage, premium keyboard, and smooth multitasking performance.",
    price: 999.99,
    category: "Computers",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Modern Stainless Steel Double Door Refrigerator for Home",
    description: "Energy-efficient refrigerator with spacious cooling compartments, fast cooling technology, elegant design, and smart temperature control.",
    price: 699.99,
    category: "Home Appliances",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Professional DSLR Camera with 4K Video Recording Support",
    description: "High-performance DSLR camera featuring 4K recording, advanced autofocus, high-resolution sensor, and professional photography features.",
    price: 1199.99,
    category: "Photography",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Ergonomic Gaming Chair with Adjustable Height and Lumbar Support",
    description: "Comfortable gaming chair designed with lumbar support, adjustable armrests, premium cushioning, and ergonomic long-session comfort.",
    price: 199.99,
    category: "Furniture",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Apple MacBook Air M3 Lightweight Laptop for Professionals",
    description: "Ultra-thin premium laptop with M3 chip performance, Retina display, all-day battery life, and silent fanless operation.",
    price: 1499.99,
    category: "Computers",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Professional Non Stick Cookware Set for Modern Kitchen",
    description: "Premium cookware set featuring non-stick coating, heat resistant handles, durable aluminum body, and easy cleaning convenience.",
    price: 149.99,
    category: "Kitchen",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Canon Wireless Inkjet Color Printer for Home and Office",
    description: "Efficient wireless printer with high-quality color printing, mobile connectivity, fast printing speed, and compact modern design.",
    price: 179.99,
    category: "Office",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Luxury Analog Wrist Watch with Stainless Steel Strap",
    description: "Elegant analog wristwatch featuring premium stainless steel construction, water resistance, stylish luxury appearance, and durable mechanism.",
    price: 229.99,
    category: "Accessories",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Portable Foldable Electric Treadmill for Home Fitness Training",
    description: "Compact treadmill with multiple speed modes, digital display, foldable storage design, and efficient cardio workout performance.",
    price: 499.99,
    category: "Fitness",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Premium Leather Travel Duffel Bag with Large Storage Capacity",
    description: "Stylish leather duffel bag featuring spacious compartments, strong handles, durable zippers, and elegant travel-friendly design.",
    price: 139.99,
    category: "Bags",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "High Speed WiFi 6 Wireless Router for Gaming and Streaming",
    description: "Advanced WiFi router with ultra-fast internet speeds, wide coverage area, secure connectivity, and smooth gaming performance.",
    price: 159.99,
    category: "Networking",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Premium Queen Size Bed Mattress with Memory Foam Comfort",
    description: "Soft memory foam mattress designed for spinal support, pressure relief, breathable fabric, and comfortable deep sleep experience.",
    price: 349.99,
    category: "Furniture",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Smart Fitness Band with Step Tracking and Sleep Monitoring",
    description: "Lightweight smart fitness tracker featuring heart rate monitoring, calorie tracking, sleep analysis, and waterproof sporty design.",
    price: 69.99,
    category: "Fitness",
    image: "https://picsum.photos/500/300"
  },
  {
    title: "Professional Makeup Kit with Premium Beauty Accessories Set",
    description: "Complete beauty makeup kit featuring long-lasting cosmetics, premium brushes, stylish packaging, and professional quality products.",
    price: 89.99,
    category: "Beauty",
    image: "https://picsum.photos/500/300"
  },
]);

    return Response.json({ message: "Database seeded successfully" });
}