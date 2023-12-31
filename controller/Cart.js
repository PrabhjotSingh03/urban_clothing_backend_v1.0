const { Brand } = require("../model/Brand");
const { Cart } = require("../model/Cart");

exports.fetchCartOfUser = async (req, res) => {
    const {id} = req.user;
  try {
    const cartProducts = await Cart.find({user:id}).populate("user").populate("product");
    res.status(200).json(cartProducts);
  } catch (error) {
    res.status(400).json(error);
  }
};                                            

exports.addProductToCart = async (req, res) => {
  const {id}=req.user;
  const cart = new Cart({...req.body,user:id});
  try {
    const response = await cart.save();
    const result = await response.populate("product");
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.updateCart = async (req, res) => {
  const {id} = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {new:true});
    const result = await cart.populate("product");
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.deleteProductFromCart = async (req, res) => {
    const {id} = req.params;
    try {
      const doc = await Cart.findByIdAndDelete(id);
      res.status(200).json(doc);
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  };