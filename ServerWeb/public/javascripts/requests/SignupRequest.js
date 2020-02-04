let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class SignupRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/user'
    }

    getErrorCodeText(errorCode){
        switch(errorCode){
            case 12: return texts.error_code_user_already_exists;
            case 13: return texts.error_code_invalid_password;
            default: return super.getErrorCodeText(errorCode);
        }
    }

    needAuth(){
        return false;
    }
}

SignupRequest.EMAIL = "Email";
SignupRequest.NAME = "Name";
SignupRequest.CIF = "CIF";
SignupRequest.TypeBusiness = "TypeBusiness";
SignupRequest.CP = "CP";
SignupRequest.MUNICIPI = "Municipi";
SignupRequest.PROVINCIA = "ProvinciaID";
SignupRequest.COUNTRY = "CountryID";
SignupRequest.ADDRESS = "Address";
SignupRequest.PHONE = "Phone";
SignupRequest.PASSWORD = "Password";
SignupRequest.CONFIRMATION_PWD = "ConfirmationPassword";
SignupRequest.POLICY = "PolicyAccepted";
SignupRequest.WEB = "WebPage";
SignupRequest.DESCRIPTION = "Description";

module.exports = SignupRequest;