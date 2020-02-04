'use strict';

let express = require('express');
let api = express.Router();
let FidelizationDiscountsController = require('../controllers/fidelization_discount');
let auth = require('../middleware/authentication');
let validations = require('../utilities/validations');

//Obtenir descomptes
api.get('/fidelizationDiscounts',auth.getValidateTokenMiddleware(validations.validateMobileRequest),FidelizationDiscountsController.getDiscounts);

//Obtenir descompte
api.get('/fidelizationDiscount',auth.getValidateTokenMiddleware(validations.validateWebRequest),FidelizationDiscountsController.getDiscount);

//Utilitzar descompte
api.delete('/fidelizationDiscounts/:id',auth.getValidateTokenMiddleware(validations.validateWebRequest),FidelizationDiscountsController.setUsedDiscount);

module.exports = api;