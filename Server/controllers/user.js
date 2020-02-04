'use strict';

// Cargamos los modelos para usarlos posteriormente
const SchemaUserMobileProtected = require('../models/user_mobile_protected');
const SchemaUserWebProtected = require('../models/user_web_protected');
const SchemaUserWeb = require('../models/user_web');
const SchemaUserMobile = require('../models/user_mobile');
const commons = require('../utilities/common_responses');
const moment = require('moment');
const manager = require('../utilities/manager');
const activateUser = require('../controllers/user_activation');
const errors = require('../utilities/error_codes');
const texts = require('../utilities/texts');
const validations = require('../utilities/validations');
const tools = require('../utilities/tools');

let fs = require('fs');
let mongoose = require('mongoose');

exports.updateUser = function(req,res){
    try{
        let type = parseInt(req.query.type);
        let targetSchema = undefined;
        if (type === manager.USER_MOBILE) targetSchema = SchemaUserMobileProtected;
        else targetSchema = SchemaUserWebProtected;

        targetSchema.findOneAndUpdate({Email:req.CURRENT_USER.Email}, req.body, {new: true}, function(err,saved_user){
           if (err)
               commons.dbAccesError(err);
           else
               commons.validResponse(res,{User: saved_user});
        });
    }catch (err) {
        commons.dbAccesError(err);
    }
};

exports.createUser = function(req,res){
    let type = parseInt(req.query.type);
    if (type === manager.USER_MOBILE){
        req.body.BornDate = tools.toDate(req.body.BornDate);//(req.body.BornDate,manager.dateFormat).toDate();
        let new_user = new SchemaUserMobile(req.body);
        new_user.ActivationCode = activateUser.getActivationCode();
        new_user.Password = tools.encryptPassword(new_user.Password);
        new_user.ConfirmationPassword = tools.encryptPassword(new_user.ConfirmationPassword);
        if (new_user.deleteValuesOnCreate) new_user.deleteValuesOnCreate();
        new_user.save(function(err,user){
            if (err) commons.dbSaveError(res);
            else {
                activateUser.onSignupActivationMail(user);
                if (user.toProtected) user.toProtected();
                commons.validResponse(res,{User:user});
            }
        });
    }else if (type === manager.USER_WEB){
        let new_user = new SchemaUserWeb(req.body);
        new_user.ActivationCode = activateUser.getActivationCode();
        new_user.Password = tools.encryptPassword(new_user.Password)
        new_user.ConfirmationPassword = tools.encryptPassword(new_user.ConfirmationPassword)
        if (new_user.deleteValuesOnCreate) new_user.deleteValuesOnCreate();
        new_user.save(function(err,user){
            if (err) commons.dbSaveError(res);
            else {
                activateUser.onSignupActivationMail(new_user);
                if (user.toProtected) user.toProtected();
                commons.validResponse(res,{User:user});
            }
        });
    }else commons.undefinedErrorResponse(res)
};

exports.acceptPolicy = function(req,res){
    if (req.CURRENT_USER){
        req.CURRENT_USER.PolicyAccepted = true;
        req.CURRENT_USER.DateAcceptation = moment().toDate();
        req.CURRENT_USER.save(function(err,user){
            if (err) commons.dbSaveError(res,err.toString());
            else{
                if (user.toProtected){
                    user.toProtected();
                }
                commons.validResponse(res,{User:user.toProtected()});
            }
        })
    }else commons.undefinedErrorResponse(res);
};

exports.getUser = function(req,res){
    //Type validat i si current_user, token tb
    if (req.CURRENT_USER) getUserData(req,res);
    else if (req.query.user || req.query.userId) checkUserExistance(req,res);
    else commons.errorResponse(res,texts.user_empty_user_id,errors.params_validation_error)
};

function getUserData(req,res){
    if (req.query.user || req.query.userId || req.query.userDNI){
        if (req.query.requestedType){
            let numType = tools.toNumber(req.query.requestedType);
            let targetSchema = undefined;
            if (numType === manager.USER_MOBILE) targetSchema = SchemaUserMobileProtected;
            else if (numType === manager.USER_WEB) targetSchema = SchemaUserWebProtected;
            else {commons.errorResponse(res,texts.error_not_valid_param("requestedType"),errors.params_validation_error); return}

            let callback = (err,users) => {
                if (err) commons.dbAccesError(res);
                else {
                    if (users.length === 1){
                        let isActive = users[0].IsActive;
                        tools.deleteProperty(users,"IsActive");
                        commons.validResponse(res,{
                            Exists : true,
                            IsActive: isActive,
                            User : users[0]
                        });
                    }else if (users.length === 0)commons.validResponse(res,{
                        Exists: false,
                        IsActive: false
                    });
                    else commons.undefinedErrorResponse(res);
                }
            };
            if (req.query.user) targetSchema.find({Email:req.query.user,Type:numType}).select('+IsActive').exec(callback);
            else if (req.query.userId) targetSchema.find({_id : req.query.userId,Type:numType}).select('+IsActive').exec(callback);
            else if (req.query.userDNI) targetSchema.find({DNI: req.query.userDNI,Type:numType}).select('+IsActive').exec(callback);
        }else commons.errorResponse(res,texts.error_missing_param("requestedType"),errors.params_validation_error);
    }
    else if (req.CURRENT_USER){
        let isActive = req.CURRENT_USER.IsActive;
        if (req.toProtected) req.toProtected();
        commons.validResponse(res,{ Exists: true, IsActive: isActive, User: req.CURRENT_USER})
    }else commons.undefinedErrorResponse(res);
}

function checkUserExistance(req,res){
    if (req.query.user || req.query.userId){
        if (req.query.requestedType){
            let numType = tools.toNumber(req.query.requestedType);
            let targetSchema = undefined;
            if (numType === manager.USER_MOBILE) targetSchema = SchemaUserMobile;
            else if (numType === manager.USER_WEB) targetSchema = SchemaUserWeb;
            else {commons.errorResponse(res,texts.error_not_valid_param("requestedType"),errors.params_validation_error); return}

            let callback = (err,users) => {
                if (err) commons.dbAccesError(res,err.toString());
                else {
                    if (users.length === 1){
                        commons.validResponse(res,{
                            Exists : true,
                            IsActive: users[0].IsActive
                        });
                    }else if (users.length === 0) commons.validResponse(res,{
                        Exists: false,
                        IsActive: false
                    });
                    else commons.undefinedErrorResponse(res);
                }
            };
            if (req.query.user) targetSchema.find({Email:req.query.user,Type:numType},callback);
            else if (req.query.userId) targetSchema.find({_id : req.query.userId,Type:numType},callback);
        }else commons.errorResponse(res,texts.error_missing_param("requestedType"),errors.params_validation_error);
    }
    else commons.undefinedErrorResponse(res);
}

exports.deleteUser = function(req,res){
    let errorsArray = [];

    validations.notEmptyString("Password",req.body.Password,errorsArray);
    validations.notEmptyString("Email",req.body.Email,errorsArray);

    if (errorsArray.length === 0) {
        //TODO: afegir fer invisible si te compres
        let type = parseInt(req.query.type);
        let targetSchema = undefined;
        if (type === manager.USER_MOBILE)
            targetSchema = SchemaUserMobileProtected;
        else if (type === manager.USER_WEB)
            targetSchema = SchemaUserWebProtected;
        else commons.undefinedErrorResponse(res);

        if (targetSchema){
            targetSchema.find({Email:req.body.Email,Type:type}).select('+Password').exec(function(err,users){
                if (err) commons.dbAccesError(res);
                else if (users.length === 0) commons.errorResponse(res,texts.user_not_found,errors.user_not_found);
                else if (users.length === 1) {
                    if (users[0].Password === req.body.Password){
                        targetSchema.deleteOne({_id : users[0]._id}, function(err){
                            if (err) commons.dbDeleteError(res);
                            else commons.validResponse(res);
                        });
                    }
                    else commons.errorResponse(res,texts.user_invalid_password,errors.user_invalid_password)
                }else commons.undefinedErrorResponse(res);
            });
        }
    }
};

exports.getUserBusiness = function(req,res){
    if (req.CURRENT_USER){
        SchemaUserMobileProtected.findById(req.CURRENT_USER._id).populate({path: 'Business', populate: {path:'Productes', model:'Product'}}).sort('Name').exec(function(err,data){
            if (err) commons.dbAccesError(res,err.toString());
            else if (!data) commons.undefinedErrorResponse(res);
            else commons.validResponse(res,{
                Count : data.Business.length,
                BusinessData : data.Business
            })
        });
    }else commons.undefinedErrorResponse(res);
};

exports.setImage = function(req,res){
    if (req.CURRENT_USER){
        let db = mongoose.connection.db;
        let mongoDriver = mongoose.mongo;
        let gfs = new Gridfs(db, mongoDriver);

        let writestream = gfs.createWriteStream({
            filename: req.CURRENT_USER._id.toString(),
            mode: 'w',
            content_type: 'image/*',
            metadata: req.body
        });

        let idFile = req.CURRENT_USER._id.toString();
        try{
            fs.createReadStream('./tmp/'+idFile+".png").pipe(writestream);
        }catch (err){}

        writestream.on('close', function(file) {
            req.CURRENT_USER.Photo = file._id;
            req.CURRENT_USER.save(function(err){
                if (err) commons.dbSaveError(res,err.toString());
                else commons.validResponse(res);
            });
            try{
                //fs.unlink('./tmp/'+idFile+".png", function(err) {});
            }catch(err){}
        });
    }else commons.undefinedErrorResponse(res);
};