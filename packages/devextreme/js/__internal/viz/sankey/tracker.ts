/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-else-return */

import type { TrackerParameters } from '@ts/viz/components/tracker';
import { Tracker } from '@ts/viz/components/tracker';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

import Sankey from './sankey';

type TrackerHost = Sankey & {
  _tracker: Tracker;
  _dataKey: string;
};

const proto = Sankey.prototype;
const DATA_KEY_BASE = '__sankey_data_';
let dataKeyModifier = 0;
/// #DEBUG
let _TESTS_dataKey;
/// #ENDDEBUG

proto._eventsMap.onNodeClick = { name: 'nodeClick' };
proto._eventsMap.onLinkClick = { name: 'linkClick' };

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
    that._tracker = new Tracker({
      widget: that,
      root: that._renderer.root,
      getData(e: ThemeValue): ThemeValue {
        const { target } = e;
        return target[dataKey];
      },
      getNode(index: number): ThemeValue {
        if (index < that._nodes.length) {
          return that._nodes[index];
        } else {
          return that._links[index - that._nodes.length];
        }
      },
      click(this: TrackerParameters, e): void {
        const eventName = this.getData(e.event) < that._nodes.length ? 'nodeClick' : 'linkClick';
        that._eventTrigger(eventName, {
          target: e.node,
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
    _change_LINKS_DRAW(this: TrackerHost): void {
      const dataKey = this._dataKey;
      this._nodes.concat(this._links).forEach((item, index) => {
        item.element.data(dataKey, index);
      });
    },
  },
};
/// #DEBUG
export { _TESTS_dataKey };
/// #ENDDEBUG
