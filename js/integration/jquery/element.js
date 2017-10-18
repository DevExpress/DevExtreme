"use strict";

var jQuery = require("jquery");
var setPublicElementWrapper = require("../../core/utils/dom").setPublicElementWrapper;
var useJQuery = require("../../core/config")().useJQuery;

var getPublicElement = function($element) {
    return $element;
};

if(jQuery && useJQuery) {
    setPublicElementWrapper(getPublicElement);
}
