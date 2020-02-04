'use strict';

let validations = require('../utilities/validations');
let commons = require('../utilities/common_responses');
let errors = require('../utilities/error_codes');
let texts = require('../utilities/texts');
let UserMobileSchema = require('../models/user_mobile');
let UserWebSchema = require('../models/user_web');
let tools = require('../utilities/tools');
let manager = require('../utilities/manager');
let moment = require('moment');

exports.validateQueryParams = function(req,res,next){
    validations.validateTypeParam(req,res,function(){
        validateUserMail(false,req,res,next);
    })
};

function validateUserMail(useProtected,req,res,next){
    let email = req.query.email;
    let type = tools.toNumber(req.query.type);
    if (email){
        let targetSchema = undefined;
        if (type === manager.USER_MOBILE) targetSchema = UserMobileSchema;
        else if (type === manager.USER_WEB) targetSchema = UserWebSchema;
        else { commons.errorResponse(res,texts.error_missing_param("Type"),errors.params_validation_error); return}

        if (targetSchema){
            targetSchema.find({Type:type,Email:email},function(err,user){
                if (err || !user) commons.dbAccesError(res);
                else {
                    if (user.length === 0) next();
                    else if (user.length === 1){
                        if (useProtected && user[0].toProtected) user[0].toProtected();
                        req.CURRENT_USER = user[0];
                        next();
                    }
                    else commons.dbAccesError(res);
                }
            })
        }
    }else commons.errorResponse(res,texts.error_missing_param("Email"),errors.params_validation_error)
}

exports.validateChangePassword = function(req,res,next){
    validations.validateTypeParam(req,res,function(){
        validateUserMail(false,req,res,function(){
            validateBodyNewPassword(req,res,next);
        });
    })
};
function validateBodyRecoveryPassword(req,res,next){
    if (req.CURRENT_USER){
        let body_errors = [];

        validations.sameValueNotNull("RecoveryCode",req.body.RecoveryCode,req.CURRENT_USER.RecoveryPasswordCode,body_errors,texts.user_credentials_recovery_code_not_valid);
        validations.validateTokenCreationDate("RecoveryCode",moment().toDate(),tools.add24Hours(req.CURRENT_USER.RecoveryPasswordCodeDate),body_errors);
        validations.validConfirmationPassword("PasswordNew",req.body.PasswordNew,"ConfirmPasswordNew",req.body.ConfirmPasswordNew,body_errors);
        validations.notSameValueNotNull("PasswordNew",tools.encryptPassword(req.body.PasswordNew),req.CURRENT_USER.Password,body_errors);

        if (body_errors.length === 0) next();
        else commons.validationError(res,body_errors);
    }else commons.errorResponse(res,texts.user_not_found,errors.user_credentials_not_found_user);
}


exports.validateRecoveryPassword = function(req,res,next){
    validations.validateTypeParam(req,res,function(){
        validateUserMail(false,req,res,function(){
            validateBodyRecoveryPassword(req,res,next);
        });
    })
};
function validateBodyNewPassword(req,res,next){
    if (req.CURRENT_USER){
        let body_errors = [];
        validations.notSameValueNotNull("PasswordNew",tools.encryptPassword(req.body.PasswordNew),req.CURRENT_USER.Password,body_errors);
        validations.validConfirmationPassword("PasswordNew",req.body.PasswordNew,"ConfirmPasswordNew",req.body.ConfirmPasswordNew,body_errors);
        validations.validPassword("PasswordNew",req.body.PasswordNew,body_errors);
        validations.sameValueNotNull("PasswordOld",tools.encryptPassword(req.body.PasswordOld),req.CURRENT_USER.Password,body_errors,texts.user_credentials_wrong_password);

        if (body_errors.length === 0) next();
        else commons.validationError(res,body_errors);
    }else commons.errorResponse(res,texts.user_not_found,errors.user_credentials_not_found_user);
}