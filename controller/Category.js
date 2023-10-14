const { Category } = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    const Categories = await Category.find({}).exec();
    res.status(200).json(Categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const response = await category.save();
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
