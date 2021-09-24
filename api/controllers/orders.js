//Models
const Order = require('../models/order');
const Product = require('../models/product');


// Get all Orders
exports.retrieveAllOrders = (req, res, next) => {
  Order.find()
    .select('quantity _id product')
    .populate('product', 'name')
    //Send Back
    .then(docs => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        }),
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Post new Order
exports.submitNewOrder = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          'error': 'Product not Found'
        });
      };
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'New Order Created!',
        order: {
          _id: result._id,
          productId: result.product,
          quantity: result.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result.product
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
}

//Get Order by idea
exports.getOrderById = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product', 'name')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      console.log(order);
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + order.product
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

exports.deleteOrderById = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({
      _id: id
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Order deleted',
        deletedCount: result.deletedCount,
        request: {
          type: 'POST',
          ulr: 'http://localhost:3000/products/',
          body: {
            productId: 'ID',
            quantity: 'Number'
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};
