'use strict';

let express = require('express');
let UserController = require('../controllers/user');
let auth = require('../middleware/authentication');

let api = express.Router();

let md_user = require('../middleware/user');
let validations = require('../utilities/validations');

//Crear usuari
api.post('/user',md_user.choose_user_type_signup,UserController.createUser);
//Carregar imatge de perfil
api.post('/user/image',auth.getValidateTokenMiddleware(validations.validateTypeParam),UserController.setImage);
//Obtenir imatge de perfil
//api.get('/user/image',auth.getValidateTokenMiddleware(validations.validateTypeParam),UserController.getImage);
//Eliminar usuari
api.delete('/user',validations.validateTypeParam,UserController.deleteUser);
//Actualitzar usuari
api.put('/user',auth.getValidateTokenMiddleware(md_user.choose_user_type_update,true,true),UserController.updateUser);
//Obtenir dades usuari
api.get('/user',auth.getValidateTokenMiddleware(validations.validateTypeParam,true,false),UserController.getUser);
//Obtenir establiments usuari
api.get('/user/business',auth.getValidateTokenMiddleware(validations.validateMobileRequest),UserController.getUserBusiness);
//Acceptar política de privacitat
api.put('/user/policy',auth.getValidateTokenMiddleware(validations.validateTypeParam),UserController.acceptPolicy);

// Exportamos la configuración
module.exports = api;