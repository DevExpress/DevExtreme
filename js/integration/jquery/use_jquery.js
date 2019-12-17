var jQuery = require('jquery');
var config = require('../../core/config');
var useJQuery = config().useJQuery;

if(jQuery && useJQuery !== false) {
    config({ useJQuery: true });
}

module.exports = function() {
    return jQuery && config().useJQuery;
};
