'use strict';

let express = require('express');
let api = express.Router();
let auth = require('../middleware/authentication');
let validations = require('../utilities/validations');
let PurchaseController = require('../controllers/purchases');
let PurchaseMiddleware = require('../middleware/purchases');


//Obtenir compres client
api.get('/purchases',auth.getValidateTokenMiddleware(validations.validateMobileRequest),PurchaseController.getPurchases);
//Afegir compra manual
api.put('/purchases/:idPurchase/manual',auth.getValidateTokenMiddleware(PurchaseMiddleware.validateManualPurchase),PurchaseController.setManualPurchase);
//Obtenir compres registrades manualment
api.get('/purchases/manual',auth.getValidateTokenMiddleware(validations.validateMobileRequest),PurchaseController.getManualPurchases);
//Obtenir vendes establiment
api.get('/sales',auth.getValidateTokenMiddleware(validations.validateWebRequest),PurchaseController.getSales);
//Obtenir venda concreta
api.get('/sales/:idSale', auth.getValidateTokenMiddleware(validations.validateWebRequest), PurchaseController.getSale);
//Obtenir vendes del dia
api.get('/sales_day',auth.getValidateTokenMiddleware(validations.validateWebRequest),PurchaseController.getCurrentSales);
//Registrar compra
api.post('/sales',auth.getValidateTokenMiddleware(PurchaseMiddleware.validateNewSale),PurchaseController.newSale);
//Obtenir vendes registrades manualment
api.get('/sales/manual',auth.getValidateTokenMiddleware(validations.validateWebRequest),PurchaseController.getManualSales);
//Acceptar compra manual
api.put('/sales/:idSale/manual',auth.getValidateTokenMiddleware(validations.validateWebRequest),PurchaseController.acceptManualSale);
//Denegar compra manual
api.delete('/sales/:idSale/manual',auth.getValidateTokenMiddleware(validations.validateWebRequest),PurchaseController.denyManualSale);

module.exports =api;