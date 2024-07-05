import { setPublicElementWrapper } from '../../core/element';

const getPublicElement = function($element) {
    return $element;
};

setPublicElementWrapper(getPublicElement);
