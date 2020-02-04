'use strict';

let express = require('express');
let UserCredentialsController = require('../controllers/user_credentials');
let UserCredentialsMiddleware = require('../middleware/user_credentials');
let api = express.Router();

api.get('/credentials',UserCredentialsMiddleware.validateQueryParams,UserCredentialsController.sendRecoveryMail);
api.put('/credentials',UserCredentialsMiddleware.validateChangePassword,UserCredentialsController.changePassword);
api.post('/credentials',UserCredentialsMiddleware.validateRecoveryPassword,UserCredentialsController.recoveryPassword);

module.exports = api;