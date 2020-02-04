'use strict';

var express = require('express');
var NewsletterController = require('../controllers/newsletter');
let validations = require('../utilities/validations');

let api = express.Router();

//Activar subscripció / crear-la. També actualitza el nom associat si s'envia.
api.post('/newsletter/:email', validations.validateTypeParam, NewsletterController.createSubscription);

//Eliminar suscripció
api.delete('/newsletter/:id', validations.validateTypeParam, NewsletterController.disableSubscription);

module.exports = api;