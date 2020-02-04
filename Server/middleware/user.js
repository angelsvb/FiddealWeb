'use strict';

const User = require('../models/user_mobile_protected');
const tools = require('../utilities/tools');
const common = require('../utilities/common_responses');
const texts = require('../utilities/texts');
const errors = require('../utilities/error_codes');
const validations = require('../utilities/validations');

function not_exists(req,res,next){
    let type = tools.toNumber(req.query.type);
    User.find({Email:req.body.Email,Type:type},function(err,data){
        if (err) common.dbAccesError(res);
        else {
            if (data.length === 0)
                next();
            else
                common.errorResponse(res,texts.existing_user,errors.user_already_exists);
        }
    });
}

function validate_values_web(req, res, next) {
    let errors = [];

    validations.validEmail("Email",req.body.Email,errors);
    validations.notEmptyString("Name",req.body.Name,errors);
    validations.validCIF("CIF",req.body.CIF,errors);
    validations.validBusinessType("TypeBusiness",req.body.TypeBusiness,errors);
    validations.validCP("CP",req.body.CP,errors);
    validations.notEmptyText("Municipi",req.body.Municipi,errors);
    validations.validateProvinciaID("ProvinciaID",req.body.ProvinciaID,req.body.CountryID,errors,function(){
        validations.validateCountryID("CountryID",req.body.CountryID,errors,function(){
            validations.notEmptyString("Address",req.body.Address,errors);
            validations.validPhone("Phone",req.body.Phone,errors);
            validations.validPassword("Password",req.body.Password,errors);
            validations.validConfirmationPassword("Password",req.body.Password,"ConfirmationPassword",req.body.ConfirmationPassword,errors);
            validations.trueBoolean("PolicyAccepted",req.body.PolicyAccepted,errors);
            validations.validLength("Description", req.body.Description, errors, 30, 200);

            if (errors.length === 0) not_exists(req,res,next);
            else common.validationError(res,errors);
        });
    });
}

function validate_values_mobile(req,res,next){
    let errors = [];

    validations.validEmail("Email",req.body.Email,errors);
    validations.notEmptyText("Name",req.body.Name,errors);
    validations.validCP("CP",req.body.CP,errors);
    validations.notEmptyText("Surname",req.body.Surname,errors);
    validations.majorEdat("BornDate",req.body.BornDate,errors);
    validations.validDNI("DNI",req.body.DNI,errors);
    validations.notEmptyText("Municipi",req.body.Municipi,errors);
    validations.validateProvinciaID("ProvinciaID",req.body.ProvinciaID,req.body.CountryID,errors,function(){
        validations.validateCountryID("CountryID",req.body.CountryID,errors,function(){
            validations.validPhone("Phone",req.body.Phone,errors);
            validations.trueBoolean("PolicyAccepted",req.body.PolicyAccepted,errors);
            validations.validPassword("Password",req.body.Password,errors);
            validations.validConfirmationPassword("ConfirmationPassword",req.body.Password,"ConfirmationPassword",req.body.ConfirmationPassword,errors);

            if (errors.length === 0) not_exists(req,res,next);
            else common.validationError(res,errors);
        });
    });
}

function validate_signup_mobile(req,res,next){
    if (tools.isUndefined(req.body)) common.errorResponse(res,texts.user_empty_body,errors.empty_body_error);
    else validate_values_mobile(req,res,next)
}

function validate_signup_web(req,res,next){
    if (tools.isUndefined(req.body)) common.errorResponse(res,texts.user_empty_body,errors.empty_body_error);
    else validate_values_web(req,res,next)
}

exports.choose_user_type_signup = function(req, res, next){
    let functionWeb = function(req,res){
        validate_signup_web(req,res,next)
    };
    let functionMobile = function(req,res){
        validate_signup_mobile(req,res,next)
    };
    validations.checkTypeParam(req,res,functionMobile,functionWeb);
};

function validate_update_web(req,res,next){
    if (tools.isUndefined(req.body)) common.errorResponse(res,texts.user_empty_body,errors.empty_body_error);
    else{
        let errors = [];

        validations.notEmptyString("Name",req.body.Name,errors);
        validations.validBusinessType("TypeBusiness",req.body.TypeBusiness,errors);
        validations.validCP("CP",req.body.CP,errors);
        validations.notEmptyText("Municipi",req.body.Municipi,errors);
        validations.notEmptyString("Address",req.body.Address,errors);
        validations.validPhone("Phone",req.body.Phone,errors);
        validations.notEmptyString("Description",req.body.Description,errors);
        validations.validURL("WebPage",req.body.WebPage,errors);
        validations.validateProvinciaID("ProvinciaID",req.body.ProvinciaID,req.body.CountryID,errors,function(){
            validations.validateCountryID("CountryID",req.body.CountryID,errors,function(){
                clearNonUpdatableWebFields(req);

                if (errors.length === 0) not_exists(req,res,next);
                else common.validationError(res,errors);
            });
        });
    }
}

function clearNonUpdatableWebFields(req){
    tools.deleteProperty(req.body,"Email");
    tools.deleteProperty(req.body,"CIF");
    tools.deleteProperty(req.body,"PolicyAccepted");
    tools.deleteProperty(req.body,"DateAcceptation");
    tools.deleteProperty(req.body,"Password");
    tools.deleteProperty(req.body,"ConfirmationPassword");
    tools.deleteProperty(req.body,"DatePassword");
    tools.deleteProperty(req.body,"RecoveryPasswordCode");
    tools.deleteProperty(req.body,"RecoveryPasswordCodeDate");
    tools.deleteProperty(req.body,"ActivationCode");
    tools.deleteProperty(req.body,"IsActive");
    tools.deleteProperty(req.body,"Type");
    tools.deleteProperty(req.body,"Schedule");
    tools.deleteProperty(req.body,"Products");
    tools.deleteProperty(req.body,"Offers");
    tools.deleteProperty(req.body,"Categories");
}

function validate_update_mobile(req,res,next){
    if (tools.isUndefined(req.body)) common.errorResponse(res,texts.user_empty_body,errors.empty_body_error);
    else {
        let errors = [];

        validations.notEmptyText("Name", req.body.Name, errors);
        validations.notEmptyText("Surname", req.body.Surname, errors);
        validations.majorEdat("BornDate", req.body.BornDate, errors);
        validations.notEmptyText("Municipi", req.body.Municipi, errors);
        validations.validPhone("Phone", req.body.Phone, errors);
        validations.validCP("CP",req.body.CP,errors);
        validations.validateProvinciaID("ProvinciaID", req.body.ProvinciaID, req.body.CountryID, errors,function(){
            validations.validateCountryID("CountryID", req.body.CountryID, errors,function(){
                clearNonUpdatableMobileFields(req);

                if (errors.length === 0) not_exists(req, res, next);
                else common.validationError(res, errors);
            });
        });
    }
}

function clearNonUpdatableMobileFields(req){
    tools.deleteProperty(req.body,"Email");
    tools.deleteProperty(req.body,"DNI");
    tools.deleteProperty(req.body,"PolicyAccepted");
    tools.deleteProperty(req.body,"DateAcceptation");
    tools.deleteProperty(req.body,"Password");
    tools.deleteProperty(req.body,"ConfirmationPassword");
    tools.deleteProperty(req.body,"DatePassword");
    tools.deleteProperty(req.body,"RecoveryPasswordCode");
    tools.deleteProperty(req.body,"RecoveryPasswordCodeDate");
    tools.deleteProperty(req.body,"ActivationCode");
    tools.deleteProperty(req.body,"IsActive");
    tools.deleteProperty(req.body,"Type");
    tools.deleteProperty(req.body,"Business");
    tools.deleteProperty(req.body,"FidelizationDiscounts");
}

exports.choose_user_type_update = function(req,res,next){
    let functionWeb = function(req,res){
        validate_update_web(req,res,next)
    };
    let functionMobile = function(req,res){
        validate_update_mobile(req,res,next)
    };
    validations.checkTypeParam(req,res,functionMobile,functionWeb);
};