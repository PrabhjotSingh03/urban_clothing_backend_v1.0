const { productCreate } = require('./controller/Product');
const productsRouters = require('./routes/Products');
const brandsRouters = require('./routes/Brands');
const categoriesRouters = require('./routes/Categories');
const usersRouters = require('./routes/Users');
const authRouters = require('./routes/Auth');
const cartRouters = require('./routes/Cart');

const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");

server.use(cors({exposedHeaders: ['X-Total-Count']}));
server.use(express.json());
server.use("/products", productsRouters.router);
server.use("/brands", brandsRouters.router);
server.use("/categories", categoriesRouters.router);
server.use("/auth", authRouters.router);
server.use("/users", usersRouters.router);
server.use("/cart", cartRouters.router);


main().catch((error) => console.log(error));

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
