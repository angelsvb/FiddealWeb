'use strict';

// Cargamos los modelos para usarlos posteriormente
let Country = require('../models/country');
let Texts = require('../utilities/texts');
let CommonResponses = require('../utilities/common_responses');
let errors = require('../utilities/error_codes');
let tools = require('../utilities/tools');

// Obtenir dades de paisos
exports.getPaisos = function (req, res) {
    try {
        let type = tools.toNumber(req.query.type);

        if (type === undefined)
            CommonResponses.errorResponse(res,Texts.error_missing_param("Type"),errors.missing_param_type);
        else if (type > 2)
            CommonResponses.errorResponse(res, Texts.error_not_valid_param("Type"),errors.not_valid_type_error);
        else {
            Country.find({}).sort('name').exec(function(err,countries) {
                if (err) CommonResponses.dbAccesError(res);
                else CommonResponses.validResponse(res,{"countries":countries})
            });
        }
    }catch(err){
       CommonResponses.undefinedErrorResponse(res)
    }
};