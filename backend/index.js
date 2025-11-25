
const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv").config()
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Error connecting MongoDB:", error.message);
    }
}
connectDb();

// Schemas
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
});


const saleSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    date: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
const Sale = mongoose.model("Sale", saleSchema);

// Routes

// Get all products
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Add new product
app.post("/products", async (req, res) => {
    const { name, price, stock } = req.body;
    const product = new Product({ name, price, stock });
    await product.save();
    res.json(product);
});

// Record a sale and update stock
app.post("/sales", async (req, res) => {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity)
        return res.status(400).json({ message: "Not enough stock" });

    product.stock -= quantity;
    await product.save();

    const sale = new Sale({ productId, quantity });
    await sale.save();
    res.json({ message: "Sale recorded", sale });
});

// Get sales history
app.get("/sales", async (req, res) => {
    const sales = await Sale.find().populate("productId");
    res.json(sales);
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
});

// Delete a sale
app.delete("/sales/:id", async (req, res) => {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted" });
});

// Start server
app.listen(9000, () => console.log("Server running on port 9000"));
