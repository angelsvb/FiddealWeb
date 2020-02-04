let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class DeleteCategoryRequest extends HTTPRequest {
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
            case 13: return texts.category_not_found;
            case 22: return texts.category_in_use;
            default: return super.getErrorCodeText(errorCode);
        }
    }
}


DeleteCategoryRequest.NAME = "categoryName";

module.exports = DeleteCategoryRequest;