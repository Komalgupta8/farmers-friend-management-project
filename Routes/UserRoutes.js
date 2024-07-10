const express = require('express');
const { createUser } = require('../Middleware/UserMiddleware');


const UserRoutes = express.Router();

UserRoutes.post('/signup',createUser);

module.exports = (UserRoutes)