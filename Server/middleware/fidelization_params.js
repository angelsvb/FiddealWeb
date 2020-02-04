'use strict';

let commons = require('../utilities/common_responses');
let errors = require('../utilities/error_codes');
let texts = require('../utilities/texts');
let validations = require('../utilities/validations');
let manager = require('../utilities/manager');
let tools = require('../utilities/tools');

exports.validateBodyAndParams = function(req,res,next){
    if (req.CURRENT_USER){
        if (validations.validateWebRequest(req,res)){
            if (req.body){
                let equivalence = tools.toDecimal(req.body.discountEquivalence);
                if (equivalence && equivalence > manager.minDiscountEquivalence && equivalence <= manager.maxDiscountEquivalence && (!req.body.expires || tools.toDecimal(req.body.discountLife) >= manager.minDiscountLife)) next();
                else {
                    let error_array = [];
                    if (!equivalence) validations.addErrorItem("discountEquivalence",texts.empty_value,error_array);
                    else if (equivalence < manager.minDiscountEquivalence) validations.addErrorItem("discountEquivalence",texts.fidelization_params_min_discount_error,error_array);
                    else if (equivalence > manager.maxDiscountEquivalence) validations.addErrorItem("discountEquivalence",texts.fidelization_params_max_discount_error,error_array);
                    if (req.body.expires && tools.toNumber(req.body.discountLife < manager.minDiscountLife))
                        validations.addErrorItem("discountLife",texts.fidelization_params_invalid_life,error_array);

                    if (error_array.length === 0) next();
                    else commons.validationError(res,error_array);
                }
            }
            else commons.errorResponse(res,texts.fidelization_params_empty_body,errors.empty_body_error);
        }else commons.unexpectedRequest(res);
    }
    else commons.invalidAuth(res);
};