'use strict';

let commons = require('../utilities/common_responses');
let tools = require('../utilities/tools');
let texts = require('../utilities/texts');
let validations = require('../utilities/validations');
let errors = require('../utilities/error_codes');
let PurchasesSchema = require('../models/purchase');
let mongoose = require('mongoose');

exports.validateGetParams = function(req,res,next){
    if (req.CURRENT_USER){
        if (req.params.businessId){
            validations.validateTypeParam(req,res,next);
        }else commons.paramsValidationError(res,[{businessId : texts.empty_value}])
    }else commons.undefinedErrorResponse(res);
};

exports.validateUpdateProduct = function(req,res,next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.query.idProduct){
                let error_array = [];
                validations.notEmptyString("Name",req.body.Name,error_array);
                validations.validatePositive("Price",req.body.Price,error_array);
                if (req.body.OutletPrice) validations.validateNotGreater("OutletPrice",req.body.OutletPrice,req.body.Price,error_array);
                validations.validatePositiveOrZero("Stock",req.body.Stock,error_array);
                if (req.body.StockState) validations.validateStockState("StockState",req.body.StockState,req.body.Stock,error_array);
                validations.notEmptyString("Description",req.body.Description,error_array);
                validations.validateSubcategory("Subcategory",req.CURRENT_USER,req.body.Subcategory,error_array);
                if (req.body.Offer) {
                    validations.validateProductOffer("Offer",req.CURRENT_USER,req.body.Offer,error_array,function(){
                        if (error_array.length === 0) {deleteNonEditableFields(req,false); next();}
                        else commons.validationError(res,error_array);
                    });
                }
                else next();
            }else commons.errorResponse(res,texts.error_missing_param("idProduct"),errors.params_validation_error);

        }else commons.unexpectedRequest(res);
    }else commons.undefinedErrorResponse(res);
};

exports.validateCreateProduct = function(req,res,next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            let error_array = [];
            validations.notEmptyString("Name",req.body.Name,error_array);
            validations.validatePositive("Price",req.body.Price,error_array);
            if (req.body.OutletPrice) validations.validateNotGreater("OutletPrice",req.body.OutletPrice,req.body.Price,error_array);
            validations.validatePositiveOrZero("Stock",req.body.Stock,error_array);
            if (req.body.StockState) validations.validateStockState("StockState",req.body.StockState,req.body.Stock,error_array);
            validations.notEmptyString("Description",req.body.Description,error_array);
            if (req.body.ExpectedArrival) validations.validateExpectedArrival("ExpectedArrival",req.body.ExpectedArrival,req.body.StockState,req.body.Stock,error_array);
            validations.validateSubcategory("Subcategory",req.CURRENT_USER,req.body.Subcategory,error_array);
            validations.validateUniqueReference("Reference",req.CURRENT_USER,req.body.Reference,error_array,function(){
                validations.validateUniqueName("Name",req.CURRENT_USER,req.body.Name,error_array,function(){
                    if (error_array.length === 0) {deleteNonEditableFields(req,true); next();}
                    else commons.validationError(res,error_array);
                });
            });
        } else commons.unexpectedRequest(res);
    }else commons.undefinedErrorResponse(res);
};

function deleteNonEditableFields(req,isNew){
    if (!isNew) tools.deleteProperty(req.body,"Reference");
    tools.deleteProperty(req.body,"Business");
    tools.deleteProperty(req.body,"CreationDate");
    tools.deleteProperty(req.body,"LastUpdate");
}

exports.validateDeleteProduct = function(req,res,next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.params.idProduct) {
                PurchasesSchema.findOne({"Products": { $elemMatch: { _id: new mongoose.Types.ObjectId(req.params.idProduct)}}}).then(function(document){
                    if (document){
                        commons.errorResponse(res, texts.product_cant_delete_purchased, errors.product_cant_delete_purchased);
                    }else next();
                }).catch(function(error){
                    commons.dbAccesError(res, error);
                });
            }
            else commons.errorResponse(res,texts.error_missing_param("idProduct"),errors.params_validation_error);
        } else commons.unexpectedRequest(res);
    }else commons.undefinedErrorResponse(res);
};