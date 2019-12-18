var window = require('../../core/utils/window').getWindow();

var getSessionStorage = function() {
    var sessionStorage;

    try {
        sessionStorage = window.sessionStorage;
    } catch(e) { }

    return sessionStorage;
};

exports.sessionStorage = getSessionStorage;
