import jQuery from 'jquery';
import rendererBase from '../../core/renderer_base';
import useJQueryFn from './use_jquery';
const useJQuery = useJQueryFn();

if(useJQuery) {
    rendererBase.set(jQuery);
}
