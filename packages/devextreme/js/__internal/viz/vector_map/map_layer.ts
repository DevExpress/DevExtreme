/* eslint-disable spellcheck/spell-checker */
/* eslint-disable new-cap */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable max-depth */
/* eslint-disable no-bitwise */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable max-classes-per-file */
// @ts-expect-error DataHelperMixin is absent from the common/data d.ts
import { DataHelperMixin } from '@js/common/data';
import { noop } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined as _isDefined, isFunction as _isFunction } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import {
  normalizeEnum as _normalizeEnum,
  parseScalar as _parseScalar,
  patchFontOptions as _patchFontOptions,
} from '@ts/viz/core/utils';

const _noop = noop;
const _extend = extend;
const _each = each;
const _concat = Array.prototype.concat;

const TYPE_AREA = 'area';
const TYPE_LINE = 'line';
const TYPE_MARKER = 'marker';

const STATE_DEFAULT = 0;
const STATE_HOVERED = 1;
const STATE_SELECTED = 2;
const STATE_TO_INDEX = [0, 1, 2, 2];

const TOLERANCE = 1;

const SELECTIONS = {
  none: null,
  single: -1,
  multiple: NaN,
};

const _isArray = Array.isArray;
const _Number = Number;
const _String = String;
const _abs = Math.abs;
const _round = Math.round;
const _min = Math.min;
const _max = Math.max;
const _sqrt = Math.sqrt;

interface LayerTracker {
  on: (handlers: Record<string, (arg: ThemeValue) => void>) => () => void;
  reset: () => void;
}

interface LayerProjection {
  on: (handlers: Record<string, () => void>) => () => void;
  getTransform: () => { translateX: number; translateY: number };
}

interface MapLayerParams {
  renderer: ThemeValue;
  projection: LayerProjection;
  themeManager: ThemeValue;
  dataExchanger: ThemeValue;
  tracker: LayerTracker;
  dataKey: string;
  eventTrigger: (name: string, arg: ThemeValue) => void;
  notifyDirty: () => void;
  notifyReady: () => void;
  dataReady: () => void;
  tooltip?: ThemeValue;
  widget?: ThemeValue;
}

interface ElementProxy {
  coordinates: () => ThemeValue;
  attribute: (name?: string, value?: ThemeValue) => ThemeValue;
  selected: (state?: boolean, _noEvent?: boolean) => ThemeValue;
  applySettings: (settings: ThemeValue) => ThemeValue;
  index?: number;
  layer?: LayerProxy;
  text?: string;
}

interface LayerProxy {
  index: number;
  name: string;
  type?: string;
  elementType?: string;
  getElements: () => ElementProxy[];
  clearSelection: () => LayerProxy;
  getDataSource: () => ThemeValue;
  getBounds: () => ThemeValue;
}

type MapLayerElementInstance = InstanceType<typeof MapLayerElement>;

type MapLayerInstance = InstanceType<typeof MapLayer>;

interface LayerSelection {
  state: Record<number, MapLayerElementInstance | null>;
  single: number;
}

interface LayerContext {
  name: string;
  layer: LayerProxy;
  renderer: ThemeValue;
  projection: ThemeValue;
  params: MapLayerParams;
  dataKey: string;
  str: ThemeValue;
  hover: boolean;
  selection: LayerSelection | null;
  grouping: Record<string, ThemeValue>;
  root: ThemeValue;
  labelRoot?: ThemeValue;
  settings?: ThemeValue;
  hasSeparateLabel?: boolean;
}

export function getMaxBound(arr) {
  return arr.reduce((a, c) => (c ? [_min(a[0], c[0]),
    _min(a[1], c[1]),
    _max(a[2], c[2]),
    _max(a[3], c[3])] : a), arr[0]);
}

function getSelection(selectionMode) {
  let selection: ThemeValue = _normalizeEnum(selectionMode);
  selection = selection in SELECTIONS ? SELECTIONS[selection] : SELECTIONS.single;
  if (selection !== null) {
    selection = { state: {}, single: selection };
  }
  return selection;
}

function getName(opt, index) {
  return (opt[index] || {}).name;
}

class EmptySource {
  count(): number { return 0; }
}

class ArraySource {
  declare raw: ThemeValue;

  constructor(raw: ThemeValue) {
    this.raw = raw;
  }

  count(): number {
    return this.raw.length;
  }

  item(index: number): ThemeValue {
    return this.raw[index];
  }

  geometry(item: ThemeValue): { coordinates: ThemeValue } {
    return { coordinates: item.coordinates };
  }

  attributes(item: ThemeValue): ThemeValue {
    return item.attributes;
  }

  getBBox(index?: ThemeValue): ThemeValue {
    return arguments.length === 0 ? undefined : this.raw[index].bbox;
  }
}

class GeoJsonSource {
  declare raw: ThemeValue;

  constructor(raw: ThemeValue) {
    this.raw = raw;
  }

  count(): number {
    return this.raw.features.length;
  }

  item(index: number): ThemeValue {
    return this.raw.features[index];
  }

  geometry(item: ThemeValue): ThemeValue {
    return item.geometry;
  }

  attributes(item: ThemeValue): ThemeValue {
    return item.properties;
  }

  getBBox(index?: ThemeValue): ThemeValue {
    return arguments.length === 0 ? this.raw.bbox : this.raw.features[index].bbox;
  }
}

function isGeoJsonObject(obj) {
  return _isArray(obj.features);
}

// The problem is that when remote source returns an object (not an array) the data.DataSource internally wraps it into array (of one element)
// So specific `if` clause is required to recognize GeoJson object in the returned `items`
function unwrapFromDataSource(source) {
  let sourceType;
  if (source) {
    if (isGeoJsonObject(source)) {
      sourceType = GeoJsonSource;
    } else if (source.length === 1 && source[0] && isGeoJsonObject(source[0])) {
      sourceType = GeoJsonSource;
      source = source[0];
    } else if (_isArray(source)) {
      sourceType = ArraySource;
    }
  }
  sourceType = sourceType || EmptySource;
  return new sourceType(source);
}

// The first problem is that when our DataSource is updated with an object (not an array) it considers such object a bunch of options.
// So single object has to be wrapped into array in order to be passed to the data.DataSource as is.
// The second problem is that when our DataSource is updated with `null` or `undefined` it does nothing - callback is not triggered (it is because of charts).
// So `null` or `undefined` is changed to empty array.
function wrapToDataSource(option) {
  return option ? isGeoJsonObject(option) ? [option] : option : [];
}

function customizeHandles(proxies, callback, widget) {
  callback.call(widget, proxies);
}

// TODO: Consider moving it inside a strategy
function setAreaLabelVisibility(label) {
  label.text.attr({ visibility: label.size[0] / label.spaceSize[0] < TOLERANCE && label.size[1] / label.spaceSize[1] < TOLERANCE ? null : 'hidden' });
}

// TODO: Consider moving it inside a strategy
function setLineLabelVisibility(label) {
  label.text.attr({ visibility: label.size[0] / label.spaceSize[0] < TOLERANCE || label.size[1] / label.spaceSize[1] < TOLERANCE ? null : 'hidden' });
}

function getDataValue(proxy, dataField) {
  return proxy.attribute(dataField);
}

const TYPE_TO_TYPE_MAP = {
  Point: TYPE_MARKER,
  MultiPoint: TYPE_LINE,
  LineString: TYPE_LINE,
  MultiLineString: TYPE_LINE,
  Polygon: TYPE_AREA,
  MultiPolygon: TYPE_AREA,
};

function pick(a, b) {
  return a !== undefined ? a : b;
}

function guessTypeByData(sample) {
  let type = TYPE_TO_TYPE_MAP[sample.type];
  const coordinates = sample.coordinates;
  if (!type) {
    if (typeof coordinates[0] === 'number') {
      type = TYPE_MARKER;
    } else if (typeof coordinates[0][0] === 'number') {
      type = TYPE_LINE;
    } else {
      type = TYPE_AREA;
    }
  }
  return type;
}

const emptyStrategy = {
  setup: _noop,

  reset: _noop,

  arrange: _noop,

  updateGrouping: _noop,

  getDefaultColor: _noop,
};

const strategiesByType = {};
const strategiesByGeometry = {};
const strategiesByElementType = {};
let groupByColor;
let groupBySize;

let selectStrategy = function (options, data) {
  let type = _normalizeEnum(options.type);
  let elementType = _normalizeEnum(options.elementType);
  let sample;
  const strategy = _extend({}, emptyStrategy);
  if (data.count() > 0) {
    sample = data.geometry(data.item(0));
    type = strategiesByType[type] ? type : guessTypeByData(sample);
    _extend(strategy, strategiesByType[type]);
    strategy.fullType = strategy.type = type;
    if (strategiesByGeometry[type]) {
      _extend(strategy, strategiesByGeometry[type](sample));
    }
    if (strategiesByElementType[type]) {
      elementType = strategiesByElementType[type][elementType] ? elementType : strategiesByElementType[type]._default;
      _extend(strategy, strategiesByElementType[type][elementType]);
      strategy.elementType = elementType;
      strategy.fullType += `:${elementType}`;
    }
  }
  return strategy;
};

function applyElementState(figure, styles, state, field) {
  figure[field].attr(styles[field][state]);
}

strategiesByType[TYPE_AREA] = {
  projectLabel: projectAreaLabel,

  transform: transformPointList,

  transformLabel: transformAreaLabel,

  draw(context, figure, data) {
    figure.root = context.renderer.path([], 'area').data(context.dataKey, data);
  },

  refresh: _noop,

  getLabelOffset(label) {
    setAreaLabelVisibility(label);
    return [0, 0];
  },

  getStyles(settings) {
    const color = settings.color || null;
    const borderColor = settings.borderColor || null;
    const borderWidth = pick(settings.borderWidth, null);
    const opacity = pick(settings.opacity, null);
    return {
      root: [
        {
          class: 'dxm-area', stroke: borderColor, 'stroke-width': borderWidth, fill: color, opacity,
        },
        {
          class: 'dxm-area dxm-area-hovered', stroke: settings.hoveredBorderColor || borderColor, 'stroke-width': pick(settings.hoveredBorderWidth, borderWidth), fill: settings.hoveredColor || color, opacity: pick(settings.hoveredOpacity, opacity),
        },
        {
          class: 'dxm-area dxm-area-selected', stroke: settings.selectedBorderColor || borderColor, 'stroke-width': pick(settings.selectedBorderWidth, borderWidth), fill: settings.selectedColor || color, opacity: pick(settings.selectedOpacity, opacity),
        },
      ],
    };
  },

  setState(figure, styles, state) {
    applyElementState(figure, styles, state, 'root');
  },

  hasLabelsGroup: true,

  updateGrouping(context) {
    groupByColor(context);
  },

  getDefaultColor: _noop,
};

strategiesByType[TYPE_LINE] = {
  projectLabel: projectLineLabel,

  transform: transformPointList,

  transformLabel: transformLineLabel,

  draw(context, figure, data) {
    figure.root = context.renderer.path([], 'line').data(context.dataKey, data);
  },

  refresh: _noop,

  getLabelOffset(label) {
    setLineLabelVisibility(label);
    return [0, 0];
  },

  getStyles(settings) {
    const color = settings.color || settings.borderColor || null;
    const width = pick(settings.borderWidth, null);
    const opacity = pick(settings.opacity, null);
    return {
      root: [
        {
          class: 'dxm-line', stroke: color, 'stroke-width': width, opacity,
        },
        {
          class: 'dxm-line dxm-line-hovered', stroke: settings.hoveredColor || settings.hoveredBorderColor || color, 'stroke-width': pick(settings.hoveredBorderWidth, width), opacity: pick(settings.hoveredOpacity, opacity),
        },
        {
          class: 'dxm-line dxm-line-selected', stroke: settings.selectedColor || settings.selectedBorderColor || color, 'stroke-width': pick(settings.selectedBorderWidth, width), opacity: pick(settings.selectedOpacity, opacity),
        },
      ],
    };
  },

  setState(figure, styles, state) {
    applyElementState(figure, styles, state, 'root');
  },

  hasLabelsGroup: true,

  updateGrouping(context) {
    groupByColor(context);
  },

  getDefaultColor: _noop,
};

strategiesByType[TYPE_MARKER] = {
  project: projectPoint,

  transform: transformPoint,

  draw(context, figure, data) {
    figure.root = context.renderer.g();
    this._draw(context, figure, data);
  },

  refresh: _noop,

  hasLabelsGroup: false,

  getLabelOffset(label, settings) {
    return [_round((label.size[0] + _max(settings.size || 0, 0)) / 2) + 2, 0];
  },

  getStyles(settings) {
    const styles = {
      root: [
        { class: 'dxm-marker' },
        { class: 'dxm-marker dxm-marker-hovered' },
        { class: 'dxm-marker dxm-marker-selected' },
      ],
    };
    this._getStyles(styles, settings);
    return styles;
  },

  setState(figure, styles, state) {
    applyElementState(figure, styles, state, 'root');
    this._setState(figure, styles, state);
  },

  updateGrouping(context) {
    groupByColor(context);
    groupBySize(context);
  },

  getDefaultColor(ctx, palette) {
    return ctx.params.themeManager.getAccentColor(palette);
  },
};

function projectAreaByGeometry(projection, coordinates) {
  return coordinates[0]
    && coordinates[0][0]
    && coordinates[0][0][0]
    && typeof coordinates[0][0][0][0] === 'number'
    ? projectMultiPolygon(projection, coordinates)
    : projectPolygon(projection, coordinates);
}

strategiesByGeometry[TYPE_AREA] = function () {
  return { project: projectAreaByGeometry };
};

function projectLineByGeometry(projection, coordinates) {
  return coordinates[0]
    && coordinates[0][0]
    && typeof coordinates[0][0][0] === 'number'
    ? projectPolygon(projection, coordinates)
    : projectLineString(projection, coordinates);
}

strategiesByGeometry[TYPE_LINE] = function () {
  return { project: projectLineByGeometry };
};

strategiesByElementType[TYPE_MARKER] = {
  _default: 'dot',

  dot: {
    setup(context) {
      context.filter = context.renderer.shadowFilter('-40%', '-40%', '180%', '200%', 0, 1, 1, '#000000', 0.2);
    },

    reset(context) {
      context.filter.dispose();
      context.filter = null;
    },

    _draw(ctx, figure, data) {
      figure.back = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
      figure.dot = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
    },

    refresh(ctx, figure, data, proxy, settings) {
      figure.dot.attr({ filter: settings.shadow ? ctx.filter.id : null });
    },

    _getStyles(styles, style) {
      const size = style.size > 0 ? _Number(style.size) : 0;
      const hoveredSize = size;
      const selectedSize = size + (style.selectedStep > 0 ? _Number(style.selectedStep) : 0);
      const hoveredBackSize = hoveredSize + (style.backStep > 0 ? _Number(style.backStep) : 0);
      const selectedBackSize = selectedSize + (style.backStep > 0 ? _Number(style.backStep) : 0);
      const color = style.color || null;
      const borderColor = style.borderColor || null;
      const borderWidth = pick(style.borderWidth, null);
      const opacity = pick(style.opacity, null);
      const backColor = style.backColor || null;
      const backOpacity = pick(style.backOpacity, null);
      styles.dot = [
        {
          r: size / 2, stroke: borderColor, 'stroke-width': borderWidth, fill: color, opacity,
        },
        {
          r: hoveredSize / 2, stroke: style.hoveredBorderColor || borderColor, 'stroke-width': pick(style.hoveredBorderWidth, borderWidth), fill: style.hoveredColor || color, opacity: pick(style.hoveredOpacity, opacity),
        },
        {
          r: selectedSize / 2, stroke: style.selectedBorderColor || borderColor, 'stroke-width': pick(style.selectedBorderWidth, borderWidth), fill: style.selectedColor || color, opacity: pick(style.selectedOpacity, opacity),
        },
      ];
      styles.back = [
        {
          r: size / 2, stroke: 'none', 'stroke-width': 0, fill: backColor, opacity: backOpacity,
        },
        {
          r: hoveredBackSize / 2, stroke: 'none', 'stroke-width': 0, fill: backColor, opacity: backOpacity,
        },
        {
          r: selectedBackSize / 2, stroke: 'none', 'stroke-width': 0, fill: backColor, opacity: backOpacity,
        },
      ];
    },

    _setState(figure, styles, state) {
      applyElementState(figure, styles, state, 'dot');
      applyElementState(figure, styles, state, 'back');
    },
  },

  bubble: {
    _draw(ctx, figure, data) {
      figure.bubble = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
    },

    refresh(ctx, figure, data, proxy, settings) {
      figure.bubble.attr({ r: settings.size / 2 });
    },

    _getStyles(styles, style) {
      const color = style.color || null;
      const borderColor = style.borderColor || null;
      const borderWidth = pick(style.borderWidth, null);
      const opacity = pick(style.opacity, null);
      styles.bubble = [
        {
          stroke: borderColor, 'stroke-width': borderWidth, fill: color, opacity,
        },
        {
          stroke: style.hoveredBorderColor || borderColor, 'stroke-width': pick(style.hoveredBorderWidth, borderWidth), fill: style.hoveredColor || style.color, opacity: pick(style.hoveredOpacity, opacity),
        },
        {
          stroke: style.selectedBorderColor || borderColor, 'stroke-width': pick(style.selectedBorderWidth, borderWidth), fill: style.selectedColor || style.color, opacity: pick(style.selectedOpacity, opacity),
        },
      ];
    },

    _setState(figure, styles, state) {
      applyElementState(figure, styles, state, 'bubble');
    },

    arrange(context, handles) {
      const values: number[] = [];
      let i;
      const ii = values.length = handles.length;
      const settings = context.settings;
      const dataField = settings.dataField;
      const minSize = settings.minSize > 0 ? _Number(settings.minSize) : 0;
      const maxSize = settings.maxSize > minSize ? _Number(settings.maxSize) : minSize;

      if (settings.sizeGroups) {
        return;
      }

      for (i = 0; i < ii; ++i) {
        values[i] = _max(getDataValue(handles[i].proxy, dataField) || 0, 0);
      }
      const minValue = _min.apply(null, values);
      const maxValue = _max.apply(null, values);
      const deltaValue = (maxValue - minValue) || 1;
      const deltaSize = maxSize - minSize;
      for (i = 0; i < ii; ++i) {
        handles[i]._settings.size = minSize + deltaSize * (values[i] - minValue) / deltaValue;
      }
    },

    updateGrouping(context) {
      const dataField = context.settings.dataField;
      strategiesByType[TYPE_MARKER].updateGrouping(context);
      groupBySize(context, (proxy) => getDataValue(proxy, dataField));
    },
  },

  pie: {
    _draw(ctx, figure, data) {
      figure.pie = ctx.renderer.g().append(figure.root);
      figure.border = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
    },

    refresh(ctx, figure, data, proxy, settings) {
      const values = getDataValue(proxy, ctx.settings.dataField) || [];
      const colors = settings._colors;
      let sum = 0;
      const pie = figure.pie;
      const renderer = ctx.renderer;
      const dataKey = ctx.dataKey;
      const r = (settings.size > 0 ? _Number(settings.size) : 0) / 2;
      let start = 90;
      let end = start;
      let zeroSum = false;

      sum = values.reduce((total, item) => total + (item || 0), 0);

      if (sum === 0) {
        zeroSum = true;
        sum = 360 / values.length;
      }

      values.forEach((item, i) => {
        start = end;
        end += zeroSum ? sum : (item || 0) / sum * 360;
        renderer.arc(0, 0, 0, r, start, end).attr({ 'stroke-linejoin': 'round', fill: colors[i] }).data(dataKey, data).append(pie);
      });
      figure.border.attr({ r });
    },

    _getStyles(styles, style) {
      const opacity = pick(style.opacity, null);
      const borderColor = style.borderColor || null;
      const borderWidth = pick(style.borderWidth, null);
      styles.pie = [
        { opacity },
        { opacity: pick(style.hoveredOpacity, opacity) },
        { opacity: pick(style.selectedOpacity, opacity) },
      ];
      styles.border = [
        { stroke: borderColor, 'stroke-width': borderWidth },
        { stroke: style.hoveredBorderColor || borderColor, 'stroke-width': pick(style.hoveredBorderWidth, borderWidth) },
        { stroke: style.selectedBorderColor || borderColor, 'stroke-width': pick(style.selectedBorderWidth, borderWidth) },
      ];
    },

    _setState(figure, styles, state) {
      applyElementState(figure, styles, state, 'pie');
      applyElementState(figure, styles, state, 'border');
    },

    arrange(context, handles) {
      let i;
      const ii = handles.length;
      const dataField = context.settings.dataField;
      let values;
      let count = 0;
      let palette;
      for (i = 0; i < ii; ++i) {
        values = getDataValue(handles[i].proxy, dataField);
        if (values && values.length > count) {
          count = values.length;
        }
      }
      if (count > 0) {
        palette = context.params.themeManager.createPalette(context.settings.palette, { useHighlight: true, extensionMode: 'alternate' });
        values = palette.generateColors(count);

        context.settings._colors = values;
        context.grouping.color = {
          callback: _noop, field: '', partition: [], values: [],
        };
        context.params.dataExchanger.set(context.name, 'color', { partition: [], values });
      }
    },
  },

  image: {
    _draw(ctx, figure, data) {
      figure.image = ctx.renderer.image(null, null, null, null, null, 'center')
        .attr({ 'pointer-events': 'visible' })// T567545
        .data(ctx.dataKey, data)
        .append(figure.root);
    },

    refresh(ctx, figure, data, proxy) {
      figure.image.attr({ href: getDataValue(proxy, ctx.settings.dataField) });
    },

    _getStyles(styles, style) {
      const size = style.size > 0 ? _Number(style.size) : 0;
      const hoveredSize = size + (style.hoveredStep > 0 ? _Number(style.hoveredStep) : 0);
      const selectedSize = size + (style.selectedStep > 0 ? _Number(style.selectedStep) : 0);
      const opacity = pick(style.opacity, null);
      styles.image = [
        {
          x: -size / 2, y: -size / 2, width: size, height: size, opacity,
        },
        {
          x: -hoveredSize / 2, y: -hoveredSize / 2, width: hoveredSize, height: hoveredSize, opacity: pick(style.hoveredOpacity, opacity),
        },
        {
          x: -selectedSize / 2, y: -selectedSize / 2, width: selectedSize, height: selectedSize, opacity: pick(style.selectedOpacity, opacity),
        },
      ];
    },

    _setState(figure, styles, state) {
      applyElementState(figure, styles, state, 'image');
    },
  },
};

function projectPoint(projection, coordinates) {
  return projection.project(coordinates);
}

function projectPointList(projection, coordinates) {
  const output: number[][] = [];
  let i;
  const ii = output.length = coordinates.length;
  for (i = 0; i < ii; ++i) {
    output[i] = projection.project(coordinates[i]);
  }
  return output;
}

function projectLineString(projection, coordinates) {
  return [projectPointList(projection, coordinates)];
}

function projectPolygon(projection, coordinates) {
  const output: number[][][] = [];
  let i;
  const ii = output.length = coordinates.length;
  for (i = 0; i < ii; ++i) {
    output[i] = projectPointList(projection, coordinates[i]);
  }
  return output;
}

function projectMultiPolygon(projection, coordinates) {
  const output: number[][][][] = [];
  let i;
  const ii = output.length = coordinates.length;
  for (i = 0; i < ii; ++i) {
    output[i] = projectPolygon(projection, coordinates[i]);
  }
  return _concat.apply([], output);
}

function transformPoint(content, projection, coordinates) {
  const data = projection.transform(coordinates);
  content.root.attr({ translateX: data[0], translateY: data[1] });
}

function transformList(projection, coordinates) {
  const output: number[] = [];
  let i;
  const ii = coordinates.length;
  let item;
  let k = 0;
  output.length = 2 * ii;
  for (i = 0; i < ii; ++i) {
    item = projection.transform(coordinates[i]);
    output[k++] = item[0];
    output[k++] = item[1];
  }
  return output;
}

function transformPointList(content, projection, coordinates) {
  const output: number[][] = [];
  let i;
  const ii = output.length = coordinates.length;
  for (i = 0; i < ii; ++i) {
    output[i] = transformList(projection, coordinates[i]);
  }
  content.root.attr({ points: output });
}

function transformAreaLabel(label, projection, coordinates) {
  const data = projection.transform(coordinates[0]);
  label.spaceSize = projection.getSquareSize(coordinates[1]);
  label.text.attr({ translateX: data[0], translateY: data[1] });
  setAreaLabelVisibility(label);
}

function transformLineLabel(label, projection, coordinates) {
  const data = projection.transform(coordinates[0]);
  label.spaceSize = projection.getSquareSize(coordinates[1]);
  label.text.attr({ translateX: data[0], translateY: data[1] });
  setLineLabelVisibility(label);
}

function getItemSettings(context, proxy, settings) {
  const result = combineSettings(context.settings, settings);
  applyGrouping(context.grouping, proxy, result);
  if (settings.color === undefined && settings.paletteIndex >= 0) {
    result.color = result._colors[settings.paletteIndex];
  }
  return result;
}

function applyGrouping(grouping, proxy, settings) {
  _each(grouping, (name, data) => {
    const index = findGroupingIndex(data.callback(proxy, data.field), data.partition);
    if (index >= 0) {
      settings[name] = data.values[index];
    }
  });
}

function findGroupingIndex(value, partition) {
  let start = 0;
  let end = partition.length - 1;
  let index = -1;
  let middle;
  if (partition[start] <= value && value <= partition[end]) {
    if (value === partition[end]) {
      index = end - 1;
    } else {
      while (end - start > 1) {
        middle = (start + end) >> 1;
        if (value < partition[middle]) {
          end = middle;
        } else {
          start = middle;
        }
      }
      index = start;
    }
  }
  return index;
}

function raiseChanged(context, handle, state, name) {
  context.params.eventTrigger(name, { target: handle.proxy, state });
}

// This is required because `$.extend` cannot be used - because of the `options.data` which is commonly a very large array
// TODO: Try to use our simple `extend` instead of `$.extend`
function combineSettings(common, partial) {
  const obj = _extend({}, common, partial);
  obj.label = _extend({}, common.label, obj.label);
  obj.label.font = _extend({}, common.label.font, obj.label.font);
  return obj;
}

function processCommonSettings(context, options) {
  const themeManager = context.params.themeManager;
  const strategy = context.str;
  const settings = combineSettings(_extend({ label: {}, color: strategy.getDefaultColor(context, options.palette) }, themeManager.theme(`layer:${strategy.fullType}`)), options);
  let colors;
  let i;
  let palette;
  if (settings.paletteSize > 0) {
    palette = themeManager.createDiscretePalette(settings.palette, settings.paletteSize);
    for (i = 0, colors = []; i < settings.paletteSize; ++i) {
      colors.push(palette.getColor(i));
    }
    settings._colors = colors;
  }
  return settings;
}

function valueCallback(proxy, dataField) {
  return proxy.attribute(dataField);
}

let performGrouping = function (context, partition, settingField, dataField, valuesCallback) {
  let values;
  if (dataField && partition && partition.length > 1) {
    values = valuesCallback(partition.length - 1);
    context.grouping[settingField] = {
      callback: _isFunction(dataField) ? dataField : valueCallback,
      field: dataField,
      partition,
      values,
    };
    context.params.dataExchanger.set(context.name, settingField, { partition, values, defaultColor: context.settings.color });
  }
};

function dropGrouping(context) {
  const name = context.name;
  const dataExchanger = context.params.dataExchanger;
  _each(context.grouping, (field) => {
    dataExchanger.set(name, field, null);
  });
  context.grouping = {};
}

groupByColor = function (context) {
  performGrouping(context, context.settings.colorGroups, 'color', context.settings.colorGroupingField, (count) => {
    const _palette = context.params.themeManager.createDiscretePalette(context.settings.palette, count);
    let i;
    const list: string[] = [];
    for (i = 0; i < count; ++i) {
      list.push(_palette.getColor(i));
    }
    return list;
  });
};

groupBySize = function (context, valueCallback) {
  const settings = context.settings;
  performGrouping(context, settings.sizeGroups, 'size', valueCallback || settings.sizeGroupingField, (count) => {
    const minSize = settings.minSize > 0 ? _Number(settings.minSize) : 0;
    const maxSize = settings.maxSize >= minSize ? _Number(settings.maxSize) : 0;
    let i = 0;
    const sizes: number[] = [];
    if (count > 1) {
      for (i = 0; i < count; ++i) {
        sizes.push((minSize * (count - i - 1) + maxSize * i) / (count - 1));
      }
    } else if (count === 1) {
      sizes.push((minSize + maxSize) / 2);
    }
    return sizes;
  });
};

function setFlag(flags, flag, state) {
  if (state) {
    flags |= flag;
  } else {
    flags &= ~flag;
  }
  return flags;
}

function hasFlag(flags, flag) {
  return !!(flags & flag);
}

function createLayerProxy(layer, name, index) {
  const proxy = {
    index,

    name,

    getElements() {
      return layer.getProxies();
    },

    clearSelection() {
      layer.clearSelection();
      return proxy;
    },

    getDataSource() {
      return layer.getDataSource();
    },

    getBounds() {
      return layer.getBounds();
    },
  };
  return proxy;
}

let MapLayer = class MapLayer {
  declare _params: MapLayerParams;

  declare _removeHandlers: () => void;

  declare proxy: LayerProxy;

  declare _context: LayerContext;

  declare _container: ThemeValue;

  declare _options: ThemeValue;

  declare _handles: MapLayerElementInstance[];

  declare _data: ThemeValue;

  declare _dataSourceLoaded: ReturnType<typeof Deferred> | null;

  declare _options_dataSource: ThemeValue;

  declare _specificDataSourceOption: ThemeValue;

  declare _dataSource: ThemeValue;

  declare _refreshDataSource: () => void;

  declare _disposeDataSource: () => void;

  constructor(params: MapLayerParams, container: ThemeValue, name: string, index: number) {
    this._params = params;
    this._onProjection();
    this.proxy = createLayerProxy(this, name, index);
    this._context = {
      name,
      layer: this.proxy,
      renderer: params.renderer,
      projection: params.projection,
      params,
      dataKey: params.dataKey,
      str: emptyStrategy,
      hover: false,
      selection: null,
      grouping: {},
      // TODO: Link name should be built upon layer index rather than name
      root: params.renderer.g().attr({ class: 'dxm-layer' }).linkOn(container, name).linkAppend(),
    };
    this._container = container;
    this._options = {};
    // Though the `_handles` field is set in the `_createHandles` it is required here because projection events are fired before data is set
    this._handles = [];
    // The `_data` field may be accessed in the `setOptions` when data is not set
    this._data = new EmptySource();
    this._dataSourceLoaded = null;
  }

  getDataReadyCallback(): ReturnType<typeof Deferred> | null {
    return this._dataSourceLoaded;
  }

  _onProjection(): void {
    const that = this;
    that._removeHandlers = that._params.projection.on({
      engine() {
        that._project();
      },
      screen() {
        that._transform();
      },
      center() {
        that._transformCore();
      },
      zoom() {
        that._transform();
      },
    });
  }

  getData(): ThemeValue {
    return this._data;
  }

  _dataSourceLoadErrorHandler(): void {
    this._dataSourceChangedHandler();
  }

  _dataSourceChangedHandler(): void {
    this._data = unwrapFromDataSource(this._dataSource && this._dataSource.items());
    this._update(true);
  }

  _dataSourceOptions(): { paginate: boolean } {
    return { paginate: false };
  }

  _getSpecificDataSourceOption(): ThemeValue {
    return this._specificDataSourceOption;
  }

  _normalizeDataSource(dataSource: ThemeValue): ThemeValue {
    const store = dataSource.store();
    if (store._loadMode === 'raw') {
      store._loadMode = undefined;
    }
    return dataSource;
  }

  _offProjection(): void {
    this._removeHandlers();
    // @ts-expect-error the projection subscription is released
    this._removeHandlers = null;
  }

  dispose(): this {
    this._disposeDataSource();
    this._destroyHandles();
    dropGrouping(this._context);
    this._context.root.linkRemove().linkOff();
    this._context.labelRoot && this._context.labelRoot.linkRemove().linkOff();
    this._context.str.reset(this._context);
    this._offProjection();
    // @ts-expect-error dispose releases the parameters, the container, the context and the proxy
    this._params = this._container = this._context = this.proxy = null;
    return this;
  }

  /// #DEBUG
  TESTS_getContext(): LayerContext {
    return this._context;
  }
  /// #ENDDEBUG

  setOptions(options: ThemeValue): void {
    options = this._options = options || {};
    this._dataSourceLoaded = Deferred();
    if ('dataSource' in options && options.dataSource !== this._options_dataSource) {
      this._options_dataSource = options.dataSource;
      this._params.notifyDirty();
      this._specificDataSourceOption = wrapToDataSource(options.dataSource);
      this._refreshDataSource();
    } else if (this._data.count() > 0) {
      this._params.notifyDirty();
      this._update((options.type !== undefined && options.type !== this._context.str.type)
                || (options.elementType !== undefined && options.elementType !== this._context.str.elementType));
    }
    this._transformCore();
  }

  _update(isContextChanged: boolean): void {
    const context = this._context;
    if (isContextChanged) {
      context.str.reset(context);
      context.root.clear();
      context.labelRoot && context.labelRoot.clear();
      this._params.tracker.reset(); // T173037; TODO: There is no need to reset the entire tracker - only its memory about items
      this._destroyHandles();
      context.str = selectStrategy(this._options, this._data);
      context.str.setup(context);
      this.proxy.type = context.str.type;
      this.proxy.elementType = context.str.elementType;
    }
    context.settings = processCommonSettings(context, this._options);
    context.hasSeparateLabel = !!(context.settings.label.enabled && context.str.hasLabelsGroup);
    context.hover = !!_parseScalar(context.settings.hoverEnabled, true);
    // There is intentionally no attempt to preserve previous selection (or part of it)
    // Otherwise it would require some stack-like structure to keep selected items
    // Let's not complicate
    if (context.selection) {
      _each(context.selection.state, (_, handle) => {
        handle && handle.resetSelected();
      });
    }
    context.selection = getSelection(context.settings.selectionMode);
    if (context.hasSeparateLabel) {
      if (!context.labelRoot) {
        // TODO: Link name should be built upon layer index rather than name
        context.labelRoot = context.renderer.g().attr({ class: 'dxm-layer-labels' }).linkOn(this._container, { name: `${context.name}-labels`, after: context.name }).linkAppend();
        this._transformCore();
      }
    } else if (context.labelRoot) {
      context.labelRoot.linkRemove().linkOff();
      context.labelRoot = null;
    }
    if (isContextChanged) {
      this._createHandles();
    }
    dropGrouping(context);
    context.str.arrange(context, this._handles);
    context.str.updateGrouping(context);
    this._updateHandles();
    this._params.notifyReady();
    if (this._dataSourceLoaded) { // T890687
      this._dataSourceLoaded.resolve();
      this._dataSourceLoaded = null;
    } else {
      this._params.dataReady();
    }
  }

  getBounds(): ThemeValue {
    return getMaxBound(this._handles.map(({ proxy }) => proxy.coordinates().map((coords) => {
      if (!_isArray(coords)) {
        return;
      }

      const coordsToBoundsSearch = _isArray(coords[0][0])
        ? coords.reduce((ac, val) => ac.concat(val), [])
        : coords;

      const initValue = coordsToBoundsSearch[0];

      return coordsToBoundsSearch.reduce((min, c) => [_min(min[0], c[0]), _min(min[1], c[1]), _max(min[2], c[0]), _max(min[3], c[1])], [initValue[0], initValue[1], initValue[0], initValue[1]]);
    })).map(getMaxBound));
  }

  _destroyHandles(): void {
    this._handles.forEach((h) => h.dispose());

    if (this._context.selection) {
      this._context.selection.state = {};
    }
    this._handles = [];
  }

  _createHandles(): void {
    const handles: MapLayerElementInstance[] = this._handles = [];
    const data = this._data;
    let i;
    const ii = handles.length = data.count();
    const context = this._context;
    const geometry = data.geometry;
    const attributes = data.attributes;
    let handle;
    let dataItem;
    for (i = 0; i < ii; ++i) {
      dataItem = data.item(i);
      handles[i] = new MapLayerElement(context, i, geometry(dataItem), attributes(dataItem));
    }
    // Customization must be performed before anything else happens to element (that is the idea of customization)
    _isFunction(this._options.customize) && customizeHandles(this.getProxies(), this._options.customize, this._params.widget);

    for (i = 0; i < ii; ++i) {
      handle = handles[i];
      handle.project();
      handle.draw();
      handle.transform();
    }
    if (context.selection) {
      _each(context.selection.state, (_, handle) => {
        handle && handle.restoreSelected();
      });
    }
  }

  _updateHandles(): void {
    const handles = this._handles;
    let i;
    const ii = handles.length;
    for (i = 0; i < ii; ++i) {
      handles[i].refresh();
    }
    if (this._context.settings.label.enabled) {
      for (i = 0; i < ii; ++i) {
        handles[i].measureLabel();
      }
      for (i = 0; i < ii; ++i) {
        handles[i].adjustLabel();
      }
    }
  }

  _transformCore(): void {
    const transform = this._params.projection.getTransform();
    this._context.root.attr(transform);
    this._context.labelRoot && this._context.labelRoot.attr(transform);
  }

  _project(): void {
    const handles = this._handles;
    let i;
    const ii = handles.length;
    for (i = 0; i < ii; ++i) {
      handles[i].project();
    }
  }

  _transform(): void {
    const handles = this._handles;
    let i;
    const ii = handles.length;
    this._transformCore();
    for (i = 0; i < ii; ++i) {
      handles[i].transform();
    }
  }

  getProxies(): ElementProxy[] {
    return this._handles.map((p) => p.proxy);
  }

  getProxy(index: number): ElementProxy {
    return this._handles[index].proxy;
  }

  raiseClick(i: number, dxEvent: ThemeValue): void {
    this._params.eventTrigger('click', {
      target: this._handles[i].proxy,
      event: dxEvent,
    });
  }

  hoverItem(i: number, state: boolean): void {
    this._handles[i].setHovered(state);
  }

  selectItem(i: number, state: boolean, _noEvent?: boolean): void {
    this._handles[i].setSelected(state, _noEvent);
  }

  clearSelection(): void {
    const selection = this._context.selection;
    if (selection) {
      _each(selection.state, (_, handle) => {
        handle && handle.setSelected(false);
      });
      selection.state = {};
    }
  }
};

_extend(MapLayer.prototype, DataHelperMixin);

function createProxy(handle, coords, attrs) {
  const proxy = {
    coordinates() {
      return coords;
    },

    attribute(name, value) {
      if (arguments.length > 1) {
        attrs[name] = value;
        return proxy;
      } else {
        return arguments.length > 0 ? attrs[name] : attrs;
      }
    },

    selected(state, _noEvent) {
      if (arguments.length > 0) {
        handle.setSelected(state, _noEvent);
        return proxy;
      } else {
        return handle.isSelected();
      }
    },

    applySettings(settings) {
      handle.update(settings);
      return proxy;
    },
  };
  return proxy;
}

let MapLayerElement = class MapLayerElement {
  declare proxy: ElementProxy;

  declare _ctx: LayerContext;

  declare _index: number;

  declare _fig: ThemeValue;

  declare _label: ThemeValue;

  declare _state: number;

  declare _coordinates: ThemeValue;

  declare _settings: ThemeValue;

  declare _data: { name: string; index: number };

  declare _projection: ThemeValue;

  declare _labelProjection: ThemeValue;

  declare _styles: ThemeValue;

  constructor(context: LayerContext, index: number, geometry: { coordinates: ThemeValue }, attributes: ThemeValue) {
    const proxy: ElementProxy = this.proxy = createProxy(this, geometry.coordinates, _extend({}, attributes));
    this._ctx = context;
    this._index = index;
    this._fig = this._label = null;
    this._state = STATE_DEFAULT;
    this._coordinates = geometry.coordinates;
    this._settings = { label: {} };
    proxy.index = index;
    proxy.layer = context.layer;
    // TODO: Replace "name" field with one referencing layer index and use layer index (instead of name) as layer id
    // as it is more suitable, simple and consistent
    this._data = { name: context.name, index };
  }

  dispose(): this {
    // @ts-expect-error dispose releases the references
    this._ctx = this.proxy = this._settings = this._fig = this._label = this._data = null;
    return this;
  }

  project(): void {
    const context = this._ctx;
    this._projection = context.str.project(context.projection, this._coordinates);
    if (context.hasSeparateLabel && this._label) {
      this._projectLabel();
    }
  }

  _projectLabel(): void {
    this._labelProjection = this._ctx.str.projectLabel(this._projection);
  }

  draw(): void {
    const context = this._ctx;
    context.str.draw(context, this._fig = {}, this._data);
    this._fig.root.append(context.root);
  }

  transform(): void {
    const context = this._ctx;
    context.str.transform(this._fig, context.projection, this._projection);
    if (context.hasSeparateLabel && this._label) {
      this._transformLabel();
    }
  }

  _transformLabel(): void {
    this._ctx.str.transformLabel(this._label, this._ctx.projection, this._labelProjection);
  }

  refresh(): void {
    const strategy = this._ctx.str;
    const settings = getItemSettings(this._ctx, this.proxy, this._settings);
    this._styles = strategy.getStyles(settings);
    strategy.refresh(this._ctx, this._fig, this._data, this.proxy, settings);
    this._refreshLabel(settings);
    this._setState();
  }

  _refreshLabel(settings: ThemeValue): void {
    const context = this._ctx;
    const labelSettings = settings.label;
    let label = this._label;
    if (context.settings.label.enabled) {
      if (!label) {
        label = this._label = {
          root: context.labelRoot || this._fig.root,
          text: context.renderer.text().attr({ class: 'dxm-label' }),
          size: [0, 0],
        };
        if (context.hasSeparateLabel) {
          this._projectLabel();
          this._transformLabel();
        }
      }
      label.value = _String(this.proxy.text || this.proxy.attribute(labelSettings.dataField) || '');
      if (label.value) {
        // The data should be set when the element is created but it requires changes in the Renderer
        label.text.attr({ text: label.value, x: 0, y: 0 }).css(_patchFontOptions(labelSettings.font)).attr({
          align: 'center',
          stroke: labelSettings.stroke,
          'stroke-width': labelSettings['stroke-width'],
          'stroke-opacity': labelSettings['stroke-opacity'],
        }).data(context.dataKey, this._data)
          .append(label.root);
        label.settings = settings;
      }
    } else if (label) {
      label.text.remove();
      this._label = null;
    }
  }

  measureLabel(): void {
    const label = this._label;
    let bBox;
    if (label.value) {
      bBox = label.text.getBBox();
      label.size = [bBox.width, bBox.height, -bBox.y - bBox.height / 2];
    }
  }

  adjustLabel(): void {
    const label = this._label;
    let offset;
    if (label.value) {
      offset = this._ctx.str.getLabelOffset(label, label.settings);
      label.settings = null;
      label.text.attr({ x: offset[0], y: offset[1] + label.size[2] });
    }
  }

  update(settings: ThemeValue): void {
    this._settings = combineSettings(this._settings, settings);
    // This check is required because the method can be called during the customization stage when DOM content neither is created nor should be changed
    if (this._fig) {
      this.refresh();
      if (this._label && this._label.value) {
        this.measureLabel();
        this.adjustLabel();
      }
    }
  }

  _setState(): void {
    this._ctx.str.setState(this._fig, this._styles, STATE_TO_INDEX[this._state]);
  }

  _setForeground(): void {
    const root = this._fig.root;

    this._state ? root.toForeground() : root.toBackground();
  }

  setHovered(state: boolean): this {
    const currentState = hasFlag(this._state, STATE_HOVERED);
    const newState = !!state;
    if (this._ctx.hover && currentState !== newState) {
      this._state = setFlag(this._state, STATE_HOVERED, newState);
      this._setState();
      this._setForeground();
      raiseChanged(this._ctx, this, newState, 'hoverChanged');
    }
    return this;
  }

  setSelected(state: boolean, _noEvent?: boolean): void {
    const currentState = hasFlag(this._state, STATE_SELECTED);
    const newState = !!state;
    const selection = this._ctx.selection;
    let tmp;
    if (selection && currentState !== newState) {
      this._state = setFlag(this._state, STATE_SELECTED, newState);
      tmp = selection.state[selection.single];
      selection.state[selection.single] = null; // This is to prevent stack overflow
      if (tmp) {
        tmp.setSelected(false);
      }
      selection.state[selection.single || this._index] = state ? this : null;
      // This check is required because the method can be called during the customization stage when DOM content neither is created nor should be changed
      if (this._fig) {
        this._setState();
        this._setForeground();
        if (!_noEvent) {
          raiseChanged(this._ctx, this, newState, 'selectionChanged');
        }
      }
    }
  }

  isSelected(): boolean {
    return hasFlag(this._state, STATE_SELECTED);
  }

  resetSelected(): void {
    this._state = setFlag(this._state, STATE_SELECTED, false);
  }

  restoreSelected(): void {
    this._fig.root.toForeground();
  }
};

// http://en.wikipedia.org/wiki/Centroid
function calculatePolygonCentroid(coordinates) {
  let i;
  const length = coordinates.length;
  let v1;
  let v2 = coordinates[length - 1];
  let cross;
  let cx = 0;
  let cy = 0;
  let area = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (i = 0; i < length; ++i) {
    v1 = v2;
    v2 = coordinates[i];
    cross = v1[0] * v2[1] - v2[0] * v1[1];
    area += cross;
    cx += (v1[0] + v2[0]) * cross;
    cy += (v1[1] + v2[1]) * cross;

    minX = _min(minX, v2[0]);
    maxX = _max(maxX, v2[0]);
    minY = _min(minY, v2[1]);
    maxY = _max(maxY, v2[1]);
  }
  // from centroid coords we need subtract the center of bbox coords to get a good geometrical center (T312029)
  return {
    area: _abs(area) / 2,
    center: [
      2 * cx / 3 / area - (minX + maxX) / 2,
      2 * cy / 3 / area - (minY + maxY) / 2,
    ],
  };
}

function calculateLineStringData(coordinates) {
  let i;
  const ii = coordinates.length;
  let v1;
  let v2 = coordinates[0] || [];
  let totalLength = 0;
  const items = [0];
  let min0 = v2[0];
  let max0 = v2[0];
  let min1 = v2[1];
  let max1 = v2[1];

  for (i = 1; i < ii; ++i) {
    v1 = v2;
    v2 = coordinates[i];
    totalLength += _sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]));
    items[i] = totalLength;
    min0 = _min(min0, v2[0]);
    max0 = _max(max0, v2[0]);
    min1 = _min(min1, v2[1]);
    max1 = _max(max1, v2[1]);
  }
  i = findGroupingIndex(totalLength / 2, items);
  v1 = coordinates[i];
  v2 = coordinates[i + 1];
  const t = (totalLength / 2 - items[i]) / (items[i + 1] - items[i]);
  return ii ? [
    [
      v1[0] * (1 - t) + v2[0] * t,
      v1[1] * (1 - t) + v2[1] * t,
    ], [
      max0 - min0,
      max1 - min1,
    ],
    totalLength,
  ] : [];
}

// TODO: Optimize!
// There are redundant iterations in the following cycle - interior holes of a polygon should not be taken into account
// So there is only centroid to be calculated for each "Polygon"
function projectAreaLabel(coordinates) {
  let i;
  const ii = coordinates.length;
  let centroid;
  let resultCentroid;
  let maxArea = 0;

  for (i = 0; i < ii; ++i) {
    centroid = calculatePolygonCentroid(coordinates[i]);
    if (centroid.area > maxArea) {
      maxArea = centroid.area;
      resultCentroid = centroid;
    }
  }
  // TODO: Move "_sqrt" to the "calculatePolygonCentroid"
  return resultCentroid ? [resultCentroid.center, [_sqrt(resultCentroid.area), _sqrt(resultCentroid.area)]] : [[], []];
}

function projectLineLabel(coordinates) {
  let i;
  const ii = coordinates.length;
  let maxLength = 0;
  let data;
  let resultData;

  for (i = 0; i < ii; ++i) {
    data = calculateLineStringData(coordinates[i]);
    if (data[2] > maxLength) {
      maxLength = data[2];
      resultData = data;
    }
  }
  return resultData || [[], []];
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let MapLayerCollection = class MapLayerCollection {
  declare _params: MapLayerParams;

  declare _layers: MapLayerInstance[];

  declare _layerByName: Record<string, MapLayerInstance>;

  declare _rect: number[];

  declare _clip: ThemeValue;

  declare _background: ThemeValue;

  declare _container: ThemeValue;

  declare _offTracker: () => void;

  declare _dataReady: () => void;

  declare _borderWidth: number;

  constructor(params: MapLayerParams) {
    const renderer = params.renderer;
    this._params = params;
    this._layers = [];
    // TODO: Use Set instance instead of plain object
    this._layerByName = {};
    this._rect = [0, 0, 0, 0];
    this._clip = renderer.clipRect();
    this._background = renderer.rect().attr({ class: 'dxm-background' }).data(params.dataKey, { name: 'background' }).append(renderer.root);
    this._container = renderer.g().attr({ class: 'dxm-layers', 'clip-path': this._clip.id }).append(renderer.root).enableLinks();
    this._subscribeToTracker(params.tracker, renderer, params.eventTrigger);
    this._dataReady = params.dataReady;
  }

  dispose(): void {
    this._clip.dispose();
    this._layers.forEach((l) => l.dispose());
    this._offTracker();
    // @ts-expect-error dispose releases the parameters, the subscription, the layers and the elements
    this._params = this._offTracker = this._layers = this._layerByName = this._clip = this._background = this._container = null;
  }

  _subscribeToTracker(tracker: LayerTracker, renderer: ThemeValue, eventTrigger: MapLayerParams['eventTrigger']): void {
    const that = this;
    that._offTracker = tracker.on({
      click(arg) {
        // TODO: Adjust `x` and `y` inside the Tracker
        const offset = renderer.getRootOffset();
        const layer = that.byName(arg.data.name);
        arg.$event.x = arg.x - offset.left;
        arg.$event.y = arg.y - offset.top;
        // TODO: Remove the "raiseClick" method
        if (layer) {
          layer.raiseClick(arg.data.index, arg.$event);
        } else if (arg.data.name === 'background') {
          eventTrigger('click', { event: arg.$event });
        }
      },
      'hover-on': function (arg) {
        const layer = that.byName(arg.data.name);
        if (layer) {
          layer.hoverItem(arg.data.index, true);
        }
      },
      'hover-off': function (arg) {
        const layer = that.byName(arg.data.name);
        if (layer) {
          layer.hoverItem(arg.data.index, false);
        }
      },
    });
  }

  setOptions(options: ThemeValue): void {
    const optionList = options ? _isArray(options) ? options : [options] : [];
    let layers = this._layers;
    let readyCallbacks: ThemeValue[] = [];
    const needToCreateLayers = optionList.length !== layers.length || layers.some((l, i) => {
      const name = getName(optionList, i);
      return _isDefined(name) && name !== l.proxy.name;
    });

    if (needToCreateLayers) {
      this._params.tracker.reset();
      this._layers.forEach((l) => l.dispose());
      const layerByName = this._layerByName = {};
      this._layers = layers = [];
      for (let i = 0, ii = optionList.length; i < ii; ++i) {
        const name = getName(optionList, i) || `map-layer-${i}`;
        const layer = layers[i] = new MapLayer(this._params, this._container, name, i);
        layerByName[name] = layer;
      }
    }

    layers.forEach((l, i) => {
      l.setOptions(optionList[i]);
    });
    readyCallbacks = layers.map((l) => l.getDataReadyCallback());
    readyCallbacks.length && when.apply(undefined, readyCallbacks).done(this._dataReady);
  }

  _updateClip(): void {
    const rect = this._rect;
    const bw = this._borderWidth;
    this._clip.attr({
      x: rect[0] + bw, y: rect[1] + bw, width: _max(rect[2] - bw * 2, 0), height: _max(rect[3] - bw * 2, 0),
    });
  }

  setBackgroundOptions(options: ThemeValue): void {
    this._background.attr({ stroke: options.borderColor, 'stroke-width': options.borderWidth, fill: options.color });
    this._borderWidth = _max(options.borderWidth, 0);
    this._updateClip();
  }

  setRect(rect: number[]): void {
    this._rect = rect;
    this._background.attr({
      x: rect[0], y: rect[1], width: rect[2], height: rect[3],
    });
    this._updateClip();
  }

  byIndex(index: number): MapLayerInstance | undefined {
    return this._layers[index];
  }

  byName(name: string): MapLayerInstance | undefined {
    return this._layerByName[name];
  }

  items(): MapLayerInstance[] {
    return this._layers;
  }
};

/// #DEBUG
export const _TESTS_MapLayer = MapLayer;
export const _TESTS_stub_MapLayer = function (stub) {
  MapLayer = stub;
};
export const _TESTS_selectStrategy = selectStrategy;
export const _TESTS_stub_selectStrategy = function (stub) {
  selectStrategy = stub;
};
export const _TESTS_MapLayerElement = MapLayerElement;
export const _TESTS_stub_MapLayerElement = function (stub) {
  MapLayerElement = stub;
};
export const _TESTS_createProxy = createProxy;
export const _TESTS_stub_performGrouping = function (stub) {
  performGrouping = stub;
};
export const _TESTS_performGrouping = performGrouping;
export const _TESTS_stub_groupByColor = function (stub) {
  groupByColor = stub;
};
export const _TESTS_groupByColor = groupByColor;
export const _TESTS_stub_groupBySize = function (stub) {
  groupBySize = stub;
};
export const _TESTS_groupBySize = groupBySize;
export const _TESTS_findGroupingIndex = findGroupingIndex;
/// #ENDDEBUG

/// #DEBUG
export function DEBUG_set_MapLayerCollection(value: typeof MapLayerCollection): void {
  MapLayerCollection = value;
}
/// #ENDDEBUG
