let HTTPRequest = require('../utilities/HTTPRequest');

class SupportRequest extends HTTPRequest {
    constructor() {
        super();
    }

    getPath() {
        return '/support'
    }
}

SupportRequest.MESSAGE = "Message";
SupportRequest.TOPIC = "Topic";
SupportRequest.CATEGORY = "Category";

module.exports = SupportRequest;