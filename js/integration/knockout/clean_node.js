"use strict";

var elementData = require("../../core/element_data"),
    afterCleanData = elementData.afterCleanData,
    jQuery = require("jquery"),
    ko = require("knockout"),
    compareVersion = require("../../core/utils/version").compare,
    useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(!useJQueryRenderer || (jQuery && compareVersion(jQuery.fn.jquery, [2, 0]) >= 0)) {
    afterCleanData(function(nodes) {
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
    });

    ko.utils.domNodeDisposal.cleanExternalData = function(node) {
        node.cleanedByKo = true;
        if(!node.cleanedByJquery) {
            elementData.cleanData([node]);
        }
    };

}
