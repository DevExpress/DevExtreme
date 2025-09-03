/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable array-callback-return */

// PLUGINS_SECTION
import componentRegistrator from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import { plugin } from '@ts/viz/core/data_source';
import baseWidget from '@ts/viz/core/m_base_widget';

import Item from './item';
import { addAlgorithm, getAlgorithm } from './tiling';
import dynamicSlope from './tiling.funnel';
import dynamicHeight from './tiling.pyramid';

const NODES_CREATE_CHANGE = 'NODES_CREATE';

addAlgorithm('dynamicslope', dynamicSlope, true);
addAlgorithm('dynamicheight', dynamicHeight);

function invertFigure(figure) {
  return figure.map((coord, index) => (index % 2 ? 1 - coord : coord));
}

function getLegendItemState(itemState) {
  return {
    fill: itemState.fill,
    hatching: itemState.hatching,
  };
}

const dxFunnel = baseWidget.inherit({
  _rootClass: 'dxf-funnel',

  _rootClassPrefix: 'dxf',

  _proxyData: [],

  _optionChangesMap: {
    dataSource: 'DATA_SOURCE',
    neckWidth: NODES_CREATE_CHANGE,
    neckHeight: NODES_CREATE_CHANGE,
    inverted: NODES_CREATE_CHANGE,
    algorithm: NODES_CREATE_CHANGE,
    item: NODES_CREATE_CHANGE,
    valueField: NODES_CREATE_CHANGE,
    argumentField: NODES_CREATE_CHANGE,
    colorField: NODES_CREATE_CHANGE,
    palette: NODES_CREATE_CHANGE,
    paletteExtensionMode: NODES_CREATE_CHANGE,
    sortData: NODES_CREATE_CHANGE,
  },

  _themeDependentChanges: [NODES_CREATE_CHANGE],

  _getDefaultSize() {
    return { width: 400, height: 400 };
  },

  _themeSection: 'funnel',

  _fontFields: ['legend.title.font', 'legend.title.subtitle.font', 'legend.font'],

  _optionChangesOrder: ['DATA_SOURCE'],

  _initialChanges: ['DATA_SOURCE'],

  _initCore() {
    this._group = this._renderer.g().append(this._renderer.root);
    this._items = [];
  },

  _eventsMap: {
    onHoverChanged: { name: 'hoverChanged' },
    onSelectionChanged: { name: 'selectionChanged' },
  },

  _disposeCore: noop,

  _applySize(rect) {
    this._rect = rect.slice();
    this._change(['TILING']);
    return this._rect;
  },

  _getAlignmentRect() {
    return this._rect;
  },

  _change_TILING() {
    const that = this;
    const items = that._items;
    const rect = that._rect;
    const convertCoord = function (coord, index) {
      const offset = index % 2;
      return rect[0 + offset] + (rect[2 + offset] - rect[0 + offset]) * coord;
    };

    this._group.clear();

    items.forEach((item, index) => {
      const coords = item.figure.map(convertCoord);
      const element = that._renderer.path([], 'area')
        .attr({
          points: coords,
        })
        .append(that._group);

      item.coords = coords;
      item.element = element;
    });

    this._requestChange(['TILES']);
  },

  _customChangesOrder: [NODES_CREATE_CHANGE, 'LAYOUT', 'TILING', 'TILES', 'DRAWN'],

  _dataSourceChangedHandler() {
    this._requestChange([NODES_CREATE_CHANGE]);
  },

  _change_DRAWN() {
    this._drawn();
  },

  _change_DATA_SOURCE() {
    this._change(['DRAWN']);
    this._updateDataSource();
  },

  _change_NODES_CREATE() {
    this._buildNodes();
  },

  _change_TILES() {
    this._applyTilesAppearance();
  },

  _suspend() {
    if (!this._applyingChanges) {
      this._suspendChanges();
    }
  },
  _resume() {
    if (!this._applyingChanges) {
      this._resumeChanges();
    }
  },

  _applyTilesAppearance() {
    this._items.forEach((item) => {
      const state = item.getState();
      item.element.smartAttr(item.states[state]);
    });
  },

  _hitTestTargets(x, y) {
    const that = this;
    let data;
    // @ts-expect-error
    this._proxyData.some((callback) => {
      data = callback.call(that, x, y);
      if (data) {
        return true;
      }
    });

    return data;
  },

  clearHover() {
    this._suspend();
    this._items.forEach((item) => {
      item.isHovered() && item.hover(false);
    });
    this._resume();
  },

  clearSelection() {
    this._suspend();
    this._items.forEach((item) => {
      item.isSelected() && item.select(false);
    });
    this._resume();
  },

  _getData() {
    const that = this;
    const data = that._dataSourceItems() || [];
    const valueField = that._getOption('valueField', true);
    const argumentField = that._getOption('argumentField', true);
    const colorField = that._getOption('colorField', true);
    const processedData = data.reduce((d, item) => {
      const value = Number(item[valueField]);
      if (value >= 0) {
        d[0].push({
          value,
          color: item[colorField],
          argument: item[argumentField],
          dataItem: item,
        });
        d[1] += value;
      }
      return d;
    }, [[], 0]);
    const items = processedData[0];

    if (data.length > 0 && items.length === 0) {
      that._incidentOccurred('E2005', valueField);
    }

    if (!processedData[1]) {
      return [];
    }

    if (that._getOption('sortData', true)) {
      items.sort((a, b) => b.value - a.value);
    }

    return items;
  },

  _buildNodes() {
    const that = this;
    const data = that._getData();
    const algorithm = getAlgorithm(that._getOption('algorithm', true));
    const percents = algorithm.normalizeValues(data);
    const itemOptions = that._getOption('item');
    const figures = algorithm.getFigures(percents, that._getOption('neckWidth', true), that._getOption('neckHeight', true));
    const palette = that._themeManager.createPalette(that._getOption('palette', true), {
      useHighlight: true,
      extensionMode: that._getOption('paletteExtensionMode', true),
      count: figures.length,
    });

    that._items = figures.map((figure, index) => {
      const curData = data[index];
      const node = new Item(that, {
        figure,
        data: curData,
        percent: percents[index],
        id: index,
        color: curData.color || palette.getNextColor(),
        itemOptions,
      });

      return node;
    });

    if (that._getOption('inverted', true)) {
      that._items.forEach((item) => {
        item.figure = invertFigure(item.figure);
      });
    }

    that._renderer.initDefsElements();
    that._change(['TILING', 'DRAWN']);
  },

  _showTooltip: noop,

  hideTooltip: noop,

  getAllItems() {
    return this._items.slice();
  },

  _getLegendData() {
    return this._items.map((item) => {
      const states = item.states;
      return {
        id: item.id,
        visible: true,
        text: item.argument,
        item,
        states: {
          normal: getLegendItemState(states.normal),
          hover: getLegendItemState(states.hover),
          selection: getLegendItemState(states.selection),
        },
      };
    });
  },

  _getMinSize() {
    const adaptiveLayout = this._getOption('adaptiveLayout');

    return [adaptiveLayout.width, adaptiveLayout.height];
  },
});

componentRegistrator('dxFunnel', dxFunnel);
export default dxFunnel;
dxFunnel.addPlugin(plugin);
