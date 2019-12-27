const window = require('../../core/utils/window').getWindow();

const getSessionStorage = function() {
    let sessionStorage;

    try {
        sessionStorage = window.sessionStorage;
    } catch(e) { }

    return sessionStorage;
};

exports.sessionStorage = getSessionStorage;
