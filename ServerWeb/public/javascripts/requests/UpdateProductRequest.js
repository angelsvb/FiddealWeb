let HTTPRequest = require('../utilities/HTTPRequest');

class UpdateProductRequest extends HTTPRequest {
    constructor() {
        super();
        this.IsVisible = true;
    }

    getPath() {
        return '/business/products/'
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    getStaticBodyParams(obj){
        super.getStaticBodyParams(obj);
        obj[UpdateProductRequest.IS_VISIBLE] = this.IsVisible;
    }
}

UpdateProductRequest.NAME = "Name";
UpdateProductRequest.PRICE = "Price";
UpdateProductRequest.OUTLET_PRICE = "OutletPrice";
UpdateProductRequest.STOCK = "Stock";
UpdateProductRequest.STOCK_STATE = "StockState";
UpdateProductRequest.DESCRIPTION = "Description";
UpdateProductRequest.EXPECTED_ARRIVAL = "ExpectedArrival";
UpdateProductRequest.SUBCATEGORY = "Subcategory";
UpdateProductRequest.REFERENCE = "Reference";
UpdateProductRequest.IS_VISIBLE = "IsVisible";
UpdateProductRequest.PRODUCT_ID = "idProduct";

module.exports = UpdateProductRequest;