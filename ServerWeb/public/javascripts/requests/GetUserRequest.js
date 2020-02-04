let HTTPRequest = require('../utilities/HTTPRequest');

class GetUserRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/user/';
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    showErrorOnRequestCompleted(){
        return false;
    }

    getStaticQueryParams(obj){
        super.getStaticQueryParams(obj);
        obj["requestedType"] = 1;
    }
}

GetUserRequest.USER = "userDNI";
module.exports = GetUserRequest;