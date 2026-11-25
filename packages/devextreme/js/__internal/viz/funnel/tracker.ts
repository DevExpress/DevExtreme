/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { isDefined } from '@ts/core/utils/type';
import { Tracker } from '@ts/viz/components/tracker';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import Funnel from '@ts/viz/funnel/funnel';
import type Item from '@ts/viz/funnel/item';

type TrackerHost = Funnel & {
  _tracker: Tracker;
  _dataKey: string;
};

const DATA_KEY_BASE = '__funnel_data_';

let dataKeyModifier = 0;
const proto = Funnel.prototype;
/// #DEBUG
let _TESTS_dataKey;
/// #ENDDEBUG
proto._eventsMap.onItemClick = { name: 'itemClick' };
proto._eventsMap.onLegendClick = { name: 'legendClick' };

const getDataKey = function (): string {
  const dataKey = DATA_KEY_BASE + dataKeyModifier;
  dataKeyModifier += 1;
  return dataKey;
};

export const plugin = {
  name: 'tracker',
  init(this: TrackerHost): void {
    const that = this;
    const dataKey = getDataKey();
    /// #DEBUG
    _TESTS_dataKey = dataKey;
    /// #ENDDEBUG
    const getProxyData = function (e: ThemeValue): ThemeValue {
      const rootOffset = that._renderer.getRootOffset();
      const x = Math.floor(e.pageX - rootOffset.left);
      const y = Math.floor(e.pageY - rootOffset.top);

      return that._hitTestTargets(x, y);
    };

    that._tracker = new Tracker({
      widget: that,
      root: that._renderer.root,
      getData(e: ThemeValue, tooltipData?: boolean): ThemeValue {
        const { target } = e;
        const data = target[dataKey];
        if (isDefined(data)) {
          return data;
        }
        const proxyData = getProxyData(e);

        if (tooltipData && proxyData && proxyData.type !== 'inside-label') {
          return;
        }

        return proxyData && proxyData.id;
      },
      getNode(index: number): Item {
        return that._items[index];
      },
      click(e): void {
        const proxyData = getProxyData(e.event);
        const dataType = proxyData && proxyData.type;
        const event = dataType === 'legend' ? 'legendClick' : 'itemClick';

        that._eventTrigger(event, {
          item: e.node,
          event: e.event,
        });
      },
    });

    this._dataKey = dataKey;
  },
  dispose(this: TrackerHost): void {
    this._tracker.dispose();
  },
  extenders: {
    _change_TILING(this: TrackerHost): void {
      const dataKey = this._dataKey;
      this._items.forEach((item, index) => {
        item.element.data(dataKey, index);
      });
    },
  },
};
/// #DEBUG
export { _TESTS_dataKey };
/// #ENDDEBUG
