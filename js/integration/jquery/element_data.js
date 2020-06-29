import jQuery from 'jquery';
import dataUtils from '../../core/element_data';
import useJQueryFn from './use_jquery';
const useJQuery = useJQueryFn();

if(useJQuery) {
    dataUtils.setDataStrategy(jQuery);
}
