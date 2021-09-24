const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Users = require('../controllers/users');

//Create a new user
router.post('/signup', Users.signup);

//Log In with an existing user.
router.post('/login', Users.login);

//Delete a user
router.delete('/:userId', Users.deleteUser);

//GET all users
router.get('/', Users.getAllUsers);

module.exports = router;
