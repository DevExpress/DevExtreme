const jQuery = require('jquery');
const config = require('../../core/config');
const useJQuery = config().useJQuery;

if(jQuery && useJQuery !== false) {
    config({ useJQuery: true });
}

module.exports = function() {
    return jQuery && config().useJQuery;
};
