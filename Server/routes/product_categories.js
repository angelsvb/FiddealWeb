'use strict';

let express = require('express');
let CategoryController = require('../controllers/product_category');
let auth = require('../middleware/authentication');
let validations = require('../utilities/validations');
let productCategoryMiddleware = require('../middleware/product_category');

let api = express.Router();

//Crear categoria
api.post('/business/categories',auth.getValidateTokenMiddleware(productCategoryMiddleware.validateCreateCategory,true,true),CategoryController.createCategory);
//Editar categoria
api.put('/business/categories',auth.getValidateTokenMiddleware(productCategoryMiddleware.validateUpdateCategory,true,true),CategoryController.updateCategory);
//Eliminar categoria
api.delete('/business/categories',auth.getValidateTokenMiddleware(productCategoryMiddleware.validateDeleteCategory,true,true),CategoryController.deleteCategory);

//Crear subcategoria
api.post('/business/categories/:categoryId/subcategories',auth.getValidateTokenMiddleware(productCategoryMiddleware.validateCreateSubcategory,true,true),CategoryController.createSubcategory);
//Editar subcategoria
api.put('/business/categories/:categoryId/subcategories',auth.getValidateTokenMiddleware(productCategoryMiddleware.validateUpdateSubcategory,true,true),CategoryController.updateSubcategory);
//Eliminar subcategoria
api.delete('/business/categories/:categoryId/subcategories',auth.getValidateTokenMiddleware(productCategoryMiddleware.validateDeleteSubcategory,true,true),CategoryController.deleteSubcategory);

module.exports = api;