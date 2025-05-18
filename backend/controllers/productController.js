// controllers/productController.js
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { timeOfDay } = req.query;
        let query = {};
        if (timeOfDay) {
            query = { timeOfDay: timeOfDay };
        }
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
