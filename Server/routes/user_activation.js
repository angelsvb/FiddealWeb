'use strict';

let express = require('express');
let UserActivationController = require('../controllers/user_activation');
let UserActivationMiddleware = require('../middleware/user_activation');
let auth = require('../middleware/authentication');

let api = express.Router();

api.get('/activation',UserActivationMiddleware.validateQueryParams,UserActivationController.sendActivationMail);
api.delete('/activation',UserActivationMiddleware.validateQueryParams,UserActivationController.cancelUserActivation);
api.put('/activation',auth.getValidateTokenMiddleware(UserActivationMiddleware.validateQueryParams,true,false),UserActivationController.activateUser);

module.exports = api;