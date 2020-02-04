let HTTPRequest = require('../utilities/HTTPRequest');

class UserDataRequest extends HTTPRequest {
    constructor() {
        super();
        this.showErrorMessage = true;
    }

    getPath() {
        return '/user'
    }

    showErrorOnRequestCompleted(){
        return this.showErrorMessage;
    }
}

module.exports = UserDataRequest;