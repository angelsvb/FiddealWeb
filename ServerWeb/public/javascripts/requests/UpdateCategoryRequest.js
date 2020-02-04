let HTTPRequest = require('../utilities/HTTPRequest');

class UpdateCategoryRequest extends HTTPRequest {
    constructor() {
        super();
        this.oldName = undefined;
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

    getStaticQueryParams(obj){
        super.getStaticQueryParams(obj);
        obj[UpdateCategoryRequest.OLD_NAME] = this.oldName;
    }
}


UpdateCategoryRequest.OLD_NAME = "categoryName";
UpdateCategoryRequest.NEW_NAME = "newCategoryName";

module.exports = UpdateCategoryRequest;