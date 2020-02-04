let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class RecoveryPasswordRequest extends HTTPRequest {
    constructor() {
        super();
        this.email = "";
    }

    getPath() {
        return '/credentials'
    }

    getManualQueryParams(object){
        object[RecoveryPasswordRequest.EMAIL] = this.email;
    }

    needAuth(){
        return false;
    }
}

RecoveryPasswordRequest.EMAIL = "email";
RecoveryPasswordRequest.CODE = "RecoveryCode";
RecoveryPasswordRequest.NEW_PASSWORD = "PasswordNew";
RecoveryPasswordRequest.CONFIRMATION_NEW_PASSWORD = "ConfirmPasswordNew";

module.exports = RecoveryPasswordRequest;