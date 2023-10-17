const { User } = require("../model/User");
const crypto = require("crypto");
const { userSanitize } = require("../services/common");
const SECRET = "SECRET";
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256",
      async function (error, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const response = await user.save();
        req.login(userSanitize(response),(error)=>{
          if(error){
            res.status(400).json(error);
          } else{
            const token = jwt.sign(userSanitize(response), SECRET);
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.userLogin = async (req, res) => {
  res.json(req.user);
};

exports.userCheck = async (req, res) => {
  res.json({status:"success",user:req.user});
};
