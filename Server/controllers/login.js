'use strict';

const UserMobile = require('../models/user_mobile');
const UserMobileProtected = require('../models/user_mobile_protected');
const UserWebProtected = require('../models/user_web_protected');
const UserWeb = require('../models/user_web');
const manager = require('../utilities/manager');

const jwt = require('jwt-simple');
const commons = require('../utilities/common_responses');
const moment = require('moment');
const tools = require('../utilities/tools');
const auth = require('../middleware/authentication');
const validations = require('../utilities/validations');

const texts = require('../utilities/texts');
const errors= require('../utilities/error_codes');

const mongoose = require('mongoose');

exports.getToken = async function (req, res) {
    //const session = await mongoose.startSession();
    //await session.startTransaction();

    try {
        const userEmail = req.body.Email;
        const userPwd = req.body.Password;
        const type = tools.toNumber(req.query.type);
        let targetSchema = undefined;
        if (type === manager.USER_MOBILE) {
            targetSchema = UserMobile;
        } else if (type === manager.USER_WEB) {
            targetSchema = UserWeb;
        } else {
            //await session.abortTransaction();
            //await session.endSession();
            commons.errorResponse(res, texts.error_missing_param("type"), errors.missing_param_type);
        }

        if (targetSchema) {
            if (!userEmail || !userPwd) {
                //await session.abortTransaction();
                //await session.endSession();
                let errors_array = [];
                //validations.addErrorItem("Email", texts.empty_value)

                if (!userEmail) validations.addErrorItem("Email", texts.empty_value, errors_array); //commons.paramsValidationError(res, {Email: texts.empty_value});
                if (!userPwd) validations.addErrorItem("Password", texts.empty_value, errors_array);//commons.paramsValidationError(res, {Password: texts.empty_value});
                //else commons.paramsValidationError(res, {Email: texts.empty_value, Password: texts.empty_value})

                if (errors_array.length > 0) commons.paramsValidationError(res, errors_array);
            } else {
                targetSchema.find({
                    Email: userEmail,
                    Password: tools.encryptPassword(userPwd),
                    Type: type
                }, function (err, user) {
                    let entity = undefined;
                    if (err) commons.dbAccesError(res);
                    else {
                        if (user.length === 1) {
                            let active = user[0].IsActive;
                            let type = user[0].Type;
                            if (user[0].toProtected) user[0].toProtected();
                            entity = {
                                Token: createToken(user[0]._id, user[0].Email, type),
                                IsActive: active,
                                Exists: true,
                                User: user[0]
                            }
                        } else if (user.length === 0) {
                            entity = {
                                IsActive: false,
                                Exists: false,
                            };
                        } else {
                            //await session.abortTransaction();
                            //await session.endSession();
                            commons.dbAccesError(res);
                            return;
                        }
                        //await session.commitTransaction();
                        //await session.endSession();
                        commons.validResponse(res, entity)
                    }
                })
            }
        } else commons.errorResponse(res, texts.error_missing_param("type"), errors.missing_param_type);
    } catch (err) {
        //await session.abortTransaction();
        //await session.endSession();
        commons.dbAccesError(res, err);
    }
};

exports.validateToken = function(req,res){
    const type = tools.toNumber(req.query.type);
    const decodedToken = auth.decodeBodyToken(req);
    let targetSchema = undefined;
    if (decodedToken){
        if (type === manager.USER_MOBILE){
            targetSchema = UserMobile
        }else if (type === manager.USER_WEB){
            targetSchema = UserWeb
        }else { commons.undefinedErrorResponse(res); return;}

        if (targetSchema){
            innerValidateToken(decodedToken,targetSchema,req,res,function(validToken,user){
                if (validToken && user){
                    commons.validResponse(res,{
                        ValidationOK: true,
                        User : user
                    })
                }else if (!validToken) commons.invalidTokenError(res);
                else commons.dbAccesError(res);
            });
        }
    }else commons.missingTokenError(res);
};

function innerValidateToken(token,targetSchema,req,res,next){
    if (token.iss && token.email && !tools.isUndefined(token.expiring) && token.CreationDate && token.type && token.rand){
        if (targetSchema){
            targetSchema.findById(token.iss,function(err,user){
                if (err || !user) next(false,undefined);
                else {
                    if (user.Type === token.type && user._id.toString() === token.iss && user.Email === token.email && !tools.olderThan(user.DatePassword,token.CreationDate)) {
                        if (user.toProtected) user.toProtected();
                        next(true,user);
                    }
                    else next(false,undefined)
                }
            });
        }else next(false,undefined);
    }else next(false,undefined);
}

function createToken(_iss,_mail,type){
    return jwt.encode({
            iss: _iss,
            expiring : false,
            email : _mail,
            CreationDate : moment().toDate(),
            type: type,
            rand : tools.getRandom(0,999999)
        },manager.TOKEN_KEY,manager.ENCODING_ALGORITHM,undefined);
}
exports.createToken = createToken;