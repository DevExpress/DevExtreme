import { afterCleanData, cleanData, strategyChanging } from '@ts/core/m_element_data';
import { compare as compareVersion } from '@ts/core/utils/m_version';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

import { getClosestNodeWithKoCreation } from './utils';

interface CleanedNode extends Node {
  cleanedByKo?: boolean;
  cleanedByJquery?: boolean;
}

if (ko) {
  const originalKOCleanExternalData = ko.utils.domNodeDisposal.cleanExternalData;
  const patchCleanData = (): void => {
    afterCleanData((nodes: CleanedNode[]) => {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < nodes.length; i += 1) {
        nodes[i].cleanedByJquery = true;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < nodes.length; i += 1) {
        if (!nodes[i].cleanedByKo) {
          ko.cleanNode(nodes[i]);
        }
        delete nodes[i].cleanedByKo;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < nodes.length; i += 1) {
        delete nodes[i].cleanedByJquery;
      }
    });

    ko.utils.domNodeDisposal.cleanExternalData = (node: CleanedNode): void => {
      node.cleanedByKo = true;
      if (getClosestNodeWithKoCreation(node)) {
        if (!node.cleanedByJquery) {
          cleanData([node]);
        }
      }
    };
  };

  const restoreOriginCleanData = (): void => {
    afterCleanData(() => {});
    ko.utils.domNodeDisposal.cleanExternalData = originalKOCleanExternalData;
  };

  patchCleanData();

  strategyChanging.add((strategy): void => {
    const isJQuery = !!strategy.fn;
    if (isJQuery && compareVersion(strategy.fn.jquery, [2, 0]) < 0) {
      restoreOriginCleanData();
    }
  });
}
