import { afterCleanData, strategyChanging, cleanData } from '../../core/element_data';
// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import { compare as compareVersion } from '../../core/utils/version';
import { getClosestNodeWithKoCreation } from './utils';

if(ko) {
    const originalKOCleanExternalData = ko.utils.domNodeDisposal.cleanExternalData;
    const patchCleanData = function() {
        afterCleanData(function(nodes) {
            let i;
            for(i = 0; i < nodes.length; i++) {
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
            if(getClosestNodeWithKoCreation(node)) {
                if(!node.cleanedByJquery) {
                    cleanData([node]);
                }
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
}
