'use strict';

let texts = require('./texts');
let errors = require('./error_codes');
let tools = require('./tools');
let logging = require('./logging');

exports.missingTokenError = function(res){
    let responseBody = {
        ResultOK : false,
        Message : texts.error_not_valid_param("Token"),
        ErrorCode : errors.invalid_or_missing_token_error,
        Entity : {}
    };
    logging.sendResponse(res, 200, responseBody);
};

exports.invalidTokenError = function(res){
    let responseBody = {
        ResultOK : true,
        Message : texts.invalid_or_missing_token,
        ErrorCode : errors.request_ok,
        Entity : {
            User : {},
            ValidationOK : false
        }
    };
    logging.sendResponse(res, 200, responseBody);
};

exports.emptyBodyError = function(res){
    let responseBody = {
        ResultOK : false,
        Message : texts.empty_body,
        ErrorCode : errors.empty_body_error,
        Entity : {},
        Errors : {}
    };
    logging.sendResponse(res, 200, responseBody);
};

exports.invalidAuth = function(res,message = texts.invalid_or_missing_token){
    let responseBody = {
        ResultOK : false,
        Message : message,
        ErrorCode : errors.invalid_or_missing_token_error,
        Entity : { }
    };
    logging.sendResponse(res, 200, responseBody);
};

exports.dbAccesError = function (res,dbError){
    let error = texts.error_db_acces;
    if (dbError && dbError !== 'undefined') error += ' - ' + dbError;

    let responseBody = {
        ResultOK : false,
        Message : error,
        ErrorCode : errors.db_acces_error,
        Entity : {}
    };
    logging.sendResponse(res, 200, responseBody);
};

function dbSaveError(res,dbError){
    let error = texts.error_db_save;
    if (dbError && dbError !== 'undefined') error += ' - ' + dbError;

    let responseBody = {
        ResultOK: false,
        Message: error,
        ErrorCode: errors.db_acces_error,
        Entity: {}
    };
    logging.sendResponse(res, 200, responseBody);
}
exports.dbSaveError = dbSaveError;

exports.dbDeleteError = function(res,dbError){
    let error = texts.error_db_delete;
    if (dbError && dbError !== 'undefined') error += ' - ' + dbError;

    let responseBody = {
        ResultOK : false,
        Message : error,
        ErrorCode : errors.db_acces_error,
        Entity : {}
    };
    logging.sendResponse(res, 200, responseBody);
};

function errorResponse(res,message,errorcode){
    let responseBody = {
        ResultOK : false,
        Message : message,
        ErrorCode : errorcode,
        Entity : {}
    };
    logging.sendResponse(res, 200, responseBody);
}
exports.errorResponse = errorResponse;

exports.sendingMailError = function(res,error){
    let errorMessage = undefined;
    if (error === errors.request_ok) return;
    else if (error === errors.support_error_creating_transporter) errorMessage = texts.error_creating_transporter;
    else if (error === errors.support_error_creating_mail) errorMessage = texts.error_creating_mail;
    else if (error === errors.support_undefined_error_sending_mail) errorMessage = texts.undefined_error_sending_mail;
    else if (error === errors.support_error_sending_mail) errorMessage = texts.error_sending_mail;
    else errorMessage = texts.undefined_error_sending_mail;

    if (!tools.isUndefined(errorMessage) && error > 0) errorResponse(res,texts.error_creating_transporter,errors.support_error_creating_transporter);
};

exports.undefinedErrorResponse = function (res){
    let responseBody = {
        ResultOK : false,
        Message : "Unexpected error",
        Errorcode : errors.undefined_error,
        Entity : {}
    };
    logging.sendResponse(res, 200, responseBody);
};

function validResponse(res,entity = {}, message = texts.request_executed_ok){
    let responseBody = {
        ResultOK : true,
        Message : message,
        ErrorCode : errors.request_ok,
        Entity : entity
    };
    logging.sendResponse(res, 200, responseBody);
}
exports.validResponse = validResponse;

exports.validationError = function(res,errors_val){
    let responseBody = {
        ResultOK : false,
        Message : texts.body_validation_errors,
        ErrorCode : errors.body_validation_error,
        Entity : {},
        Errors : getErrorObject(errors_val)
    };
    logging.sendResponse(res, 200, responseBody);
};

exports.paramsValidationError = function(res,errors_val){
    let responseBody = {
        ResultOK : false,
        Message : texts.wrong_query_params,
        ErrorCode : errors.params_validation_error,
        Entity : {},
        Errors : getErrorObject(errors_val)
    };
    logging.sendResponse(res, 200, responseBody);
};

function getErrorObject(validation_errors){
    let error = {};
    validation_errors.forEach(function(value){
       if (tools.isUndefined(error[value.prop])){
           if (value.errorMessage) error[value.prop] = value.errorMessage;
            else throw("Empty error message ->"+value.prop);
       }
    });
    return error;
}

exports.invalidJSON = function(res){
    let responseBody = {
        ResultOK : false,
        Message : texts.json_format_error,
        ErrorCode : errors.json_format_error,
    };
    logging.sendResponse(res, 200, responseBody);
};

exports.unexpectedRequest = function(res){
    let responseBody = {
        ResultOK : false,
        Message : texts.unexpected_request_error,
        ErrorCode : errors.unexpected_request_error,
    };
    logging.sendResponse(res, 200, responseBody);
};

exports.defaultSaveDbCallback = function(res){
    return function(err,data){
        if (err) dbSaveError(res,err.toString());
        else validResponse(res,{data:data});
    }
};
