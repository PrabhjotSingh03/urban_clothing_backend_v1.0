const { User } = require("../model/User");
const crypto = require("crypto");
const { userSanitize } = require("../services/common");
const SECRET = "SECRET";
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (error, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const response = await user.save();
        req.login(userSanitize(response), (error) => {
          if (error) {
            res.status(400).json(error);
          } else {
            const token = jwt.sign(userSanitize(response), process.env.JWT_SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({id:response.id, role:response.role});
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
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({id:user.id, role:user.role});
};

exports.checkAuth = async (req, res) => {
  if(req.user) {
  res.json(req.user);
  }else{
    res.sendStatus(401);
  }
};
