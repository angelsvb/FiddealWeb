let HTTPRequest = require('../utilities/HTTPRequest');
let storage = require('../utilities/storage');

class RequestPrint extends HTTPRequest {
    constructor() {
        super();
        this.mail = undefined;
    }

    getPath() {
        return '/printService';
    }

    baseURL() {
        return storage.printURL();
    }

    needAuth() {
        return false;
    }

    hasType() {
        return false;
    }

    showErrorOnRequestCompleted() {
        return false;
    }

    getStaticBodyParams(obj){
        super.getStaticBodyParams(obj);
        obj["Name"] = this.Name;
        obj["Address"] = this.Address;
        obj["Provincia"] = this.Provincia;

        obj["UserID"] = this.UserID;

        if (this.TotalDiscount) obj["TotalDiscount"] = this.TotalDiscount.toFixed(2).toString();
        else obj["TotalDiscount"] = "0.00";

        if (this.ObtainedDiscount) obj["ObtainedDiscount"] = this.ObtainedDiscount.toFixed(2).toString();
        else obj["ObtainedDiscount"] = "0.00";

        obj["ExpirationDate"] = this.ExpirationDate;

        if (this.Subtotal) obj["Subtotal"] = this.Subtotal.toFixed(2).toString();
        else obj["Subtotal"] = "0.00";

        if (this.Discount) obj["Discount"] = this.Discount.toFixed(2).toString();
        else obj["Discount"] = "0.00";

        if (this.Total) obj["Total"] = this.Total.toFixed(2).toString();
        else obj["Total"] = "0.00";

        obj["PurchaseID"] = this.PurchaseID;
        obj["PurchaseDate"] = this.PurchaseDate;
        obj["JSONProducts"] = this.JSONProducts;
    }
}
module.exports = RequestPrint;