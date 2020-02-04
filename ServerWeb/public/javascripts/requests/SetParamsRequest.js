let HTTPRequest = require('../utilities/HTTPRequest');

class SetParamsRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/business/fidelizationParams'
    }

    needAuth(){
        return true;
    }
}

SetParamsRequest.DISCOUNT_EQUIVALENCE = "discountEquivalence";
SetParamsRequest.DISCOUNT_LIFE = "discountLife";
SetParamsRequest.EXPIRES = "expires";
SetParamsRequest.EXTEND = "extendOnPurchase";

module.exports = SetParamsRequest;