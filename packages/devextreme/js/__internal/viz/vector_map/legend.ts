/* eslint-disable import/no-import-module-exports */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { paintedColor } from '@ts/core/utils/css_variables';
import { extend } from '@ts/core/utils/m_extend';
import { each } from '@ts/core/utils/m_iterator';
import type { LegendDataItem } from '@ts/viz/components/legend';
import { Legend as _BaseLegend } from '@ts/viz/components/legend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const _extend = extend;
const _each = each;

const unknownSource = { category: 'UNKNOWN', name: 'UNKNOWN' };

interface LegendLayoutControl {
  addItem: (item: ThemeValue) => void;
  removeItem: (item: ThemeValue) => void;
  suspend: () => void;
  resume: () => void;
}

interface LegendDataExchanger {
  bind: (category: string, name: string, callback: (data: ThemeValue) => void) => void;
  unbind: (category: string, name: string, callback: (data: ThemeValue) => void) => void;
}

interface LegendParameters {
  renderer: ThemeValue;
  container: ThemeValue;
  widget: ThemeValue;
  layoutControl: LegendLayoutControl;
  themeManager: { theme: (name: string) => ThemeValue };
  dataExchanger: LegendDataExchanger;
  notifyDirty: () => void;
  notifyReady: () => void;
}

interface LegendDataSource {
  category: string;
  name: string;
}

function buildData(partition: number[], values: ThemeValue[], field: string): LegendDataItem[] {
  let i;
  const ii = values.length;
  const list = [];
  let item;
  for (i = 0; i < ii; ++i) {
    // @ts-expect-error the item gets its value, states and visibility right below
    list[i] = item = {
      start: partition[i],
      end: partition[i + 1],
      index: i,
    };
    item[field] = values[i];
    item.states = { normal: { fill: item.color } };
    item.visible = true;
  }
  return list;
}

let Legend = class Legend extends _BaseLegend {
  declare _params: LegendParameters;

  declare _root: ThemeValue;

  declare _onDataChanged: (data: ThemeValue) => void;

  declare _dataCategory: string;

  declare _dataName: string;

  declare updateLayout: () => void;

  declare locate: (x: number, y: number) => this;

  constructor(parameters: LegendParameters) {
    const root = parameters.renderer.g().attr({ class: 'dxm-legend' }).linkOn(parameters.container, { name: 'legend', after: 'legend-base' }).enableLinks()
      .linkAppend();
    super({
      renderer: parameters.renderer,
      widget: parameters.widget,
      group: root,
      backgroundClass: null,
      textField: 'text',
      getFormatObject(data) {
        return data.color === undefined
          ? data
          : { ...data, color: paintedColor(data.color, parameters.renderer.root.element) };
      },
    });
    const that = this;
    that._params = parameters;
    that._root = root;
    parameters.layoutControl.addItem(that);
    that._onDataChanged = function (data): void {
      that._updateData(data);
    };
  }

  dispose(): this {
    this._params.layoutControl.removeItem(this);
    this._unbindData();
    this._root.linkRemove().linkOff();
    // @ts-expect-error dispose() drops the references
    this._params = this._root = this._onDataChanged = null;
    return super.dispose();
  }

  // This method is called only by the layout
  resize(size: { width: number; height: number } | null): void {
    this._params.notifyDirty();
    if (size === null) {
      this.erase();
    } else {
      this.draw(size.width, size.height);
    }
    this._params.notifyReady();
  }

  _updateData(data: ThemeValue): void {
    this._options.defaultColor = data && data.defaultColor;
    this.update(data ? buildData(data.partition, data.values, this._dataName) : [], this._options, this._params.themeManager.theme('legend').title);
    this.updateLayout();
  }

  _unbindData(): void {
    if (this._dataCategory) {
      this._params.dataExchanger.unbind(this._dataCategory, this._dataName, this._onDataChanged);
    }
  }

  _bindData(arg: LegendDataSource): void {
    this._params.dataExchanger.bind(this._dataCategory = arg.category, this._dataName = arg.name, this._onDataChanged);
  }

  // The `_root` should be appended or removed here but there is no way to check if core.Legend is actually enabled or not
  setOptions(options: ThemeValue): this {
    this.update(this._data, options, this._params.themeManager.theme('legend').title);
    this._unbindData();
    const source = options.source;
    this._bindData(source ? { category: source.layer, name: source.grouping } : unknownSource);
    this.updateLayout();
    return this;
  }
};

_extend(Legend.prototype, {
  locate: _BaseLegend.prototype.shift,
});

export let LegendsControl = class LegendsControl {
  declare _params: LegendParameters;

  declare _items: InstanceType<typeof Legend>[];

  constructor(parameters: LegendParameters) {
    this._params = parameters;
    this._items = [];
    parameters.container.virtualLink('legend-base');
  }

  dispose(): void {
    _each(this._items, (_, item) => {
      item.dispose();
    });
    // @ts-expect-error dispose() drops the references
    this._params = this._items = null;
  }

  setOptions(options: ThemeValue[]): void {
    const optionList = options && options.length ? options : [];
    const items = this._items;
    let i;
    const ii = optionList.length;
    const params = this._params;
    const theme = params.themeManager.theme('legend');

    for (i = items.length; i < ii; ++i) {
      items[i] = new Legend(params);
    }
    for (i = items.length - 1; i >= ii; --i) {
      items[i].dispose();
      items.splice(i, 1);
    }
    params.layoutControl.suspend();
    for (i = 0; i < ii; ++i) {
      items[i].setOptions(_extend(true, {}, theme, optionList[i]));
    }
    params.layoutControl.resume();
  }
};

/// #DEBUG
const originalLegend = Legend;
export { Legend as _TESTS_Legend };

exports._TESTS_stubLegendType = function (stub): void {
  Legend = stub;
};

exports._TESTS_restoreLegendType = function (): void {
  Legend = originalLegend;
};
/// #ENDDEBUG

/// #DEBUG
export function DEBUG_set_LegendsControl(value: typeof LegendsControl): void {
  LegendsControl = value;
}
/// #ENDDEBUG
