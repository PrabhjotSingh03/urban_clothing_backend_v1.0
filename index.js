const { productCreate } = require("./controller/Product");
const productsRouters = require("./routes/Products");
const brandsRouters = require("./routes/Brands");
const categoriesRouters = require("./routes/Categories");
const usersRouters = require("./routes/Users");
const authRouters = require("./routes/Auth");
const cartRouters = require("./routes/Cart");
const OrderRouters = require("./routes/Order");
const { User } = require("./model/User");

const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session"); //from passportjs
const passport = require("passport"); //from passportjs
const LocalStrategy = require("passport-local").Strategy; //from passportjs
const crypto = require("crypto");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const SECRET = "SECRET";
const jwt = require('jsonwebtoken');
const { isAuthenticate, userSanitize, cookieExtractor } = require("./services/common");
const cookieParser = require("cookie-parser");

//from passportjs
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET;

server.use(cookieParser());
server.use(express.static("build"));
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
server.use(express.json());
server.use("/products", isAuthenticate(), productsRouters.router);
server.use("/brands", isAuthenticate(), brandsRouters.router);
server.use("/categories", isAuthenticate(), categoriesRouters.router);
server.use("/auth", authRouters.router);
server.use("/users", isAuthenticate(), usersRouters.router);
server.use("/cart", isAuthenticate(), cartRouters.router);
server.use("/orders", isAuthenticate(), OrderRouters.router);

passport.use("local",
  new LocalStrategy(
    {usernameField:"email"},
    async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: "Invalid credentials" });
      }  
      crypto.pbkdf2(password, user.salt, 310000, 32, "sha256",
        async function (error, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          } else {
            const token = jwt.sign(userSanitize(user), SECRET);
            done(null, {token});
          }
        });
    } catch (error) {
      done(error);
    }
  })
);

passport.use("jwt", new JwtStrategy(opts, async function(jwt_payload, done) {
  console.log(jwt_payload);
  try{
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, userSanitize(user));
  } else {
      return done(null, false);
  }
  } catch(error){
      return done(err, false);
  }
}));

//To maintain a login session, Passport serializes and deserializes user information to and from the session. The information that is stored is determined by the application, which supplies a serializeUser and a deserializeUser function.
//This creates session var req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
//This changes session var req.user on being called from authorized routes
passport.deserializeUser(function (user, cb) {
  console.log("deserialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});
// Till here

main().catch((error) => console.log(error));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/urbanclothingdb");
  console.log("Connected to MongoDB...");
}

server.listen(8000, () => {
  console.log("Server is running...");
});
