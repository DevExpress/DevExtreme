const elementData = require('../../core/element_data');
const afterCleanData = elementData.afterCleanData;
const strategyChanging = elementData.strategyChanging;
const ko = require('knockout');
const compareVersion = require('../../core/utils/version').compare;

const originalKOCleanExternalData = ko.utils.domNodeDisposal.cleanExternalData;

const patchCleanData = function() {
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

const restoreOriginCleanData = function() {
    afterCleanData(function() {});
    ko.utils.domNodeDisposal.cleanExternalData = originalKOCleanExternalData;
};

patchCleanData();

strategyChanging.add(function(strategy) {
    const isJQuery = !!strategy.fn;
    if(isJQuery && compareVersion(strategy.fn.jquery, [2, 0]) < 0) {
        restoreOriginCleanData();
    }
});
