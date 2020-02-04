let Enums = require('./enums.js');
let tools = require('./tools');
let texts = require('./texts');
let Storage = require('./storage');

class HTTPRequest{
    constructor() {
        //Configuració
        this.queryParams = {};
        this.bodyParams = {};

        //Resultat preparació execució
        this.resultType = Enums.REQUEST_ERRORS.NOT_EXECUTED;
        this.hasBody = false;
        this.hasQueryParams = false;
        this.validationBodyOk = false;
        this.validationQueryOk = false;

        //Objectes a enviar
        this.queryObject = {};
        this.bodyObject = {};

        //Resposta servidor
        this.errors = {};
        this.entity = {};
        this.message = "";
        this.resultOK = false;
        this.errorCode = undefined;
    }


    getBodyObject(){
        let oRes = {};
        let hasBodyObject = false;
        this.validationBodyOk = true;
        for (let property in this.bodyParams){
            if (this.bodyParams.hasOwnProperty(property)){
                let viewID = this.bodyParams[property].inputId;
                let validation = this.bodyParams[property].validation;

                let input = $('#'+viewID);
                if (input.length){
                    let value = HTTPRequest.getViewValue(viewID);
                    if (validation){
                        let validationResult = undefined;
                        if (this.bodyParams[property].customValidation) validationResult = validation();
                        else validationResult = validation(value);
                        if (validationResult.resultOK === true){
                            oRes[property] = value;
                            this.validationBodyOk = this.validationBodyOk && validationResult.resultOK;
                            hasBodyObject = true;
                            this.constructor.disableInputError(this.bodyParams[property].errorId);
                        }else if (validationResult.resultOK === false){
                            hasBodyObject = true;
                            let errorID = this.bodyParams[property].errorId;
                            this.constructor.setInputError(errorID,validationResult.message);
                            this.validationBodyOk = this.validationBodyOk && validationResult.resultOK;
                        }else throw texts.exception_undefined_validation_result+viewID;
                    }else if (!this.emptyValue(value,input.tagName)) {
                        hasBodyObject = true;
                        oRes[property] = value;
                    }
                }else throw texts.exception_undefined_view_id_or_not_found+viewID;
            }
        }
        if (this.getManualBodyParams){
            this.getManualBodyParams(oRes);
        }
        if (this.getStaticBodyParams){
            this.getStaticBodyParams(oRes);
        }
        if (!hasBodyObject) this.validationBodyOk = true;
        return oRes;
    }

    getStaticBodyParams(){

    }

    getQueryObject(){
        let oRes = {};
        let hasQueryObject = false;
        this.validationQueryOk = true;
        for (let property in this.queryParams){
            if (this.queryParams.hasOwnProperty(property)){
                let viewID = this.queryParams[property].inputId;
                let validation = this.queryParams[property].validation;

                let input = $('#'+viewID);
                if (input.length){
                    let value = HTTPRequest.getViewValue(viewID);
                    if (validation){
                        let validationResult = undefined;
                        if (this.queryParams[property].customValidation){
                            validationResult = validation();
                        }else validationResult = validation(value);
                        if (validationResult.resultOK === true){
                            oRes[property] = value;
                            this.validationQueryOk = this.validationQueryOk && validationResult.resultOK;
                            hasQueryObject = true;
                            HTTPRequest.disableInputError(this.queryParams[property].errorId);
                        }else if (validationResult.resultOK === false){
                            hasQueryObject = true;
                            let errorID = this.queryParams[property].errorId;
                            HTTPRequest.setInputError(errorID,validationResult.message);
                            this.validationQueryOk = this.validationQueryOk && validationResult.resultOK;
                        }else throw texts.exception_undefined_validation_result+viewID;
                    }else if (!this.emptyValue(value,input.tagName)) {
                        hasQueryObject = true;
                        oRes[property] = value;
                    }
                }else throw texts.exception_undefined_view_id_or_not_found+viewID;
            }
        }
        if (this.getManualQueryParams){
            this.getManualQueryParams(oRes);
        }
        if (this.getStaticQueryParams){
            this.getStaticQueryParams(oRes);
        }
        if (!hasQueryObject) this.validationQueryOk = true;
        return oRes;
    }

    emptyValue(value,tag){
        if (value){
            if (tag === 'select' && tools.toNumber(value) === 0) return true;
            else return false;
        }else return true;
    }

    getStaticQueryParams(object){
        if (this.needAuth() && Storage.getToken && Storage.getToken()) object.token = Storage.getToken();
        else if (this.needAuth()) this.resultType = Enums.REQUEST_ERRORS.NULL_AUTHENTICATION_ERROR;
        if (this.hasType()) object.type = 2;
    }

    addQueryParam(desc,_id,_validation,_errorId,customValidation = false){
        if (this.queryParams[desc]){
            throw texts.exception_duplicated_query_param+desc;
        }else{
            this.queryParams[desc] = {
                inputId : _id,
                validation : _validation,
                customValidation : customValidation,
                errorId : _errorId
            }
        }
    }

    addBodyParam(desc,_id,_validation,_errorId,customValidation = false){
        if (this.bodyParams[desc]){
            throw texts.exception_duplicated_body_param+desc;
        }
        else{
            this.bodyParams[desc] = {
                inputId : _id,
                validation : _validation,
                customValidation : customValidation,
                errorId: _errorId
            }
        }
    }

    setInputsErrorResponse(){
        if (this.errors){
            let oneSetted = false;
            for(let property in this.errors){
                if (this.errors.hasOwnProperty(property)){
                    let errorText = this.errors[property];
                    if (this.queryParams.hasOwnProperty(property)){
                        let errorId = this.queryParams[property].errorId;
                        if (errorId) this.constructor.setInputError(errorId,errorText);
                        oneSetted = true;
                    }else if (this.bodyParams.hasOwnProperty(property)){
                        let errorId = this.bodyParams[property].errorId;
                        if (errorId) this.constructor.setInputError(errorId,errorText);
                        oneSetted = true;
                    }
                }
            }
            return oneSetted;
        }else return false;
    }

    static getViewValue(id){
        if (id.indexOf('#') > -1) {
            let input = $(id);
            if (input.tagName === "select"){
                return tools.toNumber(input.val());
            }else{
                if (input[0].type !== 'checkbox') {
                    if (input[0].type === "number") return tools.toDecimal(input.val());
                    else return input.val();
                }
                else return input.prop('checked');
            }
        }
        else {
            let input = $('#'+id);
            if (input.tagName === "select"){
                return tools.toNumber(input.val());
            }else{
                if (input[0].type !== 'checkbox') {
                    if (input[0].type === "number") return tools.toDecimal(input.val());
                    else return input.val();
                }
                else return input.prop('checked');
            }
        }
    }

    static setInputError(id,message){
        if (id.indexOf('#') > - 1) $(id).show().text(message);
        else $('#'+id).show().text(message);
    }

    static disableInputError(id){
        if (id.indexOf('#') > - 1) $(id).hide();
        else $('#'+id).hide();
    }

    hasType(){
        return true;
    }

    needAuth(){
        return true;
    }

    baseURL(){
        return Storage.apiURL();
    }

    timeout(){
        return 10000;
    }

    showLoading(){
        return true;
    }

    showErrorOnRequestCompleted(){
        return true;
    }

    showMessageOnRequestCompleted(){
        return false;
    }

    successMessage(){
        return "";
    }

    successTitle(){
        return "";
    }

    getErrorCodeText(errorCode){
        if (errorCode || errorCode === 0){
            switch(errorCode){
                case 0: return texts.error_code_ok;
                case 1: return texts.error_code_undefined;
                case 2: return texts.error_code_db_access;
                case 3: return texts.error_code_invalid_token;
                case 4: return texts.error_code_missing_param_type;
                case 5: return texts.error_code_not_valid_type;
                case 6: return texts.error_code_params_validation_error;
                case 7: return texts.error_code_body_validation_error;
                case 8: return texts.error_code_empty_body;
                case 9: return texts.error_code_user_not_found;
                case 10: return texts.error_code_json_format_error;
                case 11: return texts.error_code_unexpected_request_error;
                default: throw texts.error_code_not_defined;
            }
        }else{
            return texts.empty_error_code;
        }
    }

    setupNewRequest(){
        //Resultat preparació execució
        this.resultType = Enums.REQUEST_ERRORS.NOT_EXECUTED;
        this.hasBody = false;
        this.hasQueryParams = false;
        this.validationBodyOk = false;
        this.validationQueryOk = false;

        //Objectes a enviar
        this.queryObject = {};
        this.bodyObject = {};

        //Resposta servidor
        this.errors = {};
        this.entity = {};
        this.message = "";
        this.resultOK = false;
        this.errorCode = undefined;
    }
}

module.exports = HTTPRequest;