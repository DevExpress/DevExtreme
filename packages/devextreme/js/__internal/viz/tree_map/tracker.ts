/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import '@ts/viz/tree_map/api';
import '@ts/viz/tree_map/hover';
import '@ts/viz/tree_map/tooltip';

import { Tracker } from '@ts/viz/components/tracker';
import { expand } from '@ts/viz/core/helpers';
import { parseScalar as _parseScalar } from '@ts/viz/core/utils';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const DATA_KEY_BASE = '__treemap_data_';
let dataKeyModifier = 0;
const proto = TreeMapBase.prototype;
/// #DEBUG
let _TESTS_dataKey;
/// #ENDDEBUG
proto._eventsMap.onClick = { name: 'click' };

const getDataKey = function () {
  const dataKey = DATA_KEY_BASE + dataKeyModifier++;
  return dataKey;
};

expand(proto, '_initCore', function () {
  const that = this;
  const dataKey = getDataKey();
  /// #DEBUG
  _TESTS_dataKey = dataKey;
  /// #ENDDEBUG
  const getProxy = function (index) {
    return that._nodes[index].proxy;
  };

  that._tracker = new Tracker({
    widget: that,
    root: that._renderer.root,
    getNode(id) {
      const proxy = getProxy(id);
      const interactWithGroup = _parseScalar(that._getOption('interactWithGroup', true));

      return interactWithGroup && proxy.isLeaf() && proxy.getParent().isActive() ? proxy.getParent() : proxy;
    },
    getData(e) {
      const { target } = e;
      return (target.tagName === 'tspan' ? target.parentNode : target)[dataKey];
    },
    getProxy,
    click(e) {
      that._eventTrigger('click', e);
    },
  });
  that._handlers.setTrackerData = function (node, element) {
    element.data(dataKey, node._id);
  };
});

expand(proto, '_disposeCore', function () {
  this._tracker.dispose();
});

/// #DEBUG
export { _TESTS_dataKey };
/// #ENDDEBUG
