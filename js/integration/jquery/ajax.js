'use strict';

var jquery = require("jquery"),
    ajax = require("../../core/utils/ajax"),
    useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(useJQueryRenderer) {
    ajax.setStrategy(jquery.ajax);
}
