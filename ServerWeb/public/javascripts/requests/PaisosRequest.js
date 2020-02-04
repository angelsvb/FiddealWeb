let HTTPRequest = require('../utilities/HTTPRequest');

class PaisosRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/countries'
    }

    showLoading() {
        return false;
    }

    showErrorOnRequestCompleted(){
        return false;
    }

    needAuth(){
        return false;
    }
}


module.exports = PaisosRequest;