/* eslint-disable import/no-import-module-exports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import type { DeferredObj } from '@js/core/utils/deferred';
import { noop } from '@ts/core/utils/m_common';
/// #DEBUG
import { debug } from '@ts/core/utils/m_console';
/// #ENDDEBUG
import { Deferred } from '@ts/core/utils/m_deferred';
import { extend } from '@ts/core/utils/m_extend';
import { isDefined, isFunction } from '@ts/core/utils/m_type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { LayoutTargetOptions } from '@ts/viz/core/layout';
import type { AlignedLayoutRect, LayoutAlignment } from '@ts/viz/core/layout_element';
import { LayoutElement, WrapperLayoutElement } from '@ts/viz/core/layout_element';
import { getFuncIri, processHatchingAttrs } from '@ts/viz/core/renderers/renderer';
import { Title } from '@ts/viz/core/title';
import type { BBox, Bounds } from '@ts/viz/core/types';
import { enumParser, normalizeEnum, patchFontOptions } from '@ts/viz/core/utils';

const _Number = Number;

const _math = Math;
const _round = _math.round;
const _max = _math.max;
const _min = _math.min;
const _ceil = _math.ceil;

const _isDefined = isDefined;
const _isFunction = isFunction;
const _enumParser = enumParser;
const _normalizeEnum = normalizeEnum;

const _extend = extend;

const DEFAULT_MARGIN = 10;
const DEFAULT_MARKER_HATCHING_WIDTH = 2;
const DEFAULT_MARKER_HATCHING_STEP = 5;
const CENTER = 'center';
const RIGHT = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const INSIDE = 'inside';
const OUTSIDE = 'outside';
const NONE = 'none';
const HEIGHT = 'height';
const WIDTH = 'width';

const parseHorizontalAlignment = _enumParser([LEFT, CENTER, RIGHT]);
const parseVerticalAlignment = _enumParser([TOP, BOTTOM]);
const parseOrientation = _enumParser([VERTICAL, HORIZONTAL]);
const parseItemTextPosition = _enumParser([LEFT, RIGHT, TOP, BOTTOM]);
const parsePosition = _enumParser([OUTSIDE, INSIDE]);
const parseItemsAlignment = _enumParser([LEFT, CENTER, RIGHT]);

type MarkerCreator = (renderer: ThemeValue, size: number) => ThemeValue;

interface LegendItemStates {
  normal: ThemeValue;
  hover?: ThemeValue;
  selection?: ThemeValue;
}

export interface LegendDataItem {
  id?: number;
  text?: string;
  item?: ThemeValue;
  visible?: boolean;
  states: LegendItemStates;
  size: number;
  marker: ThemeValue;
  textOpacity?: number;
  argument?: ThemeValue;
  argumentIndex?: number;
}

interface LegendTrackerData {
  id?: number;
  argument?: ThemeValue;
  argumentIndex?: number;
}

interface LegendItemTracker extends LegendTrackerData, Bounds {}

interface CreatedLegendItem {
  label: ThemeValue;
  marker: ThemeValue;
  renderer: ThemeValue;
  group: ThemeValue;
  tracker: LegendTrackerData;
  states: LegendItemStates;
  itemTextPosition: string;
  markerOffset: number;
  bBoxes: WrapperLayoutElement[];
  renderMarker: (state: ThemeValue) => void;
}

interface LegendItem extends CreatedLegendItem {
  tracker: LegendItemTracker;
  markerBBox: BBox;
  markerSize: number;
  labelBBox: BBox;
  bBox: { width: number; height: number };
}

interface LegendLineItem {
  width: number;
  height: number;
  element: ThemeValue;
  bBox: BBox;
  pos: LayoutAlignment;
  itemIndex: number;
  offset?: number;
  altOffset?: number;
}

type LegendLine = LegendLineItem[];

interface TableLine {
  firstLine: LegendLine;
  secondLine: LegendLine;
}

interface ItemsLayoutOptions {
  itemsAlignment: string | null;
  orientation: string;
  length: number;
  spacing: number;
  direction: 'x' | 'y';
  measure: 'width' | 'height';
  altMeasure: 'width' | 'height';
  altDirection: 'x' | 'y';
  altSpacing: number;
  countItem: number;
  altCountItem: number;
  marginTextLabel: number;
  labelOffset: number;
  markerOffset?: boolean;
  inverseLabelPosition?: boolean;
  itemTextPosition: string;
}

interface LegendBoundingRect extends AlignedLayoutRect {
  widthWithoutMargins?: number;
}

interface LegendTemplate {
  render: (args: { model: LegendDataItem; container: ThemeValue; onRendered: () => unknown }) => void;
}

interface LegendWidget {
  _getTemplate: (template: ThemeValue) => LegendTemplate;
  _incidentOccurred: (id: string) => void;
}

interface LegendSettings {
  renderer: ThemeValue;
  group: ThemeValue;
  widget: LegendWidget;
  textField: string;
  getFormatObject: (data: LegendDataItem) => ThemeValue;
  backgroundClass?: string | null;
  itemGroupClass?: string;
  titleGroupClass?: string;
  allowInsidePosition?: boolean;
}

function getState(state: ThemeValue, color: ThemeValue, stateName: string): ThemeValue {
  if (!state) {
    return;
  }
  const colorFromAction = state.fill;

  return extend({}, {
    state: stateName,
    fill: colorFromAction === NONE ? color : colorFromAction,
    opacity: state.opacity,
    filter: state.filter,
    hatching: _extend({}, state.hatching, {
      step: DEFAULT_MARKER_HATCHING_STEP,
      width: DEFAULT_MARKER_HATCHING_WIDTH,
    }),
  });
}

function getAttributes(item: ThemeValue, state: ThemeValue, size?: number): ThemeValue {
  const attrs = processHatchingAttrs(item, state);

  if (attrs.fill && attrs.fill.indexOf('DevExpress') === 0) {
    attrs.fill = getFuncIri(attrs.fill);
  }

  attrs.opacity = attrs.opacity >= 0 ? attrs.opacity : 1;

  return extend({}, attrs, { size });
}

function parseMargins(options: ThemeValue): void {
  let margin = options.margin;
  if (margin >= 0) {
    margin = _Number(options.margin);
    margin = {
      top: margin, bottom: margin, left: margin, right: margin,
    };
  } else {
    margin = {
      top: margin.top >= 0 ? _Number(margin.top) : DEFAULT_MARGIN,
      bottom: margin.bottom >= 0 ? _Number(margin.bottom) : DEFAULT_MARGIN,
      left: margin.left >= 0 ? _Number(margin.left) : DEFAULT_MARGIN,
      right: margin.right >= 0 ? _Number(margin.right) : DEFAULT_MARGIN,
    };
  }
  options.margin = margin;
}

function getSizeItem(options: ThemeValue, markerBBox: BBox, labelBBox: BBox): { width: number; height: number } {
  const defaultXMargin = 7;
  const defaultTopMargin = 4;
  let width;
  let height;

  switch (options.itemTextPosition) {
    case LEFT:
    case RIGHT:
      width = markerBBox.width + defaultXMargin + labelBBox.width;
      height = _max(markerBBox.height, labelBBox.height);
      break;
    case TOP:
    case BOTTOM:
      width = _max(markerBBox.width, labelBBox.width);
      height = markerBBox.height + defaultTopMargin + labelBBox.height;
      break;
  }

  return { width, height };
}

function calculateBBoxLabelAndMarker(markerBBox: BBox, labelBBox: BBox): Bounds {
  const bBox = {} as Bounds;
  bBox.left = _min(markerBBox.x, labelBBox.x);
  bBox.top = _min(markerBBox.y, labelBBox.y);
  bBox.right = _max(markerBBox.x + markerBBox.width, labelBBox.x + labelBBox.width);
  bBox.bottom = _max(markerBBox.y + markerBBox.height, labelBBox.y + labelBBox.height);

  return bBox;
}

function applyMarkerState(id: number, idToIndexMap: Record<number, number>, items: LegendItem[], stateName: keyof LegendItemStates): void {
  const item = idToIndexMap && items[idToIndexMap[id]];
  if (item) {
    item.renderMarker(item.states[stateName]);
  }
}

function parseOptions(options: ThemeValue, textField: string, allowInsidePosition?: boolean): ThemeValue {
  if (!options) return null;

  /// #DEBUG
  debug.assertParam(options.visible, 'Visibility was not passed');
  debug.assertParam(options.markerSize, 'markerSize was not passed');
  debug.assertParam(options.font.color, 'fontColor was not passed');
  debug.assertParam(options.font.family, 'fontFamily was not passed');
  debug.assertParam(options.font.size, 'fontSize was not passed');
  debug.assertParam(options.paddingLeftRight, 'paddingLeftRight was not passed');
  debug.assertParam(options.paddingTopBottom, 'paddingTopBottom was not passed');
  debug.assertParam(options.columnItemSpacing, 'columnItemSpacing was not passed');
  debug.assertParam(options.rowItemSpacing, 'rowItemSpacing was not passed');
  /// #ENDDEBUG

  parseMargins(options);
  options.horizontalAlignment = parseHorizontalAlignment(options.horizontalAlignment, RIGHT);
  options.verticalAlignment = parseVerticalAlignment(options.verticalAlignment, options.horizontalAlignment === CENTER ? BOTTOM : TOP);
  options.orientation = parseOrientation(options.orientation, options.horizontalAlignment === CENTER ? HORIZONTAL : VERTICAL);
  options.itemTextPosition = parseItemTextPosition(options.itemTextPosition, options.orientation === HORIZONTAL ? BOTTOM : RIGHT);
  options.position = allowInsidePosition ? parsePosition(options.position, OUTSIDE) : OUTSIDE;
  options.itemsAlignment = parseItemsAlignment(options.itemsAlignment, null);
  options.hoverMode = _normalizeEnum(options.hoverMode);
  options.customizeText = _isFunction(options.customizeText) ? options.customizeText : function (): ThemeValue { return this[textField]; };
  options.customizeHint = _isFunction(options.customizeHint) ? options.customizeHint : noop;
  options._incidentOccurred = options._incidentOccurred || noop;
  return options;
}

function createSquareMarker(renderer: ThemeValue, size: number): ThemeValue {
  return renderer.rect(0, 0, size, size);
}

function createCircleMarker(renderer: ThemeValue, size: number): ThemeValue {
  return renderer.circle(size / 2, size / 2, size / 2);
}

function isCircle(type: ThemeValue): boolean {
  return _normalizeEnum(type) === 'circle';
}

function inRect(rect: Bounds, x: number, y: number): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
// @ts-expect-error returns true only when the lines do not fit, undefined otherwise
function checkLinesSize(lines: LegendLine[], layoutOptions: ItemsLayoutOptions, countItems: number, margins: Bounds): boolean | undefined {
  const position = { x: 0, y: 0 };
  let maxMeasureLength = 0;
  let maxAltMeasureLength = 0;
  let margin = 0;

  if (layoutOptions.direction === 'y') {
    margin = margins.top + margins.bottom;
  } else {
    margin = margins.left + margins.right;
  }

  lines.forEach((line, i) => {
    const firstItem = line[0];
    const lineLength = line.length;

    line.forEach((item, index) => {
      const offset = item.offset || layoutOptions.spacing;
      position[layoutOptions.direction] += item[layoutOptions.measure] + (index !== lineLength - 1 ? offset : 0);
      maxMeasureLength = _max(maxMeasureLength, position[layoutOptions.direction]);
    });

    position[layoutOptions.direction] = 0;
    position[layoutOptions.altDirection] += firstItem[layoutOptions.altMeasure]
        // @ts-expect-error without altOffset the sum is NaN and falls back to altSpacing (maxAltMeasureLength is not used)
        + firstItem.altOffset || layoutOptions.altSpacing;
    maxAltMeasureLength = _max(maxAltMeasureLength, position[layoutOptions.altDirection]);
  });

  if (maxMeasureLength + margin > layoutOptions.length) {
    layoutOptions.countItem = decreaseItemCount(layoutOptions, countItems);
    return true;
  }
}

function decreaseItemCount(layoutOptions: ItemsLayoutOptions, countItems: number): number {
  layoutOptions.altCountItem++;
  return _ceil(countItems / layoutOptions.altCountItem);
}

function getLineLength(line: LegendLine, layoutOptions: ItemsLayoutOptions): number {
  return line.reduce((lineLength, item) => {
    const offset = item.offset || layoutOptions.spacing;
    return lineLength + item[layoutOptions.measure] + offset;
  }, 0);
}

function getMaxLineLength(lines: LegendLine[], layoutOptions: ItemsLayoutOptions): number {
  return lines.reduce((maxLineLength, line) => _max(maxLineLength, getLineLength(line, layoutOptions)), 0);
}

function getInitPositionForDirection(line: LegendLine, layoutOptions: ItemsLayoutOptions, maxLineLength: number): number {
  const lineLength = getLineLength(line, layoutOptions);
  let initPosition: number;

  switch (layoutOptions.itemsAlignment) {
    case RIGHT:
      initPosition = maxLineLength - lineLength;
      break;
    case CENTER:
      initPosition = (maxLineLength - lineLength) / 2;
      break;
    default:
      initPosition = 0;
  }

  return initPosition;
}
// @ts-expect-error the switch covers every itemTextPosition
function getPos(layoutOptions: ItemsLayoutOptions): LayoutAlignment {
  switch (layoutOptions.itemTextPosition) {
    case BOTTOM:
      return {
        horizontal: CENTER,
        vertical: TOP,
      };
    case TOP:
      return {
        horizontal: CENTER,
        vertical: BOTTOM,
      };
    case LEFT:
      return {
        horizontal: RIGHT,
        vertical: CENTER,
      };
    case RIGHT:
      return {
        horizontal: LEFT,
        vertical: CENTER,
      };
  }
}

function getLines(lines: LegendLine[], layoutOptions: ItemsLayoutOptions, itemIndex: number): TableLine {
  const tableLine = {} as TableLine;

  if (itemIndex % layoutOptions.countItem === 0) {
    if (layoutOptions.markerOffset) {
      lines.push([], []);
    } else {
      lines.push([]);
    }
  }

  if (layoutOptions.markerOffset) {
    tableLine.firstLine = lines[lines.length - 1];
    tableLine.secondLine = lines[lines.length - 2];
  } else {
    tableLine.firstLine = tableLine.secondLine = lines[lines.length - 1];
  }

  return tableLine;
}

function setMaxInLine(line: (LegendLineItem | undefined)[], measure: 'width' | 'height'): void {
  const maxLineSize = line.reduce((maxLineSize, item) => {
    const itemMeasure = item ? item[measure] : maxLineSize;
    return _max(maxLineSize, itemMeasure);
  }, 0);

  line.forEach((item) => {
    if (item) {
      item[measure] = maxLineSize;
    }
  });
}

function transpose<T>(array: T[][]): (T | undefined)[][] {
  const width = array.length;
  const height = array[0].length;
  let i;
  let j;
  const transposeArray: (T | undefined)[][] = [];

  for (i = 0; i < height; i++) {
    transposeArray[i] = [];
    for (j = 0; j < width; j++) {
      transposeArray[i][j] = array[j][i];
    }
  }

  return transposeArray;
}
// @ts-expect-error the switch covers every position
function getAlign(position: string): string {
  switch (position) {
    case TOP:
    case BOTTOM:
      return CENTER;
    case LEFT:
      return RIGHT;
    case RIGHT:
      return LEFT;
  }
}

let getMarkerCreator = function (type: ThemeValue): MarkerCreator {
  return isCircle(type) ? createCircleMarker : createSquareMarker;
};

function getTitleHorizontalAlignment(options: ThemeValue): string {
  if (options.horizontalAlignment === CENTER) {
    return CENTER;
  } else if (options.itemTextPosition === RIGHT) {
    return LEFT;
  } else if (options.itemTextPosition === LEFT) {
    return RIGHT;
  } else {
    return CENTER;
  }
}

export let Legend = class Legend extends LayoutElement {
  declare _renderer: ThemeValue;

  declare _legendGroup: ThemeValue;

  declare _backgroundClass?: string | null;

  declare _itemGroupClass?: string;

  declare _textField: string;

  declare _getCustomizeObject: (data: LegendDataItem) => ThemeValue;

  declare _titleGroupClass?: string;

  declare _allowInsidePosition?: boolean;

  declare _widget: LegendWidget;

  declare _updated: boolean;

  declare _data: LegendDataItem[];

  declare _boundingRect: LegendBoundingRect;

  declare _title: InstanceType<typeof Title>;

  declare _insideLegendGroup: ThemeValue;

  declare _markersGroup: ThemeValue;

  declare _background: ThemeValue;

  declare _markersId: Record<number, number>;

  declare _deferredItems: DeferredObj<unknown>[];

  declare _templatesGroups: ThemeValue[];

  declare _items: LegendItem[];

  declare _size: { width: number; height: number };

  declare _x1: number;

  declare _y1: number;

  declare _x2: number;

  declare _y2: number;

  constructor(settings: LegendSettings) {
    super();
    this._renderer = settings.renderer;
    this._legendGroup = settings.group;
    this._backgroundClass = settings.backgroundClass;
    this._itemGroupClass = settings.itemGroupClass;
    this._textField = settings.textField;
    this._getCustomizeObject = settings.getFormatObject;
    this._titleGroupClass = settings.titleGroupClass;
    this._allowInsidePosition = settings.allowInsidePosition;
    this._widget = settings.widget;

    this._updated = false;
  }

  getOptions(): ThemeValue {
    return this._options;
  }

  update(data: LegendDataItem[] = [], options: ThemeValue, themeManagerTitleOptions: ThemeValue = {}): this {
    options = this._options = parseOptions(options, this._textField, this._allowInsidePosition) || {};
    const initMarkerSize = options.markerSize;
    this._updated = true;
    this._data = data.map((dataItem) => {
      dataItem.size = _Number(dataItem.size > 0 ? dataItem.size : initMarkerSize);
      dataItem.marker = getAttributes(dataItem, dataItem.states.normal);
      Object.defineProperty(dataItem.marker, 'size', {
        get() {
          return dataItem.size;
        },
        set(value) {
          dataItem.size = value;
        },
      });
      Object.defineProperty(dataItem.marker, 'opacity', {
        get() {
          return dataItem.states.normal.opacity;
        },
        set(value) {
          dataItem.states.normal.opacity = dataItem.states.hover.opacity = dataItem.states.selection.opacity = value;
        },
      });

      return dataItem;
    });

    if (options.customizeItems) {
      this._data = options.customizeItems(data.slice()) || data;
    }

    this._boundingRect = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    };

    if (this.isVisible()) {
      this._title?.dispose();

      this._title = new Title({
        renderer: this._renderer,
        cssClass: this._titleGroupClass,
        root: this._legendGroup,
        incidentOccurred: this._widget._incidentOccurred,
      });
    }

    if (this._title) {
      const titleOptions = options.title;
      themeManagerTitleOptions.horizontalAlignment = getTitleHorizontalAlignment(options);
      this._title.update(themeManagerTitleOptions, titleOptions);
    }

    this.erase();

    return this;
  }

  isVisible(): boolean {
    return this._options && this._options.visible;
  }

  draw(width: number, height: number): this {
    // TODO check multiple groups creation
    const items = this._getItemData();

    this.erase();

    if (!(this.isVisible() && items && items.length)) {
      return this;
    }

    this._insideLegendGroup = this._renderer.g().enableLinks().append(this._legendGroup);
    this._title.changeLink(this._insideLegendGroup);

    this._createBackground();

    if (this._title.hasText()) {
      const horizontalPadding = this._background ? 2 * this._options.paddingLeftRight : 0;
      this._title.draw(width - horizontalPadding, height);
    }

    // TODO review pass or process states in legend
    this._markersGroup = this._renderer.g().attr({ class: this._itemGroupClass }).append(this._insideLegendGroup);
    this._createItems(items);

    this._updateElementsPosition(width, height);

    return this;
  }

  _measureElements(): void {
    const options = this._options;
    let maxBBoxHeight = 0;
    this._items.forEach((item) => {
      const labelBBox = item.label.getBBox();
      const markerBBox = item.marker.getBBox();
      item.markerBBox = markerBBox;
      item.markerSize = Math.max(markerBBox.width, markerBBox.height);
      const bBox = getSizeItem(options, markerBBox, labelBBox);
      item.labelBBox = labelBBox;
      item.bBox = bBox;
      maxBBoxHeight = _max(maxBBoxHeight, bBox.height);
    });
    if (options.equalRowHeight) {
      this._items.forEach((item) => item.bBox.height = maxBBoxHeight);
    }
  }

  _updateElementsPosition(width: number, height: number): void {
    const options = this._options;
    this._size = { width, height };
    this._measureElements();
    this._locateElements(options);
    this._finalUpdate(options);

    const size = this.getLayoutOptions() as LegendBoundingRect;
    if (size.width > width || size.height > height) {
      this.freeSpace();
    }
  }

  _createItems(items: LegendDataItem[]): void {
    const that = this;
    const options = that._options;
    const renderer = that._renderer;
    const createMarker = getMarkerCreator(options.markerShape);

    that._markersId = {};

    const templateFunction = !options.markerTemplate ? (dataItem: LegendDataItem, group: ThemeValue): void => {
      const attrs = dataItem.marker;
      createMarker(renderer, attrs.size)
        .attr({
          fill: attrs.fill,
          opacity: attrs.opacity,
          filter: attrs.filter,
        })
        .append({ element: group });
    } : options.markerTemplate;

    const template = that._widget._getTemplate(templateFunction);

    const markersGroup = that._markersGroup;

    markersGroup.css(patchFontOptions(options.font));

    that._deferredItems = [];
    that._templatesGroups = [];

    that._items = (items || []).map((dataItem, i) => {
      const stateOfDataItem = dataItem.states;
      const normalState = stateOfDataItem.normal;
      const normalStateFill = normalState.fill;
      dataItem.size = dataItem.marker.size;

      const states = {
        normal: extend(normalState, { fill: normalStateFill || options.markerColor || options.defaultColor, state: 'normal' }),
        hover: getState(stateOfDataItem.hover, normalStateFill, 'hovered'),
        selection: getState(stateOfDataItem.selection, normalStateFill, 'selected'),
      };
      dataItem.states = states;

      const itemGroup = renderer.g().append(markersGroup);

      const markerGroup = renderer.g().attr({ class: 'dxl-marker' }).append(itemGroup);

      that._deferredItems[i] = Deferred();
      that._templatesGroups.push(markerGroup);

      const item: CreatedLegendItem = {
        label: that._createLabel(dataItem, itemGroup),
        marker: markerGroup,
        renderer,
        group: itemGroup,
        tracker: { id: dataItem.id, argument: dataItem.argument, argumentIndex: dataItem.argumentIndex },
        states,
        itemTextPosition: options.itemTextPosition,
        markerOffset: 0,
        bBoxes: [],
        renderMarker(state) {
          dataItem.marker = getAttributes(item, state, dataItem.size);
          markerGroup.clear();
          template.render({
            model: dataItem,
            container: markerGroup.element,
            onRendered: that._deferredItems[i].resolve,
          });
        },
      };

      item.renderMarker(states.normal);

      that._createHint(dataItem, itemGroup);

      if (dataItem.id !== undefined) {
        that._markersId[dataItem.id] = i;
      }

      return item;
    }) as LegendItem[];
  }

  getTemplatesGroups(): ThemeValue[] {
    return this._templatesGroups || [];
  }

  getTemplatesDef(): DeferredObj<unknown>[] {
    return this._deferredItems || [];
  }

  _getItemData(): LegendDataItem[] {
    let items = this._data || [];
    const options = this._options || {};
    // For maps in dashboards
    if (options.inverted) {
      items = items.slice().reverse();
    }

    return items.filter((i) => i.visible);
  }

  _finalUpdate(options: ThemeValue): void {
    this._adjustBackgroundSettings(options);
    this._setBoundingRect(options.margin);
  }

  // The name is chosen to be opposite for `draw`
  erase(): this {
    const insideLegendGroup = this._insideLegendGroup;

    insideLegendGroup && insideLegendGroup.dispose();
    // @ts-expect-error erase() drops the drawn state
    this._insideLegendGroup = this._markersGroup = this._x1 = this._x2 = this._y2 = this._y2 = null;
    return this;
  }

  _locateElements(locationOptions: ThemeValue): void {
    this._moveInInitialValues();
    this._locateRowsColumns(locationOptions);
  }

  _moveInInitialValues(): void {
    // @ts-expect-error a [0, 0] rect never reaches the fitRect branch of Title.move()
    this._title.hasText() && this._title.move([0, 0]);
    this._legendGroup && this._legendGroup.move(0, 0);
    this._background && this._background.attr({
      x: 0, y: 0, width: 0, height: 0,
    });
  }

  applySelected(id: number): this {
    applyMarkerState(id, this._markersId, this._items, 'selection');
    return this;
  }

  applyHover(id: number): this {
    applyMarkerState(id, this._markersId, this._items, 'hover');
    return this;
  }

  resetItem(id: number): this {
    applyMarkerState(id, this._markersId, this._items, 'normal');
    return this;
  }

  _createLabel(data: LegendDataItem, group: ThemeValue): ThemeValue {
    const labelFormatObject = this._getCustomizeObject(data);
    const options = this._options;
    const align = getAlign(options.itemTextPosition);
    const text = options.customizeText.call(labelFormatObject, labelFormatObject);
    const fontStyle = _isDefined(data.textOpacity) ? { color: options.font.color, opacity: data.textOpacity } : {};

    return this._renderer.text(text, 0, 0)
      .css(patchFontOptions(fontStyle))
      .attr({ align, class: options.cssClass })
      .append(group);
  }

  _createHint(data: LegendDataItem, group: ThemeValue): void {
    const labelFormatObject = this._getCustomizeObject(data);
    const text = this._options.customizeHint.call(labelFormatObject, labelFormatObject);
    if (_isDefined(text) && text !== '') {
      group.setTitle(text);
    }
  }

  _createBackground(): void {
    const isInside = this._options.position === INSIDE;
    const color = this._options.backgroundColor;
    const fill = color || (isInside ? this._options.containerBackgroundColor : NONE);

    if (this._options.border.visible || ((isInside || color) && color !== NONE)) {
      this._background = this._renderer.rect(0, 0, 0, 0)
        .attr({ fill, class: this._backgroundClass })
        .append(this._insideLegendGroup);
    }
  }

  _locateRowsColumns(options: ThemeValue): void {
    let iteration = 0;
    const layoutOptions = this._getItemsLayoutOptions();
    const countItems = this._items.length;
    let lines;

    do {
      lines = [];
      this._createLines(lines, layoutOptions);
      this._alignLines(lines, layoutOptions);
      iteration++;
    } while (checkLinesSize(lines, layoutOptions, countItems, options.margin) && iteration < countItems);

    this._applyItemPosition(lines, layoutOptions);
  }

  _createLines(lines: LegendLine[], layoutOptions: ItemsLayoutOptions): void {
    this._items.forEach((item, i) => {
      const tableLine = getLines(lines, layoutOptions, i);
      const labelBox: LegendLineItem = {
        width: item.labelBBox.width,
        height: item.labelBBox.height,
        element: item.label,
        bBox: item.labelBBox,
        pos: getPos(layoutOptions),
        itemIndex: i,
      };
      const markerBox: LegendLineItem = {
        width: item.markerBBox.width,
        height: item.markerBBox.height,
        element: item.marker,
        pos: {
          horizontal: CENTER,
          vertical: CENTER,
        },
        bBox: {
          width: item.markerBBox.width, height: item.markerBBox.height, x: item.markerBBox.x, y: item.markerBBox.y,
        },
        itemIndex: i,
      };
      let firstItem: LegendLineItem;
      let secondItem: LegendLineItem;
      const offsetDirection = layoutOptions.markerOffset ? 'altOffset' : 'offset';

      if (layoutOptions.inverseLabelPosition) {
        firstItem = labelBox;
        secondItem = markerBox;
      } else {
        firstItem = markerBox;
        secondItem = labelBox;
      }

      firstItem[offsetDirection] = layoutOptions.labelOffset;
      tableLine.secondLine.push(firstItem);
      tableLine.firstLine.push(secondItem);
    });
  }

  _alignLines(lines: LegendLine[], layoutOptions: ItemsLayoutOptions): void {
    let i;
    let measure = layoutOptions.altMeasure;
    lines.forEach((line) => setMaxInLine(line, measure));
    measure = layoutOptions.measure;
    if (layoutOptions.itemsAlignment) {
      if (layoutOptions.markerOffset) {
        for (i = 0; i < lines.length;) {
          transpose([lines[i++], lines[i++]]).forEach(processLine);
        }
      }
    } else {
      transpose(lines).forEach(processLine);
    }

    function processLine(line: (LegendLineItem | undefined)[]): void {
      setMaxInLine(line, measure);
    }
  }

  _applyItemPosition(lines: LegendLine[], layoutOptions: ItemsLayoutOptions): void {
    const position = { x: 0, y: 0 };
    const maxLineLength = getMaxLineLength(lines, layoutOptions);

    lines.forEach((line) => {
      const firstItem = line[0];
      const altOffset = firstItem.altOffset || layoutOptions.altSpacing;
      position[layoutOptions.direction] = getInitPositionForDirection(line, layoutOptions, maxLineLength);

      line.forEach((item) => {
        const offset = item.offset || layoutOptions.spacing;
        const wrap = new WrapperLayoutElement(item.element, item.bBox);
        const itemBBoxOptions = {
          x: position.x,
          y: position.y,
          width: item.width,
          height: item.height,
        };
        const itemBBox = new WrapperLayoutElement(null, itemBBoxOptions);
        const itemLegend = this._items[item.itemIndex];

        wrap.position({
          of: itemBBox,
          my: item.pos,
          at: item.pos,
        });
        itemLegend.bBoxes.push(itemBBox);
        position[layoutOptions.direction] += item[layoutOptions.measure] + offset;
      });
      position[layoutOptions.altDirection] += firstItem[layoutOptions.altMeasure] + altOffset;
    });

    this._items.forEach((item) => {
      const itemBBox = calculateBBoxLabelAndMarker(item.bBoxes[0].getLayoutOptions(), item.bBoxes[1].getLayoutOptions());
      const horizontal = this._options.columnItemSpacing / 2;
      const vertical = this._options.rowItemSpacing / 2;
      item.tracker.left = itemBBox.left - horizontal;
      item.tracker.right = itemBBox.right + horizontal;
      item.tracker.top = itemBBox.top - vertical;
      item.tracker.bottom = itemBBox.bottom + vertical;
    });
  }

  _getItemsLayoutOptions(): ItemsLayoutOptions {
    const options = this._options;
    const orientation = options.orientation;
    const layoutOptions = {
      itemsAlignment: options.itemsAlignment,
      orientation: options.orientation,
    } as ItemsLayoutOptions;
    const width = this._size.width - (this._background ? 2 * options.paddingLeftRight : 0);
    const height = this._size.height - (this._background ? 2 * options.paddingTopBottom : 0);

    if (orientation === HORIZONTAL) {
      layoutOptions.length = width;
      layoutOptions.spacing = options.columnItemSpacing;
      layoutOptions.direction = 'x';
      layoutOptions.measure = WIDTH;
      layoutOptions.altMeasure = HEIGHT;
      layoutOptions.altDirection = 'y';
      layoutOptions.altSpacing = options.rowItemSpacing;
      layoutOptions.countItem = options.columnCount;
      layoutOptions.altCountItem = options.rowCount;
      layoutOptions.marginTextLabel = 4;
      layoutOptions.labelOffset = 7;
      if (options.itemTextPosition === BOTTOM || options.itemTextPosition === TOP) {
        layoutOptions.labelOffset = 4;
        layoutOptions.markerOffset = true;
      }
    } else {
      layoutOptions.length = height;
      layoutOptions.spacing = options.rowItemSpacing;
      layoutOptions.direction = 'y';
      layoutOptions.measure = HEIGHT;
      layoutOptions.altMeasure = WIDTH;
      layoutOptions.altDirection = 'x';
      layoutOptions.altSpacing = options.columnItemSpacing;
      layoutOptions.countItem = options.rowCount;
      layoutOptions.altCountItem = options.columnCount;
      layoutOptions.marginTextLabel = 7;
      layoutOptions.labelOffset = 4;
      if (options.itemTextPosition === RIGHT || options.itemTextPosition === LEFT) {
        layoutOptions.labelOffset = 7;
        layoutOptions.markerOffset = true;
      }
    }
    if (!layoutOptions.countItem) {
      if (layoutOptions.altCountItem) {
        layoutOptions.countItem = _ceil(this._items.length / layoutOptions.altCountItem);
      } else {
        layoutOptions.countItem = this._items.length;
      }
    }

    if (options.itemTextPosition === TOP || options.itemTextPosition === LEFT) {
      layoutOptions.inverseLabelPosition = true;
    }
    layoutOptions.itemTextPosition = options.itemTextPosition;
    layoutOptions.altCountItem = layoutOptions.altCountItem || _ceil(this._items.length / layoutOptions.countItem);

    return layoutOptions;
  }

  _adjustBackgroundSettings(locationOptions: ThemeValue): void {
    if (!this._background) return;
    const border = locationOptions.border;
    const legendBox = this._calculateTotalBox();
    const backgroundSettings: Record<string, ThemeValue> = {
      x: _round(legendBox.x - locationOptions.paddingLeftRight),
      y: _round(legendBox.y - locationOptions.paddingTopBottom),
      width: _round(legendBox.width) + 2 * locationOptions.paddingLeftRight,
      height: _round(legendBox.height),
      opacity: locationOptions.backgroundOpacity,
    };

    if (border.visible && border.width && border.color && border.color !== NONE) {
      backgroundSettings['stroke-width'] = border.width;
      backgroundSettings.stroke = border.color;
      backgroundSettings['stroke-opacity'] = border.opacity;
      backgroundSettings.dashStyle = border.dashStyle;
      backgroundSettings.rx = border.cornerRadius || 0;
      backgroundSettings.ry = border.cornerRadius || 0;
    }

    this._background.attr(backgroundSettings);
  }

  _setBoundingRect(margin: Bounds): void {
    if (!this._insideLegendGroup) {
      return;
    }

    const box = this._calculateTotalBox();

    box.height += margin.top + margin.bottom;
    box.widthWithoutMargins = box.width;
    box.width += margin.left + margin.right;
    box.x -= margin.left;
    box.y -= margin.top;

    this._boundingRect = box;
  }

  _calculateTotalBox(): LegendBoundingRect {
    const markerBox = this._markersGroup.getBBox();
    const titleBox = this._title.getCorrectedLayoutOptions();
    const box = this._insideLegendGroup.getBBox();

    const verticalPadding = this._background ? 2 * this._options.paddingTopBottom : 0;

    box.height = markerBox.height + titleBox.height + verticalPadding;
    titleBox.width > box.width && (box.width = titleBox.width);

    return box;
  }

  getActionCallback(point: { index: number }): (act: string) => void {
    const that = this;
    if (that._options.visible) {
      return function (act) {
        that[act](point.index);
      };
    } else {
      return noop;
    }
  }

  getLayoutOptions(): LegendBoundingRect | null {
    const options = this._options;
    const boundingRect: LegendBoundingRect = this._insideLegendGroup ? this._boundingRect : {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    };

    if (options) {
      boundingRect.verticalAlignment = options.verticalAlignment;
      boundingRect.horizontalAlignment = options.horizontalAlignment;
      if (options.orientation === HORIZONTAL) {
        boundingRect.cutLayoutSide = options.verticalAlignment;
        boundingRect.cutSide = 'vertical';
      } else if (options.horizontalAlignment === CENTER) {
        boundingRect.cutLayoutSide = options.verticalAlignment;
        boundingRect.cutSide = 'vertical';
      } else {
        boundingRect.cutLayoutSide = options.horizontalAlignment;
        boundingRect.cutSide = 'horizontal';
      }
      boundingRect.position = {
        horizontal: options.horizontalAlignment,
        vertical: options.verticalAlignment,
      };
      return boundingRect;
    }
    return null;
  }

  shift(x: number, y: number): this {
    let box = {} as BBox;

    if (this._insideLegendGroup) {
      this._insideLegendGroup.attr({ translateX: x - this._boundingRect.x, translateY: y - this._boundingRect.y });
    }

    this._title && this._shiftTitle(this._boundingRect.widthWithoutMargins);
    this._markersGroup && this._shiftMarkers();

    if (this._insideLegendGroup) box = this._legendGroup.getBBox();
    this._x1 = box.x;
    this._y1 = box.y;
    this._x2 = box.x + box.width;
    this._y2 = box.y + box.height;
    return this;
  }

  _shiftTitle(boxWidth: number | undefined): void {
    const title = this._title;
    const titleBox = title.getCorrectedLayoutOptions();
    if (!titleBox || !title.hasText()) {
      return;
    }

    const width = boxWidth === undefined ? titleBox.width : boxWidth - (this._background ? 2 * this._options.paddingLeftRight : 0);
    const titleOptions = title.getOptions();
    let titleY = titleBox.y + titleOptions.margin.top;
    let titleX = 0;

    if (titleOptions.verticalAlignment === BOTTOM && this._markersGroup) {
      titleY += this._markersGroup.getBBox().height;
    }

    if (titleOptions.horizontalAlignment === RIGHT) {
      titleX = width - titleBox.width;
    } else if (titleOptions.horizontalAlignment === CENTER) {
      titleX = (width - titleBox.width) / 2;
    }
    title.shift(titleX, titleY);
  }

  _shiftMarkers(): void {
    const titleBox = this._title.getLayoutOptions();
    const markerBox = this._markersGroup.getBBox();
    const titleOptions = this._title.getOptions() || {};
    let center = 0;
    let y = 0;

    if (titleBox.width > markerBox.width && this._options.horizontalAlignment === CENTER) {
      center = titleBox.width / 2 - markerBox.width / 2;
    }

    if (titleOptions.verticalAlignment === TOP) {
      y = titleBox.height;
    }

    if (center !== 0 || y !== 0) {
      this._markersGroup.attr({ translateX: center, translateY: y });

      this._items.forEach((item) => {
        item.tracker.left += center;
        item.tracker.right += center;
        item.tracker.top += y;
        item.tracker.bottom += y;
      });
    }
  }

  getPosition(): string {
    return this._options.position;
  }

  coordsIn(x: number, y: number): boolean {
    return x >= this._x1 && x <= this._x2 && y >= this._y1 && y <= this._y2;
  }

  getItemByCoord(x: number, y: number): LegendItemTracker | null {
    const items = this._items;
    const legendGroup = this._insideLegendGroup;
    x -= legendGroup.attr('translateX');
    y -= legendGroup.attr('translateY');

    for (let i = 0; i < items.length; i++) {
      if (inRect(items[i].tracker, x, y)) {
        return items[i].tracker;
      }
    }
    return null;
  }

  dispose(): this {
    this._title && this._title.dispose();
    // @ts-expect-error dispose() drops the references
    this._legendGroup = this._insideLegendGroup = this._title = this._renderer = this._options = this._data = this._items = null;

    return this;
  }

  // BaseWidget_layout_implementation
  layoutOptions(): LayoutTargetOptions | null {
    if (!this.isVisible()) {
      return null;
    }
    const pos = this.getLayoutOptions() as LegendBoundingRect;
    return {
      horizontalAlignment: this._options.horizontalAlignment,
      verticalAlignment: this._options.verticalAlignment,
      side: pos.cutSide,
      priority: 1,
      position: this.getPosition(),
    };
  }

  measure(size: number[]): number[] {
    if (this._updated || !this._insideLegendGroup) {
      this.draw(size[0], size[1]);
      this._updated = false;
    } else {
      this._items.forEach((item) => {
        item.bBoxes = [];
      });
      this._updateElementsPosition(size[0], size[1]);
    }
    const rect = this.getLayoutOptions() as LegendBoundingRect;
    return [rect.width, rect.height];
  }

  move(rect: number[]): void {
    this.shift(rect[0], rect[1]);
  }

  freeSpace(): void {
    this._options._incidentOccurred('W2104');
    this.erase();
  }
  // BaseWidget_layout_implementation
};

export const plugin = {
  name: 'legend',
  init(): void {
    const that = this;
    const group = this._renderer.g()
      .attr({
        class: `${this._rootClassPrefix}-legend`,
      })
      .enableLinks()
      .append(that._renderer.root);

    that._legend = new Legend({
      renderer: that._renderer,
      group,
      widget: this,
      itemGroupClass: `${this._rootClassPrefix}-item`,
      titleGroupClass: `${this._rootClassPrefix}-title`,
      textField: 'text',
      getFormatObject(data): { item: ThemeValue; text?: string } {
        return {
          item: data.item,
          text: data.text,
        };
      },
    });

    that._layout.add(that._legend);
  },
  extenders: {
    _applyTilesAppearance(): void {
      const that = this;
      this._items.forEach((item) => {
        that._applyLegendItemStyle(item.id, item.getState());
      });
    },
    _buildNodes(): void {
      this._createLegendItems();
    },
  },
  members: {
    _applyLegendItemStyle(id: number, state: string): void {
      const legend = this._legend;
      switch (state) {
        case 'hover':
          legend.applyHover(id);
          break;
        case 'selection':
          legend.applySelected(id);
          break;
        default:
          legend.resetItem(id);
          break;
      }
    },

    _createLegendItems(): void {
      if (this._legend.update(this._getLegendData(), this._getOption('legend'), this._themeManager.theme('legend').title)) {
        this._requestChange(['LAYOUT']);
      }
    },
  },
  dispose(): void {
    this._legend.dispose();
  },
  customize(constructor: ThemeValue): void {
    // @ts-expect-error returns the legend item under the point, undefined elsewhere
    constructor.prototype._proxyData.push(function (x, y) {
      if (this._legend.coordsIn(x, y)) {
        const item = this._legend.getItemByCoord(x, y);
        if (item) {
          return {
            id: item.id,
            type: 'legend',
          };
        }
      }
    });

    constructor.addChange({
      code: 'LEGEND',
      handler(): void {
        this._createLegendItems();
      },
      isThemeDependent: true,
      option: 'legend',
      isOptionChange: true,
    });
  },
};

/// #DEBUG
exports._setLegend = function (value): void {
  Legend = value;
};

const __getMarkerCreator = getMarkerCreator;
exports._DEBUG_stubMarkerCreator = function (callback): void {
  getMarkerCreator = function (): MarkerCreator {
    return callback;
  };
};
exports._DEBUG_restoreMarkerCreator = function (): void {
  getMarkerCreator = __getMarkerCreator;
};
/// #ENDDEBUG
