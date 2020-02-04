let $ = require('jquery');
require('./utilities/templates');
require('jquery.nicescroll');

let http_client = require('./utilities/HTTPClient');
let Handlebars = require('handlebars');
let Tools = require('./utilities/tools');
let LoginRequest = require('./requests/LoginRequest');
let RecoveryMailRequest = require('./requests/RecoveryMailRequest');
let RecoveryPasswordRequest = require('./requests/RecoveryPasswordRequest');
let ActivateUserRequest = require('./requests/ActivateUserRequest');
let ActivationMailRequest = require('./requests/ActivationMailRequest');
let CancelSignupRequest = require('./requests/CancelSignupRequest');
let PaisosRequest = require('./requests/PaisosRequest');
let SignupRequest = require('./requests/SignupRequest');
let texts = require('./utilities/texts');
let validations = require('./utilities/validations');
let Storage = require('./utilities/storage');

let loading = undefined;
let errorDialog = undefined;
let recoveryPassword = undefined;
let activateAccount = undefined;
let recoveryNewPassword = undefined;

let recoverySent = false;
let recoveryMail = undefined;

let countries = new PaisosRequest();
let signupLoadedCountries = false;

const LOGIN_PWD = "login_password";
const LOGIN_EMAIL = "login_email";
const LOGIN_PWD_ERR= "login_password_error";
const LOGIN_EMAIL_ERR = "login_email_error";

const RECOVERY_MAIL = "recovery_mail";
const RECOVERY_MAIL_ERR = "recovery_mail_error";

const RECOVERY_CODE = "input_recovery_code";
const RECOVERY_CODE_ERR = "error_recovery_code";
const RECOVERY_PWD = "input_new_password";
const RECOVERY_PWD_ERR = "error_new_password";
const CONFIRM_RECOVERY_PWD = "input_confirm_password";
const CONFIRM_RECOVERY_PWD_ERR  = "error_confirm_password";
const ACTIVATE_CODE = "activation_code";
const ACTIVATE_CODE_ERR = "activation_code_error";

let loginRequest = undefined;
let activateRequest = undefined;

window.onerror = function myErrorHandler(errorMsg,url,line) {
    if (loading) Handlebars.hide(loading);
    errorDialog = Handlebars.parseTemplate(Handlebars.templateKeys.warning,{title: texts.error_dialog_title,message: errorMsg + ". "  + texts.error_line + ": "+line});
    if (errorDialog) Handlebars.show(errorDialog);
    return false;
};

window.executeLogin = function executeLogin(){
    loginRequest = new LoginRequest();
    loginRequest.addBodyParam(LoginRequest.EMAIL,LOGIN_EMAIL,validations.validMail,LOGIN_EMAIL_ERR);
    loginRequest.addBodyParam(LoginRequest.PASSWORD,LOGIN_PWD,validations.notEmpty,LOGIN_PWD_ERR);
    http_client.requestPOST(loginRequest,onLoginSuccess);
    return false;
};

function onLoginSuccess(_request){
    if (_request.resultOK){
        if (_request.entity.Exists){
            if (_request.entity.IsActive) goToMain();
            else Tools.showErrorDialog(texts.user_not_active,"showUserActivationDialog")
        }else Tools.showErrorDialog(texts.invalid_login_credentials);
    }
}

function goToMain(){
    if (activateAccount) Handlebars.hide(activateAccount);
    if (loginRequest && loginRequest.entity && loginRequest.entity.Exists && loginRequest.entity.IsActive){
        Storage.setToken(loginRequest.entity.Token);
        Storage.setSessionToken(loginRequest.entity.Token);
        Storage.setUser(loginRequest.entity.User);
    }else{
        Storage.setToken(activateRequest.entity.Token);
        Storage.setSessionToken(activateRequest.entity.Token);
        Storage.setUser(activateRequest.entity.User);
    }
    window.location = "/html/facturacio.html";
}

window.initializeBefore = function(){
    http_client.requestGET(countries);
};

window.onRecoveryMailSuccess = function(_request){
    recoverySent = true;
    recoveryMail = _request.queryObject[RecoveryPasswordRequest.EMAIL];
    if (recoveryPassword) Handlebars.hide(recoveryPassword);
    if (!recoveryNewPassword){
        recoveryNewPassword = Handlebars.parseTemplate(Handlebars.templateKeys.recovery_password,{onSubmit: Tools.toHandlebarsFunction(setNewPassword)});
        if (recoveryNewPassword) Handlebars.show(recoveryNewPassword);
    }else Handlebars.show(recoveryNewPassword);
    Tools.showInformationDialog(texts.user_credentials_recovery_sent);
};

window.showUserActivationDialog = function(){
    let warning = $('#' + Handlebars.templateKeys.warning);
    if (warning.length) Handlebars.hide(warning);
    if (activateAccount) Handlebars.show(activateAccount);
    else {
        activateAccount = Handlebars.parseTemplate(Handlebars.templateKeys.activate_account,{sendAgain: Tools.toHandlebarsFunction(sendActivationMail), activateAccount: Tools.toHandlebarsFunction(activateUserAccount), cancelSignup: Tools.toHandlebarsFunction(cancelUserSignup)});
        if (activateAccount) Handlebars.show(activateAccount);
    }
};

window.sendActivationMail = function sendActivationMail(){
    let sendMail = new ActivationMailRequest();
    sendMail.addQueryParam(ActivationMailRequest.EMAIL,LOGIN_EMAIL,validations.validMail,LOGIN_EMAIL_ERR);
    http_client.requestGET(sendMail,showInfoEmailSent);
};

window.showInfoEmailSent = function(){
    Tools.showInformationDialog(texts.user_credentials_activate_mail_sent)
};

window.activateUserAccount = function activateUserAccount(){
    activateRequest = new ActivateUserRequest();
    activateRequest.addQueryParam(ActivateUserRequest.EMAIL,LOGIN_EMAIL,validations.validMail,LOGIN_EMAIL_ERR);
    activateRequest.addBodyParam(ActivateUserRequest.PWD,LOGIN_PWD,validations.notEmpty,LOGIN_PWD_ERR);
    activateRequest.addBodyParam(ActivateUserRequest.CODE,ACTIVATE_CODE,validations.validRecoveryCode,ACTIVATE_CODE_ERR);
    http_client.requestPUT(activateRequest,goToMain)
};

window.cancelUserSignup = function cancelUserSignup(){
    let cancelSignup = new CancelSignupRequest();
    cancelSignup.addQueryParam(CancelSignupRequest.EMAIL,LOGIN_EMAIL,validations.validMail,LOGIN_EMAIL_ERR);
    http_client.requestDELETE(cancelSignup,showInfoSignupCanceled);
};

function showInfoSignupCanceled(){
    if (activateAccount) Handlebars.hide(activateAccount);
    Tools.showInformationDialog(texts.user_credentials_user_deleted)
}

window.initializeAfter = function(){
    Handlebars.translatePage("index");
    Handlebars.loadFooter('footer');

    Tools.initializeCookies();

    Tools.setScroll('body');
    Tools.setSmallScroll('.modal-body');

    Tools.setSameHeight('#contentSignin','#contentSignup');
    Tools.setSameHeight('#signin_inputs','#signup_message');

    Tools.fillBusinessType('#inputBusinessType');
    Tools.initializeTooltips();

    Tools.validateAuthLogin();
};

window.showRecoveryDialog = function(){
    if (!recoverySent){
        if (!recoveryPassword){
            recoveryPassword = Handlebars.parseTemplate(Handlebars.templateKeys.request_recovery_password,{sendRecoveryMail: Tools.toHandlebarsFunction(sendRecoveryMail)});
            if (recoveryPassword) Handlebars.show(recoveryPassword);
        }else Handlebars.show(recoveryPassword);
    }else{
        if (!recoveryNewPassword){
            recoveryNewPassword = Handlebars.parseTemplate(Handlebars.templateKeys.recovery_password,{setNewPassword: setNewPassword});
            if (recoveryNewPassword) Handlebars.show(recoveryNewPassword);
        }else Handlebars.show(recoveryNewPassword);
    }
};

window.setNewPassword = function setNewPassword(){
    let recoveryRequest = new RecoveryPasswordRequest();
    recoveryRequest.addBodyParam(RecoveryPasswordRequest.CODE,RECOVERY_CODE,validations.validRecoveryCode,RECOVERY_CODE_ERR);
    recoveryRequest.addBodyParam(RecoveryPasswordRequest.NEW_PASSWORD,RECOVERY_PWD,validations.validPassword,RECOVERY_PWD_ERR);
    recoveryRequest.addBodyParam(RecoveryPasswordRequest.CONFIRMATION_NEW_PASSWORD,CONFIRM_RECOVERY_PWD,() => {
        let pwd = Tools.getViewValue(RECOVERY_PWD);
        let confirmPwd = Tools.getViewValue(CONFIRM_RECOVERY_PWD);
        if (!confirmPwd) return validations.wrongValidation(texts.validation_empty_string);
        else if (pwd) {
            if (pwd === confirmPwd) return validations.validationOK();
            else return validations.wrongValidation(texts.validation_non_equal_confirmation);
        }
    },CONFIRM_RECOVERY_PWD_ERR,true);
    recoveryRequest.email = recoveryMail;
    http_client.requestPOST(recoveryRequest,onNewPasswordSuccess);
};

window.onNewPasswordSuccess = function(){
    if (recoveryNewPassword) Handlebars.hide(recoveryNewPassword);
    Tools.showInformationDialog(texts.user_credentials_recovery_success);
};

window.hideRecoveryNewPassword = function(){
    if (recoveryPassword) Handlebars.hide(recoveryPassword);
};

window.sendRecoveryMail = function sendRecoveryMail(){
    let passwordRequest = new RecoveryMailRequest();
    passwordRequest.addQueryParam(RecoveryMailRequest.EMAIL,RECOVERY_MAIL,validations.validMail,RECOVERY_MAIL_ERR);
    http_client.requestGET(passwordRequest,onRecoveryMailSuccess);
};

window.hideRecoveryDialog = function hideRecoveryDialog(){
    if (recoveryPassword) Handlebars.hide(recoveryPassword);
};

window.showSignupDialog = function(){
    if (!signupLoadedCountries) {
        Tools.loadCountriesInformation("#inputState","#inputProvincia",countries.entity.countries,"#prefix");
        signupLoadedCountries = true;
    }
    $('#modal_registrar').show();
    $('body').getNiceScroll().hide();
};

window.hideSignupDialog = function() {
    $('#modal_registrar').hide();
    $('body').getNiceScroll().show();
    $('.invalid-tooltip').hide();
};

window.executeSignup = function(){
    let signup = new SignupRequest();
    signup.addBodyParam(SignupRequest.EMAIL, EMAIL_INPUT, validations.validMail, EMAIL_ERR);
    signup.addBodyParam(SignupRequest.NAME, NAME_INPUT, validations.notEmpty, NAME_ERR);
    signup.addBodyParam(SignupRequest.CIF, CIF_INPUT, validations.validCIF, CIF_ERR);
    signup.addBodyParam(SignupRequest.PASSWORD, PWD_INPUT, validations.validPassword, PWD_ERR);
    signup.addBodyParam(SignupRequest.CONFIRMATION_PWD, CONFIRM_PWD_INPUT, () => {
        let pwd = Tools.getViewValue(PWD_INPUT);
        let confirmPwd = Tools.getViewValue(CONFIRM_PWD_INPUT);
        if (!confirmPwd) return validations.wrongValidation(texts.validation_empty_string);
        else if (pwd) {
            if (pwd === confirmPwd) return validations.validationOK();
            else return validations.wrongValidation(texts.validation_non_equal_confirmation);
        }
    }, CONFIRM_PWD_ERR, true);
    signup.addBodyParam(SignupRequest.PHONE, PHONE_INPUT, validations.validPhone, PHONE_ERR);
    signup.addBodyParam(SignupRequest.WEB, WEB_INPUT);
    signup.addBodyParam(SignupRequest.TypeBusiness, BUSSINES_TYPE_INPUT,validations.notDefaultSelect,BUSINESS_TYPE_ERR);
    signup.addBodyParam(SignupRequest.COUNTRY,COUNTRY_INPUT, validations.notDefaultSelect,COUNTRY_ERR);
    signup.addBodyParam(SignupRequest.PROVINCIA,PROVINCIA_INPUT,validations.notDefaultSelect,PROVINCIA_ERR);
    signup.addBodyParam(SignupRequest.MUNICIPI,MUNICIPI_INPUT,validations.notEmptyText,MUNICIPI_ERR);
    signup.addBodyParam(SignupRequest.CP,CP_INPUT,validations.validCP,CP_ERR);
    signup.addBodyParam(SignupRequest.ADDRESS,ADDRESS_INPUT,validations.notEmpty,ADDRESS_ERR);
    signup.addBodyParam(SignupRequest.DESCRIPTION,DESCRIPTION_INPUT,validations.notEmpty,DESCRIPTION_ERR);
    signup.addBodyParam(SignupRequest.POLICY,POLICY_CHECK,validations.trueBoolean,POLICY_ERR);
    http_client.requestPOST(signup,(request) => {
        $('#'+LOGIN_EMAIL).val(request.bodyObject[SignupRequest.EMAIL]);
        $('#'+LOGIN_PWD).val(request.bodyObject[SignupRequest.PASSWORD]);
        hideSignupDialog();
        showUserActivationDialog();
        showInfoSignupSuccess();
        clearSignupValues()
    })
};

function showInfoSignupSuccess(){
    Tools.showInformationDialog(texts.signup_successfull);
}

function clearSignupValues(){
    $('#signup_content input').val("");
    $('#signup_content select').val(0);
}

const EMAIL_INPUT = "inputEmail";
const EMAIL_ERR = "inputEmail_error";
const NAME_INPUT = "businessName";
const NAME_ERR = "businessName_error";
const CIF_INPUT = "inputCIF";
const CIF_ERR = "inputCIF_error";
const PWD_INPUT = "inputPassword";
const PWD_ERR = "inputPassword_error";
const CONFIRM_PWD_INPUT = "inputConfirmation";
const CONFIRM_PWD_ERR = "inputConfirmation_error";
const WEB_INPUT = "inputWebPage";
const PHONE_INPUT = "inputPhone";
const PHONE_ERR = "inputPhone_error";
const COUNTRY_INPUT = "inputState";
const COUNTRY_ERR = "inputState_error";
const BUSSINES_TYPE_INPUT = "inputBusinessType";
const BUSINESS_TYPE_ERR = "inputBusinessType_error";
const POLICY_CHECK = "termsAndConditions";
const POLICY_ERR = "termsAndConditions_error";
const DESCRIPTION_INPUT = "inputDescripton";
const DESCRIPTION_ERR = "inputDescripton_error";
const CP_INPUT = "inputCP";
const CP_ERR = "inputCP_errpr";
const ADDRESS_INPUT = "inputAddress";
const ADDRESS_ERR = "inputAddress_error";
const MUNICIPI_INPUT = "inputMunicipi";
const MUNICIPI_ERR = "inputMunicipi_error";
const PROVINCIA_INPUT = "inputProvincia";
const PROVINCIA_ERR = "inputProvincia_error";