const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const response = await user.save();
    res.status(201).json({id:response.id, role:response.role});
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log({user});
    if (!user) { 
        res.status(401).json({ message: "Invalid credentials" });
    } else if (user.password === req.body.password) {
        res.status(200).json({id: user.id, role: user.role});
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
