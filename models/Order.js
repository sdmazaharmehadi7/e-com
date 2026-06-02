import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: String,
  title: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  total: Number,
  name: String,
  email: String,
  address: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
