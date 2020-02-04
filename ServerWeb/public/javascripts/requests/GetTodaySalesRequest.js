let HTTPRequest = require('../utilities/HTTPRequest');
let Storage = require('../utilities/storage');

class GetTodaySalesRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/sales_day';
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }
}

module.exports = GetTodaySalesRequest;