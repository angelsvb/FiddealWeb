let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class DeleteSubcategoryRequest extends HTTPRequest {
    constructor() {
        super();
        this.parentCategory = undefined;
    }

    getPath() {
        return '/business/categories/'+this.parentCategory+"/subcategories";
    }


    getStaticQueryParams(obj){
        super.getStaticQueryParams(obj);
        obj[DeleteSubcategoryRequest.NAME] = this.subcategory;
    }

    getErrorCodeText(errorCode) {
        switch (errorCode) {
            case 16: return texts.subcategory_not_found;
            case 15: return texts.category_not_found;
            case 21: return texts.subcategory_in_use;
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


DeleteSubcategoryRequest.NAME = "subCategoryName";
DeleteSubcategoryRequest.PARENT_CATEGORY = "categoryId";
module.exports = DeleteSubcategoryRequest;