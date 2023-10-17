const { Order } = require("../model/Order");

exports.fetchUserOrders = async (req, res) => {
    const {user} = req.query;
  try {
    const orders = await Order.find({user:user});
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};                                            

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const response = await order.save();
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.orderUpdate = async (req, res) => {
  const {id} = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {new:true});
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.deleteOrder = async (req, res) => {
    const {id} = req.params;
    try {
      const order = await Order.findByIdAndDelete(id);
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  };