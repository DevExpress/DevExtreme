import { setPublicElementWrapper } from '../../core/element';
import useJQuery from './use_jquery';

const getPublicElement = function($element) {
    return $element;
};

if(useJQuery()) {
    setPublicElementWrapper(getPublicElement);
}
