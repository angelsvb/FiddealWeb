let HTTPRequest = require('../utilities/HTTPRequest');
let Storage = require('../utilities/storage');

class GetProductsRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/business/'+Storage.getUser()._id+"/products/";
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }
}

module.exports = GetProductsRequest;