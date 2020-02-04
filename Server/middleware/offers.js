'use strict';

let commons = require('../utilities/common_responses');
let texts = require('../utilities/texts');
let tools = require('../utilities/tools');
let validations = require('../utilities/validations');
let moment = require('moment');
let errors = require('../utilities/error_codes');

exports.validateNewOffer = function(req,res,next){
    if (validations.validateWebRequest(req,res)){
        if (req.CURRENT_USER){
            if (req.body){
                let error_array = [];
                validations.validateOlder("ValidSince",tools.toDate(req.body.ValidSince),"CurrentDate",tools.toDate(tools.now()),error_array);
                validations.validateOlder("ExpirationDate",tools.toDate(req.body.ExpirationDate),"CurrentDate",tools.toDate(tools.now()),error_array);
                validations.validateNotOlder("ValidSince",tools.toDate(req.body.ValidSince),"ExpirationDate",tools.toDate(req.body.ExpirationDate),error_array);
                //validations.validOfferType("OfferType",req.body.OfferType,req.body.Products,error_array);
                validations.notEmptyArray("Products",req.body.Products,error_array);
                validations.notEmptyString("Description",req.body.Description,error_array);
                if (req.body.Products) validations.validateExistsProductsWithoutDuplicates("Products",req.body.Products,req.CURRENT_USER._id.toString(),error_array,function(){
                    validations.validateProductsWithoutOffer("Products",req.body,req.CURRENT_USER._id.toString(),error_array,function(){
                        if (error_array.length === 0) next();
                        else commons.validationError(res,error_array);
                    });
                });
            }else commons.emptyBodyError(res);
        }else commons.invalidAuth(res);
    } else commons.unexpectedRequest(res);
};

exports.validateUpdateOffer = function(req,res,next){
    if (validations.validateWebRequest(req,res)){
        if (req.CURRENT_USER){
            if (req.body){
                if (req.params.id){
                        let error_array = [];

                        validations.validateOfferExists(req.CURRENT_USER._id,req.params.id,function(offer) {
                            if (offer){
                                if (!tools.olderThan(moment().toDate(),tools.toDate(offer.ExpirationDate))){
                                    if (req.body.ValidSince && !tools.sameDay(tools.toDate(req.body.ValidSince),tools.toDate(offer.ValidSince))) {
                                        //Si l'oferta ja ha començat, no es pot modificar aquesta propietat
                                        if (tools.olderThan(moment().toDate(), offer.ValidSince)) validations.addErrorItem("ValidSince", texts.offer_cant_update_valid_since_started, error_array);
                                        else {
                                            validations.validateNotOlder("CurrentDate", tools.now(), "ValidSince", req.body.ValidSince,  error_array);

                                            if (req.body.ExpirationDate) validations.validateNotOlder("ValidSince", req.body.ValidSince, "ExpirationDate", req.body.ExpirationDate, error_array);
                                            else validations.validateNotOlder("ValidSince", req.body.ValidSince, "ExpirationDate", offer.ExpirationDate, error_array);
                                            //validations.addErrorItem("ExpirationDate", texts.empty_value, error_array);
                                        }
                                    }

                                    if (req.body.ExpirationDate && !tools.sameDay(req.body.ExpirationDate,offer.ExpirationDate)){
                                        //Si l'oferta no ha caducat, es pot ampliar el plaç
                                        if (tools.olderThan(moment().toDate(),req.body.ExpirationDate)){
                                            validations.addErrorItem("ValidSince",texts.offer_cant_update_expired,error_array);
                                        }else {
                                            validations.validateNotOlder("ValidSince",req.body.ValidSince,"ExpirationDate",req.body.ExpirationDate,error_array);
                                        }
                                    }
                                    if (!req.body.Description) validations.notEmptyString("Description",req.body.Description,error_array);


                                    if (req.body.Business) tools.deleteProperty(req.body,"Business");
                                    if (req.body.CreationDate) tools.deleteProperty(req.body,"CreationDate");
                                    if (req.body.OfferType) tools.deleteProperty(req.body,"OfferType");
                                    if (req.body.Products) tools.deleteProperty(req.body,"Products");
                                    if (req.body.MinDiscount) tools.deleteProperty(req.body,"MinDiscount");
                                    if (req.body.MaxDiscount) tools.deleteProperty(req.body,"MaxDiscount");

                                    if (error_array.length === 0) {
                                        next();
                                    } else commons.validationError(res,error_array);
                                } else commons.errorResponse(res,texts.offer_cant_update_expired,errors.offer_cant_update_expired);
                            }else commons.errorResponse(res,texts.offer_not_found,errors.offer_not_found);
                        });
                    }else commons.paramsValidationError(res,{id:texts.empty_value});
            }else commons.emptyBodyError(res);
        }else commons.invalidAuth(res);
    } else commons.unexpectedRequest(res);
};

exports.validateDeleteOffer = function(req,res,next){
    if (validations.validateWebRequest(req,res)) {
        if (req.CURRENT_USER){
            if (req.body){
                if (req.params.id){
                    next();
                }else commons.paramsValidationError(res,{id:texts.empty_value})
            }else commons.emptyBodyError(res);
        }else commons.invalidAuth(res);
    } else commons.unexpectedRequest(res);
};