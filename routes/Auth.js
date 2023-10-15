const express = require("express");
const router = express.Router();
const { createUser, userLogin } = require("../controller/Auth");

router.post("/signup", createUser).post("/login", userLogin); //     /auth already added to the path

exports.router = router;