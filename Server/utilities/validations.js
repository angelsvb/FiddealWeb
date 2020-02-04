'use strict';

let texts = require('./texts');
let moment = require('moment');
let manager = require('./manager');
let tools = require('./tools');
let commons = require('./common_responses');
let error = require('./error_codes');
let enums = require('../utilities/enums');
let SchemaCountries = require('../models/country');
let SchemaProvincia = require('../models/provincia');
let SchemaOffer = require('../models/offer');
let SchemaProduct = require('../models/product');
let SchemaBusiness = require('../models/user_web_protected');
let SchemaUserMobile = require('../models/user_mobile_protected');

function addErrorItem(JSONProp,message,errorsArray){
    let errorItem = errorsArray.find(function(item){
        return item.prop === JSONProp;
    });
    if (!errorItem) errorsArray.push({prop: JSONProp, errorMessage: message});
    else errorItem.errorMEssage = message;
}
exports.addErrorItem = addErrorItem;

exports.validEmail = function(JSONProp,value,errorsArray){
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(value && value.match(mailformat)) return true;
    else{
        if (!value) addErrorItem(JSONProp,texts.empty_mail, errorsArray);
        else addErrorItem(JSONProp,texts.invalid_mail, errorsArray);
        return false;
    }
};

exports.validEmailSimple = function(mail){
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mail && mail.match(mailformat)
};

exports.validCP = function(JSONProp,value,errorsArray){
    if (!value) {
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        return false;
    }else if (isNaN(value)) {
        addErrorItem(JSONProp,texts.not_a_number,errorsArray);
        return false;
    }
    else{
        let numericCP = tools.toNumber(value);
        if (value.toString().length !== 5 || numericCP < 10000 || numericCP>52999){
            addErrorItem(JSONProp,texts.user_not_valid_cp,errorsArray);
            return false;
        }else return true;
    }
};

exports.validateProvinciaID = function(JSONProp,value,countryId,errors,next){
    if (validID(JSONProp,value,errors)){
        if (value){
            let oRes = false;
            SchemaCountries.findById(countryId,function(err,data){
                if (err) addErrorItem(JSONProp,texts.error_db_acces,errors);
                else {
                    if (data) {
                        let provincia = data.provincies.find(function(item){
                            return item._id.toString() === value;
                        });
                        if (provincia) oRes = true;
                        else addErrorItem(JSONProp,texts.provincia_not_found,errors);
                    }else addErrorItem(JSONProp,texts.country_not_found,errors);
                }
                next();
            });
            return oRes;
        }else{
            addErrorItem(JSONProp,texts.empty_value,errors);
            if (next) next();
            return false;
        }
    }else{
        if (next) next();
        return false;
    }
};

exports.validateCountryID = function(JSONProp,value,errors,next){
    if (validID(JSONProp,value,errors)){
        if (value){
            let oRes = false;
            SchemaCountries.findById(value,function(err,data){
                if (err) addErrorItem(JSONProp,texts.error_db_acces,errors);
                else {
                    if (data) oRes = true;
                    else addErrorItem(JSONProp,texts.country_not_found,errors);
                }
                if (next) next();
            });
            return oRes;
        }else{
            addErrorItem(JSONProp,texts.empty_value,errors);
            if (next) next();
            return false;
        }
    }else{
        if (next) next();
        return false;
    }
};

exports.notEmptyBuffer = function(JSONProp,value,errorsArray){
    if (value) return true;
    else {
        addErrorItem(JSONProp,texts.empty_buffer,errorsArray);
        return false;
    }
};

exports.notEmptyDate = function(JSONProp,value,errorsArray){
    if (value){
        try {
            tools.toDate(value);
            return true;
        }catch (err){
            addErrorItem(JSONProp, texts.invalid_date_format,errorsArray);
            return false;
        }
    }else {
        addErrorItem(JSONProp, texts.empty_date,errorsArray)
        return false;
    }
};

exports.notEmptyText = function(JSONProp,value,errorsArray){
    if (value) {
        if (/^[a-zA-Z]+$/.test(value)) return true;
        else {
            addErrorItem(JSONProp,texts.non_text,errorsArray);
            return true;
        }
    }
    else {
        addErrorItem(JSONProp,texts.empty_text,errorsArray);
        return false;
    }
};

function validID(JSONProp,value,errorsArray) {
    if (value) {
        let regEx = new RegExp("^[0-9a-fA-F]{24}$");
        if (regEx.test(value)) return true;
        else {
            addErrorItem(JSONProp, texts.not_valid_id, errorsArray);
            return false;
        }
    } else {
        addErrorItem(JSONProp,texts.empty_text,errorsArray);
        return false;
    }
};
exports.validId = validID;

exports.notEmptyArray = function(JSONProp,value,errorsArray){
    if (value && value.length > 0){
        return true;
    }else{
        addErrorItem(JSONProp,texts.empty_array,errorsArray);
        return false;
    }
};

exports.notEmptyString = function(JSONProp,value,errorsArray){
    if (value){
        if ((typeof value === 'string') || (value instanceof String))
            return true;
        else {
            addErrorItem(JSONProp,texts.non_text,errorsArray);
            return false;
        }
    }else{
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        return false;
    }
};

exports.notEmptyNumber = function(JSONProp,value,errorsArray){
    if (value){
        if (typeof value === 'number') return true;
        else {
            addErrorItem(JSONProp,texts.not_a_number,errorsArray);
            return false;
        }
    }else{
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        return false;
    }
};

exports.majorEdat = function(JSONProp,value,errorsArray){
    if (!value){
        addErrorItem(JSONProp,texts.empty_date,errorsArray);
        return false;
    }
    let diff = undefined;
    try{
        let parsedDate = moment(value,manager.dateFormat);
        diff = moment().diff(parsedDate,'years');
    }catch(err){
        addErrorItem(JSONProp,texts.invalid_date_format,errorsArray);
        return false;
    }

    if (isNaN(diff)){
        addErrorItem(JSONProp,texts.invalid_date_format,errorsArray);
        return false;
    }

    if (!tools.isUndefined(diff)){
        if (diff > manager.minUseAge) return true;
        else {
            addErrorItem(JSONProp,texts.invalid_age,errorsArray);
            return false;
        }
    }
};

exports.validDNI = function(JSONProp,value,errorsArray){
    if (value){
        let dniReal = String(value);
        if (dniReal.toUpperCase().startsWith("X") || dniReal.toUpperCase().startsWith("Y") || dniReal.toUpperCase().startsWith("Z")) dniReal = String(dniReal.substring(1));
        let pattern = /(\d{8})([TRWAGMYFPDXBNJZSQVHLCKEtrwagmyfpdxbnjzsqvhlcke])/;
        if(dniReal.match(pattern)){
            let letras = "TRWAGMYFPDXBNJZSQVHLCKE";
            let letra = dniReal[dniReal.length-1].toString();
            let index = dniReal.substring(0,dniReal.length-1);

            if (isNaN(index)){
                addErrorItem(JSONProp,texts.user_not_valid_dni,errorsArray);
                return false;
            }

            index = tools.toNumber(index) % 23;
            let reference = letras.substring(index, index + 1);
            if (reference.toUpperCase() === letra.toUpperCase()) return true;
            else {
                addErrorItem(JSONProp,texts.user_not_valid_dni,errorsArray);
                return false;
            }
        }else{
            addErrorItem(JSONProp,texts.user_not_valid_dni,errorsArray);
            return false;
        }
    }
    else {
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        return false;
    }
};

exports.validCIF = function(JSONProp,value,errorsArray){
    if (value) {
        let valueCif=value.substr(1,value.length-2);
        let suma=0;

        //Sumamos las cifras pares de la cadena
        for(let i=1;i<valueCif.length;i=i+2) suma=suma+parseInt(valueCif.substr(i,1));
        let suma2=0;
        //Sumamos las cifras impares de la cadena
        for(let i=0;i<valueCif.length;i=i+2) {
            let result=parseInt(valueCif.substr(i,1))*2;
            if(result.toString().length===1) suma2=suma2+parseInt(result);
            else suma2=suma2+parseInt(String(result).substr(0,1))+parseInt(String(result).substr(1,1));
        }
        // Sumamos las dos sumas que hemos realizado
        suma=suma+suma2;
        let unidad=String(suma).substr(1,1);
        unidad=10-parseInt(unidad);
        let primerCaracter=value.substr(0,1).toUpperCase();
        if(primerCaracter.match(/^[FJKNPQRSUVW]$/)) {
            if(String.fromCharCode(64+unidad).toUpperCase()===value.substr(value.length-1,1).toUpperCase())
                return true;
        }else if(primerCaracter.match(/^[XYZ]$/)) {
            addErrorItem(JSONProp,texts.user_cif_not_valid,errorsArray);
            return false;
        }
        else if(primerCaracter.match(/^[ABCDEFGHLM]$/)){
            if(unidad===10) unidad=0;
            if(value.substr(value.length-1,1)===String(unidad)) return true;
        }else{
            addErrorItem(JSONProp,texts.user_cif_not_valid,errorsArray);
            return false;
        }
        addErrorItem(JSONProp,texts.user_cif_not_valid,errorsArray);
        return false;
    }else{
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        return false;
    }
};

exports.validBusinessType = function(JSONProp,value,errorsArray){
    if (enums.eBusinessType.isValidType(tools.toNumber(value))) return true;
    else {
        addErrorItem(JSONProp,texts.user_not_valid_business_type,errorsArray);
        return false;
    }
};

exports.validPhone = function(JSONProp,value,errorsArray){
    if (!value) addErrorItem(JSONProp,texts.empty_value,errorsArray);
    else {
        value = value.toString().split(' ').join('');
        if (!tools.isNumber(value)) addErrorItem(JSONProp,texts.not_a_number,errorsArray);
        else if (value.toString().length > 6) return true;
        else addErrorItem(JSONProp,texts.too_short_phone,errorsArray);
    }
};

exports.trueBoolean = function(JSONProp,value,errorsArray){
    if (value === true || value === "true") return true;
    else {
        addErrorItem(JSONProp,texts.policy_not_accepted,errorsArray);
        return false;
    }
};

exports.validLength = function(JSONPROP, value, errorsArray, minLength, maxLength){
    if (value) {
        if (value.length >= minLength && value.length <= maxLength) return true;
        else {
            addErrorItem(JSONPROP, texts.invalid_length, errorsArray);
            return false;
        }
    }else{
        addErrorItem(JSONPROP, texts.empty_value, errorsArray);
        return false;
    }
}

exports.validPassword = function(JSONProp,value,errorsArray){
    if (!value){
        addErrorItem(JSONProp,texts.empty_date,errorsArray);
        return false;
    }else if (value.length > 50){
        addErrorItem(JSONProp,texts.user_password_too_long,errorsArray);
        return false;
    }else if (value.length < 8){
        addErrorItem(JSONProp,texts.user_password_too_short,errorsArray);
        return false;
    }else if (!tools.containsChar(value) || !tools.containsDigit(value)){
        addErrorItem(JSONProp,texts.user_password_not_safe,errorsArray);
        return false;
    }else return true;
};

exports.validConfirmationPassword = function(JSONProp1,value,JSONProp2,valueConfirm,errorsArray){
    if (!value) {
        addErrorItem(JSONProp1,texts.error_missing_param(JSONProp1),errorsArray);
        return false;
    }
    else if (!valueConfirm) {
        addErrorItem(JSONProp2,texts.error_missing_param(JSONProp2),errorsArray);
        return false;
    }
    else {
        if (value === valueConfirm) return true;
        else{
            addErrorItem(JSONProp2,texts.invalid_confirmation_password,errorsArray);
            return false;
        }
    }
};

exports.checkTypeParam = function(req,res,nextMobile,nextWeb){
    let type = tools.toNumber(req.query.type);
    if (type === undefined)
        commons.errorResponse(res,texts.error_missing_param("Type"),error.missing_param_type);
    else if (type > 2)
        commons.errorResponse(res, texts.error_not_valid_param("Type"),error.not_valid_type_error);
    else {
        if (type === manager.USER_MOBILE) nextMobile(req,res);
        else if (type === manager.USER_WEB) nextWeb(req,res);
    }
};

exports.validateTypeParam = function(req,res,next){
    let type = tools.toNumber(req.query.type);
    if (type === undefined || isNaN(type))
        commons.errorResponse(res,texts.error_missing_param("Type"),error.missing_param_type);
    else if (type > 2)
        commons.errorResponse(res, texts.error_not_valid_param("Type"),error.not_valid_type_error);
    else {
        next()
    }
};

exports.validateMobileRequest = function(req,res,next){
    if (req.query.type){
        let numericType = tools.toNumber(req.query.type);
        if (numericType === manager.USER_MOBILE) {
            next();
            return true;
        }
        else {
            commons.errorResponse(res,texts.error_not_valid_param("Type"),error.not_valid_type_error);
            return false;
        }
    }else commons.errorResponse(res,texts.error_missing_param("Type"),error.missing_param_type);
    return false;
};

exports.sameValueNotNull = function(JSONProp,value1,value2,errorsArray,message){
    if (!value1){
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        return false;
    }else if (value1 !== value2){
        if (value1.toString() !== value2.toString()) {
            addErrorItem(JSONProp,message,errorsArray);
            return false;
        }else return true;
    }else return true;
};

exports.validateTokenCreationDate = function(JSONProp, date1, date2, body_errors){
    if (tools.olderThan(date1,date2)){
        addErrorItem(JSONProp,texts.user_credentials_expired_code,body_errors);
        return false;
    } else return true;
};

exports.validateNotOlder = function(JSONProp,date1,JSONProp2,date2,body_errors){
    if (tools.olderThan(date1,date2)){
        addErrorItem(JSONProp,texts.offer_cant_be_older(JSONProp,JSONProp2),body_errors);
        return false;
    } else return true;
};

exports.validateOlder = function(JSONProp,date1,JSONProp2,date2,body_errors){
    if (!tools.olderThan(date1,date2)){
        addErrorItem(JSONProp,texts.offer_cant_be_older_or_equal(JSONProp2,JSONProp),body_errors);
        return false;
    } else return true;
};

exports.notSameValueNotNull = function(JSONProp,value1,value2,errorsArray){
  if (!value1){
      addErrorItem(JSONProp,texts.empty_value,errorsArray);
      return false;
  }if (value1 === value2){
      addErrorItem(JSONProp,texts.user_credentials_cant_be_equals,errorsArray);
      return false;
  }else return true;
};

exports.validURL = function(JSONProp,value,errorsArray) {
    if (value){
        let regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
        let url = new RegExp(regexQuery,"i");
        if (url.test(value)) return true;
        else{
            addErrorItem(JSONProp,texts.not_valid_url,errorsArray);
            return false;
        }
    }else{
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        return false;
    }
};

exports.validateWebRequest = function(req,res,next){
    if (req.query.type){
        let numericType = tools.toNumber(req.query.type);
        if (numericType === manager.USER_WEB) {
            if (next) next();
            return true;
        }
        else {
            commons.errorResponse(res,texts.error_not_valid_param("Type"),error.not_valid_type_error);
            return false;
        }
    }else commons.errorResponse(res,texts.error_missing_param("Type"),error.missing_param_type);
    return false;
};

exports.validatePositive = function(JSONProp,value,errorsArray){
    if (value){
        if (!isNaN(value)) {
            let numericValue = tools.toDecimal(value);
            if (numericValue > 0) return true;
            else addErrorItem(JSONProp,texts.negative_value,errorsArray);
        }else addErrorItem(JSONProp,texts.not_a_number,errorsArray);
    }else addErrorItem(JSONProp,texts.empty_value,errorsArray);
    return false;
};

exports.validatePositiveOrZero = function(JSONProp,value,errorsArray){
    if (value){
        if (!isNaN(value)) {
            let numericValue = tools.toDecimal(value);
            if (numericValue >= 0) return true;
            else addErrorItem(JSONProp,texts.negative_value,errorsArray);
        }else addErrorItem(JSONProp,texts.not_a_number,errorsArray);
    }else addErrorItem(JSONProp,texts.empty_value,errorsArray);
    return false;
};

exports.validateNotGreater = function(JSONProp,value1,JSONProp2,value2,errorsArray){
    if (value1 && value2){
        if (!isNaN(value1) && !isNaN(value2)){
            let numeric1 = tools.toDecimal(value1);
            let numeric2 = tools.toDecimal(value2);
            if (numeric1 >= numeric2) addErrorItem(JSONProp,texts.cant_be_greater_than(JSONProp2),errorsArray);
            else return true;
        }else if (!isNaN(value1)) addErrorItem(JSONProp,texts.not_a_number,errorsArray);
        else addErrorItem(JSONProp,texts.cant_compare_with_nan,errorsArray);
    }else if (!value1) addErrorItem(JSONProp,texts.empty_value,errorsArray);
    else addErrorItem(JSONProp,texts.cant_compare_with_empty,errorsArray);
    return false;
};

exports.validateStockState = function(JSONProp,eStockState,stockUnits,errorsArray){
    switch (tools.toNumber(eStockState)){
        case enums.eStockState.NON_AVAILABLE:{
            if (tools.toNumber(stockUnits) > 0) {
                addErrorItem(JSONProp,texts.product_stock_non_available_with_units,errorsArray);
                return false;
            }else return true;
        }
        case enums.eStockState.AVAILABLE:{
            if (tools.toNumber(stockUnits) <= 0){
                addErrorItem(JSONProp,texts.product_stock_available_without_units,errorsArray);
                return false;
            }else return true;
        }
        case enums.eStockState.DEPRECATED:{
            if (tools.toNumber(stockUnits) > 0){
                addErrorItem(JSONProp,texts.product_stock_deprecated_with_units,errorsArray);
                return false;
            }
            else return true;
        }
        case enums.eStockState.OUTLET:{
            if (tools.toNumber(stockUnits) <= 0){
                addErrorItem(JSONProp,texts.product_stock_outlet_without_units,errorsArray);
                return false;
            }else return true;
        }
        case enums.eStockState.TO_ARRIVE:{
            if (tools.toNumber(stockUnits) > 0){
                addErrorItem(JSONProp,texts.product_stock_to_arrive_with_units,errorsArray);
                return false;
            }else return true;
        }
        default:{
            addErrorItem(JSONProp,texts.unexpected_value,errorsArray);
            return false;
        }
    }
};

exports.validateExpectedArrival = function(JSONProp,expectedArrival,eStockState,stockUnits,errorsArray){
    if (tools.toNumber(eStockState) === enums.eStockState.TO_ARRIVE){
        if (tools.toNumber(stockUnits) === 0){
            try{
                if (tools.olderThan(moment(expectedArrival,manager.dateFormat).toDate(),moment().toDate())){
                    return true;
                }else {
                    addErrorItem(JSONProp,texts.must_be_non_expired_date,errorsArray);
                    return false;
                }
            }catch(err) {
                addErrorItem(JSONProp,texts.invalid_date_format,errorsArray);
                return false;
            }
        }else {
            addErrorItem(JSONProp,texts.product_cant_set_arrival_date_with_stock,errorsArray);
            return false;
        }
    }else {
        addErrorItem(JSONProp,texts.product_cant_set_arrival_date_without_to_arrive_state,errorsArray);
        return false;
    }
};

exports.validateSubcategory = function(JSONProp,user,subcategoryId,errorsArray){
    if (user){
        if (user.containsSubcategory(subcategoryId)) return true;
        else addErrorItem(JSONProp,texts.subcategory_not_found,errorsArray);
    }else addErrorItem(JSONProp,texts.user_not_found,errorsArray);
    return false;
};

exports.validateProductOffer = function(JSONProp,business,offer,errorsArray,next){
    if (!offer) {
        addErrorItem(JSONProp,texts.empty_value,errorsArray);
        next();
        return false;
    }else{
        SchemaOffer.find({businessID : business._id,_id:offer},function(err,offers){
            if (err) {
                addErrorItem(JSONProp,texts.error_db_acces,errorsArray);
                next();
                return false;
            }
            else{
                if (offers.length === 1) {
                    next();
                    return true;
                }
                else if (offers.length === 0) {
                    addErrorItem(JSONProp,texts.offer_not_found,errorsArray);
                    next();
                    return false;
                }else {
                    addErrorItem(JSONProp,texts.offer_undefined_error,errorsArray);
                    next();
                    return false;
                }
            }
        })
    }
};

exports.validateUniqueReference = function(JSONProp,business,reference,errorsArray,next){
    SchemaProduct.find({Reference: reference,Business: business._id.toString()},function(err,data){
        if (err) {
            addErrorItem(JSONProp,texts.error_db_acces,errorsArray);
            next();
            return false;
        }
        else{
            if (data.length === 0) {
                next();
                return true;
            }
            else {
                addErrorItem(JSONProp,texts.product_duplicated_reference,errorsArray);
                next();
                return false;
            }
        }
    });
};

exports.validateUniqueName = function(JSONProp,business,name,errorsArray,next){
    SchemaProduct.find({Name: name,Business: business._id.toString()},function(err,data){
        if (err) {
            addErrorItem(JSONProp,texts.error_db_acces,errorsArray);
            next();
            return false;
        }
        else{
            if (data.length === 0) {
                next();
                return true;
            }
            else {
                addErrorItem(JSONProp,texts.product_duplicated_name,errorsArray);
                next();
                return false;
            }
        }
    });
};

exports.validOfferType = function(JSONProp,value,products,errorArray){
    //si category range global -> descompte igual en tot
    //si last_units -> descompte igual en productes marcats
    //si category_range || categories_range -> descompte different a cada producte

    if (value>=0 && value<=2) return true;
    else {
        addErrorItem(JSONProp,texts.offer_invalid_offer_type,errorArray);
        return false;
    }
};

exports.validateExistsProductsWithoutDuplicates = function(JSONProp, products_array, businessId, errorArray, next){
    let arrayId = [];
    let hasDuplicated = false;
    let hasNonValidIds = false;
    for (let i = 0;i<products_array.length;i++){
        let oRes = tools.convertIds(products_array[i].Products);
        let auxArray = oRes.ids;
        if (oRes.invalidIds) {
            hasNonValidIds = true;
            break;
        }
        if (auxArray.length !== products_array[i].Products.length && !oRes.invalidIds) {
            hasDuplicated = true;
            break;
        }else{
            for (let j = 0;j<auxArray.length;j++){
                if (arrayId.indexOf(auxArray[j]) >= 0){
                    hasDuplicated = true;
                    break;
                }
            }
        }
        if (hasDuplicated  || hasNonValidIds) break;
        else arrayId = arrayId.concat(auxArray);
    }
    if (hasDuplicated) {
        addErrorItem(JSONProp,texts.offer_duplicated_product,errorArray);
        next();
        return false;
    }else if (hasNonValidIds){
        addErrorItem(JSONProp,texts.offer_invalid_products_id,errorArray);
        next();
        return false;
    }
    else{
        SchemaProduct.find({_id:{$in:arrayId},Business:businessId},function(err,data){
            if (err) addErrorItem(JSONProp,texts.error_db_acces,errorArray);
            else if (data){
                if (data.length !== arrayId.length) addErrorItem(JSONProp,texts.product_some_products_not_found,errorArray)
            }else addErrorItem(JSONProp,texts.empty_value,errorArray);
            next();
        });
    }
};

exports.validateOfferExists = function(businessId,offerId,next){
    SchemaOffer.find({_id:offerId,Business:businessId},function(err,data){
        if (err) { next(undefined);}
        else{
            if (data.length === 1) next(data[0]);
            else next(undefined);
        }
    })
};

exports.validateSameValue = function(JSONProp,value1,value2,errors_array){
    if (value1){
        if (value1 === value2) return true;
        else addErrorItem(JSONProp,texts.unexpected_value,errors_array);
    }else{
        addErrorItem(JSONProp,texts.empty_value,errors_array);
        return false;
    }
};

exports.validateProductsWithoutOffer = function(JSONProp,offer,businessId,error_array,next){
    let arrayId = [];
    let offer_products = offer.Products;
    for (let i = 0;i<offer_products.length;i++){
        let oRes = tools.convertIds(offer_products[i].Products);
        let auxArray = oRes.ids;
        arrayId = arrayId.concat(auxArray);
    }

    SchemaOffer.find({$and:[
            {Business:businessId},
            {$and : [{ExpirationDate: {$gte :tools.toDate(offer.ValidSince)}},
                {ValidSince : {$lte: tools.toDate(offer.ExpirationDate)}}]},
            {Products: {
                $elemMatch : {
                    Products : {
                        $elemMatch : {
                            $in : arrayId
                        }
                    }
                }
            }}
            ]
    },function(err,data){
        if (err) addErrorItem(JSONProp,texts.error_db_acces,error_array);
        else if (!data || data.length === 0){
            next();
            return true;
        }else{
            addErrorItem(JSONProp,texts.offer_product_in_other_offer,error_array);
            next();
            return false;
        }
    })
};

exports.validateUserExists = function(JSONProp,userId,error_array,next){
    SchemaUserMobile.findById(userId,function(err,user){
       if (err) addErrorItem(JSONProp,texts.error_db_acces,error_array);
       else if (!user) addErrorItem(JSONProp,texts.user_not_found,error_array);
       next();
    });
};