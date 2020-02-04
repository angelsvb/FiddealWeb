let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class UpdateSubcategoryRequest extends HTTPRequest {
    constructor() {
        super();
        this.currentParent = undefined;
    }

    getPath() {
        return '/business/categories/'+this.currentParent+"/subcategories";
    }

    getStaticQueryParams(object) {
        super.getStaticQueryParams(object);
        object[UpdateSubcategoryRequest.NAME] = this.currentName;
    }

    getErrorCodeText(errorCode) {
        switch (errorCode) {
            case 16: return texts.subcategory_not_found;
            default: return super.getErrorCodeText(errorCode);
        }
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }
}


UpdateSubcategoryRequest.NAME = "subCategoryName"
UpdateSubcategoryRequest.NEW_NAME = "newName";
UpdateSubcategoryRequest.NEW_PARENT = "newParent";
module.exports = UpdateSubcategoryRequest;