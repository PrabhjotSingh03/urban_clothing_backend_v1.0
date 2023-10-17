const express = require("express");
const router = express.Router();
const { fetchUserOrders, createOrder, orderUpdate, deleteOrder, fetchAllOrders } = require("../controller/Order");

router.post("/", createOrder).get("/user/:userId", fetchUserOrders).delete("/:id", deleteOrder).patch("/:id", orderUpdate).get('/', fetchAllOrders); //     /orders already added to the path

exports.router = router;