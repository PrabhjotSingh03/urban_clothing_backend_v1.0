const express = require("express");
const router = express.Router();
const { fetchUserById, updateUser } = require("../controller/User");

router.get("/uid", fetchUserById).patch('/:id', updateUser); //     /users already added to the path

exports.router = router;