let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class ActivationMailRequest extends HTTPRequest {
    constructor() {
        super();
        this.mail = undefined;
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

    needAuth() {
        return false;
    }

    getStaticQueryParams(obj){
        super.getStaticQueryParams(obj);
        if (this.mail) obj[ActivationMailRequest.EMAIL] = this.mail;
    }
}

ActivationMailRequest.EMAIL = "email";
module.exports = ActivationMailRequest;