import jQuery from 'jquery';
import ajax from '../../core/utils/ajax';
import useJQuery from './use_jquery';

if(useJQuery()) {
    ajax.inject({
        sendRequest: function(options) {
            if(!options.responseType && !options.upload) {
                return jQuery.ajax(options);
            }

            return this.callBase.apply(this, [options]);
        }
    });
}


