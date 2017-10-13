"use strict";

var jQuery = require("jquery");
var setElementStrategy = require("../../core/utils/dom").setElementStrategy;
var useJQuery = require("../../core/config")().useJQuery;

var getPublicElement = function($element) {
    return $element;
};

if(jQuery && useJQuery) {
    setElementStrategy(getPublicElement);
}
