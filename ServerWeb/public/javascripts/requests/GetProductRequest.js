let HTTPRequest = require('../utilities/HTTPRequest');
let Storage = require('../utilities/storage');

class GetProductRequest extends HTTPRequest {
    constructor() {
        super();
        this.productId = "";
    }

    getPath() {
        return '/business/products/'+this.productId;
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
}

module.exports = GetProductRequest;