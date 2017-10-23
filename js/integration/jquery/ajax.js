'use strict';

var jQuery = require("jquery");
var ajax = require("../../core/utils/ajax");
var useJQuery = require("./use_jquery")();

if(useJQuery) {
    ajax.setStrategy(jQuery.ajax);
}
