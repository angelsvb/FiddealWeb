let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');
let Storage = require('../utilities/storage');

class ActivateUserRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/activation'
    }

    getErrorCodeText(errorCode){
        switch (errorCode) {
            case 12: return texts.user_activation_not_found;
            case 13: return texts.user_activation_cant_delete_active;
            case 14: return texts.user_activation_not_valid_code;
            default: return super.getErrorCodeText(errorCode);
        }
    }

    needAuth(){
        return false;
    }

    getStaticQueryParams(obj){
        super.getStaticQueryParams(obj);
        if (!obj[ActivateUserRequest.PWD] && !obj[ActivateUserRequest.EMAIL]) {
            obj["token"] = Storage.getToken();
        }
    }
}


ActivateUserRequest.EMAIL = "email";
ActivateUserRequest.CODE = "ActivationCode";
ActivateUserRequest.PWD = "Password";

module.exports = ActivateUserRequest;