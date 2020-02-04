let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class CreateSubcategoryRequest extends HTTPRequest {
    constructor() {
        super();
        this.parentCategory = undefined;
    }

    getPath() {
        return '/business/categories/'+this.parentCategory+"/subcategories";
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    getErrorCodeText(errorCode) {
        switch (errorCode) {
            case 14: return texts.subcategory_already_exists;
            case 16: return texts.subcategory_not_found;
            case 17: return texts.subcategory_name_equal_parent;
            default: return super.getErrorCodeText(errorCode);
        }
    }
}


CreateSubcategoryRequest.NAME = "subCategoryName";
module.exports = CreateSubcategoryRequest;