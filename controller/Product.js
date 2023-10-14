const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const response = await product.save();
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  let query = Product.find({});
  let productsTotalQuery = Product.find({});

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    productsTotalQuery = productsTotalQuery.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    productsTotalQuery = productsTotalQuery.find({ brand: req.query.brand });
  }
  if (req.query._page && req.query._limit) {
    const page = req.query._page;
    const pageSize = req.query._limit;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  const docsTotal = await productsTotalQuery.count().exec();
  console.log({ docsTotal });

  try {
    const response = await query.exec();
    res.set("X-Total-Count", docsTotal);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const {id} = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
