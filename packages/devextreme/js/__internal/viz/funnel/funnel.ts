/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
// PLUGINS_SECTION
import componentRegistrator from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import BaseWidget from '@ts/viz/core/base_widget';
import type { DataSourcePluginMembers } from '@ts/viz/core/data_source';
import { plugin } from '@ts/viz/core/data_source';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';

import Item from './item';
import { addAlgorithm, getAlgorithm } from './tiling';
import dynamicSlope from './tiling.funnel';
import dynamicHeight from './tiling.pyramid';

const NODES_CREATE_CHANGE = 'NODES_CREATE';

addAlgorithm('dynamicslope', dynamicSlope, true);
addAlgorithm('dynamicheight', dynamicHeight);

interface FunnelDataItem {
  value: number;
  color: ThemeValue;
  argument: ThemeValue;
  dataItem: ThemeValue;
}

interface FunnelItem {
  id: number;
  figure: number[];
  coords: number[];
  element: ThemeValue;
  argument: ThemeValue;
  value: number;
  percent: number;
  states: ThemeValue;
  getState: () => string;
  isHovered: () => boolean;
  hover: (state: boolean) => void;
  isSelected: () => boolean;
  select: (state: boolean) => void;
}

interface LegendItemState {
  fill: ThemeValue;
  hatching: ThemeValue;
}

type HitTestCallback = (this: Funnel, x: number, y: number) => ThemeValue;

function invertFigure(figure: number[]): number[] {
  return figure.map((coord, index) => (index % 2 ? 1 - coord : coord));
}

function getLegendItemState(itemState: ThemeValue): LegendItemState {
  return {
    fill: itemState.fill,
    hatching: itemState.hatching,
  };
}

interface Funnel extends DataSourcePluginMembers {}

class Funnel extends BaseWidget {
  _group;

  _items!: FunnelItem[];

  _rect!: number[];

  _proxyData!: HitTestCallback[];

  _getDefaultSize(): { width: number; height: number } {
    return { width: 400, height: 400 };
  }

  _initCore(): void {
    this._group = this._renderer.g().append(this._renderer.root);
    this._items = [];
  }

  _applySize(rect: number[]): number[] {
    this._rect = rect.slice();
    this._change(['TILING']);
    return this._rect;
  }

  _getAlignmentRect(): number[] {
    return this._rect;
  }

  _change_TILING(): void {
    const rect = this._rect;
    const convertCoord = (coord: number, index: number): number => {
      const offset = index % 2;
      return rect[0 + offset] + (rect[2 + offset] - rect[0 + offset]) * coord;
    };

    this._group.clear();

    this._items.forEach((item) => {
      const coords = item.figure.map(convertCoord);
      const element = this._renderer.path([], 'area')
        .attr({
          points: coords,
        })
        .append(this._group);

      item.coords = coords;
      item.element = element;
    });

    this._requestChange(['TILES']);
  }

  _dataSourceChangedHandler(): void {
    this._requestChange([NODES_CREATE_CHANGE]);
  }

  _change_DRAWN(): void {
    this._drawn();
  }

  _change_DATA_SOURCE(): void {
    this._change(['DRAWN']);
    this._updateDataSource();
  }

  _change_NODES_CREATE(): void {
    this._buildNodes();
  }

  _change_TILES(): void {
    this._applyTilesAppearance();
  }

  _suspend(): void {
    if (!this._applyingChanges) {
      this._suspendChanges();
    }
  }

  _resume(): void {
    if (!this._applyingChanges) {
      this._resumeChanges();
    }
  }

  _applyTilesAppearance(): void {
    this._items.forEach((item) => {
      const state = item.getState();
      item.element.smartAttr(item.states[state]);
    });
  }

  _hitTestTargets(x: number, y: number): ThemeValue {
    return this._proxyData.reduce<ThemeValue>(
      (found: ThemeValue, callback: HitTestCallback): ThemeValue => (
        found || callback.call(this, x, y)
      ),
      undefined,
    );
  }

  clearHover(): void {
    this._suspend();
    this._items.forEach((item) => {
      if (item.isHovered()) {
        item.hover(false);
      }
    });
    this._resume();
  }

  clearSelection(): void {
    this._suspend();
    this._items.forEach((item) => {
      if (item.isSelected()) {
        item.select(false);
      }
    });
    this._resume();
  }

  _getData(): FunnelDataItem[] {
    const data: ThemeValue[] = this._dataSourceItems() || [];
    const valueField = this._getOption('valueField', true);
    const argumentField = this._getOption('argumentField', true);
    const colorField = this._getOption('colorField', true);
    const initial: [FunnelDataItem[], number] = [[], 0];
    const processedData = data.reduce<[FunnelDataItem[], number]>((d, item: ThemeValue) => {
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
    }, initial);
    const items = processedData[0];

    if (data.length > 0 && items.length === 0) {
      this._incidentOccurred('E2005', valueField);
    }

    if (!processedData[1]) {
      return [];
    }

    if (this._getOption('sortData', true)) {
      items.sort((a, b) => b.value - a.value);
    }

    return items;
  }

  _buildNodes(): void {
    const data = this._getData();
    const algorithm = getAlgorithm(this._getOption('algorithm', true));
    const percents = algorithm.normalizeValues(data);
    const itemOptions = this._getOption('item');
    const figures = algorithm.getFigures(
      percents,
      this._getOption('neckWidth', true),
      this._getOption('neckHeight', true),
    );
    const palette = this._themeManager.createPalette(this._getOption('palette', true), {
      useHighlight: true,
      extensionMode: this._getOption('paletteExtensionMode', true),
      count: figures.length,
    });

    this._items = figures.map((figure: number[], index: number): ThemeValue => {
      const curData = data[index];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Item(this, {
        figure,
        data: curData,
        percent: percents[index],
        id: index,
        color: curData.color || palette.getNextColor(),
        itemOptions,
      });
    });

    if (this._getOption('inverted', true)) {
      this._items.forEach((item) => {
        item.figure = invertFigure(item.figure);
      });
    }

    this._renderer.initDefsElements();
    this._change(['TILING', 'DRAWN']);
  }

  getAllItems(): FunnelItem[] {
    return this._items.slice();
  }

  _getLegendData(): ThemeValue[] {
    return this._items.map((item) => {
      const { states } = item;
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
  }

  _getMinSize(): number[] {
    const adaptiveLayout: { width: number; height: number } = this._getOption('adaptiveLayout');

    return [adaptiveLayout.width, adaptiveLayout.height];
  }
}

setupWidgetPrototype(Funnel, {
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
  _themeSection: 'funnel',
  _fontFields: ['legend.title.font', 'legend.title.subtitle.font', 'legend.font'],
  _optionChangesOrder: ['DATA_SOURCE'],
  _initialChanges: ['DATA_SOURCE'],
  _eventsMap: {
    onHoverChanged: { name: 'hoverChanged' },
    onSelectionChanged: { name: 'selectionChanged' },
  },
  _disposeCore: noop,
  _customChangesOrder: [NODES_CREATE_CHANGE, 'LAYOUT', 'TILING', 'TILES', 'DRAWN'],
  _showTooltip: noop,
  hideTooltip: noop,
});

componentRegistrator('dxFunnel', Funnel);

Funnel.addPlugin(plugin);

export default Funnel;
