let HTTPRequest = require('../utilities/HTTPRequest');

class SavePurchaseRequest extends HTTPRequest {
    constructor() {
        super();
        this.productId = "";
    }

    getPath() {
        return '/sales';
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    getStaticBodyParams(obj){
        super.getStaticBodyParams(obj);

        obj["PurchaseSubtotal"] = this.Subtotal;
        obj["PurchaseDiscount"] = this.Discount;
        if (this.Fidelization) obj["PurchaseFidelization"] = this.Fidelization;
        obj["PurchaseTotal"] = this.Total;
        obj["Products"] = this.Products;
        obj["Business"] = this.Business;
        if (this.User) obj["User"] = this.User;
        obj["PaymentMethod"] = this.PaymentMethod;
    }
}

module.exports = SavePurchaseRequest;