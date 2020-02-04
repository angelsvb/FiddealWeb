let HTTPRequest = require('../utilities/HTTPRequest');

class AcceptManualPurchaseRequest extends HTTPRequest {
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
module.exports = AcceptManualPurchaseRequest;