'use strict';

let express = require('express');
let OffersController = require('../controllers/offers');
let OffersMiddleware = require('../middleware/offers');
let api = express.Router();
let validations = require('../utilities/validations');
let auth = require('../middleware/authentication');

//Obtenir totes les ofertes disponibles per un usuari
api.get('/offers',auth.getValidateTokenMiddleware(validations.validateMobileRequest),OffersController.getAllOffers);
//Obtenir totes les ofertes d'un establiment
api.get('/business/:id/offers',auth.getValidateTokenMiddleware(validations.validateTypeParam),OffersController.getBusinessOffers);
//Crear oferta en un establiment
api.post('/business/offers',auth.getValidateTokenMiddleware(OffersMiddleware.validateNewOffer),OffersController.createOffer);
//Editar una oferta en un establiment
api.put('/business/offers/:id',auth.getValidateTokenMiddleware(OffersMiddleware.validateUpdateOffer),OffersController.updateOffer);
//Eliminar una oferta en un establiment
api.delete('/business/offers/:id',auth.getValidateTokenMiddleware(OffersMiddleware.validateDeleteOffer),OffersController.deleteOffer);

module.exports = api;