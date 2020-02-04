let HTTPRequest = require('../utilities/HTTPRequest');

class GetFidelizationDiscountRequest extends HTTPRequest {
    constructor() {
        super();
        this.user = "";
    }

    getPath() {
        return '/fidelizationDiscount';
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    getStaticQueryParams(obj){
        super.getStaticQueryParams(obj);
        obj["User"] = this.user;
    }
}

module.exports = GetFidelizationDiscountRequest;