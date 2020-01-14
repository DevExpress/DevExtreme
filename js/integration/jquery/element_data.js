const jQuery = require('jquery');
const dataUtils = require('../../core/element_data');
const useJQuery = require('./use_jquery')();

if(useJQuery) {
    dataUtils.setDataStrategy(jQuery);
}
