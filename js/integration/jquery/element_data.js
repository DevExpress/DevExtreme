'use strict';

var jQuery = require("jquery"),
    dataUtils = require("../../core/element_data"),
    useJQuery = require("../../core/config")().useJQuery;

if(jQuery && useJQuery) {
    dataUtils.setDataStrategy(jQuery);
}
