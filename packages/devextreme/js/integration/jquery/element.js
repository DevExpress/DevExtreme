import { setPublicElementWrapper } from '../../core/element';
import useJQueryFn from './use_jquery';
const useJQuery = useJQueryFn();

export function getPublicElementJQuery($element) {
    return $element;
}

if(useJQuery) {
    setPublicElementWrapper(getPublicElementJQuery);
}
