const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  //First we check that the mail sent is not already in use
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail already in use'
        });
      } else {
        //Here we hash the recieved password,
        //if we find no error, proceed to create the new User.
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          };
        });
      }
    });
};

//Log In with an existing user.
exports.login = (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if (result) {
          const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_Key, {
              expiresIn: "1hr"
            }
          );
          return res.status(200).json({
            message: 'Auth Successful',
            token: token
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Delete a user
exports.deleteUser = (req, res, next) => {
  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      error: err
    });
};

//GET all Users
exports.getAllUsers = (req, res, next) => {
  User.find()
    .exec()
    .then(
      docs => {
        const response = {
          count: docs.length,
          users: docs.map(doc => {
            return {
              _id: doc._id,
              email: doc.email
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
