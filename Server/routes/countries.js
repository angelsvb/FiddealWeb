'use strict';

var express = require('express');
var CountriesController = require('../controllers/country');
var api = express.Router();

// Obtenir països disponibles
api.get('/countries', CountriesController.getPaisos);

module.exports = api;