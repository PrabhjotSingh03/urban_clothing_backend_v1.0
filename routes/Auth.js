const express = require("express");
const router = express.Router();
const passport = require("passport");
const { createUser, userLogin, checkAuth } = require("../controller/Auth");

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), userLogin)
  .get("/check", passport.authenticate("jwt"), checkAuth); 

exports.router = router;
