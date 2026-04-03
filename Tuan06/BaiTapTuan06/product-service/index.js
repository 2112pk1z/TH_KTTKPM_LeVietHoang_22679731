const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://product-db:27017/productdb");

const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  stock: Number,
});

// CRUD
app.post("/products", async (req, res) => {
  const p = new Product(req.body);
  await p.save();
  res.send(p);
});

app.get("/products", async (req, res) => {
  res.send(await Product.find());
});

app.listen(3001, () => console.log("Product service running"));