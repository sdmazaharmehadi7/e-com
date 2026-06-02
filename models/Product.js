import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    category:String,
    image:String,
});

// Create text index for search
productSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.models.Product || mongoose.model("Product", productSchema);