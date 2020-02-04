'use strict';

let commons = require('../utilities/common_responses');
let FidelizationParamsSchema = require('../models/fidelization_params');

exports.setFidelizationParams = function(req,res){
    if (req.CURRENT_USER){
        req.CURRENT_USER.FidelizationParams = new FidelizationParamsSchema(req.body);
        req.CURRENT_USER.save(commons.defaultSaveDbCallback(res));
    }else commons.undefinedErrorResponse(res);
};

exports.getFidelizationParams = function(req,res){
    if (req.CURRENT_USER){
        commons.validResponse(res,req.CURRENT_USER.FidelizationParams);
    }else commons.undefinedErrorResponse(res);
};