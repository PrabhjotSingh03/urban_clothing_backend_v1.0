const express = require("express");
const router = express.Router();
const { fetchCartOfUser, addProductToCart, deleteProductFromCart, cartUpdate } = require("../controller/Cart");

router.post("/", addProductToCart).get("/", fetchCartOfUser).delete("/:id", deleteProductFromCart).patch("/:id", cartUpdate); //     /cart already added to the path

exports.router = router;