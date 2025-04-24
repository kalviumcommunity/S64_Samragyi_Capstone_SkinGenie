// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  timeOfDay: { type: String, enum: ['AM', 'PM', 'Both'], required: true },
  skinTypes: [{ type: String }],
  concerns: [{ type: String }],
  order: { type: Number } // For ordering products in the routine
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; // Export Product model
