'use strict';

let express = require('express');
let api = express.Router();
let auth = require('../middleware/authentication');
let validations = require('../utilities/validations');
let PurchaseReturnController = require('../controllers/purchase_returns');
let PurchaseReturnMiddlemware = require('../middleware/purchase_returns');

//Obtenir devolucions
api.get('/returns', auth.getValidateTokenMiddleware(validations.validateTypeParam), PurchaseReturnController.getReturns);
//Crear devolució
api.post('/returns', auth.getValidateTokenMiddleware(PurchaseReturnMiddlemware.validateCreateReturn), PurchaseReturnController.createReturn);

module.exports = api;