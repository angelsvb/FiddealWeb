'use strict';

let validations = require('../utilities/validations');
let tools = require('../utilities/tools');
let commons = require('../utilities/common_responses');
let texts = require('../utilities/texts');
let errors = require('../utilities/error_codes');
let manager = require('../utilities/manager');
let UserMobileSchema = require('../models/user_mobile');
let UserWebSchema = require('../models/user_web');

exports.validateQueryParams = function(req,res,next){
    validations.validateTypeParam(req,res,function(){
        if (!req.CURRENT_USER) validateUserEmail(req,res,next);
        else next();
    })
};

function validateUserEmail(req,res,next){
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
                    if (user.length === 0)
                        commons.errorResponse(res,texts.activate_user_not_found,errors.activate_user_not_found);
                    else if (user.length === 1){
                        req.CURRENT_USER = user[0];
                        next();
                    }
                    else commons.dbAccesError(res);
                }
            })
        }
    }else commons.errorResponse(res,texts.error_missing_param("Email"),errors.params_validation_error)
}