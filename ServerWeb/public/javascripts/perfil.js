let $ = require('jquery');
require('./utilities/templates');
require('jquery.nicescroll');
let Handlebars = require('handlebars');
let Tools = require('./utilities/tools.js');
let texts = require('./utilities/texts');
let validations = require('./utilities/validations');
let http_client = require('./utilities/HTTPClient');
let CountriesRequest = require('./requests/PaisosRequest');
let UserDataRequest = require('./requests/UserDataRequest');
let SetParamsRequest = require('./requests/SetParamsRequest');
let UpdateUserRequest = require('./requests/UpdateUserRequest');
let Storage = require('./utilities/storage');

let dataRequest = undefined;
let inputProfileEnabled = true;
let inputParamsEnabled = true;
let countries = undefined;

const EMAIL = "inputEmail";
const EMAIL_ERR = "inputEmail_error";
const NAME = "inputName";
const NAME_ERR = "inputName_error";
const CIF = "inputCIF";
const CIF_ERR = "inputCIF_error";
const COUNTRY = "inputState";
const COUNTRY_ERR = "inputState_error";
const PROVINCIA = "inputProvincia";
const PROVINCIA_ERR = "inputProvincia_error";
const MUNICIPI = "inputMunicipi";
const MUNICIPI_ERR = "inputMunicipi_error";
const ADDRESS = "inputAddress";
const ADDRESS_ERR = "inputAddress_error";
const CP = "inputCP";
const CP_ERR = "inputCP_error";
const PHONE = "inputPhone";
const PHONE_ERR = "inputPhone_error";
const WEBPAGE = "inputWebPage";
const BUSINES_TYPE = "inputBusinessType";
const BUSINES_TYPE_ERR = "inputBusinessType_error";
const DESCRIPTION = "inputDescription";
const DESCRIPTION_ERR = "inputDescription_error";

const DISCOUNT_EQUIVALENCE = "inputEquivalence";
const DISCOUNT_EQUIVALENCE_ERR = "inputEquivalence_error";
const LIFE_TIME = "inputLifeTime";
const LIFE_TIME_ERR = "inputLifeTime_error";
const EXPIRING_DISCOUNTS = "inputCaducidad";
const ADD_LIFE_TIME = "inputAmpliar";

let window_loaded = false;
let countries_loaded = false;

window.initializeBefore = function(){
    Tools.commonInitializationBefore();

    if (!countries) countries = new CountriesRequest();
    http_client.requestGET(countries,() => {countries_loaded = true;  initializeAfter()});
};

window.initializeAfter = function() {
    if (countries_loaded && !window_loaded){
        Handlebars.translatePage("perfil");

        Tools.commonInitializationAfter({name:Storage.getUser().Name,current: texts.option_perfil});
        Tools.loadCountriesInformation('#inputState','#inputProvincia',countries.entity.countries);

        Tools.fillBusinessType('#inputBusinessType');

        let validTokenExecuted = Tools.validateAuth();
        if (!validTokenExecuted){
            dataRequest = new UserDataRequest();
            dataRequest.showErrorMessage = false;
            http_client.requestGET(dataRequest,(request) => {parseUserValues(request.entity.User);Storage.setUser(request.entity.User);},showUserMissingDataWarning);
        }else{
            if (Storage.getUser()) parseUserValues(Storage.getUser());
            else showUserMissingDataWarning();
        }

        disableProfileInputs();
        disableFidelizationInputs();
        window_loaded = true;
    }
};

function parseUserValues(User,updateProfile = true,updateParams = true){
    if (updateProfile){
        //Perfil
        $('#'+EMAIL).val(User.Email);
        $('#'+NAME).val(User.Name);
        $('#'+CIF).val(User.CIF);
        $('#'+COUNTRY).val(User.CountryID);
        $('#'+COUNTRY)[0].onchange();
        $('#'+PROVINCIA).val(User.ProvinciaID);
        $('#'+MUNICIPI).val(User.Municipi);
        $('#'+ADDRESS).val(User.Address);
        $('#'+CP).val(User.CP);
        $('#'+PHONE).val(User.Phone);
        $('#'+WEBPAGE).val(User.WebPage);
        $('#'+BUSINES_TYPE).val(User.TypeBusiness);
        $('#'+DESCRIPTION).val(User.Description);
    }

    if (updateParams){
        //Parametres
        $('#'+DISCOUNT_EQUIVALENCE).val(User.FidelizationParams.discountEquivalence);
        $('#'+LIFE_TIME).val(User.FidelizationParams.discountLife);
        $('#'+EXPIRING_DISCOUNTS).val(User.FidelizationParams.expires);
        $('#'+ADD_LIFE_TIME).val(User.FidelizationParams.extendOnPurchase);

        $('#'+EXPIRING_DISCOUNTS).change(function() {
            if(!this.checked && inputParamsEnabled) {
                $('#inputAmpliar').prop('disabled', true);
                $('#inputLifeTime').prop('disabled', true);
            }else{
                $('#inputAmpliar').prop('disabled', false);
                $('#inputLifeTime').prop('disabled', false);
            }
        });
    }
}

window.changeProfileInputStatus= function(){
    if (inputProfileEnabled){
        if (window_loaded){
            let updateRequest = new UpdateUserRequest();

            updateRequest.addBodyParam(UpdateUserRequest.Name,NAME,validations.notEmpty,NAME_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.CountryID,COUNTRY,validations.notDefaultSelect,COUNTRY_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.ProvinciaID,PROVINCIA,validations.notDefaultSelect,PROVINCIA_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.Municipi,MUNICIPI,validations.notEmptyText,MUNICIPI_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.Address,ADDRESS,validations.notEmpty,ADDRESS_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.CP,CP,validations.validCP,CP_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.Phone,PHONE,validations.validPhone,PHONE_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.WebPage,WEBPAGE);
            updateRequest.addBodyParam(UpdateUserRequest.TypeBusiness,BUSINES_TYPE,validations.notDefaultSelect,BUSINES_TYPE_ERR);
            updateRequest.addBodyParam(UpdateUserRequest.Description,DESCRIPTION,validations.notEmpty,DESCRIPTION);

            http_client.requestPUT(updateRequest,() => {
                disableProfileInputs();
                Storage.setUser(updateRequest.entity.User);
            })
        }else{
            disableProfileInputs();
        }
    }else{
        $('#form_profile .editable').prop('disabled', false);
        inputProfileEnabled = true;
        $("#image_profile").attr("src","../images/ic_action_save.svg");
    }
};

window.disableProfileInputs = function disableProfileInputs(){
    $('#form_profile input').prop('disabled', true);
    $('#form_profile select').prop('disabled', true);
    $('#form_profile textarea').prop('disabled', true);
    inputProfileEnabled = false;
    $("#image_profile").attr("src","../images/ic_action_edit.svg");
};

window.disableFidelizationInputs = function disableFidelizationInputs(){
    $('#form_params input').prop('disabled', true);
    $('#form_params select').prop('disabled', true);
    $('#form_params textarea').prop('disabled', true);

    inputParamsEnabled = false;
    $("#image_params").attr("src","../images/ic_action_edit.svg");
}

window.changeParamsInputStatus= function(){
    if (inputParamsEnabled){
        if (window_loaded){
            let requestSaveParams = new SetParamsRequest();

            requestSaveParams.addBodyParam(SetParamsRequest.DISCOUNT_EQUIVALENCE,DISCOUNT_EQUIVALENCE,() => {
                let value = Tools.getViewValue(DISCOUNT_EQUIVALENCE);
                if (value || value===0){
                    if (isNaN(value)){
                        return validations.wrongValidation(texts.validation_nan);
                    }else{
                        let numericValue = Tools.toDecimal(value);
                        if (numericValue < 0.01) return validations.wrongValidation(texts.validation_too_small("0.01€ " + texts.for_each + " 1€"));
                        if (numericValue > 0.9) return validations.wrongValidation(texts.validation_too_large("0.9€ " + texts.for_each + " 1€"));
                        else return validations.validationOK();
                    }
                }else return validations.wrongValidation(texts.validation_empty_string);
            },DISCOUNT_EQUIVALENCE_ERR,true);
            requestSaveParams.addBodyParam(SetParamsRequest.DISCOUNT_LIFE,LIFE_TIME,() => {
                let value = Tools.getViewValue(LIFE_TIME);
                if (value || value===0){
                    if (isNaN(value)){
                        return validations.wrongValidation(texts.validation_nan);
                    }else{
                        let numericValue = Tools.toNumber(value);
                        if (numericValue === 0) return validations.wrongValidation(texts.validation_too_small);
                        if (numericValue > 36) return validations.wrongValidation(texts.validation_too_large);
                        else return validations.validationOK();
                    }
                }else return validations.wrongValidation(texts.validation_empty_string);
            },LIFE_TIME_ERR,true);
            requestSaveParams.addBodyParam(SetParamsRequest.EXPIRES,EXPIRING_DISCOUNTS);
            requestSaveParams.addBodyParam(SetParamsRequest.EXTEND,ADD_LIFE_TIME);

            http_client.requestPUT(requestSaveParams,(request) => {
                disableFidelizationInputs();

                let user = Storage.getUser();
                user.FidelizationParams = request.entity;
                Storage.setUser(user);
            });
        }else{
            disableFidelizationInputs();
        }
    }else{
        $('#form_params input').prop('disabled', false);
        $('#form_params select').prop('disabled', false);
        $('#form_params textarea').prop('disabled', false);
        inputParamsEnabled = true;
        $("#image_params").attr("src","../images/ic_action_save.svg");

        if (!$('#inputCaducidad').is(":checked")){
            $('#inputAmpliar').prop('disabled', true);
            $('#inputLifeTime').prop('disabled', true);
        }
    }
};