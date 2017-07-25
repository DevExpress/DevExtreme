"use strict";

var dataUtilsStrategy = require("../../core/element_data").getDataStrategy(),
    jQuery = require("jquery"),
    ko = require("knockout"),
    compareVersion = require("../../core/utils/version").compare,
    useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(!useJQueryRenderer || (jQuery && compareVersion(jQuery.fn.jquery, [2, 0]) >= 0)) {
    var cleanData = dataUtilsStrategy.cleanData;
    dataUtilsStrategy.cleanData = function(nodes) {
        var result = cleanData(nodes);

        for(var i = 0; i < nodes.length; i++) {
            nodes[i].cleanedByJquery = true;
        }

        for(i = 0; i < nodes.length; i++) {
            if(!nodes[i].cleanedByKo) {
                ko.cleanNode(nodes[i]);
            }
            delete nodes[i].cleanedByKo;
        }

        for(i = 0; i < nodes.length; i++) {
            delete nodes[i].cleanedByJquery;
        }

        return result;
    };

    ko.utils.domNodeDisposal.cleanExternalData = function(node) {
        node.cleanedByKo = true;
        if(!node.cleanedByJquery) {
            dataUtilsStrategy.cleanData([node]);
        }
    };

}
