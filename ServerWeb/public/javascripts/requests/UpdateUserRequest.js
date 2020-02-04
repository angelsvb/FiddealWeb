let HTTPRequest = require('../utilities/HTTPRequest');

class UpdateUserRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/user'
    }

    needAuth(){
        return true;
    }

    getErrorCodeText(errorCode){
        switch(errorCode){
            case 12: return texts.error_code_user_already_exists;
            case 13: return texts.error_code_invalid_password;
            default: return super.getErrorCodeText(errorCode);
        }
    }
}

UpdateUserRequest.Name = "Name";
UpdateUserRequest.TypeBusiness = "TypeBusiness";
UpdateUserRequest.CP = "CP";
UpdateUserRequest.Municipi = "Municipi";
UpdateUserRequest.ProvinciaID = "ProvinciaID";
UpdateUserRequest.CountryID = "CountryID";
UpdateUserRequest.Address = "Address";
UpdateUserRequest.Phone = "Phone";
UpdateUserRequest.Description = "Description";
UpdateUserRequest.WebPage = "WebPage";

module.exports = UpdateUserRequest;