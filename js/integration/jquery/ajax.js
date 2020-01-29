const jQuery = require('jquery');
const ajax = require('../../core/utils/ajax');
const useJQuery = require('./use_jquery')();

if(useJQuery) {
    ajax.inject({
        sendRequest: function(options) {
            if(!options.responseType && !options.upload) {
                return jQuery.ajax(options);
            }

            return this.callBase.apply(this, [options]);
        }
    });
}


