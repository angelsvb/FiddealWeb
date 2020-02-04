'use strict'

let jwt = require('jwt-simple');
let manager = require('../utilities/manager');
let tools = require('../utilities/tools');
let commons = require('../utilities/common_responses');
let UserMobile = require('../models/user_mobile');
let UserWeb = require('../models/user_web');
let UserMobileProtected = require('../models/user_mobile_protected');
let UserWebProtected = require('../models/user_web_protected');
let texts = require('../utilities/texts');

function validBodyToken(req,res,next,expressNext,errorOnNoValidToken = true,getProtectedUserData = false){
    if (req.query.Type){
        let decodedToken = decodeBodyToken(req);
        if (decodedToken) innerValidateToken(decodedToken,req,res,next,errorOnNoValidToken,getProtectedUserData);
        else if (errorOnNoValidToken) commons.invalidAuth(res);
        else next(req,res,expressNext);
    }else if (errorOnNoValidToken) {
        if (!req.query.type) commons.invalidAuth(res,texts.error_missing_param("type"));
        else commons.invalidAuth(res,texts.error_not_valid_param("type"));
    }else{
        next(req,res,expressNext);
    }
}
exports.validBodyToken = validBodyToken;

function validQueryToken(req,res,next,expressNext,errorOnNoValidToken = true,getProtectedUserData = false){
    if (req.query.type && !isNaN(req.query.type)) {
        let decodedToken = decodeQueryToken(req);
        if (decodedToken) innerValidateToken(decodedToken, req, res, next, expressNext, errorOnNoValidToken, getProtectedUserData);
        else if (errorOnNoValidToken) commons.invalidAuth(res);
        else next(req, res, expressNext);
    }else if (errorOnNoValidToken) {
        if (!req.query.type) commons.invalidAuth(res,texts.error_missing_param("type"));
        else commons.invalidAuth(res,texts.error_not_valid_param("type"));
    }else next(req,res,expressNext);
}
exports.validQueryToken = validQueryToken;

function decodeBodyToken(req){
    if (req.body.Token){
        try{
            return jwt.decode(req.body.Token,manager.TOKEN_KEY,false,manager.ENCODING_ALGORITHM);
        } catch(err) {
            return undefined;
        }
    }else return undefined;
}
exports.decodeBodyToken = decodeBodyToken;

function decodeQueryToken(req){
    if (req.query.token){
        try{
            return jwt.decode(req.query.token,manager.TOKEN_KEY,false,manager.ENCODING_ALGORITHM);
        }catch(err){ return undefined;}

    }else return undefined;
}
exports.decodeQueryToken = decodeQueryToken;

function innerValidateToken(token,req,res,next,expressNext,errorOnNoValidToken = true,getUserProtectedData = false){
    let type = tools.toNumber(req.query.type);
    if (token.iss && token.email && !tools.isUndefined(token.expiring) && token.CreationDate){
        let targetSchema = undefined;
        if (type === manager.USER_MOBILE){
            if (getUserProtectedData) targetSchema = UserMobileProtected;
            else targetSchema = UserMobile;
        }else if (type === manager.USER_WEB){
            if (getUserProtectedData) targetSchema = UserWebProtected;
            else targetSchema = UserWeb;
        }else {
            if (errorOnNoValidToken) commons.invalidAuth(res);
            else next(req,res,expressNext);
            return;
        }

        if (type !== token.type){
            if (errorOnNoValidToken) {
                commons.invalidAuth(res);
                return;
            }
            else next(req,res,expressNext);
        }

        if (targetSchema){
            targetSchema.findById(token.iss,function(err,user){
                if (err && errorOnNoValidToken) commons.dbAccesError(res);
                else {
                    if (user){
                        if (user._id.toString() === token.iss && user.Email === token.email && !tools.olderThan(user.DatePassword,token.CreationDate)) {
                            req.CURRENT_USER = user;
                            next(req,res,expressNext);
                        }
                        else if (errorOnNoValidToken) commons.invalidAuth(res);
                        else next(req,res,expressNext);
                    }else if (errorOnNoValidToken) commons.invalidAuth(res);
                    else next(req,res,expressNext);
                }
            });
        }else if (errorOnNoValidToken) commons.invalidAuth(res);
        else next(req,res,expressNext);
    }else if (errorOnNoValidToken) commons.invalidAuth(res);
    else next(req,res,expressNext);
}

exports.getValidateTokenMiddleware = function (_next,_tokenInQuery = true,_errorOnNoValidToken = true){
    return function(req,res,next){
        if (_tokenInQuery) validQueryToken(req,res,_next,next,_errorOnNoValidToken);
        else validBodyToken(req,res,_next,next,_errorOnNoValidToken);
    }
};