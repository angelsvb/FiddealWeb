'use strict';

const texts = require('../utilities/texts');
const errors = require('../utilities/error_codes');
const commons = require('../utilities/common_responses');
const manager = require('../utilities/manager');
const mailing = require('../utilities/mailing_interface');
const tools = require('../utilities/tools');
const moment = require('moment');

exports.sendRecoveryMail = function(req,res){
    if (req.CURRENT_USER){
        req.CURRENT_USER.RecoveryPasswordCode = tools.getRandom(10000000,99999999);
        req.CURRENT_USER.RecoveryPasswordCodeDate = moment().toDate();
        req.CURRENT_USER.save(function(err){
            if (err) commons.errorResponse(res,texts.user_credentials_error_generating_code,errors.user_credentials_error_generating_code);
            else {
                mailing.sendMail(texts.user_credentials_recovery_password,getRecoveryHTML(req.CURRENT_USER.Type,req.CURRENT_USER),true,req.CURRENT_USER.Email,function(err,info){
                    if (err) console.log("Error sending recovery mail to: "+req.CURRENT_USER.Email);
                    else {
                        commons.validResponse(res);
                        console.log("RECOVERY MAIL SENT:"+info.messageId);
                    }
                });
            }
        });
    }else{
        mailing.sendMail(texts.user_credentials_recovery_password,getUserNotFoundHTML(tools.toNumber(req.query.type),req.query.email),true,req.query.email,function(mailErr,info){
            if (mailErr) {
                commons.errorResponse(res,texts.user_credentials_error_generating_code,errors.user_credentials_error_generating_code);
                console.log("Error sending recovery mail to: "+req.query.email);
            }
            else {
                commons.validResponse(res);
                console.log("RECOVERY MAIL SENT (USER NOT FOUND):"+info.messageId);
            }
        });
    }
};

function getRecoveryHTML(type,user){
    return tools.getHTMLTemplate('password_recovery_code_template',{
        mainMessage : texts.user_credentials_message,
        supportMail : manager.supportMailAddress,
        activationCode : user.RecoveryPasswordCode,
        expirationDate : moment(tools.add24Hours(user.RecoveryPasswordCodeDate)).format(manager.datetimeFormat),
        privacyPolicy : texts.link_privacy_policy,
        userType : texts.user_credentials_type(type),
        termsAndConditions : texts.link_terms_and_conditions,
        mailTo : user.Email,
        autoMail: manager.autoMailAccount,
        icon_path: tools.getImagePath("/appicon_hd.png")
    });
}

function getUserNotFoundHTML(type,mail){
    return tools.getHTMLTemplate('password_recovery_user_not_found',{
        supportMail : manager.supportMailAddress,
        privacyPolicy : texts.link_privacy_policy,
        userType : texts.user_credentials_type(type),
        termsAndConditions : texts.link_terms_and_conditions,
        mailTo : mail,
        autoMail: manager.autoMailAccount,
        icon_path: tools.getImagePath("/appicon_hd.png")
    });
}

exports.changePassword = function(req,res){
    if (req.CURRENT_USER){
        req.CURRENT_USER.Password = tools.encryptPassword(req.body.PasswordNew);
        req.CURRENT_USER.ConfirmationPassword = tools.encryptPassword(req.body.ConfirmPasswordNew);
        req.CURRENT_USER.DatePassword = moment().toDate();
        req.CURRENT_USER.save(function(err){
            if (err) commons.dbSaveError(res);
            else commons.validResponse(res);
        });
    }else commons.undefinedErrorResponse(res);
};

exports.recoveryPassword = function(req,res){
    if (req.CURRENT_USER){
        req.CURRENT_USER.Password = tools.encryptPassword(req.body.PasswordNew);
        req.CURRENT_USER.ConfirmationPassword = tools.encryptPassword(req.body.ConfirmPasswordNew);
        req.CURRENT_USER.DatePassword = moment().toDate();
        req.CURRENT_USER.save(function(err){
            if (err) commons.dbSaveError(res);
            else commons.validResponse(res);
        });
    }else commons.undefinedErrorResponse(res);
};