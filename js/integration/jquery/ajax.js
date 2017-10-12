'use strict';

var jquery = require("jquery"),
    ajax = require("../../core/utils/ajax"),
    useJQuery = require("../../core/config")().useJQuery;

if(useJQuery) {
    ajax.setStrategy(jquery.ajax);
}
