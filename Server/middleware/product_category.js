'use strict';

let commons = require('../utilities/common_responses');
let validations = require('../utilities/validations');
let texts = require('../utilities/texts');
let errors = require('../utilities/error_codes');
let tools = require('../utilities/tools');
let ProductSchema = require('../models/product');
let mongoose = require('mongoose');

exports.validateCreateCategory = function(req, res, next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.query.categoryName) next();
            else commons.paramsValidationError(res,{categoryName:texts.empty_value});
        }else commons.errorResponse(res,texts.error_not_valid_param("type"),errors.not_valid_type_error);
    }
    else commons.invalidAuth(res);
};

exports.validateUpdateCategory = function(req, res, next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.query.categoryName && req.query.newCategoryName) next();
            else {
                let err = {};
                if (!req.query.categoryName) err["categoryName"] = texts.empty_value;
                if (!req.query.newCategoryName) err["newCategoryName"] = texts.empty_value;
                commons.paramsValidationError(res,err);
            }
        }else commons.errorResponse(res,texts.error_not_valid_param("type"),errors.not_valid_type_error);
    }else commons.invalidAuth(res);
};

exports.validateDeleteCategory = function(req, res, next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.query.categoryName) {
                let category = tools.getCategory(req.CURRENT_USER, req.query.categoryName);
                if (category && category.Subcategories){
                    let idsList = [];
                    category.Subcategories.forEach(item => idsList.push(new mongoose.Types.ObjectId(item._id.toString())));
                    ProductSchema.findOne({Subcategory: { $in: idsList}}).then(function(doc){
                        if (doc) commons.errorResponse(res, texts.error_category_in_use, errors.category_in_use);
                        else next();
                    }).catch(function(error){
                        commons.dbAccesError(res, error);
                    });

                }else next();
            }
            else {
                let err = {};
                if (!req.query.categoryName) err["categoryName"] = texts.empty_value;
                commons.paramsValidationError(res,err);
            }
        }else commons.errorResponse(res,texts.error_not_valid_param("type"),errors.not_valid_type_error);
    }else commons.invalidAuth(res);
};

exports.validateCreateSubcategory = function(req,res,next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.params.categoryId && req.query.subCategoryName) next();
            else {
                let errors = [];
                if (!req.query.subCategoryName) validations.addErrorItem("subCategoryName", texts.empty_value, errors);
                if (!req.params.categoryId) validations.addErrorItem("categoryId", texts.empty_value, errors);
                commons.paramsValidationError(res,errors);
            }
        }else commons.errorResponse(res,texts.error_not_valid_param("type"),errors.not_valid_type_error);
    }else commons.invalidAuth(res);
};

exports.validateUpdateSubcategory = function(req,res,next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.params.categoryId && req.query.subCategoryName && (req.query.newName || req.query.newParent)) next();
            else {
                let errors = [];
                if (!req.query.subCategoryName && !req.query.newParent){
                    validations.addErrorItem("subCategoryName", texts.empty_value, errors);
                    validations.addErrorItem("newParent", texts.empty_value, errors);
                    validations.addErrorItem("newName", texts.empty_value, errors);
                }
                if (!req.params.id) validations.addErrorItem("categoryId", texts.empty_value, errors);
                commons.paramsValidationError(res,errors);
            }
        }else commons.errorResponse(res,texts.error_not_valid_param("type"),errors.not_valid_type_error);
    }else commons.invalidAuth(res);
};

exports.validateDeleteSubcategory = function(req,res,next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.params.categoryId && req.query.subCategoryName) {
                let subcategoryId = tools.getSubcategoryId(req.CURRENT_USER, req.params.categoryId, req.query.subCategoryName);
                if (subcategoryId) {
                    ProductSchema.find({Subcategory: new mongoose.Types.ObjectId(subcategoryId)}).then(function(doc){
                        if (doc && doc.length > 0) commons.errorResponse(res, texts.error_subcategory_in_use, errors.subcategory_in_use);
                        else next();
                    }).catch(function(error){
                        commons.dbAccesError(res, error);
                    });
                } else next();
            }
            else {
                let errors = [];
                if (!req.query.subCategoryName) validations.addErrorItem("subCategoryName", texts.empty_value, errors);
                if (!req.params.categoryId) validations.addErrorItem("categoryId", texts.empty_value, errors);
                commons.paramsValidationError(res, errors);
            }
        }else commons.errorResponse(res,texts.error_not_valid_param("type"),errors.not_valid_type_error);
    }else commons.invalidAuth(res);
};