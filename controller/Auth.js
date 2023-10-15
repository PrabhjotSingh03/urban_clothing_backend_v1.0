const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const response = await user.save();
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    console.log({user});
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else if (user.password === req.body.password) {
        res.status(200).json({id: user.id, name: user.name, email: user.email, addresses: user.address}); 
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
