'use strict';

var jquery = require("jquery"),
    ajaxUtils = require("../../core/utils/ajax"),
    useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(useJQueryRenderer) {
    ajaxUtils.setAjaxStrategy(jquery.ajax);
}
