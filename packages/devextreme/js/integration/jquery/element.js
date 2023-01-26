import { setPublicElementWrapper } from '../../core/element';
import useJQueryFn from './use_jquery';
const useJQuery = useJQueryFn();

const getPublicElement = function($element) {
    return $element;
};

if(useJQuery) {
    setPublicElementWrapper(getPublicElement);
}
