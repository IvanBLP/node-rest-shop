const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const upload = require('../controllers/multer');

const Products = require('../controllers/products');

// Get all the products
router.get('/', Products.retrieveAllProducts);

// Post a single new product
router.post('/', checkAuth, upload.single('productImage'), Products.submitProduct);

//Get an especific product by id.
router.get('/:idProduct', Products.retrieveProductById);

//Patch, Update a specific product
router.patch('/:idProduct', checkAuth, Products.updateProductById);

//Delete an specific product
router.delete('/:idProduct', checkAuth, Products.deleteProductById);

module.exports = router;
