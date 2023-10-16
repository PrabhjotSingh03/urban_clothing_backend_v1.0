const express = require("express");
const router = express.Router();
const { productCreate, fetchAllProducts, fetchProductById, productUpdate } = require("../controller/Product");

router.post("/", productCreate).get("/", fetchAllProducts).get("/:id", fetchProductById).patch('/:id', productUpdate); //     /products already added to the path

exports.router = router;