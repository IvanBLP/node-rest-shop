const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  productImage: {
    type: String,
    required: true
  } //Type String becouse it's a URL
});

module.exports = mongoose.model('Product', productSchema);
