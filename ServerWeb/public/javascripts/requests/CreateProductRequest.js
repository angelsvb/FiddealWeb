let HTTPRequest = require('../utilities/HTTPRequest');

class CreateProductRequest extends HTTPRequest {
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
        obj[CreateProductRequest.IS_VISIBLE] = this.IsVisible;
    }
}

CreateProductRequest.NAME = "Name";
CreateProductRequest.PRICE = "Price";
CreateProductRequest.OUTLET_PRICE = "OutletPrice";
CreateProductRequest.STOCK = "Stock";
CreateProductRequest.STOCK_STATE = "StockState";
CreateProductRequest.DESCRIPTION = "Description";
CreateProductRequest.EXPECTED_ARRIVAL = "ExpectedArrival";
CreateProductRequest.SUBCATEGORY = "Subcategory";
CreateProductRequest.REFERENCE = "Reference";
CreateProductRequest.IS_VISIBLE = "IsVisible";

module.exports = CreateProductRequest;