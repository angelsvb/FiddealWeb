let HTTPRequest = require('../utilities/HTTPRequest');
let Storage = require('../utilities/storage');

class GetSalesRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/sales/';
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }
}

module.exports = GetSalesRequest;