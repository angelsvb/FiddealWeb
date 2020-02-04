'use strict';

let express = require('express');
let loginController = require('../controllers/login');
let api = express.Router();
let validations = require('../utilities/validations');

//Obtenir un token nou
api.post('/signin',validations.validateTypeParam,loginController.getToken);
//Validar token
api.put('/signin',validations.validateTypeParam,loginController.validateToken);

module.exports = api;