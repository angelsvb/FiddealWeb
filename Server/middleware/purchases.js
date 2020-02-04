'use strict';

let validations = require('../utilities/validations');
let commons = require('../utilities/common_responses');
let tools = require('../utilities/tools');
let texts = require('../utilities/texts');

exports.validateNewSale = function(req,res,next){
    if (validations.validateWebRequest(req,res)){
        if (req.CURRENT_USER){
            let errors_array = [];
            validations.validateSameValue("Business",req.body.Business,req.CURRENT_USER._id.toString(),errors_array);
            validations.validatePositive("PurchaseSubtotal",req.body.PurchaseSubtotal,errors_array);
            if (req.body.User){
                validations.validateUserExists("User",req.body.User,errors_array,function(){
                    next();
                    //validateFidelizationDiscount(req,res,errors_array,next);
                });
            }else{
                tools.deleteProperty(req.body,"PurchaseFidelization");
                tools.deleteProperty(req.body,"PurchaseDiscount");
                validations.sameValueNotNull("PurchaseSubtotal",req.body.PurchaseSubtotal,req.body.PurchaseTotal,errors_array,texts.purchase_inconsistent_total);
                //validateProducts(req,res,errors_array,next);
                next();
            }
        }else commons.invalidAuth(res);
    }else commons.unexpectedRequest(res);
};

exports.validateManualPurchase = function(req,res,next){
    if (validations.validateMobileRequest(req,res)){ //UsuariID validat
        if (req.CURRENT_USER){
            if (req.params.purchaseId){ //PurchaseID validat
                if (req.body){
                    let errors_array =  [];
                    validations.notEmptyBuffer("TicketImg",req.body.TicketImg,errors_array);
                    validations.notEmptyNumber("PurchaseTotal",req.body.PurchaseTotal,errors_array);
                    validations.notEmptyString("Business",req.body.Business,errors_array);
                    validations.notEmptyDate("PurchaseDate",req.body.PurchaseDate,errors_array);
                    if (errors_array.length === 0) next();
                    else commons.validationError(res,errors_array);
                }else commons.errorResponse(res,texts.empty_body_error,errors.empty_body_error);
            }else commons.errorResponse(res,texts.purchase_empty_id,errors.params_validation_error)
        } else commons.invalidAuth(res);
    }else commons.unexpectedRequest(res);
};