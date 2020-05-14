import { setPublicElementWrapper } from '../../core/element';
const useJQuery = require('./use_jquery')();

const getPublicElement = function($element) {
    return $element;
};

if(useJQuery) {
    setPublicElementWrapper(getPublicElement);
}
