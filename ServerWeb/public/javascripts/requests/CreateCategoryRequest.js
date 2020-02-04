let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class CreateCategoryRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/business/categories'
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    getErrorCodeText(errorCode) {
        switch (errorCode) {
            case 12: return texts.category_already_exists;
            default: return super.getErrorCodeText(errorCode);
        }
    }
}


CreateCategoryRequest.NAME = "categoryName";

module.exports = CreateCategoryRequest;