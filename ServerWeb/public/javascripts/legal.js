let Tools = require('./utilities/tools');

window.initializeAfter = function(){
    Tools.initializeCookies();

    Tools.setScroll('body');
    Tools.setSmallScroll('.modal-body');
};