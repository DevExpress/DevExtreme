'use strict';

var jQuery = require("jquery"),
    ajax = require("../../core/utils/ajax"),
    useJQuery = require("../../core/config")().useJQuery;

if(jQuery && useJQuery) {
    ajax.setStrategy(jQuery.ajax);
}
