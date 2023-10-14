const express = require("express");
const { fetchCategories, createCategory } = require("../controller/Category");
const router = express.Router();

router.get("/", fetchCategories).post('/', createCategory); //     /Categories already added to the path

exports.router = router;