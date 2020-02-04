let HTTPRequest = require('../utilities/HTTPRequest');

class RejectManualPurchaseRequest extends HTTPRequest {
    constructor() {
        super();
        this.idSale = undefined;
    }

    getPath() {
        return '/sales/'+this.idSale+'manual';
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }
}

RejectManualPurchaseRequest.COMMENT = "comment";
module.exports = RejectManualPurchaseRequest;