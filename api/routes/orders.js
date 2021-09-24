const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')


//Controllers
const Orders = require('../controllers/orders');

//Retrieve all Orders
router.get('/', checkAuth, Orders.retrieveAllOrders);

//Posting a new Order
router.post('/', checkAuth, Orders.submitNewOrder);

//Retrieve Order By Id
router.get('/:orderId', checkAuth, Orders.getOrderById);

//Delete Order By Id
router.delete('/:orderId', checkAuth, Orders.deleteOrderById);

module.exports = router;
