import jQuery from 'jquery';
import dataUtils from '../../core/element_data';
import useJQuery from './use_jquery';

if(useJQuery()) {
    dataUtils.setDataStrategy(jQuery);
}
