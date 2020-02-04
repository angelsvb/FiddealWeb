'use strict';

const manager = require('../utilities/manager');
const mailing = require('../utilities/mailing_interface');
const commons = require('../utilities/common_responses');
const texts = require('../utilities/texts');
const tools = require('../utilities/tools');
const moment = require('moment');
const SchemaUserMobileProtected = require('../models/user_mobile_protected');
const SchemaUserWebProtected = require('../models/user_web_protected');
const SchemaUserMobile = require('../models/user_mobile');
const SchemaUserWeb = require('../models/user_web');
const errors = require('../utilities/error_codes');
const login = require('../controllers/login');
const validations = require('../utilities/validations');

exports.activateUser = function(req,res){
    if (req.CURRENT_USER && validateCode(req,res,req.CURRENT_USER)){
        req.CURRENT_USER.IsActive = true;
        req.CURRENT_USER.save(function(err,updatedUser){
            if (err) commons.dbSaveError(res);
            else {
                if (updatedUser.toProtected) updatedUser.toProtected();
                commons.validResponse(res,{
                    Token:login.createToken(updatedUser._id,updatedUser.Email,updatedUser.Type),
                    User: updatedUser
                });
            }
        })
    }else if (!req.CURRENT_USER) commons.undefinedErrorResponse(res);
};

function validateCode(req,res,user){
    let errors_array = [];

    if (!req.query.token){
        validations.notEmptyString("Password",req.body.Password,errors_array);
        validations.notEmptyNumber("ActivationCode",tools.toNumber(req.body.ActivationCode),errors_array);

        if (errors_array.length === 0) {
            if (tools.encryptPassword(req.body.Password) !== user.Password){
                commons.errorResponse(res,texts.activate_user_invalid_password,errors.activate_user_invalid_password);
                return false;
            }else if (tools.toNumber(req.body.ActivationCode) !== user.ActivationCode){
                commons.errorResponse(res,texts.activate_user_not_valid_code,errors.activate_user_not_valid_code);
                return false;
            }else return true;
        }
        else {
            commons.validationError(res,errors_array);
            return false;
        }
    }else{
        if (tools.toNumber(req.body.ActivationCode) !== user.ActivationCode){
            commons.errorResponse(res,texts.activate_user_not_valid_code,errors.activate_user_not_valid_code);
            return false;
        }else return true;
    }
}


function onSignupActivationMail(user){
    mailing.sendMail(texts.activate_user_subject,getActivationHTML(user.Type,user.ActivationCode,user.Email),true,user.Email,function(error,info){
        if (!error) {
            console.log("ACTIVATION MAIL SENT: "+info.messageId);
        }
    });
}
exports.onSignupActivationMail = onSignupActivationMail;

exports.sendActivationMail = function(req,res){
    let email = req.CURRENT_USER.Email;
    if (email){
        if (!req.CURRENT_USER.IsActive) {
            req.CURRENT_USER.ActivationCode = getActivationCode();
            req.CURRENT_USER.LastUpdate = moment().toDate();
            req.CURRENT_USER.save(function(err,updatedUser){
                if (err) commons.dbAccesError(res);
                else {
                    mailing.sendMail(texts.activate_user_subject,getActivationHTML(updatedUser.Type,updatedUser.ActivationCode,updatedUser.Email),true,updatedUser.Email,function(error,info){
                        if (error) commons.sendingMailError(res,error);
                        else {
                            console.log("ACTIVATION MAIL SENT: "+info.messageId);
                            commons.validResponse(res,{});
                        }
                    });
                }
            });
        }else {
            mailing.sendMail(texts.activate_user_subject,getAlreadyActiveHTML(user.Type,user.Email,user.CreationDate),true,email,function(error,info){
                if (error) commons.sendingMailError(res,error);
                else {
                    console.log("ALREADY ACTIVE MAIL SENT: "+info.messageId);
                    commons.validResponse(res,{});
                }
            })
        }
    }else commons.undefinedErrorResponse(res);
};

exports.cancelUserActivation = function(req,res){
    let user = req.CURRENT_USER;
    if (user){
        if (!user.IsActive){
            let type = parseInt(req.query.type);
            let targetSchema = undefined;
            if (type === manager.USER_MOBILE)
                targetSchema = SchemaUserMobileProtected;
            else if (type === manager.USER_WEB)
                targetSchema = SchemaUserWebProtected;
            else commons.undefinedErrorResponse(res);

            if (targetSchema){
                if (req.CURRENT_USER){
                    targetSchema.deleteOne({_id : req.CURRENT_USER._id}, function(err){
                        if (err) commons.dbDeleteError(res);
                        else commons.validResponse(res);
                    });
                }else commons.undefinedErrorResponse(res)
            }
        }
        else commons.errorResponse(res,texts.activate_user_cant_delete_active,errors.activate_user_cant_delete_active);
    }else commons.undefinedErrorResponse(res);
};

function getActivationHTML(type,code,mail){
    let message = undefined;
    if (type === manager.USER_WEB) message = texts.activate_user_web_message;
    else message = texts.activate_user_mobile_message;

    let obj = {
        mainMessage : message,
        supportMail : manager.supportMailAddress,
        mailTo : mail,
        activationCode : code,
        autoMail : manager.autoMailAccount,
        privacyPolicy: texts.link_privacy_policy,
        termsAndConditions: texts.link_terms_and_conditions,
        icon_path: tools.getImagePath("/appicon_hd.png")
    };
    return tools.getHTMLTemplate('user_activation_code_template',obj)
}

function getAlreadyActiveHTML(type,mail,creationDate){
    let message = undefined;
    if (type === manager.USER_WEB) message = texts.activate_user_web_already_active;
    else message = texts.activate_user_mobile_already_active;

    let obj = {
        mainMessage : message,
        supportMail : manager.supportMailAddress,
        mailTo : mail,
        CreationDate : creationDate,
        autoMail : manager.autoMailAccount,
        privacyPolicy: texts.link_privacy_policy,
        termsAndConditions: texts.link_terms_and_conditions,
        icon_path: tools.getImagePath("/appicon_hd.png")
    };
    return tools.getHTMLTemplate('user_activation_already_active_template',obj);
}

function getActivationCode() {
    return tools.getRandom(manager.ACTIVATION_CODE_MIN,manager.ACTIVATION_CODE_MAX)
}
exports.getActivationCode = getActivationCode;
