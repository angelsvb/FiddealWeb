'use strict';

let express = require('express');
let api = express.Router();
let auth = require('../middleware/authentication');
let ProductMiddleware = require('../middleware/products');
let ProductController = require('../controllers/products');
let validations = require('../utilities/validations');

//Obtenir productes -> si algún esta d'oferta, es referenciarà l'oferta
api.get('/business/:businessId/products',auth.getValidateTokenMiddleware(ProductMiddleware.validateGetParams),ProductController.getBusinessProducts);
//Obtenir productes -> si esta d'oferta, es referenciarà l'oferta
api.get('/business/products/:idProduct',auth.getValidateTokenMiddleware(validations.validateWebRequest),ProductController.getProduct);
//Actualització de productes
api.put('/business/products',auth.getValidateTokenMiddleware(ProductMiddleware.validateUpdateProduct),ProductController.updateProduct);
//Creació de productes
api.post('/business/products',auth.getValidateTokenMiddleware(ProductMiddleware.validateCreateProduct),ProductController.createProduct);
//Eliminar producte -> Si s'ha comprat algun cop, no es pot eliminar
api.delete('/business/products/:idProduct',auth.getValidateTokenMiddleware(ProductMiddleware.validateDeleteProduct),ProductController.deleteProduct);

module.exports = api;