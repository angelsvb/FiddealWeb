let HTTPRequest = require('../utilities/HTTPRequest');

class LoginRequest extends HTTPRequest {
    constructor() {
        super();
        this.email = undefined;
        this.password = undefined;
        this.showLoadingState = true;
    }

    getPath() {
        return '/signin'
    }

    needAuth(){
        return false;
    }

    getStaticBodyParams(obj){
        super.getStaticQueryParams(obj);
        if (this.password && this.email){
            obj[LoginRequest.EMAIL] = this.email;
            obj[LoginRequest.PASSWORD] = this.password;
        }
    }

    showLoading(){
        return this.showLoadingState;
    }
}


LoginRequest.EMAIL = "Email";
LoginRequest.PASSWORD = "Password";

module.exports = LoginRequest;