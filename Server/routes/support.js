'use strict';

let express = require('express');
let validations = require('../utilities/validations');
let SupportController = require('../controllers/support');
let api = express.Router();
let auth = require('../middleware/authentication');

//Enviar correu de soporte
api.post('/support', auth.getValidateTokenMiddleware(validations.validateTypeParam),SupportController.sendSupport);

module.exports = api;