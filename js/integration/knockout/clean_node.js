var elementData = require('../../core/element_data'),
    afterCleanData = elementData.afterCleanData,
    strategyChanging = elementData.strategyChanging,
    ko = require('knockout'),
    compareVersion = require('../../core/utils/version').compare;

var originalKOCleanExternalData = ko.utils.domNodeDisposal.cleanExternalData;

var patchCleanData = function() {
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
};

var restoreOriginCleanData = function() {
    afterCleanData(function() {});
    ko.utils.domNodeDisposal.cleanExternalData = originalKOCleanExternalData;
};

patchCleanData();

strategyChanging.add(function(strategy) {
    var isJQuery = !!strategy.fn;
    if(isJQuery && compareVersion(strategy.fn.jquery, [2, 0]) < 0) {
        restoreOriginCleanData();
    }
});
