const express = require("express");
const router = express.Router();
const { fetchUserOrders, createOrder, orderUpdate, deleteOrder } = require("../controller/Order");

router.post("/", createOrder).get("/", fetchUserOrders).delete("/:id", deleteOrder).patch("/:id", orderUpdate); //     /orders already added to the path

exports.router = router;