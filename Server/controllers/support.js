'use strict';

let texts = require('../utilities/texts');
let CommonResponses = require('../utilities/common_responses');
let mailing = require('../utilities/mailing_interface');
let manager = require('../utilities/manager');
let errorCodes = require('../utilities/error_codes');
let tools = require('../utilities/tools');

exports.sendSupport = function(req,res){
    let type = tools.toNumber(req.query.type);
    if (type === manager.USER_MOBILE) sendSupportMobile(req,res);
    else if (type === manager.USER_WEB) sendSupportWeb(req,res);
    else CommonResponses.errorResponse(res,texts.error_not_valid_param("Type"),errorCodes.undefined_error)
};

function sendSupportWeb(req,res){
    let userMail = req.CURRENT_USER.Email;
    let category = req.body.Category;
    let topic = req.body.Topic;
    let message = req.body.Message;
    let labelCategory = getCategoryLabel(category);
    mailing.sendMail("[Soporte] "+labelCategory+" - "+topic,getSupportHTMLMailAdmin(labelCategory,topic,message,userMail,manager.USER_WEB),true,manager.supportMailAddress,function(errorResult,info){
        if (errorResult === errorCodes.request_ok) {
            console.log("MAIL TO SUPPORT SENT: "+info.messageId);
            mailing.sendMail(texts.support_confirmation_subject,getSupportHTMLMail(labelCategory,topic,message,userMail),true,userMail,function(errorResult,info){
                if (errorResult === errorCodes.request_ok) {
                    CommonResponses.validResponse(res,{});
                    console.log("MAIL COPY SENT: "+info.messageId);
                }
                else CommonResponses.sendingMailError(res,errorResult)
            });
        }
        else CommonResponses.sendingMailError(res,errorResult)
    });
}

function sendSupportMobile(req,res){
    let userMail = req.CURRENT_USER.Email;
    let category = req.body.Category;
    let topic = req.body.Topic;
    let message = req.body.Message;
    let labelCategory = getCategoryLabel(category);
    mailing.sendMail("[Soporte] "+labelCategory+" - "+topic,getSupportHTMLMailAdmin(labelCategory,topic,message,userMail,manager.USER_WEB),true,manager.supportMailAddress,function(errorResult,info){
        if (errorResult === errorCodes.request_ok) {
            console.log("MAIL TO SUPPORT SENT: "+info.messageId);
            mailing.sendMail(texts.support_confirmation_subject,getSupportHTMLMail(labelCategory,topic,message,userMail),true,userMail,function(errorResult,info){
                if (errorResult === errorCodes.request_ok) {
                    CommonResponses.validResponse(res,{});
                    console.log("MAIL COPY SENT: "+info.messageId);
                }
                else CommonResponses.sendingMailError(res,errorResult)
            });
        }
        else CommonResponses.sendingMailError(res,errorResult);
    });
}

function getSupportHTMLMail(ctg,tpc,msg, to){
    let obj = {
        supportMail: manager.supportMailAddress,
        category: ctg,
        termsAndConditions: texts.link_terms_and_conditions,
        privacyPolicy: texts.link_privacy_policy,
        topic: tpc,
        message: msg,
        autoMail: manager.autoMailAccount,
        mailTo: to,
        icon_path: tools.getImagePath("/appicon_hd.png")
    };
    return tools.getHTMLTemplate('support_mail_template_user',obj);
}

function getSupportHTMLMailAdmin(ctg,tpc,msg,to,type){
    let strType = texts.support_undefined_user_type;
    if (type === 1) strType = texts.support_mobile_user_type;
    else if (type === 2) strType = texts.support_web_user_type;
    let obj = {
        category: ctg,
        topic: tpc,
        message: msg,
        mailTo: to,
        typeUser : strType
    };
    return tools.getHTMLTemplate('support_mail_template_admin',obj);
}

function getCategoryLabel(categoryId){
    switch (categoryId){
        case 1: return texts.support_category_others;
        case 2: return texts.support_category_help;
        case 3: return texts.support_category_suggestion;
        case 4: return texts.support_category_software_problem;
        case 5: return texts.support_category_business_problem;
        default: return texts.support_category_undefined;
    }
}