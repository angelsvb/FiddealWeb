let HTTPRequest = require('../utilities/HTTPRequest');

class AcceptPolicyRequest extends HTTPRequest {
    constructor() {
        super();
        this.mail = undefined;
    }

    getPath() {
        return '/user/policy';
    }

    showLoading(){
        return false;
    }
}
module.exports = AcceptPolicyRequest;