const { Order } = require("../model/Order");

exports.fetchUserOrders = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });
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
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({ deleted: { $ne: true } });
  let ordersTotalQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  if (req.query._page && req.query._limit) {
    const page = req.query._page;
    const pageSize = req.query._limit;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  const docsTotal = await ordersTotalQuery.count().exec();
  console.log({ docsTotal });

  try {
    const response = await query.exec();
    res.set("X-Total-Count", docsTotal);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
