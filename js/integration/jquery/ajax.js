'use strict';

var jquery = require("jquery"),
    ajaxStrategy = require("../../core/ajax_strategy"),
    useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(useJQueryRenderer) {
    ajaxStrategy.set(jquery.ajax);
}
