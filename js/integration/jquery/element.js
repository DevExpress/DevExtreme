var setPublicElementWrapper = require('../../core/utils/dom').setPublicElementWrapper;
var useJQuery = require('./use_jquery')();

var getPublicElement = function($element) {
    return $element;
};

if(useJQuery) {
    setPublicElementWrapper(getPublicElement);
}
