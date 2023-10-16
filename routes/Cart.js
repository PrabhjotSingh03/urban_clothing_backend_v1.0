const express = require("express");
const router = express.Router();
const { fetchCartOfUser, addProductToCart, deleteProductFromCart, updateCart } = require("../controller/Cart");

router.post("/", addProductToCart).get("/", fetchCartOfUser).delete("/:id", deleteProductFromCart).patch("/:id", updateCart); //     /cart already added to the path

exports.router = router;