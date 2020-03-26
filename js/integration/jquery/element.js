const setPublicElementWrapper = require('../../core/utils/dom').setPublicElementWrapper;
const useJQuery = require('./use_jquery')();

const getPublicElement = function($element) {
    return $element;
};

if(useJQuery) {
    setPublicElementWrapper(getPublicElement);
}
