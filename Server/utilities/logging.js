'use strict';

let moment = require('moment');
let credentialSchema = require('../models/log_credentials');
let requestSchema = require('../models/log_requests');
let mailingSchema = require('../models/log_mailing');

const TIMESTAMP = "Timestamp";
const METHOD = "Method";
const USER_AGENT = "Agent";
const HOST = "IPAddress";
const REQUEST_PATH = "RequestPath";
const REQUEST_BODY = "RequestBody";
const USER_TYPE = "UserType";
const USER_ID = "UserId";
const RESPONSE_CODE = "ResponseCode";
const RESPONSE_BODY = "ResponseBody";
const REQUEST_ID = "RequestId";

exports.RESPONSE_CODE = RESPONSE_CODE;
exports.RESPONSE_BODY = RESPONSE_BODY;

const MAILING_HOST = "Host";
const MAILING_PORT = "Port";
const MAILING_SECURE = "Secure";
const MAILING_TIMESTAMP = "Timestamp";
const MAILING_ERROR = "ErrorMessage";
const MAILING_FROM = "MailFrom";
const MAILING_TO = "MailTo";
const MAILING_SUBJECT = "MailSubject";
const MAILING_MESSAGE = "MailMessage";
const MAILING_ID = "MailId";

exports.MAILING_HOST = MAILING_HOST;
exports.MAILING_PORT = MAILING_PORT;
exports.MAILING_SECURE = MAILING_SECURE;
exports.MAILING_TIMESTAMP = MAILING_TIMESTAMP;
exports.MAILING_ERROR = MAILING_ERROR;
exports.MAILING_FROM = MAILING_FROM;
exports.MAILING_TO = MAILING_TO;
exports.MAILING_SUBJECT = MAILING_SUBJECT;
exports.MAILING_MESSAGE = MAILING_MESSAGE;
exports.MAILING_ID = MAILING_ID;

exports.saveMailingLog = function(loggingObject){
    if (loggingObject){
        mailingSchema.create(loggingObject, function(err, doc) {});
    }
};

exports.sendResponse = function(response, responseCode, responseBody){
    let loggingObject = getRequestLogObject(response.req);

    let targetSchema = undefined;
    if (isCredentialsRequest(response.req.route.path, response.req.method))
        targetSchema = credentialSchema;
    else targetSchema  = requestSchema;

    loggingObject[RESPONSE_CODE] = 200;
    loggingObject[RESPONSE_BODY] = JSON.stringify(responseBody);

    targetSchema.create(loggingObject, function(err, doc){
        if (doc) responseBody[REQUEST_ID] = doc._id.toString();
        response.status(responseCode).send(responseBody);
    });
};

function isCredentialsRequest(path, method){
    return path === "/credentials" || path === "/activation" || path === "/signin"
            || (path === "/user" && (method === "POST" || method === "DELETE"))
}

function getRequestLogObject(request){
    let oRes = {};

    oRes[TIMESTAMP] = moment().toDate();
    oRes[METHOD] = request.method;
    oRes[USER_AGENT] = request.headers["user-agent"];
    oRes[HOST] = request.headers["host"];
    oRes[REQUEST_PATH] = request.originalUrl;
    oRes[REQUEST_BODY] = JSON.stringify(request.body);
    if (request.query.type) oRes[USER_TYPE] = request.query.type;
    if (request.CURRENT_USER) oRes[USER_ID] = request.CURRENT_USER._id.toString();

    return oRes;
};