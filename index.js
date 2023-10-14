const { createProduct } = require('./controller/Product');
const productsRouters = require('./routes/Products');
const brandsRouters = require('./routes/Brands');
const categoriesRouters = require('./routes/Categories');

const express = require("express");
const server = express();
const mongoose = require("mongoose");

server.use(express.json());
server.use("/products", productsRouters.router);
server.use("/brands", brandsRouters.router);
server.use("/categories", categoriesRouters.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/urbanclothingdb");
  console.log("Connected to MongoDB...");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});


server.listen(8000, () => {
  console.log("Server is running...");
});
