const  express = require('express');
const { weatherReport } = require('../Middleware/DashboardMiddleware');

const DashboardRoutes = express.Router();

DashboardRoutes.get('/dashboard',weatherReport);


module.exports = (DashboardRoutes)