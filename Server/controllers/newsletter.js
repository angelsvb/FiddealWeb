'use strict';

let Subscription = require('../models/newsletter');
let Texts = require('../utilities/texts');
let CommonResponses = require('../utilities/common_responses');
let errors = require('../utilities/error_codes');
let tools = require('../utilities/tools');
let validations = require('../utilities/validations');
let mongoose = require('mongoose');

exports.createSubscription = function(req, res) {
    try{
        let type = tools.toNumber(req.query.type);
        let email = req.params.email;
        let name = req.query.name;
        if (!name) name = "";

        if (validations.validEmailSimple(email)){
            Subscription.findOne({Type: type, Email: email}).then(function(doc){
                if (doc){
                    doc.Active = true;
                    doc.Name = name;
                }else{
                    doc = new Subscription({Email: email, Type: type, Name: name});
                }

                doc.save().then(function(doc){
                    CommonResponses.validResponse(res);
                }).catch(function(error){
                    CommonResponses.dbSaveError(res, error);
                });
            }).catch(function(error) {
                CommonResponses.dbAccesError(res, error);
            });
        }else{
            CommonResponses.errorResponse(res, Texts.error_not_valid_param("email"), errors.params_validation_error);
        }
    } catch (err){
        CommonResponses.undefinedErrorResponse(res);
    }
};

exports.disableSubscription = function(req, res) {
    try{
        let type = tools.toNumber(req.query.type);
        let id = req.params.id;

        if (tools.validObjectID(id)){
            Subscription.findOne({Type: type, _id: mongoose.Types.ObjectId(id) }).then(function(doc){
                if (doc){
                    doc.Active = false;
                    doc.save().then(function(doc){
                        CommonResponses.validResponse(res);
                    }).catch(function(error){
                        CommonResponses.dbSaveError(res, error);
                    });
                }else CommonResponses.errorResponse(res, Texts.subscription_not_found, errors.subscription_not_found);
            }).catch(function(error) {
                CommonResponses.dbAccesError(res, error);
            });
        }else CommonResponses.errorResponse(res, Texts.error_not_valid_param("id"), errors.params_validation_error)
    } catch (err){
        CommonResponses.undefinedErrorResponse(res);
    }
};