let HTTPRequest = require('../utilities/HTTPRequest');

class ValidateTokenRequest extends HTTPRequest {
    constructor() {
        super();
        this.token = "";
    }

    getPath() {
        return '/signin'
    }

    getStaticBodyParams(obj){
        super.getStaticBodyParams(obj);
        obj[ValidateTokenRequest.TOKEN] = this.token;
    }

    needAuth(){
        return false;
    }
}

ValidateTokenRequest.TOKEN = "Token";
module.exports = ValidateTokenRequest;