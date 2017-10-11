'use strict';

var jquery = require("jquery"),
    dataUtils = require("../../core/element_data"),
    useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(jquery && useJQueryRenderer) {
    dataUtils.setDataStrategy(jquery);
}
