let texts = require('./texts.js');
let enums = require('./enums');
let $ = require('jquery');
let Handlebars = require('handlebars');
let Tools = require('./tools');

function isEmptyObject(obj){
    for (let prop in obj){
        if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
}

exports.requestGET = function requestGET(_request,onSuccess,onError, async = true){
    if (_request.showLoading()) showLoading();

    _request.setupNewRequest();

    let errorMessage = validateRequest(_request);
    if (!errorMessage) {
        let queryObject = undefined;
        try{
            queryObject = _request.getQueryObject();

            _request.queryObject = queryObject;
        }catch (err){
            _request.resultType = enums.REQUEST_ERRORS.ERROR_PARSING_VALUES;
            if (_request.showLoading()) hideLoading();
            showErrorDialog(texts.request_error_parsing_values + " - " + err.message);
            return;
        }
        if (_request.resultType === enums.REQUEST_ERRORS.NOT_EXECUTED){
            try{
                if (_request.validationQueryOk){
                    let url = _request.baseURL()+_request.getPath();
                    if (_request.queryObject && !isEmptyObject(_request.queryObject)) url = url+'?'+$.param(queryObject);
                    $.ajax({
                        type:'GET',
                        crossDomain : true,
                        url:url,
                        async:async ,
                        success : onSuccessGeneric(onSuccess,onError,_request),
                        error : onErrorGeneric(onError,_request),
                        timeout: _request.timeout(),
                        dataType: "json",
                    });
                }else {
                    if (_request.showLoading()) hideLoading();
                    _request.resultType = enums.REQUEST_ERRORS.WRONG_VALIDATION;
                }
            }catch (err){
                _request.resultType = enums.REQUEST_ERRORS.ERROR_EXECUTING_REQUEST;
                if (_request.showLoading()) hideLoading();
                showErrorDialog(texts.request_error_executing_request + " - " + err.message);
            }
        }else{
            if (_request.showLoading()) hideLoading();
            Tools.showMissingTokenDialog();
        }
    }else {
        if (_request.showLoading()) hideLoading();
        _request.resultType = enums.REQUEST_ERRORS.WRONG_REQUEST_CONFIG;
        showErrorDialog(errorMessage);
    }
};

exports.requestPOST = function requestPOST(_request,onSuccess,onError, async){
    if (_request.showLoading()) showLoading();

    _request.setupNewRequest();

    let errorMessage = validateRequest(_request);
    if (!errorMessage) {
        let queryObject = undefined;
        let bodyObject = undefined;
        try{
            queryObject = _request.getQueryObject();
            bodyObject = _request.getBodyObject();

            _request.queryObject = queryObject;
            _request.bodyObject = bodyObject;
        }catch (err){
            _request.resultType = enums.REQUEST_ERRORS.ERROR_PARSING_VALUES;
            if (_request.showLoading()) hideLoading();
            showErrorDialog(texts.request_error_parsing_values + " - " + err.message);
            return;
        }

        if (_request.resultType === enums.REQUEST_ERRORS.NOT_EXECUTED){
            try{
                if (_request.validationQueryOk && _request.validationBodyOk){
                    let url = _request.baseURL()+_request.getPath();
                    if (_request.queryObject && !isEmptyObject(_request.queryObject)) url = url+'?'+$.param(queryObject);
                    $.ajax({
                        type:'POST',
                        crossDomain : true,
                        url:url,
                        async: async,
                        dataType: 'json',
                        success : onSuccessGeneric(onSuccess,onError,_request),
                        error : onErrorGeneric(onError,_request),
                        data: JSON.stringify(bodyObject),
                        timeout: _request.timeout(),
                        contentType: 'text/plain'
                    });
                }else{
                    if (_request.showLoading()) hideLoading();
                    _request.resultType = enums.REQUEST_ERRORS.WRONG_VALIDATION;
                }
            }catch (err){
                _request.resultType = enums.REQUEST_ERRORS.ERROR_EXECUTING_REQUEST;
                if (_request.showLoading()) hideLoading();
                showErrorDialog(texts.request_error_executing_request + " - " + err.message);
            }
        }else{
            if (_request.showLoading()) hideLoading();
            Tools.showMissingTokenDialog();
        }
    }else {
        if (_request.showLoading()) hideLoading();
        _request.resultType = enums.REQUEST_ERRORS.WRONG_REQUEST_CONFIG;
        showErrorDialog(errorMessage);
    }
};

exports.requestPUT = function requestPUT(_request,onSuccess,onError, async){
    if (_request.showLoading()) showLoading();

    _request.setupNewRequest();

    let errorMessage = validateRequest(_request);
    if (!errorMessage) {
        let queryObject =undefined;
        let bodyObject = undefined;

        try{
            queryObject = _request.getQueryObject();
            bodyObject = _request.getBodyObject();

            _request.queryObject = queryObject;
            _request.bodyObject = bodyObject;
        }catch(err){
            _request.resultType = enums.REQUEST_ERRORS.ERROR_PARSING_VALUES;
            if (_request.showLoading()) hideLoading();
            showErrorDialog(texts.request_error_parsing_values + " - " + err.message);
            return;
        }

        if (_request.resultType === enums.REQUEST_ERRORS.NOT_EXECUTED){
            try{
                if (_request.validationQueryOk && _request.validationBodyOk){
                    let url = _request.baseURL()+_request.getPath();
                    if (_request.queryObject && !isEmptyObject(_request.queryObject)) url = url+'?'+$.param(queryObject);
                    $.ajax({
                        type:'PUT',
                        crossDomain: true,
                        url:url,
                        async: async,
                        dataType: 'json',
                        success : onSuccessGeneric(onSuccess,onError,_request),
                        error : onErrorGeneric(onError,_request),
                        data: JSON.stringify(bodyObject),
                        timeout: _request.timeout(),
                        contentType: 'text/plain'
                    });
                }else{
                    if (_request.showLoading()) hideLoading();
                    _request.resultType = enums.REQUEST_ERRORS.WRONG_VALIDATION;
                }
            }catch(err){
                _request.resultType = enums.REQUEST_ERRORS.ERROR_EXECUTING_REQUEST;
                if (_request.showLoading()) hideLoading();
                showErrorDialog(texts.request_error_executing_request + " - " + err.message);
            }
        }else{
            if (_request.showLoading()) hideLoading();
            Tools.showMissingTokenDialog();
        }
    }else {
        if (_request.showLoading()) hideLoading();
        _request.resultType = enums.REQUEST_ERRORS.WRONG_REQUEST_CONFIG;
        showErrorDialog(errorMessage);
    }
};

exports.requestDELETE = function requestDELETE(_request,onSuccess,onError, async){
    if (_request.showLoading()) showLoading();

    _request.setupNewRequest();

    let errorMessage = validateRequest(_request);
    if (!errorMessage) {
        let queryObject = undefined;
        let bodyObject = undefined;

        try{
            queryObject = _request.getQueryObject();
            bodyObject = _request.getBodyObject();

            _request.queryObject = queryObject;
            _request.bodyObject = bodyObject;
        }catch(err){
            _request.resultType = enums.REQUEST_ERRORS.ERROR_PARSING_VALUES;
            if (_request.showLoading()) hideLoading();
            showErrorDialog(texts.request_error_parsing_values + " - " + err.message);
            return;
        }

        if (_request.resultType === enums.REQUEST_ERRORS.NOT_EXECUTED){
            try{
                if (_request.validationQueryOk && _request.validationBodyOk){
                    let url = _request.baseURL()+_request.getPath();
                    if (_request.queryObject && !isEmptyObject(_request.queryObject)) url = url+'?'+$.param(queryObject);
                    $.ajax({
                        type:'DELETE',
                        crossDomain : true,
                        url:url,
                        dataType: 'json',
                        async: async,
                        success : onSuccessGeneric(onSuccess,onError,_request),
                        error : onErrorGeneric(onError,_request),
                        data: JSON.stringify(bodyObject),
                        timeout: _request.timeout(),
                        contentType: 'text/plain'
                    });
                }else{
                    if (_request.showLoading()) hideLoading();
                    _request.resultType = enums.REQUEST_ERRORS.WRONG_VALIDATION;
                }
            }catch(err){
                _request.resultType = enums.REQUEST_ERRORS.ERROR_EXECUTING_REQUEST;
                if (_request.showLoading()) hideLoading();
                showErrorDialog(texts.request_error_executing_request + " - " + err.message);
            }
        }else{
            if (_request.showLoading()) hideLoading();
            Tools.showMissingTokenDialog();
        }
    }else {
        if (_request.showLoading()) hideLoading();
        _request.resultType = enums.REQUEST_ERRORS.WRONG_REQUEST_CONFIG;
        showErrorDialog(errorMessage);
    }
};

function validateRequest(_request){
    if (!_request.getPath()){
        return texts.request_error_missing_path;
    }else if (!_request.baseURL()){
        return texts.request_error_missing_base_url;
    }
    else if (_request.timeout() < 5000){
        return texts.request_error_invalid_timeout;
    }
    else return undefined;
}

function onSuccessGeneric(_onSuccess,_onError,_request){
    return function(data){
        try{
            _request.resultOK = data.ResultOK;
            _request.message = data.Message;
            _request.errorCode = data.ErrorCode;
            _request.errors = data.Errors;
            _request.entity = data.Entity;

            if (_request.parseCustomResponse){
                _request.parseCustomResponse(data);
            }

            if (_request.resultOK){
                if (_request.showMessageOnRequestCompleted()) showInformationDialog(_request.successMessage(),_request.successTitle());
                if (_onSuccess) _onSuccess(_request,data);
            }else{
                if (_request.errors) {
                    let settedAlmostOneError = _request.setInputsErrorResponse();
                    if (!settedAlmostOneError) showErrorDialog(texts.errors_not_assigned);
                }else{
                    if (_request.showErrorOnRequestCompleted()) {
                        if (_request.getErrorCodeText) {
                            if (_request.errorCode !== 3) showErrorDialog(_request.getErrorCodeText(_request.errorCode));
                            else{
                                Tools.showMissingTokenDialog();
                            }
                        }
                        else showErrorDialog(texts.request_errorcode_not_treated);
                    }
                }
                if (_onError) _onError();
            }
            if (_request.showLoading()) hideLoading();
        }catch(err){
            if (_request.showLoading()) hideLoading();
            throw err;
        }
    }
}

function onErrorGeneric(_onError,_request){
    return function(xhr, ajaxOptions, thrownError){
        try{
            if (_request.showErrorOnRequestCompleted()){
                switch (xhr.readyState){
                    case 0:
                        showErrorDialog(texts.request_error_connection);
                        break;
                    case 3:
                        showErrorDialog(texts.request_error_redirectioning);
                        break;
                    case 4:
                        showErrorDialog(texts.request_error_client_http);
                        break;
                    default:
                        showErrorDialog(texts.request_error_unexpected);
                        break;
                }
            }
            if (_onError) _onError(xhr, ajaxOptions, thrownError);
            if (_request.showLoading()) hideLoading();
        }catch(err){
            if (_request.showLoading()) hideLoading();
            throw err;
        }
    }
}

function hideLoading(){
    let loading = $('#loading');
    if (loading.length) Handlebars.hide(loading);
}

function showLoading(){
    let loading = $('#loading');
    if (loading.length) Handlebars.show(loading);
    else{
        loading = Handlebars.parseTemplate("loading");
        if (loading) Handlebars.show(loading);
    }
}

function showErrorDialog(message){
    let warning = Handlebars.parseTemplate("warning",{
        title: texts.error_dialog_title,
        message: message
    });
    if (warning) Handlebars.show(warning);
}

function showInformationDialog(message,title = texts.information_dialog_title){
    let information = Handlebars.parseTemplate('information',{
        title: title,
        message : message
    });
    if (information) Handlebars.show(information);
}