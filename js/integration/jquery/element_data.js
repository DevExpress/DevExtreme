'use strict';

var jquery = require("jquery"),
    dataUtils = require("../../core/element_data"),
    useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(useJQueryRenderer) {
    dataUtils.setDataStrategy(jquery);
}
