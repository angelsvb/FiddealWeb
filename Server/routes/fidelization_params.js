'use strict';

let express = require('express');
let api = express.Router();
let fidelizationParamsController = require('../controllers/fidelization_params');
let fidelizationParamsMiddleware = require('../middleware/fidelization_params');
let auth = require('../middleware/authentication');
let validations = require('../utilities/validations');

///Editar paràmetres de fidelització
api.put('/business/fidelizationParams',auth.getValidateTokenMiddleware(fidelizationParamsMiddleware.validateBodyAndParams),fidelizationParamsController.setFidelizationParams);
//Obtenir paràmetres de fidelització
api.get('/business/fidelizationParams',auth.getValidateTokenMiddleware(validations.validateWebRequest),fidelizationParamsController.getFidelizationParams);

module.exports = api;