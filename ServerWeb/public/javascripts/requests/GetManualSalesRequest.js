let HTTPRequest = require('../utilities/HTTPRequest');

class GetManualSalesRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/sales/manual';
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }
}

module.exports = GetManualSalesRequest;