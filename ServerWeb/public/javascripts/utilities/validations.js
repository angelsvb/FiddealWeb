let texts = require('./texts');
let tools = require('./tools');
let moment = require('moment');

exports.notEmpty = function(value){
    if (value){
        if ((typeof value === 'string' || value instanceof String))
            return validationOK();
        else {
            return wrongValidation(texts.validation_non_string);
        }
    }else{
        return wrongValidation(texts.validation_empty_string);
    }
};

exports.validMail = function(value){
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(value && value.match(mailformat)) return validationOK();
    else{
        if (!value) return wrongValidation(texts.validation_empty_string);
        else return wrongValidation(texts.validation_email_format);
    }
};

exports.validRecoveryCode = function(value){
    if (!value) return wrongValidation(texts.validation_empty_string);
    else {
        let pin = tools.toNumber(value);
        if (pin){
            if (value.length === 8) return validationOK();
            else if (value.length > 8) return wrongValidation(texts.validation_too_long);
            else return wrongValidation(texts.validation_too_short);
        }else return wrongValidation(texts.validation_nan);
    }
};

exports.validPassword = function(value){
    if (!value) return wrongValidation(texts.validation_empty_string);
    else if (value.length > 50) return wrongValidation(texts.validation_too_long);
    else if (value.length < 8) return wrongValidation(texts.validation_too_short);
    else if (!tools.containsChar(value) || !tools.containsDigit(value)) return wrongValidation(texts.validation_non_safe_password);
    else return validationOK();
};

function validationOK(){
    return {resultOK : true, message: ""}
}
exports.validationOK = validationOK;

function wrongValidation(message){
    return {resultOK: false, message:message }
}
exports.wrongValidation = wrongValidation;

exports.notZero = function(value){
    if (isNaN(value)) return wrongValidation(texts.validation_nan);
    else{
        if (parseInt(value) === 0) return wrongValidation(texts.validation_empty_string);
        else return validationOK();
    }
};

exports.validCIF = function(value){
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
            if(String.fromCharCode(64+unidad).toUpperCase()===value.substr(value.length-1,1).toUpperCase()) return validationOK();
        }else if(primerCaracter.match(/^[XYZ]$/)) return wrongValidation(texts.cif_not_valid);
        else if(primerCaracter.match(/^[ABCDEFGHLM]$/)){
            if(unidad===10) unidad=0;
            if(value.substr(value.length-1,1)===String(unidad)) return validationOK();
        }else return wrongValidation(texts.cif_not_valid);
        return wrongValidation(texts.cif_not_valid);
    }else{
        return wrongValidation(texts.validation_empty_string);
    }
};

exports.validPhone = function(value){
    value = value.split(' ').join('');
    if (!value) return wrongValidation(texts.validation_empty_string);
    else {
        if (isNaN(tools.toNumber(value))) return wrongValidation(texts.validation_nan);
        else if (value.toString().length > 6) return validationOK();
        else return wrongValidation(texts.validation_too_short)
    }
};

exports.validCP = function(value){
    if (!value) return wrongValidation(texts.validation_empty_string);
    else if (isNaN(value)) return wrongValidation(texts.validation_nan);
    else{
        let numericCP = tools.toNumber(value);
        if (value.toString().length !== 5 || numericCP < 10000 || numericCP>52999) return wrongValidation(texts.validation_CP_format);
        else return validationOK();
    }
};

exports.trueBoolean = function(value){
    if (value === true || value === "true") return validationOK();
    else return wrongValidation(texts.validation_must_check);
};

exports.notEmptyText = function(value){
    if (value) {
        if (/^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(value)) return validationOK();
        else return wrongValidation(texts.validation_not_text);
    }
    else return wrongValidation(texts.validation_empty_string);
};

exports.notDefaultSelect = function(value){
    if (!value || value === 0 || value === "0" || value === ""){
        return wrongValidation(texts.validation_select_option);
    }else return validationOK();
};

exports.positive = function(value){
    if (!value && value !== 0) return wrongValidation(texts.validation_empty_string);
    else if (isNaN(value)) return wrongValidation(texts.validation_nan);
    else{
        if (tools.toDecimal(value) > 0) return validationOK();
        else return wrongValidation(texts.non_positive_number);
    }
};

exports.isZero = function(value){
    if (!value && value !== 0) return wrongValidation(texts.validation_empty_string);
    else if (isNaN(value)) return wrongValidation(texts.validation_nan);
    else{
        if (tools.toNumber(value) === 0) return validationOK();
        else return wrongValidation(texts.non_zero_numb);
    }
};

exports.empty = function(value){
    if (!value) return validationOK();
    else return wrongValidation(texts.non_empty_value);
};

exports.olderThanCurrentDate = function(value){
    if (value){
        try{
            let date = moment(value);
            if (!date.isValid()) date = moment(value,"DD/MM/YYYY");
            if (olderThan(date, moment().toDate())){
                return validationOK();
            }else{
                return wrongValidation(texts.date_too_small);
            }
        }catch(err){
            return wrongValidation(texts.invalid_date_format);
        }
    }else return wrongValidation(texts.validation_empty_string);
};

function olderThan(date1,date2){
    let d1 = moment(date1);
    let d2 = moment(date2);
    return d1 > d2;
};
exports.olderThan = olderThan;