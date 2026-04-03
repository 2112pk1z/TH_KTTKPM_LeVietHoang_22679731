const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://order-db:27017/orderdb");

// Model
const Order = mongoose.model("Order", {
  customerId: String,
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  totalPrice: Number,
  status: String, // pending, completed, cancelled
});

// CRUD

// Tạo đơn hàng
app.post("/orders", async (req, res) => {
  const order = new Order({
    ...req.body,
    status: "pending",
  });
  await order.save();
  res.send(order);
});

// Lấy tất cả đơn hàng
app.get("/orders", async (req, res) => {
  res.send(await Order.find());
});

// Lấy 1 đơn hàng theo ID
app.get("/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.send(order);
});

// Cập nhật trạng thái
app.put("/orders/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(order);
});

// Xóa đơn
app.delete("/orders/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

app.listen(3002, () => console.log("Order service running"));