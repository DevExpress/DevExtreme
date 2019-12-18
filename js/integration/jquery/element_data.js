var jQuery = require('jquery');
var dataUtils = require('../../core/element_data');
var useJQuery = require('./use_jquery')();

if(useJQuery) {
    dataUtils.setDataStrategy(jQuery);
}
