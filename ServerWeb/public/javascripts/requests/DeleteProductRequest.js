let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class DeleteProductRequest extends HTTPRequest {
    constructor() {
        super();
        this.idProduct = undefined;
    }

    getPath() {
        return '/business/products/'+this.idProduct;
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    getErrorCodeText(errorCode) {
        switch (errorCode) {
            case 12: return texts.product_not_found;
            case 13: return texts.product_cant_delete_purchased;
            default: return super.getErrorCodeText(errorCode);
        }
    }
}

module.exports = DeleteProductRequest;