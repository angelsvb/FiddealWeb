let Tools = require('./tools');
let Texts = require('./texts');

const REQUEST_ERRORS = {
    OK : 1,
    NOT_EXECUTED : 2,
    CONNECTION_ERROR : 3,
    WRONG_VALIDATION : 4,
    UNDEFINED_ERROR : 5,
    SERVER_ERROR : 6,
    NULL_AUTHENTICATION_ERROR : 7,
    ERROR_PARSING_VALUES : 8,
    ERROR_PARSING_RESPONSE : 9,
    ERROR_SETTING_NEW_REQUEST : 10,
    ERROR_EXECUTING_REQUEST : 11,
    WRONG_REQUEST_CONFIG : 12
};

const BUSINESS_TYPE = {
    UNDEFINED : {id:0,text:Texts.default_select_option},
    SHOP : {id:1,text:Texts.business_type_commerce},
    RESTAURANT : {id:2,text:Texts.business_type_restaurant},
    HAIR_SALON : {id:3,text:Texts.business_type_hair},
    VETERINARIAN : {id:4,text:Texts.business_type_veterinary}
};

const STOCK_STATE = {
    UNDEFINED : 0,
    AVAILABLE : 1,
    DEPRECATED : 2,
    OUTLET : 3,
    TO_ARRIVE : 4,
    NON_AVAILABLE : 5
};

exports.getStockStateString = function(value, expectedArrival){
    switch (Tools.toNumber(value)) {
        case 0 : return Texts.stock_state_undefined;
        case 1 : return Texts.stock_state_available;
        case 2 : return Texts.stock_state_descatalogado;
        case 3 : return Texts.stock_state_outlet;
        case 4 : {
            if (expectedArrival) return Texts.stock_state_arriving + " - " + Tools.unifyDateFormat(expectedArrival, true);
            else return Texts.stock_state_arriving;
        }
        case 5 : return Texts.stock_state_non_available;
    }
};

exports.BUSINESS_TYPE = BUSINESS_TYPE;
exports.REQUEST_ERRORS = REQUEST_ERRORS;
exports.STOCK_STATE = STOCK_STATE;