'use strict';

var jquery = require("jquery"),
    dataUtils = require("../../core/element_data"),
    useJQuery = require("../../core/config")().useJQuery;

if(jquery && useJQuery) {
    dataUtils.setDataStrategy(jquery);
}
