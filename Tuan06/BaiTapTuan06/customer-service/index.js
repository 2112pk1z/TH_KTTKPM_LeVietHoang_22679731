const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://customer-db:27017/customerdb");

// Model
const Customer = mongoose.model("Customer", {
  name: String,
  address: String,
  phone: String,
  email: String,
});

// CRUD

// Tạo khách hàng
app.post("/customers", async (req, res) => {
  const c = new Customer(req.body);
  await c.save();
  res.send(c);
});

// Lấy tất cả khách hàng
app.get("/customers", async (req, res) => {
  res.send(await Customer.find());
});

// Lấy 1 khách hàng
app.get("/customers/:id", async (req, res) => {
  const c = await Customer.findById(req.params.id);
  res.send(c);
});

// Cập nhật
app.put("/customers/:id", async (req, res) => {
  const c = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(c);
});

// Xóa
app.delete("/customers/:id", async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

app.listen(3003, () => console.log("Customer service running"));