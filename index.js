require("dotenv").config();
const path = require("path");
const { productCreate } = require("./controller/Product");
const productsRouters = require("./routes/Products");
const brandsRouters = require("./routes/Brands");
const categoriesRouters = require("./routes/Categories");
const usersRouters = require("./routes/Users");
const authRouters = require("./routes/Auth");
const cartRouters = require("./routes/Cart");
const OrderRouters = require("./routes/Order");
const { User } = require("./model/User");
// const helmet = require('helmet');

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
const jwt = require('jsonwebtoken');
const { isAuthenticate, userSanitize, cookieExtractor } = require("./services/common");
const cookieParser = require("cookie-parser");
const { Order } = require("./model/Order");

//webhook
const endpointSecret = process.env.ENDPOINT_Secret;

// server.use(helmet({contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://js.stripe.com"],
//       },
//     },
//     permissionsPolicy: 'attribution-reporting=()',
//     },
//   )
// );

server.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      const order = await Order.findById(paymentIntentSucceeded.metadata.order_id);
      order.statusPayment = "Received";
      await order.save();
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

//from passportjs
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

server.use(cookieParser());
server.use(express.static(path.resolve(__dirname, "build")));
server.use(
  session({
    secret: process.env.SESSION_KEY,
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
server.get('*', (req, res) => res.sendFile(path.resolve('build', 'index.html')));

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
            const token = jwt.sign(userSanitize(user), process.env.JWT_SECRET_KEY);
            done(null, {id:user.id, role:user.role, token});
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

//Stripe Payments
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, order_id} = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "cad",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{order_id}
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

main().catch((error) => console.log(error));

async function main() {
  await mongoose.connect(process.env.DB_HOST);
  console.log("Connected to MongoDB...");
}

server.listen(process.env.PORT, () => {
  console.log("Server is running...");
});
