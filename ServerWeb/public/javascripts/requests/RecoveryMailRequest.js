let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class RecoveryMailRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/credentials'
    }

    getErrorCodeText(errorCode){
        switch(errorCode){
            case 12: return texts.user_credentials_error_generating_code;
            case 13: return texts.user_credentials_user_not_found;
            default: return super.getErrorCodeText(errorCode);
        }
    }

    needAuth(){
        return false;
    }
}

RecoveryMailRequest.EMAIL = "email";
module.exports = RecoveryMailRequest;