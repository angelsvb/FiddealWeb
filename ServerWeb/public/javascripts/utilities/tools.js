let queries = require('css-element-queries');
let $ = require('jquery');
require('jquery/dist/jquery');
require('popper.js/dist/umd/popper');
require('bootstrap/dist/js/bootstrap');
require('cookieconsent');
let moment = require('moment');
let Handlebars = require('handlebars');
let texts = require('./texts');
let enums = require('./enums');
let Storage = require('../utilities/storage');
let http_client = require('../utilities/HTTPClient');
let RequestValidateToken = require('../requests/ValidateTokenRequest');
let ActivateUserRequest = require('../requests/ActivateUserRequest');
let ActivationMailRequest = require('../requests/ActivationMailRequest');
let CancelSignupRequest = require('../requests/CancelSignupRequest');
let LoginRequest = require('../requests/LoginRequest');
let ChangePasswordRequest = require('../requests/ChangePasswordRequest');
let SupportRequest = require('../requests/SupportRequest');
let AcceptPolicyRequest = require('../requests/AcceptPolicyRequest');
let InitScheduleRequest = require('../requests/InitScheduleRequest');
let validations = require('./validations');

exports.setSameHeight = function(idElement1,idElement2){
    let elem1 = $(idElement1);
    let elem2 = $(idElement2);
    if (elem1 && elem2){
        if (elem2.height() < elem1.height()) elem2.height(elem1.height());
        else if (elem1.height() < elem2.height()) elem1.height(elem2.height());

        new queries.ResizeSensor(elem1, function() {
            if (elem2.height() < elem1.height()) elem2.height(elem1.height());
            else if (elem1.height() < elem2.height()) elem1.height(elem2.height());
        });
        new queries.ResizeSensor(elem2, function() {
            if (elem2.height() < elem1.height()) elem2.height(elem1.height());
            else if (elem1.height() < elem2.height()) elem1.height(elem2.height());
        });
    }
};

exports.setSmallScroll = function(id, wrapper = undefined){
    if (!wrapper){
        $(id).niceScroll({
            cursorcolor:"#454545",
            cursorwidth:"1vw",
            cursorborder: "0px"
        });
    }else{
        $(id).niceScroll(wrapper, {
            cursorcolor:"#454545",
            cursorwidth:"1vw",
            cursorborder: "0px",
            bouncescroll: false
        });
    }

};

function setScroll(id){
    $(id).niceScroll({
        cursorcolor:"#454545",
        cursorwidth:"1vw",
        cursorborder: "0px"
    });
}
exports.setScroll = setScroll;

exports.setScrollWhite = function(id){
    $(id).niceScroll({
        cursorcolor:"#FCFCFC",
        cursorwidth:"12px",
        cursorborder: "0px"
    });
};

function showErrorDialog(message,fun = undefined){
    let warning = undefined;
    if (fun){
        warning = Handlebars.parseTemplate(Handlebars.templateKeys.warning,{
            title: texts.error_dialog_title,
            message: message,
            onAccept : 'onClick=\''+fun+'()\''
        });
    }else{
        warning = Handlebars.parseTemplate(Handlebars.templateKeys.warning,{
            title: texts.error_dialog_title,
            message: message
        });
    }
    if (warning) Handlebars.show(warning);
}
exports.showErrorDialog = showErrorDialog;

function showInformationDialog(message,fun = undefined){
    let information = undefined;
    if (fun){
        information = Handlebars.parseTemplate(Handlebars.templateKeys.information,{
            title: texts.information_dialog_title,
            message: message,
            onAccept : 'onClick=\''+fun+'()\''
        });
    }else{
        information = Handlebars.parseTemplate(Handlebars.templateKeys.information,{
            title: texts.information_dialog_title,
            message: message
        });
    }
    if (information) Handlebars.show(information);
};
exports.showInformationDialog = showInformationDialog;

function toHandlebarsFunction(fun){
    if (fun.name){
        return 'onClick=\''+getName(fun)+'()\''
    }else{
        throw texts.exception_anonimous_function;
    }
}
exports.toHandlebarsFunction = toHandlebarsFunction;

function getName(callback){
    let name=callback.toString();
    let reg=/function ([^\(]*)/;
    return reg.exec(name)[1];
}

exports.containsChar = function(value){
    let strValue = value.toString();
    if (!strValue) return false;
    else {
        let strWithCharRegex = /.*[a-zA-z].*/;
        return value.match(strWithCharRegex);
    }
};

exports.containsDigit = function(value){
    let strValue = value.toString();
    if (!strValue) return false;
    else {
        let strWithDigitRegex = /.*[0-9].*/;
        return value.match(strWithDigitRegex);
    }
};

function getViewValue(id){
    if (id.indexOf('#') > -1) {
        let input = $(id);
        if (input.tagName === "select"){
            return toNumber(input.val());
        }else{
            if (input[0].type !== 'checkbox') {
                if (input[0].type === "number") return toDecimal(input.val());
                else return input.val();
            }
            else return input.prop('checked');
        }
    }
    else {
        let input = $('#'+id);
        if (input.tagName === "select"){
            return toNumber(input.val());
        }else{
            if (input[0].type !== 'checkbox') {
                if (input[0].type === "number") return toDecimal(input.val());
                else return input.val();
            }
            else return input.prop('checked');
        }
    }
};
exports.getViewValue = getViewValue;

exports.fillBusinessType = function(id){
    let select = $(id);
    if (select){
        $.each(Object.getOwnPropertyNames(enums.BUSINESS_TYPE),function(){
            select.append(getOption(enums.BUSINESS_TYPE[this].id,enums.BUSINESS_TYPE[this].text))
        });
    }
};

function getOption(val,text){
    return $("<option />").val(val).text(text)
}
exports.getOption = getOption;

function toNumber(_number){ return parseInt(_number);}
exports.toNumber = toNumber;
function toDecimal(_number){ return parseFloat(_number);}
exports.toDecimal = toDecimal;

function validateCurrentUser(){
    let current_user = Storage.getUser();
    if (!current_user.IsActive){
        showUserActivationDialog()
    }else if (!current_user.PolicyAccepted){
        let policyAccepted = Handlebars.parseTemplate(Handlebars.templateKeys.terms_conditions_modified);
        if (policyAccepted) Handlebars.show(policyAccepted);
    }
    else if (!current_user.ScheduleInitialized){
        let scheduleInitialized = Handlebars.parseTemplate(Handlebars.templateKeys.initialize_horari,undefined,undefined,false);
        setScroll('#initialize_horari_content');
        if (scheduleInitialized) Handlebars.show(scheduleInitialized);
    }
}

exports.validateAuth = function(){
    if(Storage.getToken()) {
        let validation = new RequestValidateToken();
        validation.token = Storage.getToken();
        http_client.requestPUT(validation,(request) => {
            if (request.entity.ValidationOK){
                Storage.setUser(request.entity.User);
                Storage.setSessionToken(Storage.getToken());
                validateCurrentUser();
            } else
                showMissingTokenDialog();
        }, () => {
            showMissingTokenDialog();
        }, false);
        return true;
    }else {
        showMissingTokenDialog();
        return false;
    }
};

exports.validateAuthLogin = function(){
    if (Storage.getToken() && Storage.getSessionToken() && Storage.getUser()){
        window.location = "/html/facturacio.html"
    }else if(Storage.getToken()) {
        let validation = new RequestValidateToken();
        validation.token = Storage.getToken();
        http_client.requestPUT(validation,(request) => {
            if (request.entity.ValidationOK){
                Storage.setUser(request.entity.User);
                Storage.setSessionToken(Storage.getToken());
                window.location = "/html/facturacio.html"
            } else{
                Storage.clearStorage();
            }
        });
    }
};

exports.initializeTooltips = function(){
    $('[data-toggle="tooltip"]').tooltip({delay:{show:1500}});
};

exports.loadCountriesInformation = function loadCountriesInformation(selectPaisId,selectProvinciaId,countries,prefixId){
    let selector_pais = $(selectPaisId);
    selector_pais.empty();
    selector_pais.append($("<option />").val(0).text(texts.default_select_option));
    $.each(countries,function(){
        selector_pais.append(getOption(this._id,this.name));
    });
    selector_pais[0].onchange = function(){
        let index = this.selectedIndex;
        let selector_provincia = $(selectProvinciaId);
        if (index > 0){
            if (selector_pais.is(':enabled')){
                selector_provincia.prop('disabled', false);
            }
            selector_provincia.empty();
            selector_provincia.append($("<option />").val(0).text(texts.default_select_option));
            let current_country = countries[index-1];
            $.each(current_country.provincies,function(){
                selector_provincia.append(getOption(this._id,this.name));
            });
            selector_provincia.val(0);
            if (prefixId){
                if (current_country.prefix.toString().length === 2) $('#prefix').val('+0'+current_country.prefix);
                else $('#prefix').val('+'+current_country.prefix);
            }
        }else{
            selector_provincia.prop('disabled', true);
            selector_provincia.val(0);
            $('#prefix').val('+000');
        }
    }
};

window.redirectToIndex = function redirectToIndex() {
    window.location = "/index.html";
};

window.setLanguage = function(language){
    Storage.setLanguage(language);
    location.reload();
};

function showMissingTokenDialog(){
    Storage.clearStorage();
    showErrorDialog(texts.missing_auth_data,'redirectToIndex');
}
exports.showMissingTokenDialog = showMissingTokenDialog;

exports.commonInitializationBefore = function(page){
    if (!Storage.languageInitialized()) Storage.initializeLanguage();

    if (page) Handlebars.translatePage(page);

    let loading = undefined;
    let errorDialog = undefined;

    window.onerror = function myErrorHandler(errorMsg,url,line) {
        if (loading) Handlebars.hide(loading);
        errorDialog = Handlebars.parseTemplate(Handlebars.templateKeys.warning,{title: texts.error_dialog_title,message: errorMsg + ". Linia: "+line});
        if (errorDialog) Handlebars.show(errorDialog);
        return false;
    };

    window.changePasswordDialog = function(){
        let changePwd = Handlebars.parseTemplate(Handlebars.templateKeys.change_password,{executeChangePassword:toHandlebarsFunction(executeChangePassword)});
        if (changePwd) Handlebars.show(changePwd);
    };

    window.supportDialog = function(){
        let supportDialog = Handlebars.parseTemplate(Handlebars.templateKeys.support_dialog,{sendSupport: toHandlebarsFunction(sendSupportMail)});
        if (supportDialog) Handlebars.show(supportDialog);
    };

    window.closeSession = function(){
        let closeSession = Handlebars.parseTemplate(Handlebars.templateKeys.close_session,{title:texts.information_dialog_title,message:texts.confirm_close_session,onAccept:toHandlebarsFunction(performCloseSession)});
        if (closeSession){
            Handlebars.show(closeSession);
        }
    };

    window.performCloseSession = function performCloseSession(){
        Storage.clearStorage();
        window.location = "/index.html";
    };

    window.acceptPolicy = function acceptPolicy(){
        let requestAccept = new AcceptPolicyRequest();
        http_client.requestPUT(requestAccept,() => {
           let dialog = $('#' + Handlebars.templateKeys.terms_conditions_modified);
           if (dialog) Handlebars.hide(dialog);

           Storage.setUser(requestAccept.entity.User);
        });
    };

    const CATEGORY = "inputCategory";
    const CATEGORY_ERR = "inputCategory_err";
    const MESSAGE_ERR = "inputMessage_err";
    const MESSAGE = "inputMessage";
    const TOPIC = "inputTopic";
    const TOPIC_ERR = "inputTopic_err";

    window.sendSupportMail = function sendSupportMail(){
        let request = new SupportRequest();

        request.addBodyParam(SupportRequest.CATEGORY,CATEGORY,validations.notDefaultSelect,CATEGORY_ERR);
        request.addBodyParam(SupportRequest.MESSAGE,MESSAGE,validations.notEmpty,MESSAGE_ERR);
        request.addBodyParam(SupportRequest.TOPIC,TOPIC,validations.notEmpty,TOPIC_ERR);

        http_client.requestPOST(request,() => {
            let supportDialog = $('#'+Handlebars.templateKeys.support_dialog);
            if (supportDialog) Handlebars.hide(supportDialog);

            showInformationDialog(texts.support_message_sent);
        });
    };

    const PWD_CHNG = "pwd_change";
    const PWD_CHNG_ERR = "pwd_change_err";
    const PWD_CHNG_NEW = "pwd_change_new";
    const PWD_CHNG_NEW_ERR = "pwd_change_new_err";
    const PWD_CHNG_NEW_CONF = "pwd_change_new_confirm";
    const PWD_CHNG_NEW_CONF_ERR = "pwd_change_new_confirm_err";

    window.executeChangePassword = function executeChangePassword(){
        let request = new ChangePasswordRequest();
        request.email = Storage.getUser().Email;
        request.addBodyParam(ChangePasswordRequest.OLD_PASSWORD,PWD_CHNG,validations.notEmpty,PWD_CHNG_ERR);
        request.addBodyParam(ChangePasswordRequest.NEW_PASSWORD,PWD_CHNG_NEW,validations.validPassword,PWD_CHNG_NEW_ERR);
        request.addBodyParam(ChangePasswordRequest.CONFIRMATION_NEW_PASSWORD,PWD_CHNG_NEW_CONF,() => {
            let pwd = getViewValue(PWD_CHNG_NEW);
            let confirmPwd = getViewValue(PWD_CHNG_NEW_CONF);
            if (!confirmPwd) return validations.wrongValidation(texts.validation_empty_string);
            else if (pwd) {
                if (pwd === confirmPwd) return validations.validationOK();
                else return validations.wrongValidation(texts.validation_non_equal_confirmation);
            }
        },PWD_CHNG_NEW_CONF_ERR,true);
        request.email = Storage.getUser().Email;
        http_client.requestPUT(request,() => {
            let requestLogin = new LoginRequest();
            requestLogin.email = Storage.getUser().Email;
            requestLogin.password = request.bodyObject[ChangePasswordRequest.NEW_PASSWORD];
            requestLogin.showLoadingState = false;
            http_client.requestPOST(requestLogin,(req, data) => {
                Storage.setToken(data.Entity.Token);
                Storage.setSessionToken(data.Entity.Token);
            });
            let chng_dialog = $('#change_password');
            if (chng_dialog) Handlebars.hide(chng_dialog);
            showInformationDialog(texts.password_changed);
        });
    }
};

function initializeCookies(){
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "rgba(57, 57, 57, 0.95)"
            },
            "button": {
                "background": "#4CAF50",
                "border":"solid 3px #fff"
            }
        },
        "showLink": false,
        "content": {
            "message": texts.cookies_message,
            "dismiss": texts.cookies_accept
        }
    });
};

exports.initializeCookies = initializeCookies;

exports.commonInitializationAfter = function(context){
    Handlebars.loadFooter(Handlebars.templateKeys.footer);
    Handlebars.loadHeader(Handlebars.templateKeys.header,'content_container',context);

    initializeCookies();

    if (context && context.current) document.title = texts.appname + " - " + context.current;
    else document.title = texts.appname;

    setScroll("body");
    setScroll('#hamburgerMenu');
};

var ACTIVATE_CODE = "activation_code";
var ACTIVATE_CODE_ERR = "activation_code_error";

window.showUserActivationDialog = function(){
    let warning = $('#warning');
    if (warning.length) Handlebars.hide(warning);

    let activateAccount = Handlebars.parseTemplate(Handlebars.templateKeys.activate_account,{sendAgain: toHandlebarsFunction(sendActivationMail), activateAccount: toHandlebarsFunction(activateUserAccount), cancelSignup: toHandlebarsFunction(cancelUserSignup)});
    if (activateAccount) Handlebars.show(activateAccount);
    $('#activation_code').prop('disabled', false);
    let information = Handlebars.parseTemplate(Handlebars.templateKeys.information,{message: texts.user_not_active});
    if (information) Handlebars.show(information);
};

window.sendActivationMail = function sendActivationMail(){
    let sendMail = new ActivationMailRequest();
    sendMail.mail = Storage.getUser().Email;
    http_client.requestGET(sendMail,showInfoEmailSent);
};

window.showInfoEmailSent = function(){
    showInformationDialog(texts.user_credentials_activate_mail_sent)
};

window.activateUserAccount = function activateUserAccount(){
    let activateRequest = new ActivateUserRequest();
    activateRequest.addBodyParam(ActivateUserRequest.CODE,ACTIVATE_CODE,validations.validRecoveryCode,ACTIVATE_CODE_ERR);
    http_client.requestPUT(activateRequest,() => {
        let dialog = $('#'+Handlebars.templateKeys.activate_account);
        if (dialog) Handlebars.hide(dialog);
        let current_user = Storage.getUser();
        current_user.IsActive = true;
        Storage.setUser(current_user);
        if (!current_user.PolicyAccepted){
            let policyAccepted = Handlebars.parseTemplate(Handlebars.templateKeys.terms_conditions_modified);
            if (policyAccepted) Handlebars.show(policyAccepted);
    }});
};

window.cancelUserSignup = function cancelUserSignup(){
    let cancelSignup = new CancelSignupRequest();
    cancelSignup.mail = Storage.getUser().Email;
    http_client.requestDELETE(cancelSignup,showInfoSignupCanceled);
};

function showInfoSignupCanceled(){
    if (activateAccount) Handlebars.hide(activateAccount);
    showInformationDialog(texts.user_credentials_activate_mail_sent)
}

window.reloadPage = function reloadPage() {location.reload();};

window.showUserMissingDataWarning = function(){
    let errorDialog = Handlebars.parseTemplate(Handlebars.templateKeys.warning,{message: texts.error_getting_user_data,onAccept: toHandlebarsFunction(reloadPage)});
    if (errorDialog) Handlebars.show(errorDialog);
};

window.disableScheduleInputs_closed = function disableScheduleInputs_closed(id) {
    if ($('#'+id+'_closed').is(':checked')){
        $('#' + id + '_1').val("").prop('disabled', true);
        $('#' + id + '_2').val("").prop('disabled', true);
        $('#' + id + '_3').val("").prop('disabled', true);
        $('#' + id + '_4').val("").prop('disabled', true);
        $('#' + id + '_24h').prop('checked', false);
    }else{
        $('#' + id + '_1').prop('disabled', false);
        $('#' + id + '_2').prop('disabled', false);
        $('#' + id + '_3').prop('disabled', false);
        $('#' + id + '_4').prop('disabled', false);
    }
};

window.disableScheduleInputs_24h = function disableScheduleInputs_24h(id){
    if ($('#'+id+'_24h').is(':checked')){
        $('#' + id + '_1').val("").prop('disabled', true);
        $('#' + id + '_2').val("").prop('disabled', true);
        $('#' + id + '_3').val("").prop('disabled', true);
        $('#' + id + '_4').val("").prop('disabled', true);
        $('#' + id + '_closed').prop('checked', false)
    }else{
        $('#' + id + '_1').prop('disabled', false);
        $('#' + id + '_2').prop('disabled', false);
        $('#' + id + '_3').prop('disabled', false);
        $('#' + id + '_4').prop('disabled', false);
    }
};

window.switchFloatingButtons = function(){
    if ($('#main_button').hasClass('clicked')) {
        $('#main_button').removeClass('clicked');
    }
    else {
        $('#main_button').addClass('clicked');
    }
};

exports.switchEditMode = function switchEditMode(editing = true){
    if (editing){
        $('.button_secondary_second.edit').addClass('hidden');
        $('.button_secondary_second.confirm_edit').removeClass('hidden');

        $('.button_secondary_third.delete').addClass('hidden');
        $('.button_secondary_third.discard_edit').removeClass('hidden');
    }else{
        $('.button_secondary_second.edit').removeClass('hidden');
        $('.button_secondary_second.confirm_edit').addClass('hidden');

        $('.button_secondary_third.delete').removeClass('hidden');
        $('.button_secondary_third.discard_edit').addClass('hidden');
    }
};

window.showCenteredActions = function(){
    $('#empty_grid').removeClass('hidden');
};

window.allDaysClosed = function allDaysClosed(){
    return $('#monday_closed').is(":checked") && $('#tuesday_closed').is(":checked") && $('#thursday_closed').is(":checked")
        && $('#wednesday_closed').is(":checked") && $('#friday_closed').is(":checked") && $('#saturday_closed').is(":checked")
        && $('#sunday_closed').is(":checked");
};

window.initializeHorari = function initializeHorari(){
    if (allDaysClosed()) {
        showInformationDialog(texts.schedule_cant_close_allways);
        return;
    }

    let request = new InitScheduleRequest();
    request.openingDays = parseOpeningDays();
    if (request.openingDays){
        http_client.requestPOST(request,() => {
            let dialogSchedule = $('#'+ Handlebars.templateKeys.initialize_horari);
            if (dialogSchedule) Handlebars.hide(dialogSchedule);
            Storage.setUser(request.entity.User);
        });
        console.log(JSON.stringify(request.bodyObject));
    }
};

window.parseOpeningDays = function parseOpeningDays(){
    let oRes = [];
    let validationOK = true;
    let monday = parseDay('monday',1);
    if (!monday) validationOK = false;
    else oRes.push(monday);

    let tuesday = parseDay('tuesday',2);
    if (!tuesday) validationOK = false;
    else oRes.push(tuesday);

    let wednesday = parseDay('wednesday',3);
    if (!wednesday) validationOK = false;
    else oRes.push(wednesday);

    let thursday = parseDay('thursday',4);
    if (!thursday) validationOK = false;
    else oRes.push(thursday);

    let friday = parseDay('friday',5);
    if (!friday) validationOK = false;
    else oRes.push(friday);

    let saturday = parseDay('saturday',6);
    if (!saturday) validationOK = false;
    else oRes.push(saturday);

    let sunday = parseDay('sunday',7);
    if (!sunday) validationOK = false;
    else oRes.push(sunday);

    if (validationOK) return oRes;
    else return undefined;
};

window.parseDay = function parseDay(day,dayIndex){
    disableInputError('#'+day+'_1_error');
    disableInputError('#'+day+'_2_error');
    disableInputError('#'+day+'_3_error');
    disableInputError('#'+day+'_4_error');

    let closedAllDay = getViewValue('#'+day+'_closed');
    let openedAllDay = getViewValue('#'+day+'_24h');
    if (closedAllDay || openedAllDay){
        if (closedAllDay) return {dayNumber : dayIndex, closed:true};
        else return {dayNumber: dayIndex, allDay:true};
    }else{
        let r1 = validateRange1(day);
        if (r1 && r1.validationOK){
            let r2 = validateRange2(day,r1.data);
            let oRes = {dayNumber:dayIndex};
            oRes.openingHours = [];
            oRes.openingHours.push(r1.data);
            if (r2){
                if (r2.validationOK){
                    oRes.openingHours.push(r2.data);
                    return oRes;
                }else return undefined;
            }else return oRes;
        }else return undefined;
    }
};

window.validateRange1 = function validateRange1(day){
    let ini = getViewValue('#'+day+'_1');
    let fi = getViewValue('#'+day+'_2');
    if (!ini || !fi){
        if (!ini) setInputError('#'+day+'_1_error',texts.validation_empty_string);
        if (!fi) setInputError('#'+day+'_2_error',texts.validation_empty_string);
        return {validationOK : false}
    }else{
        let int_ini = toIntTime(ini);
        let int_fi = toIntTime(fi);
        if (int_ini >= int_fi){
            setInputError('#'+day+'_2_error',texts.validation_too_small);
            return {validationOK : false}
        }else {
            return {validationOK: true,data:{start:int_ini,end:int_fi}}
        }
    }
};

window.validateRange2 = function validateRange1(day,range1){
    let ini = getViewValue('#'+day+'_3');
    let fi = getViewValue('#'+day+'_4');
    if (!ini && !fi) return undefined;
    else if ((ini && !fi) || (fi && !ini)) {
        if (!ini) setInputError('#'+day+'_3_error',texts.validation_empty_string);
        if (!fi) setInputError('#'+day+'_4_error',texts.validation_empty_string);
        return {validationOK : false}
    }else{
        let int_ini = toIntTime(ini);
        let int_fi = toIntTime(fi);
        if ((range1 && range1.end >= int_ini) || int_ini >= int_fi){
            if (range1 && range1.end >= int_ini){
                setInputError('#'+day+'_3_error',texts.validation_too_small);
            }
            if (int_ini >= int_fi){
                setInputError('#'+day+'_4_error',texts.validation_too_small);
            }
            return {validationOK : false}
        }
        else{
            return {validationOK: true,data:{start:int_ini,end:int_fi}}
        }
    }
};

function setInputError(id,message){
    if (id.indexOf('#') > - 1) $(id).show().text(message);
    else $('#'+id).show().text(message);
}
exports.setInputError = setInputError;

function disableInputError(id){
    if (id.indexOf('#') > - 1) $(id).hide();
    else $('#'+id).hide();
}
exports.disableInputError = disableInputError;

function toIntTime(value){
    let a = value.split(':'); // split it at the colons
    return (+a[0]) * 60 + (+a[1]);
}
exports.toIntTime = toIntTime;

exports.unifyDateFormat = function(strDate, withoutTime = false){
    if (!withoutTime) return moment(strDate).format('DD/MM/YYYY HH:mm');
    else return moment(strDate).format('DD/MM/YYYY');
};

exports.toInputDate = function(strDate){
    return moment(strDate).format("YYYY-MM-DD");
};

exports.optionKeys = {
    categories: "categories",
    compres: "compres",
    compres_manuals : "compres_manuals",
    facturacio: "facturacio",
    horari: "horari",
    index: "index",
    ofertes: "ofertes",
    perfil: "perfil",
    politica_privacidad: "politica_privacidad",
    productes: "productes",
    terminos_condiciones: "terminos_condiciones"
};