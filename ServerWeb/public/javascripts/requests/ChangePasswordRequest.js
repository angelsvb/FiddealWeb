let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class ChangePasswordRequest extends HTTPRequest {
    constructor() {
        super();
        this.email = "";
    }

    getPath() {
        return '/credentials'
    }

    getManualQueryParams(object){
        object[ChangePasswordRequest.EMAIL] = this.email;
    }

    needAuth(){
        return false;
    }
}

ChangePasswordRequest.EMAIL = "email";
ChangePasswordRequest.OLD_PASSWORD = "PasswordOld";
ChangePasswordRequest.NEW_PASSWORD = "PasswordNew";
ChangePasswordRequest.CONFIRMATION_NEW_PASSWORD = "ConfirmPasswordNew";

module.exports = ChangePasswordRequest;