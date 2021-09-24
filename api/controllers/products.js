//Modules
const mongoose = require('mongoose');
const Product = require('../models/product');

//Retrieve all Products
exports.retrieveAllProducts = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(
      docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + doc._id
              }
            }
          })
        };
        res.status(200).json(response);
      })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Post new Products
exports.submitProduct = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path //In the console we can see the path of the img stored in the server
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Product Successfully Created',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Get product By Id
exports.retrieveProductById = (req, res, next) => {
  const id = req.params.idProduct;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided ID'
        });
      };
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Update Product By idea
exports.updateProductById = (req, res, next) => {
  const id = req.params.idProduct;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  // The req.body recieved is an Array that contains an object like
  //this "{"propName":xxxx,"value":xxxx}" for each property of the
  //saved product i want to patch

  Product.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product Updated Successfully',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Delete Product By Id
exports.deleteProductById = (req, res, next) => {
  const id = req.params.idProduct;
  Product.remove({
      _id: id
    })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
