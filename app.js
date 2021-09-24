//dependencies
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//Conecting to Mongo DB via Mongoose
mongoose.connect(
  'mongodb+srv://node-shop:' +
  process.env.MONGO_ATLAS_PW +
  '@node-rest-shop.vvek5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
//Morgan will allow us to log request/response in the console
app.use(morgan('dev'));

//Static function makes the folder public available
app.use('/uploads', express.static('uploads'));

//BodyParser, allows us to parse json and URLEncoded to be use in our endpoints
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Setting the Headers to Handle CORS error on the browsers.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, XRequested-With, Content-Type, Aceept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'),
      res.status(200).json({});
  };
  next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

//Error handling for wrong urls
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
