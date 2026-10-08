/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-import-module-exports */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-empty */
/* eslint-disable no-cond-assign */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable no-bitwise */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable radix */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable default-case */
/* eslint-disable @stylistic/max-len */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */

import type { Coordinates } from '@js/core/renderer';
import { domAdapter } from '@ts/core/dom_adapter';
import { renderer as $ } from '@ts/core/renderer';
import type { Renderer as CoreRenderer } from '@ts/core/renderer_base';
import { callOnce } from '@ts/core/utils/call_once';
import { getSvgMarkup } from '@ts/core/utils/m_svg';
import { isDefined } from '@ts/core/utils/m_type';
import { getWindow } from '@ts/core/utils/m_window';
import eventsEngine from '@ts/events/core/events_engine';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { Animation, AnimationOptions } from '@ts/viz/core/renderers/animation';
import { AnimationController } from '@ts/viz/core/renderers/animation';
import {
  getNextDefsSvgId,
  normalizeArcParams,
  normalizeBBox,
  normalizeEnum,
  rotateBBox,
} from '@ts/viz/core/utils';

const window = getWindow();

const { max, round } = Math;

const SHARPING_CORRECTION = 0.5;
const ARC_COORD_PREC = 5;

const LIGHTENING_HASH = '@filter::lightening';

const pxAddingExceptions = {
  'column-count': true,
  'fill-opacity': true,
  'flex-grow': true,
  'flex-shrink': true,
  'font-weight': true,
  'line-height': true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  'z-index': true,
  zoom: true,
};

const KEY_TEXT = 'text';
const KEY_STROKE = 'stroke';
const KEY_STROKE_WIDTH = 'stroke-width';
const KEY_STROKE_OPACITY = 'stroke-opacity';
const KEY_FONT_SIZE = 'font-size';
const KEY_FONT_STYLE = 'font-style';
const KEY_FONT_WEIGHT = 'font-weight';
const KEY_TEXT_DECORATION = 'text-decoration';
const KEY_TEXTS_ALIGNMENT = 'textsAlignment';
const NONE = 'none';
const DEFAULT_FONT_SIZE = 12;
const ELLIPSIS = '...';

type SvgAttributes = Record<string, ThemeValue>;

type PathSegment = (number | string)[];

type FuncIriCallback = (() => void) & { renderer?: RendererInstance };

interface FuncIriCallbacks {
  add: (fn: FuncIriCallback) => void;
  remove: (fn?: FuncIriCallback) => void;
  removeByRenderer: (renderer: RendererInstance) => void;
  fire: () => void;
}

interface FuncIriNode extends ChildNode {
  _fixFuncIri?: FuncIriCallback;
  readonly childNodes: NodeListOf<FuncIriNode>;
}

interface SvgDomElement extends SVGElement {
  _fixFuncIri?: FuncIriCallback;
  cloneNode: (deep?: boolean) => SvgDomElement;
  getBBox?: () => DOMRect;
  offsetWidth?: number;
  offsetHeight?: number;
}

interface SvgTextDomElement extends SvgDomElement {
  textContent: string;
}

interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
  isEmpty?: boolean;
}

interface ElementContainer {
  element: Node;
}

interface ElementLink {
  is: boolean;
  name: string;
  after?: string;
  virtual?: boolean;
  to: SvgElementInstance;
  i: number;
}

interface LinkedItem {
  _link: ElementLink;
}

interface CssTarget {
  element: ElementCSSInlineStyle;
  _styles: SvgAttributes;
}

interface HatchingTarget {
  renderer: RendererInstance;
  _hatching?: string | null;
  _filter?: string | null;
}

interface TextItem {
  value: string;
  height?: ThemeValue;
  line?: number;
  style?: SvgAttributes;
  className?: string;
  inherits?: boolean;
  tspan?: ThemeValue;
  stroke?: ThemeValue;
  startBox?: ThemeValue;
  endBox?: ThemeValue;
  endIndex?: number;
  hasEllipsis?: boolean;
}

interface TextLine {
  commonLength: number;
  parts: TextItem[];
}

interface TextOverflowOptions {
  wordWrap?: string;
  textOverflow?: string;
  hideOverflowEllipsis?: boolean;
}

interface MaxSizeResult {
  rowCount: number;
  textChanged: boolean;
  textIsEmpty: boolean;
}

interface ElementAnimationOptions {
  [option: string]: ThemeValue;
  step?: (easedProgress: number, progress: number) => void;
  complete?: () => void;
}

interface RendererOptions {
  container: Element;
  cssClass?: string;
  pathModified?: boolean;
}

interface RendererSettings {
  rtl?: boolean;
  encodeHtml?: boolean;
  animation?: ThemeValue;
}

interface RendererAnimationOptions {
  [option: string]: ThemeValue;
  enabled: boolean;
  duration: number;
  easing: string;
}

interface GradientStop {
  offset: ThemeValue;
  'stop-color'?: string;
  color?: string;
  opacity?: ThemeValue;
}

interface Hatching {
  direction?: string;
  step?: number;
  width?: number;
  opacity?: number;
}

interface PatternTemplate {
  render: (options: { container: Element }) => void;
}

interface DefsStorageItem {
  pattern: SvgElementInstance;
  count: number;
}

interface DefsStorage {
  byHash: Record<string, DefsStorageItem>;
  refToHash: Record<string, string>;
  baseId: string;
  nextId: number;
}

const DEFAULTS = {
  scaleX: 1,
  scaleY: 1,
  'pointer-events': null,
};

export const getBackup = callOnce(() => {
  const backupContainer = domAdapter.createElement('div');
  const backupCounter = 0;
  backupContainer.style.left = '-9999px';
  backupContainer.style.position = 'absolute';

  return {
    backupContainer,
    backupCounter,
  };
});

function backupRoot(root: SvgElementInstance): void {
  if (getBackup().backupCounter === 0) {
    domAdapter.getBody().appendChild(getBackup().backupContainer);
  }
  ++getBackup().backupCounter;
  root.append({ element: getBackup().backupContainer });
}

function restoreRoot(root: SvgElementInstance, container: Element): void {
  root.append({ element: container });
  --getBackup().backupCounter;
  if (getBackup().backupCounter === 0) {
    domAdapter.getBody().removeChild(getBackup().backupContainer);
  }
}

function isObjectArgument(value: ThemeValue): value is SvgAttributes {
  return value && (typeof value !== 'string');
}

function createElement(tagName: string): SvgDomElement {
  return domAdapter.createElementNS('http://www.w3.org/2000/svg', tagName) as SvgDomElement;
}

export function getFuncIri(id: string, pathModified?: boolean): string;
export function getFuncIri(id: string | null, pathModified?: boolean): string | null {
  return id !== null ? `url(${pathModified ? window.location.href.split('#')[0] : ''}#${id})` : id;
}

function extend(target: Record<string, ThemeValue>, source: ThemeValue): ThemeValue {
  let key;
  for (key in source) {
    target[key] = source[key];
  }
  return target;
}

const preserveAspectRatioMap = {
  full: NONE,
  lefttop: 'xMinYMin',
  leftcenter: 'xMinYMid',
  leftbottom: 'xMinYMax',
  centertop: 'xMidYMin',
  center: 'xMidYMid',
  centerbottom: 'xMidYMax',
  righttop: 'xMaxYMin',
  rightcenter: 'xMaxYMid',
  rightbottom: 'xMaxYMax',
};

export function processHatchingAttrs(element: HatchingTarget, attrs: SvgAttributes): SvgAttributes {
  if (attrs.hatching && normalizeEnum(attrs.hatching.direction) !== 'none') {
    attrs = extend({}, attrs);
    attrs.fill = element._hatching = element.renderer.lockDefsElements({
      color: attrs.fill,
      hatching: attrs.hatching,
    }, element._hatching, 'pattern');
    delete attrs.filter;
  } else if (element._hatching) {
    element.renderer.releaseDefsElements(element._hatching);
    element._hatching = null;
    delete attrs.filter;
  } else if (attrs.filter) {
    attrs = extend({}, attrs);
    attrs.filter = element._filter = element.renderer.lockDefsElements({}, element._filter, 'filter');
  } else if (element._filter) {
    element.renderer.releaseDefsElements(element._filter);
    element._filter = null;
  }
  delete attrs.hatching;
  return attrs;
}

//
// Build path segments
//

const buildArcPath = function (x: number, y: number, innerR: number, outerR: number, startAngleCos: number, startAngleSin: number, endAngleCos: number, endAngleSin: number, isCircle: boolean, longFlag: string): string {
  return [
    'M', (x + outerR * startAngleCos).toFixed(ARC_COORD_PREC), (y - outerR * startAngleSin).toFixed(ARC_COORD_PREC),
    'A', outerR.toFixed(ARC_COORD_PREC), outerR.toFixed(ARC_COORD_PREC), 0, longFlag, 0, (x + outerR * endAngleCos).toFixed(ARC_COORD_PREC), (y - outerR * endAngleSin).toFixed(ARC_COORD_PREC),
    isCircle ? 'M' : 'L', (x + innerR * endAngleCos).toFixed(5), (y - innerR * endAngleSin).toFixed(ARC_COORD_PREC),
    'A', innerR.toFixed(ARC_COORD_PREC), innerR.toFixed(ARC_COORD_PREC), 0, longFlag, 1, (x + innerR * startAngleCos).toFixed(ARC_COORD_PREC), (y - innerR * startAngleSin).toFixed(ARC_COORD_PREC),
    'Z',
  ].join(' ');
};

function buildPathSegments(points: ThemeValue, type: string): PathSegment[] {
  let list: PathSegment[] = [['M', 0, 0]];
  switch (type) {
    case 'line':
      list = buildLineSegments(points);
      break;
    case 'area':
      list = buildLineSegments(points, true);
      break;
    case 'bezier':
      list = buildCurveSegments(points);
      break;
    case 'bezierarea':
      list = buildCurveSegments(points, true);
      break;
  }
  return list;
}

function buildLineSegments(points: ThemeValue, close?: boolean): PathSegment[] {
  return buildSegments(points, buildSimpleLineSegment, close);
}

function buildCurveSegments(points: ThemeValue, close?: boolean): PathSegment[] {
  return buildSegments(points, buildSimpleCurveSegment, close);
}

function buildSegments(points: ThemeValue, buildSimpleSegment: (points: ThemeValue, close: boolean | undefined, list: PathSegment[]) => PathSegment[], close: boolean | undefined): PathSegment[] {
  let i;
  let ii;
  const list: PathSegment[] = [];
  if (points[0]?.length) {
    for (i = 0, ii = points.length; i < ii; ++i) {
      buildSimpleSegment(points[i], close, list);
    }
  } else {
    buildSimpleSegment(points, close, list);
  }
  return list;
}

function buildSimpleLineSegment(points: ThemeValue, close: boolean | undefined, list: PathSegment[]): PathSegment[] {
  let i = 0;
  const k0 = list.length;
  let k = k0;
  const ii = (points || []).length;
  if (ii) {
    // backward compatibility
    if (points[0].x !== undefined) {
      for (; i < ii;) {
        list[k++] = ['L', points[i].x, points[i++].y];
      }
    } else {
      for (; i < ii;) {
        list[k++] = ['L', points[i++], points[i++]];
      }
    }
    list[k0][0] = 'M';
  } else {
    list[k] = ['M', 0, 0];
  }
  close && list.push(['Z']);
  return list;
}

function buildSimpleCurveSegment(points: ThemeValue, close: boolean | undefined, list: PathSegment[]): PathSegment[] {
  let i;
  let k = list.length;
  const ii = (points || []).length;
  if (ii) {
    // backward compatibility
    if (points[0].x !== undefined) {
      list[k++] = ['M', points[0].x, points[0].y];
      for (i = 1; i < ii;) {
        list[k++] = [
          'C',
          points[i].x,
          points[i++].y,
          points[i].x,
          points[i++].y,
          points[i].x,
          points[i++].y,
        ];
      }
    } else {
      list[k++] = ['M', points[0], points[1]];
      for (i = 2; i < ii;) {
        list[k++] = [
          'C',
          points[i++],
          points[i++],
          points[i++],
          points[i++],
          points[i++],
          points[i++],
        ];
      }
    }
  } else {
    list[k] = ['M', 0, 0];
  }
  close && list.push(['Z']);
  return list;
}

function combinePathParam(segments: PathSegment[]): string {
  const d: (number | string)[] = [];
  let k = 0;
  let i;
  const ii = segments.length;
  let segment;
  let j;
  let jj;
  for (i = 0; i < ii; ++i) {
    segment = segments[i];
    for (j = 0, jj = segment.length; j < jj; ++j) {
      d[k++] = segment[j];
    }
  }
  return d.join(' ');
}

function compensateSegments(oldSegments: PathSegment[], newSegments: PathSegment[], type: string): PathSegment[] | undefined {
  const oldLength = oldSegments.length;
  const newLength = newSegments.length;
  let i;
  let originalNewSegments;
  // eslint-disable-next-line @typescript-eslint/prefer-includes
  const makeEqualSegments = type.indexOf('area') !== -1 ? makeEqualAreaSegments : makeEqualLineSegments;

  if (oldLength === 0) {
    for (i = 0; i < newLength; i++) {
      oldSegments.push(newSegments[i].slice(0));
    }
  } else if (oldLength < newLength) {
    makeEqualSegments(oldSegments, newSegments, type);
  } else if (oldLength > newLength) {
    originalNewSegments = newSegments.slice(0);
    makeEqualSegments(newSegments, oldSegments, type);
  }
  return originalNewSegments;
}

function prepareConstSegment(constSeg: PathSegment, type: string): void {
  const x = constSeg[constSeg.length - 2];
  const y = constSeg[constSeg.length - 1];
  switch (type) {
    case 'line':
    case 'area':
      constSeg[0] = 'L';
      break;
    case 'bezier':
    case 'bezierarea':
      constSeg[0] = 'C';
      constSeg[1] = constSeg[3] = constSeg[5] = x;
      constSeg[2] = constSeg[4] = constSeg[6] = y;
      break;
  }
}

function makeEqualLineSegments(short: PathSegment[], long: PathSegment[], type: string): void {
  const constSeg = short[short.length - 1].slice();
  let i = short.length;
  prepareConstSegment(constSeg, type);
  for (; i < long.length; i++) {
    short[i] = constSeg.slice(0);
  }
}

function makeEqualAreaSegments(short: PathSegment[], long: PathSegment[], type: string): void {
  let i;
  let head;
  const shortLength = short.length;
  const longLength = long.length;
  let constsSeg1;
  let constsSeg2;

  if ((shortLength - 1) % 2 === 0 && (longLength - 1) % 2 === 0) {
    i = (shortLength - 1) / 2 - 1;
    head = short.slice(0, i + 1);
    constsSeg1 = head[head.length - 1].slice(0);
    constsSeg2 = short.slice(i + 1)[0].slice(0);
    prepareConstSegment(constsSeg1, type);
    prepareConstSegment(constsSeg2, type);
    for (let j = i; j < (longLength - 1) / 2 - 1; j++) {
      short.splice(j + 1, 0, constsSeg1);
      short.splice(j + 3, 0, constsSeg2);
    }
  }
}

function baseCss<T extends CssTarget>(that: T, styles?: SvgAttributes | null): T {
  const elemStyles = that._styles;
  let key;
  let value;

  styles = styles || {};
  for (key in styles) {
    value = styles[key];
    if (isDefined(value)) {
      value += typeof value === 'number' && !pxAddingExceptions[key] ? 'px' : '';
      elemStyles[key] = value !== '' ? value : null;
    }
  }
  // NOTE: Seems that [].concat is not faster when there are only few entries in the `styles` (and in most cases there are few of them)
  for (key in elemStyles) {
    // The alternative is to *delete* entries in the previous cycle, but it is *delete*!
    value = elemStyles[key];
    if (value) {
      that.element.style[key] = value;
    } else if (value === null) {
      that.element.style[key] = '';
    }
  }
  return that;
}

function fixFuncIri(wrapper: SvgElementInstance, attribute: string): void {
  const { element } = wrapper;
  const id = wrapper.attr(attribute);

  if (id && id.indexOf('DevExpress') !== -1) {
    element.removeAttribute(attribute);
    element.setAttribute(attribute, getFuncIri(id, wrapper.renderer.pathModified));
  }
}

function baseAttr(that: SvgElementInstance, attrs?: string | SvgAttributes | null): ThemeValue {
  attrs = attrs || {};
  const settings = that._settings;
  const attributes = {};
  let key;
  let value;
  const elem = that.element;
  const { renderer } = that;
  const { rtl } = renderer;
  let hasTransformations;
  let recalculateDashStyle;
  let sw;
  let i;

  if (!isObjectArgument(attrs)) {
    if (attrs in settings) {
      return settings[attrs];
    }
    if (attrs in DEFAULTS) {
      return DEFAULTS[attrs];
    }
    return 0;
  }

  extend(attributes, attrs);

  for (key in attributes) {
    value = attributes[key];
    if (value === undefined) {
      continue;
    }
    settings[key] = value;

    if (key === 'align') {
      key = 'text-anchor';
      value = { left: rtl ? 'end' : 'start', center: 'middle', right: rtl ? 'start' : 'end' }[value] || null;
    } else if (key === 'dashStyle') {
      recalculateDashStyle = true;
      continue;
    } else if (key === KEY_STROKE_WIDTH) {
      recalculateDashStyle = true;
    } else if (value && (key === 'fill' || key === 'clip-path' || key === 'filter') && value.indexOf('DevExpress') === 0) {
      that._addFixIRICallback();
      value = getFuncIri(value, renderer.pathModified);
    } else if (/^(translate(X|Y)|rotate[XY]?|scale(X|Y)|sharp|sharpDirection)$/i.test(key)) {
      hasTransformations = true;
      continue;
    } else if (/^(x|y|d)$/i.test(key)) {
      // TODO test it
      hasTransformations = true;
    }
    if (value === null) {
      elem.removeAttribute(key);
    } else {
      elem.setAttribute(key, value);
    }
  }

  if (recalculateDashStyle && ('dashStyle' in settings)) {
    value = settings.dashStyle;
    sw = ('_originalSW' in that ? that._originalSW : settings[KEY_STROKE_WIDTH]) || 1;
    key = 'stroke-dasharray';

    value = value === null ? '' : normalizeEnum(value);

    if (value === '' || value === 'solid' || value === NONE) {
      that.element.removeAttribute(key);
    } else {
      value = value.replace(/longdash/g, '8,3,').replace(/dash/g, '4,3,').replace(/dot/g, '1,3,').replace(/,$/, '')
        .split(',');
      i = value.length;
      while (i--) {
        value[i] = parseInt(value[i]) * sw;
      }
      that.element.setAttribute(key, value.join(','));
    }
  }

  if (hasTransformations) {
    that._applyTransformation();
  }

  return that;
}

function orderHtmlTree(list: TextItem[], line: number, node: ThemeValue, parentStyle: SvgAttributes, parentClassName: string): number {
  let style;
  let realStyle;
  let i;
  let ii;
  let nodes;

  if (node.wholeText !== undefined) {
    list.push({
      value: node.wholeText, style: parentStyle, className: parentClassName /* EXPERIMENTAL */, line, height: parentStyle[KEY_FONT_SIZE] || 0,
    });
  } else if (node.tagName === 'BR') {
    ++line;
  } else if (domAdapter.isElementNode(node)) {
    extend(style = {}, parentStyle);
    switch (node.tagName) {
      case 'B':
      case 'STRONG':
        style[KEY_FONT_WEIGHT] = 'bold';
        break;
      case 'I':
      case 'EM':
        style[KEY_FONT_STYLE] = 'italic';
        break;
      case 'U':
        style[KEY_TEXT_DECORATION] = 'underline';
        break;
    }
    realStyle = node.style;
    realStyle.color && (style.fill = realStyle.color);
    realStyle.fontSize && (style[KEY_FONT_SIZE] = realStyle.fontSize);
    realStyle.fontStyle && (style[KEY_FONT_STYLE] = realStyle.fontStyle);
    realStyle.fontWeight && (style[KEY_FONT_WEIGHT] = realStyle.fontWeight);
    realStyle.textDecoration && (style[KEY_TEXT_DECORATION] = realStyle.textDecoration);
    for (i = 0, nodes = node.childNodes, ii = nodes.length; i < ii; ++i) {
      line = orderHtmlTree(list, line, nodes[i], style, node.className || parentClassName);
    }
  }
  return line;
}

function adjustLineHeights(items: TextItem[]): void {
  let i;
  let ii;
  let currentItem = items[0];
  let item;
  for (i = 1, ii = items.length; i < ii; ++i) {
    item = items[i];
    if (item.line === currentItem.line) {
      // T177039
      currentItem.height = maxLengthFontSize(currentItem.height, item.height);
      currentItem.inherits = currentItem.inherits || parseFloat(item.height) === 0;
      item.height = NaN;
    } else {
      currentItem = item;
    }
  }
}

function removeExtraAttrs(html: string): string {
  const findTagAttrs = /(?:(<[a-z0-9]+\s*))([\s\S]*?)(>|\/>)/gi;
  const findStyleAndClassAttrs = /(style|class)\s*=\s*(["'])(?:(?!\2).)*\2\s?/gi;

  return html.replace(findTagAttrs, (allTagAttrs, p1, p2, p3) => {
    p2 = (p2 && p2.match(findStyleAndClassAttrs) || []).map((str) => str).join(' ');

    return p1 + p2 + p3;
  });
}

function parseHTML(text: string): TextItem[] {
  const items: TextItem[] = [];
  const div = domAdapter.createElement('div');
  div.innerHTML = text.replace(/\r/g, '').replace(/\n/g, '<br/>').replace(/style=/g, 'data-style=');
  div.querySelectorAll('[data-style]').forEach((element) => {
    // @ts-expect-error querySelectorAll types the matches as Element, which has no style; a string sets the inline style text
    element.style = element.getAttribute('data-style');
    element.removeAttribute('data-style');
  });
  orderHtmlTree(items, 0, div, {}, '');
  adjustLineHeights(items);
  return items;
}

function parseMultiline(text: string): TextItem[] {
  const texts = text.replace(/\r/g, '').split(/\n/g);
  let i = 0;
  const items: TextItem[] = [];
  for (; i < texts.length; i++) {
    items.push({ value: texts[i].trim(), height: 0, line: i });
  }
  return items;
}

function createTspans(items: TextItem[], element: Node, fieldName: 'tspan' | 'stroke'): void {
  let i;
  let ii;
  let item;
  for (i = 0, ii = items.length; i < ii; ++i) {
    item = items[i];
    item[fieldName] = createElement('tspan');
    item[fieldName].appendChild(domAdapter.createTextNode(item.value));
    item.style && baseCss({ element: item[fieldName], _styles: {} }, item.style);
    item.className && item[fieldName].setAttribute('class', item.className); // EXPERIMENTAL
    element.appendChild(item[fieldName]);
  }
}

function cloneAndRemoveAttrs(node: ThemeValue): ThemeValue {
  let clone;
  if (node) {
    clone = node.cloneNode();
    clone.removeAttribute('y');
    clone.removeAttribute('x');
  }
  return clone || node;
}

function detachTitleElements(element: Element): NodeListOf<Element> {
  const titleElements = domAdapter.querySelectorAll(element, 'title');

  for (let i = 0; i < titleElements.length; i++) {
    element.removeChild(titleElements[i]);
  }

  return titleElements;
}

function detachAndStoreTitleElements(element: Element): () => void {
  const titleElements = detachTitleElements(element);

  return () => {
    for (let i = 0; i < titleElements.length; i++) {
      element.appendChild(titleElements[i]);
    }
  };
}

// @ts-expect-error returns the index only when the text crosses maxWidth, undefined otherwise
function getIndexForEllipsis(text: TextItem, maxWidth: number, startBox: number, endBox: number): number | undefined {
  let k;
  let kk;
  if (startBox <= maxWidth && endBox > maxWidth) {
    for (k = 1, kk = text.value.length; k <= kk; ++k) {
      if (startBox + text.tspan.getSubStringLength(0, k) > maxWidth) {
        return k - 1;
      }
    }
  }
}

function getTextWidth(text: TextItem): number {
  return text.value.length ? text.tspan.getSubStringLength(0, text.value.length) : 0;
}

function prepareLines(element: SvgTextDomElement, texts: TextItem[] | null, maxWidth: number): TextLine[] {
  let lines: TextLine[] = [];
  let i;
  let ii;
  let text;
  let startBox;
  let endBox;

  if (texts) {
    for (i = 0, ii = texts.length; i < ii; ++i) {
      text = texts[i];
      if (!lines[text.line]) {
        text.startBox = startBox = 0;
        lines.push({ commonLength: text.value.length, parts: [text] });
      } else {
        text.startBox = startBox;
        lines[text.line].parts.push(text);
        lines[text.line].commonLength += text.value.length;
      }
      endBox = startBox + text.tspan.getSubStringLength(0, text.value.length);
      text.endIndex = getIndexForEllipsis(text, maxWidth, startBox, endBox);
      startBox = endBox;
    }
  } else {
    text = { value: element.textContent, tspan: element };
    text.startBox = startBox = 0;
    endBox = startBox + getTextWidth(text);
    text.endIndex = getIndexForEllipsis(text, maxWidth, startBox, endBox);
    lines = [{ commonLength: element.textContent.length, parts: [text] }];
  }
  return lines;
}

function getSpaceBreakIndex(text: TextItem, maxWidth: number): number {
  const initialIndices = text.startBox > 0 ? [0] : [];
  const spaceIndices = text.value.split('').reduce((indices, char, index) => {
    if (char === ' ') {
      indices.push(index);
    }
    return indices;
  }, initialIndices);

  let spaceIndex = 0;
  while (spaceIndices[spaceIndex + 1] !== undefined && (text.startBox + text.tspan.getSubStringLength(0, spaceIndices[spaceIndex + 1]) < maxWidth)) {
    spaceIndex++;
  }

  return spaceIndices[spaceIndex];
}

// @ts-expect-error returns the index only when the text crosses maxWidth, undefined otherwise
function getWordBreakIndex(text: TextItem, maxWidth: number): number | undefined {
  for (let i = 0; i < text.value.length - 1; i++) {
    if (text.startBox + text.tspan.getSubStringLength(0, i + 1) > maxWidth) {
      return i;
    }
  }
}

function getEllipsisString(ellipsisMaxWidth: number, { hideOverflowEllipsis }: TextOverflowOptions): string {
  return hideOverflowEllipsis && ellipsisMaxWidth === 0 ? '' : ELLIPSIS;
}

function setEllipsis(text: TextItem, ellipsisMaxWidth: number, options: TextOverflowOptions): void {
  const ellipsis = getEllipsisString(ellipsisMaxWidth, options);
  if (text.value.length && text.tspan.parentNode) {
    for (let i = text.value.length - 1; i >= 1; i--) {
      if (text.startBox + text.tspan.getSubStringLength(0, i) < ellipsisMaxWidth) {
        setNewText(text, i, ellipsis);
        break;
      } else if (i === 1) {
        setNewText(text, 0, ellipsis);
      }
    }
  }
}

function wordWrap(text: TextItem, maxWidth: number, ellipsisMaxWidth: number, options: TextOverflowOptions, lastStepBreakIndex?: number): TextLine[] {
  const wholeText = text.value;
  let breakIndex;
  if (options.wordWrap !== 'none') {
    breakIndex = options.wordWrap === 'normal' ? getSpaceBreakIndex(text, maxWidth) : getWordBreakIndex(text, maxWidth);
  }

  let restLines: TextLine[] = [];
  let restText;

  if (isFinite(breakIndex) && !(lastStepBreakIndex === 0 && breakIndex === 0)) {
    setNewText(text, breakIndex, '');

    const newTextOffset = wholeText[breakIndex] === ' ' ? 1 : 0;

    const restString = wholeText.slice(breakIndex + newTextOffset);
    if (restString.length) {
      const restTspan = cloneAndRemoveAttrs(text.tspan);

      restTspan.textContent = restString;

      text.tspan.parentNode.appendChild(restTspan);

      restText = extend(extend({}, text), {
        value: restString,
        startBox: 0,
        height: 0,
        tspan: restTspan,
        stroke: cloneAndRemoveAttrs(text.stroke),
        endBox: restTspan.getSubStringLength(0, restString.length),
      });

      restText.stroke && (restText.stroke.textContent = restString);

      if (restText.endBox > maxWidth) {
        restLines = wordWrap(restText, maxWidth, ellipsisMaxWidth, options, breakIndex);
        if (!restLines.length) {
          return [];
        }
      }
    }
  }

  if (text.value.length) {
    if (options.textOverflow === 'ellipsis' && text.tspan.getSubStringLength(0, text.value.length) > maxWidth) {
      setEllipsis(text, ellipsisMaxWidth, options);
    }

    if (options.textOverflow === 'hide' && text.tspan.getSubStringLength(0, text.value.length) > maxWidth) {
      return [];
    }
  } else {
    text.tspan.parentNode.removeChild(text.tspan);
  }

  const parts: TextItem[] = [];

  if (restText) {
    parts.push(restText);
  }

  return [{ commonLength: wholeText.length, parts }].concat(restLines);
}

function calculateLineHeight(line: TextLine, lineHeight: number): number {
  return line.parts.reduce((height, text) => max(height, getItemLineHeight(text, lineHeight)), 0);
}

function setMaxHeight(lines: TextLine[], ellipsisMaxWidth: number, options: TextOverflowOptions, maxHeight: number, lineHeight: number): TextLine[] {
  const { textOverflow } = options;
  if (!isFinite(maxHeight)
      || Number(maxHeight) === 0
    || textOverflow === 'none'
  ) {
    return lines;
  }
  const result = lines.reduce<[TextLine[], number]>(([lines, commonHeight], l, index, arr) => {
    const height = calculateLineHeight(l, lineHeight);
    commonHeight += height;
    if (commonHeight < maxHeight) {
      lines.push(l);
    } else {
      l.parts.forEach((item) => {
        removeTextSpan(item);
      });
      if (textOverflow === 'ellipsis') {
        const prevLine = arr[index - 1];
        if (prevLine) {
          const text = prevLine.parts[prevLine.parts.length - 1];
          if (!text.hasEllipsis) {
            if (ellipsisMaxWidth === 0 || text.endBox < ellipsisMaxWidth) {
              setNewText(text, text.value.length, getEllipsisString(ellipsisMaxWidth, options));
            } else {
              setEllipsis(text, ellipsisMaxWidth, options);
            }
          }
        }
      }
    }
    return [lines, commonHeight];
  }, [[], 0]);

  if (textOverflow === 'hide' && result[1] > maxHeight) {
    result[0].forEach((l) => {
      l.parts.forEach((item) => {
        removeTextSpan(item);
      });
    });
    return [];
  }

  return result[0];
}

function applyOverflowRules(element: SvgTextDomElement, texts: TextItem[] | null, maxWidth: number, ellipsisMaxWidth: number, options: TextOverflowOptions): TextLine[] {
  if (!texts) {
    const textValue = element.textContent;
    const text = { value: textValue, height: 0, line: 0 };
    element.textContent = '';
    createTspans([text], element, 'tspan');

    texts = [text];
  }

  return texts.reduce<[TextLine[], number, number, boolean, number?]>(([lines, startBox, endBox, stop, lineNumber], text) => {
    const line = lines[lines.length - 1];
    if (stop) {
      return [lines, startBox, endBox, stop];
    }
    if (!line || text.line !== lineNumber) {
      text.startBox = startBox = 0;
      lines.push({ commonLength: text.value.length, parts: [text] });
    } else {
      text.startBox = startBox;
      if (startBox > ellipsisMaxWidth && options.wordWrap === 'none' && options.textOverflow === 'ellipsis') {
        removeTextSpan(text);
        return [lines, startBox, endBox, stop, lineNumber];
      }
      line.parts.push(text);

      line.commonLength += text.value.length;
    }
    text.endBox = endBox = startBox + getTextWidth(text);

    startBox = endBox;

    if (isDefined(maxWidth) && endBox > maxWidth) {
      const wordWrapLines = wordWrap(text, maxWidth, ellipsisMaxWidth, options);
      if (!wordWrapLines.length) {
        lines = [];
        stop = true;
      } else {
        lines = lines.concat(wordWrapLines.filter((l) => l.parts.length > 0));
      }
    }

    return [lines, startBox, endBox, stop, text.line];
  }, [[], 0, 0, false, 0])[0];
}

function setNewText(text: TextItem, index: number, insertString = ELLIPSIS): void {
  const newText = text.value.substr(0, index) + insertString;
  text.value = text.tspan.textContent = newText;
  text.stroke && (text.stroke.textContent = newText);
  if (insertString === ELLIPSIS) {
    text.hasEllipsis = true;
  }
}

function removeTextSpan(text: TextItem): void {
  text.tspan.parentNode && text.tspan.parentNode.removeChild(text.tspan);
  text.stroke && text.stroke.parentNode && text.stroke.parentNode.removeChild(text.stroke);
}

function createTextNodes(wrapper: TextSvgElementInstance, text: ThemeValue, isStroked: boolean): void {
  let items;
  let parsedHtml;

  wrapper._texts = null;
  wrapper.clear();

  if (text === null) return;

  text = `${text}`;
  if (!wrapper.renderer.encodeHtml && (/<[a-z][\s\S]*>/i.test(text) || text.indexOf('&') !== -1)) {
    parsedHtml = removeExtraAttrs(text);
    items = parseHTML(parsedHtml);
    /// #DEBUG
    wrapper.DEBUG_parsedHtml = parsedHtml;
    /// #ENDDEBUG
  } else if (/\n/g.test(text)) {
    items = parseMultiline(text);
  } else if (isStroked) {
    items = [{ value: text.trim(), height: 0 }];
  }
  if (items) {
    if (items.length) { // T227388
      wrapper._texts = items;
      if (isStroked) {
        createTspans(items, wrapper.element, KEY_STROKE);
      }
      createTspans(items, wrapper.element, 'tspan');
    }
  } else {
    wrapper.element.appendChild(domAdapter.createTextNode(text));
  }
}

function setTextNodeAttribute(item: TextItem, name: string, value: ThemeValue): void {
  item.tspan.setAttribute(name, value);
  item.stroke && item.stroke.setAttribute(name, value);
}

function getItemLineHeight(item: TextItem, defaultValue: ThemeValue): ThemeValue {
  return item.inherits ? maxLengthFontSize(item.height, defaultValue) : item.height || defaultValue;
}

function locateTextNodes(wrapper: TextSvgElementInstance): void {
  if (!wrapper._texts) return;
  const items = wrapper._texts;
  const { x } = wrapper._settings;
  const lineHeight = wrapper._getLineHeight();
  let i;
  let ii;
  let item = items[0];
  setTextNodeAttribute(item, 'x', x);
  setTextNodeAttribute(item, 'y', wrapper._settings.y);
  for (i = 1, ii = items.length; i < ii; ++i) {
    item = items[i];
    if (parseFloat(item.height) >= 0) {
      setTextNodeAttribute(item, 'x', x);
      const height = getItemLineHeight(item, lineHeight);
      setTextNodeAttribute(item, 'dy', height); // T177039
    }
  }
}

function alignTextNodes(wrapper: TextSvgElementInstance, alignment: string): void {
  if (!wrapper._texts || alignment === 'center') {
    return;
  }

  const items = wrapper._texts;
  const direction = alignment === 'left' ? -1 : 1;
  const maxTextWidth = Math.max.apply(Math, items.map((t) => getTextWidth(t)));

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const textWidth = getTextWidth(item);
    if (maxTextWidth !== 0 && maxTextWidth !== textWidth) {
      setTextNodeAttribute(item, 'dx', direction * round(((maxTextWidth - textWidth) / 2) * 10) / 10);
    }
  }
}

function maxLengthFontSize(fontSize1: ThemeValue, fontSize2: ThemeValue): ThemeValue {
  const parsedHeight1 = parseFloat(fontSize1);
  const parsedHeight2 = parseFloat(fontSize2);
  const height1 = parsedHeight1 || DEFAULT_FONT_SIZE;
  const height2 = parsedHeight2 || DEFAULT_FONT_SIZE;

  return height1 > height2 ? !isNaN(parsedHeight1) ? fontSize1 : height1 : !isNaN(parsedHeight2) ? fontSize2 : height2;
}

function strokeTextNodes(wrapper: TextSvgElementInstance): void {
  if (!wrapper._texts) return;
  const items = wrapper._texts;
  const stroke = wrapper._settings[KEY_STROKE];
  const strokeWidth = wrapper._settings[KEY_STROKE_WIDTH];
  const strokeOpacity = wrapper._settings[KEY_STROKE_OPACITY] || 1;
  let tspan;
  let i;
  let ii;
  for (i = 0, ii = items.length; i < ii; ++i) {
    tspan = items[i].stroke;
    tspan.setAttribute(KEY_STROKE, stroke);
    tspan.setAttribute(KEY_STROKE_WIDTH, strokeWidth);
    tspan.setAttribute(KEY_STROKE_OPACITY, strokeOpacity);
    tspan.setAttribute('stroke-linejoin', 'round');
  }
}

function baseAnimate<T extends SvgElementInstance>(that: T, params: SvgAttributes, options?: ElementAnimationOptions, complete?: () => void): T {
  options = options || {};
  let key;
  let value;
  const { renderer } = that;
  const settings = that._settings;
  const animationParams: SvgAttributes = {};

  const defaults = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
  };

  if (complete) {
    options.complete = complete;
  }

  if (renderer.animationEnabled()) {
    for (key in params) {
      value = params[key];
      if (/^(translate(X|Y)|rotate[XY]?|scale(X|Y))$/i.test(key)) {
        animationParams.transform = animationParams.transform || { from: {}, to: {} };
        animationParams.transform.from[key] = key in settings ? Number(settings[key].toFixed(3)) : defaults[key]; // T338486
        animationParams.transform.to[key] = value;
      } else if (key === 'arc' || key === 'segments') {
        animationParams[key] = value;
      } else {
        animationParams[key] = {
          // @ts-expect-error a missing attribute animates from parseFloat(0), that is 0
          from: key in settings ? settings[key] : parseFloat(that.element.getAttribute(key) || 0),
          to: value,
        };
      }
    }
    renderer.animateElement(that, animationParams, extend(extend({}, renderer._animation), options));
  } else {
    options.step && options.step.call(that, 1, 1);
    options.complete && options.complete.call(that);

    that.attr(params);
  }
  return that;
}

function buildLink(target: SvgElementInstance | null, parameters: ThemeValue): ElementLink {
  // @ts-expect-error `to` is set below for a real link (a virtual link has no container), `i` once linkItem() inserts the item
  const obj: ElementLink = { is: false, name: parameters.name || parameters, after: parameters.after };
  if (target) {
    obj.to = target;
  } else {
    obj.virtual = true;
  }
  return obj;
}

// SvgElement
export let SvgElement = class SvgElement {
  declare renderer: RendererInstance;

  declare element: SvgDomElement;

  declare _settings: SvgAttributes;

  declare _styles: SvgAttributes;

  declare type?: string;

  declare _$element?: CoreRenderer;

  declare _links: LinkedItem[];

  declare _link: ElementLink;

  declare _linkAfter?: string;

  declare _hatching?: string | null;

  declare _filter?: string | null;

  declare _originalSW?: number;

  declare animation?: Animation;

  declare id?: string;

  declare clipPath?: SvgElementInstance;

  declare rect?: SvgElementInstance;

  declare path?: SvgElementInstance;

  declare gaussianBlur?: SvgElementInstance;

  declare offset?: SvgElementInstance;

  declare flood?: SvgElementInstance;

  declare composite?: SvgElementInstance;

  declare finalComposite?: SvgElementInstance;

  constructor(renderer: RendererInstance, tagName: string, type?: string) {
    this.renderer = renderer;
    this.element = createElement(tagName);
    this._settings = {};
    this._styles = {};

    if (tagName === 'path') {
      this.type = type || 'line';
    }
  }

  _getJQElement(): CoreRenderer {
    return (this._$element || (this._$element = $(this.element)));
  }

  _addFixIRICallback(): void {
    const that = this;
    const fn = function (): void {
      fixFuncIri(that, 'fill');
      fixFuncIri(that, 'clip-path');
      fixFuncIri(that, 'filter');
    };

    that.element._fixFuncIri = fn;
    fn.renderer = that.renderer;
    fixFuncIriCallbacks.add(fn);
    that._addFixIRICallback = function (): void {};
  }

  _clearChildrenFuncIri(): void {
    const clearChildren = function (element: FuncIriNode): void {
      let i;

      for (i = 0; i < element.childNodes.length; i++) {
        removeFuncIriCallback(element.childNodes[i]._fixFuncIri);
        clearChildren(element.childNodes[i]);
      }
    };

    clearChildren(this.element);
  }

  dispose(): this {
    removeFuncIriCallback(this.element._fixFuncIri);
    this._clearChildrenFuncIri();
    this._getJQElement().remove();
    return this;
  }

  append(parent?: ElementContainer | null): this {
    (parent || this.renderer.root).element.appendChild(this.element);
    return this;
  }

  remove(): this {
    const { element } = this;
    element.parentNode && element.parentNode.removeChild(element);
    return this;
  }

  // NOTE: Though it is not actually required I think it would be better to explicitly declare usage of link mechanism
  enableLinks(): this {
    this._links = [];
    return this;
  }

  /// #DEBUG
  checkLinks(): void {
    let count = 0;
    const links = this._links;
    let i;
    const ii = links.length;
    for (i = 0; i < ii; ++i) {
      if (!links[i]._link.virtual) {
        ++count;
      }
    }
    if (count > 0) {
      throw new Error('There are non disposed links!');
    }
  }
  /// #ENDDEBUG

  virtualLink(parameters: ThemeValue): this {
    linkItem({ _link: buildLink(null, parameters) }, this);
    return this;
  }

  linkAfter(name?: string): this {
    this._linkAfter = name;
    return this;
  }

  linkOn(target: SvgElementInstance, parameters: ThemeValue): this {
    this._link = buildLink(target, parameters);
    linkItem(this, target);
    return this;
  }

  linkOff(): this {
    unlinkItem(this);
    // @ts-expect-error linkOff() drops the link
    this._link = null;
    return this;
  }

  // It might be better to traverse list to start (not to end) as widget components more likely will be rendered in the same order as they were created
  linkAppend(): this {
    const link = this._link;
    const items = link.to._links;
    let i;
    let next;
    for (i = link.i + 1; (next = items[i]) && !next._link.is; ++i);
    this._insert(link.to, next);
    link.is = true;
    return this;
  }

  // The method exists only for being overridden in vml
  _insert(parent: ElementContainer, next?: ElementContainer): void {
    parent.element.insertBefore(this.element, next ? next.element : null);
  }

  linkRemove(): this {
    this.remove();
    this._link.is = false;
    return this;
  }

  clear(): this {
    this._clearChildrenFuncIri();// T711457
    this._getJQElement().empty();
    return this;
  }

  toBackground(): this {
    const elem = this.element;
    const parent = elem.parentNode;
    parent?.insertBefore(elem, parent.firstChild);
    return this;
  }

  toForeground(): this {
    const elem = this.element;
    const parent = elem.parentNode;
    parent?.appendChild(elem);
    return this;
  }

  attr(name: string): ThemeValue;
  attr(attrs?: SvgAttributes | null): this;
  attr(attrs?: ThemeValue): ThemeValue {
    return baseAttr(this, attrs);
  }

  smartAttr(attrs: SvgAttributes): this {
    return this.attr(processHatchingAttrs(this, attrs));
  }

  css(styles?: SvgAttributes | null): this {
    return baseCss(this, styles);
  }

  animate(params: SvgAttributes, options?: ElementAnimationOptions, complete?: () => void): this {
    return baseAnimate(this, params, options, complete);
  }

  sharp(pos?: string | boolean, sharpDirection?: number): this {
    return this.attr({ sharp: pos || true, sharpDirection });
  }

  _applyTransformation(): void {
    const tr = this._settings;
    let rotateX;
    let rotateY;
    const transformations: string[] = [];
    const sharpMode = tr.sharp;
    const trDirection = tr.sharpDirection || 1;
    const strokeOdd = tr[KEY_STROKE_WIDTH] % 2;
    const correctionX = strokeOdd && (sharpMode === 'h' || sharpMode === true) ? SHARPING_CORRECTION * trDirection : 0;
    const correctionY = strokeOdd && (sharpMode === 'v' || sharpMode === true) ? SHARPING_CORRECTION * trDirection : 0;
    transformations.push(`translate(${(tr.translateX || 0) + correctionX},${(tr.translateY || 0) + correctionY})`);

    if (tr.rotate) {
      if ('rotateX' in tr) {
        rotateX = tr.rotateX;
      } else {
        rotateX = tr.x;
      }

      if ('rotateY' in tr) {
        rotateY = tr.rotateY;
      } else {
        rotateY = tr.y;
      }
      transformations.push(`rotate(${tr.rotate},${rotateX || 0},${rotateY || 0})`);
    }
    const scaleXDefined = isDefined(tr.scaleX);
    const scaleYDefined = isDefined(tr.scaleY);
    if (scaleXDefined || scaleYDefined) {
      transformations.push(`scale(${scaleXDefined ? tr.scaleX : 1},${scaleYDefined ? tr.scaleY : 1})`);
    }

    if (transformations.length) {
      this.element.setAttribute('transform', transformations.join(' '));
    }
  }

  move(x?: number, y?: number, animate?: boolean, animOptions?: ElementAnimationOptions): this {
    const obj: SvgAttributes = {};
    isDefined(x) && (obj.translateX = x);
    isDefined(y) && (obj.translateY = y);

    if (!animate) {
      this.attr(obj);
    } else {
      this.animate(obj, animOptions);
    }
    return this;
  }

  rotate(angle: number, x?: number, y?: number, animate?: boolean, animOptions?: ElementAnimationOptions): this {
    const obj: SvgAttributes = {
      rotate: angle || 0,
    };
    isDefined(x) && (obj.rotateX = x);
    isDefined(y) && (obj.rotateY = y);

    if (!animate) {
      this.attr(obj);
    } else {
      this.animate(obj, animOptions);
    }
    return this;
  }

  _getElementBBox(): BBox {
    const elem = this.element;
    let bBox;

    try {
      bBox = elem.getBBox && elem.getBBox();
    } catch (e) { }

    return bBox || {
      x: 0, y: 0, width: elem.offsetWidth || 0, height: elem.offsetHeight || 0,
    };
  }

  // TODO do we need to round results and consider rotation coordinates?
  getBBox(): BBox {
    const transformation = this._settings;
    let bBox = this._getElementBBox();

    if (transformation.rotate) {
      bBox = rotateBBox(bBox, [
        ('rotateX' in transformation ? transformation.rotateX : transformation.x) || 0,
        ('rotateY' in transformation ? transformation.rotateY : transformation.y) || 0,
      ], -transformation.rotate); // Angle is transformed from svg to right-handed cartesian space
    } else {
      bBox = normalizeBBox(bBox);
    }
    return bBox;
  }

  markup(): string {
    return getSvgMarkup(this.element);
  }

  getOffset(): Coordinates | undefined {
    return this._getJQElement().offset();
  }

  stopAnimation(disableComplete?: boolean): this {
    const { animation } = this;
    animation?.stop(disableComplete);
    return this;
  }

  setTitle(text?: string): void {
    const titleElem = createElement('title');
    titleElem.textContent = text || '';
    this.element.appendChild(titleElem);
  }

  removeTitle(): void {
    detachTitleElements(this.element);
  }

  data(name: string, value: ThemeValue): this;
  data(values: SvgAttributes): this;
  data(obj: ThemeValue, val?: ThemeValue): this {
    const elem = this.element;
    let key;
    if (val !== undefined) {
      elem[obj] = val;
    } else {
      for (key in obj) {
        elem[key] = obj[key];
      }
    }
    return this;
  }

  on(...args: ThemeValue[]): this;
  on(): this {
    const args = [this._getJQElement()];
    // @ts-expect-error push.apply forwards `arguments`, which the typings do not accept as an argument array
    args.push.apply(args, arguments);
    // @ts-expect-error apply() passes the collected array, the typings expect the (element, eventName, handler) tuple
    eventsEngine.on.apply(eventsEngine, args);
    return this;
  }

  off(...args: ThemeValue[]): this;
  off(): this {
    const args = [this._getJQElement()];
    // @ts-expect-error push.apply forwards `arguments`, which the typings do not accept as an argument array
    args.push.apply(args, arguments);
    // @ts-expect-error apply() passes the collected array, the typings expect the (element, eventName?, handler?) tuple
    eventsEngine.off.apply(eventsEngine, args);
    return this;
  }

  trigger(...args: ThemeValue[]): this;
  trigger(): this {
    const args = [this._getJQElement()];
    // @ts-expect-error push.apply forwards `arguments`, which the typings do not accept as an argument array
    args.push.apply(args, arguments);
    // @ts-expect-error apply() passes the collected array, the typings expect the (element, event, extraParameters?) tuple
    eventsEngine.trigger.apply(eventsEngine, args);
    return this;
  }
};

type SvgElementInstance = InstanceType<typeof SvgElement>;

function removeFuncIriCallback(callback?: FuncIriCallback): void {
  fixFuncIriCallbacks.remove(callback);
}
// SvgElement

// PathSvgElement
export let PathSvgElement = class PathSvgElement extends SvgElement {
  declare type: string;

  declare segments?: PathSegment[];

  constructor(renderer: RendererInstance, type?: string) {
    super(renderer, 'path', type);
  }

  attr(name: string): ThemeValue;
  attr(attrs?: SvgAttributes | null): this;
  attr(attrs?: ThemeValue): ThemeValue {
    let segments;

    if (isObjectArgument(attrs)) {
      attrs = extend({}, attrs);
      segments = attrs.segments;
      if ('points' in attrs) {
        segments = buildPathSegments(attrs.points, this.type);
        delete attrs.points;
      }
      if (segments) {
        attrs.d = combinePathParam(segments);
        this.segments = segments;
        delete attrs.segments;
      }
    }
    return baseAttr(this, attrs);
  }

  animate(params: SvgAttributes, options?: ElementAnimationOptions, complete?: () => void): this {
    const curSegments = this.segments || [];
    let newSegments;
    let endSegments;

    if (this.renderer.animationEnabled() && 'points' in params) {
      newSegments = buildPathSegments(params.points, this.type);
      endSegments = compensateSegments(curSegments, newSegments, this.type);

      params.segments = { from: curSegments, to: newSegments, end: endSegments };
      delete params.points;
    }

    return baseAnimate(this, params, options, complete);
  }
};

type PathSvgElementInstance = InstanceType<typeof PathSvgElement>;
// PathSvgElement

// ArcSvgElement
export let ArcSvgElement = class ArcSvgElement extends SvgElement {
  constructor(renderer: RendererInstance) {
    super(renderer, 'path', 'arc');
  }

  attr(name: string): ThemeValue;
  attr(attrs?: SvgAttributes | null): this;
  attr(attrs?: ThemeValue): ThemeValue {
    const settings = this._settings;
    let x;
    let y;
    let innerRadius;
    let outerRadius;
    let startAngle;
    let endAngle;

    if (isObjectArgument(attrs)) {
      attrs = extend({}, attrs);
      if ('x' in attrs || 'y' in attrs || 'innerRadius' in attrs || 'outerRadius' in attrs || 'startAngle' in attrs || 'endAngle' in attrs) {
        settings.x = x = 'x' in attrs ? attrs.x : settings.x; delete attrs.x;
        settings.y = y = 'y' in attrs ? attrs.y : settings.y; delete attrs.y;
        settings.innerRadius = innerRadius = 'innerRadius' in attrs ? attrs.innerRadius : settings.innerRadius; delete attrs.innerRadius;
        settings.outerRadius = outerRadius = 'outerRadius' in attrs ? attrs.outerRadius : settings.outerRadius; delete attrs.outerRadius;
        settings.startAngle = startAngle = 'startAngle' in attrs ? attrs.startAngle : settings.startAngle; delete attrs.startAngle;
        settings.endAngle = endAngle = 'endAngle' in attrs ? attrs.endAngle : settings.endAngle; delete attrs.endAngle;
        // @ts-expect-error normalizeArcParams returns an untyped array of the buildArcPath arguments
        attrs.d = buildArcPath.apply(null, normalizeArcParams(x, y, innerRadius, outerRadius, startAngle, endAngle));
      }
    }
    return baseAttr(this, attrs);
  }

  animate(params: SvgAttributes, options?: ElementAnimationOptions, complete?: () => void): this {
    const settings = this._settings;
    const arcParams: { from: SvgAttributes; to: SvgAttributes } = { from: {}, to: {} };

    if (this.renderer.animationEnabled()
      && ('x' in params || 'y' in params || 'innerRadius' in params || 'outerRadius' in params || 'startAngle' in params || 'endAngle' in params)) {
      arcParams.from.x = settings.x || 0;
      arcParams.from.y = settings.y || 0;
      arcParams.from.innerRadius = settings.innerRadius || 0;
      arcParams.from.outerRadius = settings.outerRadius || 0;
      arcParams.from.startAngle = settings.startAngle || 0;
      arcParams.from.endAngle = settings.endAngle || 0;
      arcParams.to.x = 'x' in params ? params.x : settings.x; delete params.x;
      arcParams.to.y = 'y' in params ? params.y : settings.y; delete params.y;
      arcParams.to.innerRadius = 'innerRadius' in params ? params.innerRadius : settings.innerRadius; delete params.innerRadius;
      arcParams.to.outerRadius = 'outerRadius' in params ? params.outerRadius : settings.outerRadius; delete params.outerRadius;
      arcParams.to.startAngle = 'startAngle' in params ? params.startAngle : settings.startAngle; delete params.startAngle;
      arcParams.to.endAngle = 'endAngle' in params ? params.endAngle : settings.endAngle; delete params.endAngle;

      params.arc = arcParams;
    }

    return baseAnimate(this, params, options, complete);
  }
};

type ArcSvgElementInstance = InstanceType<typeof ArcSvgElement>;
// ArcSvgElement

// RectSvgElement
export let RectSvgElement = class RectSvgElement extends SvgElement {
  declare _originalX?: number;

  declare _originalY?: number;

  declare _originalWidth?: number;

  declare _originalHeight?: number;

  constructor(renderer: RendererInstance) {
    super(renderer, 'rect');
  }

  attr(name: string): ThemeValue;
  attr(attrs?: SvgAttributes | null): this;
  attr(attrs?: ThemeValue): ThemeValue {
    let x;
    let y;
    let width;
    let height;
    let sw;
    let maxSW;
    let newSW;

    if (isObjectArgument(attrs)) {
      attrs = extend({}, attrs);
      if (attrs.x !== undefined
        || attrs.y !== undefined
        || attrs.width !== undefined
        || attrs.height !== undefined
        || attrs[KEY_STROKE_WIDTH] !== undefined) {
        attrs.x !== undefined ? x = this._originalX = attrs.x : x = this._originalX || 0;
        attrs.y !== undefined ? y = this._originalY = attrs.y : y = this._originalY || 0;
        attrs.width !== undefined ? width = this._originalWidth = attrs.width : width = this._originalWidth || 0;
        attrs.height !== undefined ? height = this._originalHeight = attrs.height : height = this._originalHeight || 0;
        attrs[KEY_STROKE_WIDTH] !== undefined ? sw = this._originalSW = attrs[KEY_STROKE_WIDTH] : sw = this._originalSW;

        maxSW = ~~((width < height ? width : height) / 2);
        newSW = (sw || 0) < maxSW ? sw || 0 : maxSW;

        attrs.x = x + newSW / 2;
        attrs.y = y + newSW / 2;
        attrs.width = width - newSW;
        attrs.height = height - newSW;
        (((sw || 0) !== newSW) || !(newSW === 0 && sw === undefined)) && (attrs[KEY_STROKE_WIDTH] = newSW);
      }

      if ('sharp' in attrs) {
        delete attrs.sharp;
      }
    }
    return baseAttr(this, attrs);
  }
};

type RectSvgElementInstance = InstanceType<typeof RectSvgElement>;
// RectSvgElement

// TextSvgElement
export let TextSvgElement = class TextSvgElement extends SvgElement {
  declare element: SvgTextDomElement;

  declare _texts: TextItem[] | null;

  declare _hasEllipsis: boolean;

  declare DEBUG_parsedHtml?: string;

  constructor(renderer: RendererInstance) {
    super(renderer, 'text');
    this.css({ 'white-space': 'pre' });
  }

  attr(name: string): ThemeValue;
  attr(attrs?: SvgAttributes | null): this;
  attr(attrs?: ThemeValue): ThemeValue {
    let isResetRequired;

    if (!isObjectArgument(attrs)) {
      return baseAttr(this, attrs);
    }

    attrs = extend({}, attrs);
    const settings = this._settings;
    const wasStroked = isDefined(settings[KEY_STROKE]) && isDefined(settings[KEY_STROKE_WIDTH]);

    if (attrs[KEY_TEXT] !== undefined) {
      settings[KEY_TEXT] = attrs[KEY_TEXT];
      delete attrs[KEY_TEXT];
      isResetRequired = true;
    }
    if (attrs[KEY_STROKE] !== undefined) {
      settings[KEY_STROKE] = attrs[KEY_STROKE];
      delete attrs[KEY_STROKE];
    }
    if (attrs[KEY_STROKE_WIDTH] !== undefined) {
      settings[KEY_STROKE_WIDTH] = attrs[KEY_STROKE_WIDTH];
      delete attrs[KEY_STROKE_WIDTH];
    }
    if (attrs[KEY_STROKE_OPACITY] !== undefined) {
      settings[KEY_STROKE_OPACITY] = attrs[KEY_STROKE_OPACITY];
      delete attrs[KEY_STROKE_OPACITY];
    }
    if (attrs[KEY_TEXTS_ALIGNMENT] !== undefined) {
      alignTextNodes(this, attrs[KEY_TEXTS_ALIGNMENT]);
      delete attrs[KEY_TEXTS_ALIGNMENT];
    }

    const isStroked = isDefined(settings[KEY_STROKE]) && isDefined(settings[KEY_STROKE_WIDTH]);
    baseAttr(this, attrs);
    isResetRequired = isResetRequired || (isStroked !== wasStroked && settings[KEY_TEXT]);
    if (isResetRequired) {
      createTextNodes(this, settings.text, isStroked);
      this._hasEllipsis = false;
    }
    if (isResetRequired || attrs.x !== undefined || attrs.y !== undefined) {
      locateTextNodes(this);
    }
    if (isStroked) {
      strokeTextNodes(this);
    }
    return this;
  }

  css(styles?: SvgAttributes | null): this {
    styles = styles || {};
    baseCss(this, styles);
    if (KEY_FONT_SIZE in styles) {
      locateTextNodes(this);
    }
    return this;
  }

  applyEllipsis(maxWidth: number): boolean {
    let lines;
    let hasEllipsis = false;
    let i;
    let ii;
    let lineParts;
    let j;
    let jj;
    let text;

    this.restoreText();

    const ellipsis = this.renderer.text(ELLIPSIS).attr(this._styles).append(this.renderer.root);
    const ellipsisWidth = ellipsis.getBBox().width;
    if (this._getElementBBox().width > maxWidth) {
      if (maxWidth - ellipsisWidth < 0) {
        maxWidth = 0;
      } else {
        maxWidth -= ellipsisWidth;
      }
      lines = prepareLines(this.element, this._texts, maxWidth);

      for (i = 0, ii = lines.length; i < ii; ++i) {
        lineParts = lines[i].parts;
        if (lines[i].commonLength === 1) {
          continue;
        }
        for (j = 0, jj = lineParts.length; j < jj; ++j) {
          text = lineParts[j];
          if (isDefined(text.endIndex)) {
            setNewText(text, text.endIndex);
            hasEllipsis = true;
          } else if (text.startBox > maxWidth) {
            removeTextSpan(text);
          }
        }
      }
    }

    ellipsis.remove();
    this._hasEllipsis = hasEllipsis;

    return hasEllipsis;
  }

  setMaxSize(maxWidth: number, maxHeight?: number, options: TextOverflowOptions = {}): MaxSizeResult {
    let lines: TextLine[] = [];
    let textChanged = false;
    let textIsEmpty = false;
    let ellipsisMaxWidth = maxWidth;

    this.restoreText();
    const restoreTitleElement = detachAndStoreTitleElements(this.element);

    const ellipsis = this.renderer.text(ELLIPSIS).attr(this._styles).append(this.renderer.root);
    const ellipsisWidth = ellipsis.getBBox().width;

    const { width, height } = this._getElementBBox();

    if ((width || height) && (width > maxWidth || maxHeight && height > maxHeight)) {
      if (maxWidth - ellipsisWidth < 0) {
        ellipsisMaxWidth = 0;
      } else {
        ellipsisMaxWidth -= ellipsisWidth;
      }

      lines = applyOverflowRules(this.element, this._texts, maxWidth, ellipsisMaxWidth, options);
      // @ts-expect-error setMaxHeight() keeps every line for a non-finite maxHeight, undefined included
      lines = setMaxHeight(lines, ellipsisMaxWidth, options, maxHeight, parseFloat(this._getLineHeight()));
      this._texts = lines.reduce((texts: TextItem[], line) => texts.concat(line.parts), []).filter((t) => t.value !== '').map((t) => {
        t.stroke && t.tspan.parentNode.appendChild(t.stroke);
        return t;
      }).map((t) => {
        t.tspan.parentNode.appendChild(t.tspan);
        return t;
      });

      !this._texts.length && (this._texts = null);

      textChanged = true;
      if (this._texts) {
        locateTextNodes(this);
      } else {
        this.element.textContent = '';
        textIsEmpty = true;
      }
    }

    ellipsis.remove();
    this._hasEllipsis = textChanged;
    restoreTitleElement();
    return { rowCount: lines.length, textChanged, textIsEmpty };
  }

  restoreText(): void {
    if (this._hasEllipsis) {
      this.attr({ text: this._settings.text });
    }
  }

  _getLineHeight(): ThemeValue {
    return !isNaN(parseFloat(this._styles[KEY_FONT_SIZE])) ? this._styles[KEY_FONT_SIZE] : DEFAULT_FONT_SIZE;
  }
};

type TextSvgElementInstance = InstanceType<typeof TextSvgElement>;
// TextSvgElement

function updateIndexes(items: LinkedItem[], k: number): void {
  let i;
  let item;
  for (i = k; item = items[i]; ++i) {
    item._link.i = i;
  }
}

function linkItem(target: LinkedItem, container: SvgElementInstance): void {
  const items = container._links;
  const key = target._link.after = target._link.after || container._linkAfter;
  let i;
  let item;
  if (key) {
    for (i = 0; (item = items[i]) && item._link.name !== key; ++i);
    if (item) {
      for (++i; (item = items[i]) && item._link.after === key; ++i);
    }
  } else {
    i = items.length;
  }
  items.splice(i, 0, target);
  updateIndexes(items, i);
}

function unlinkItem(target: SvgElementInstance): void {
  let i;
  const items = target._link.to._links;
  for (i = 0; items[i] !== target; ++i);
  items.splice(i, 1);
  updateIndexes(items, i);
}

export let Renderer = class Renderer {
  declare root: SvgElementInstance;

  declare pathModified: boolean;

  declare _$container: CoreRenderer;

  declare _locker: number;

  declare _backed: boolean;

  declare _defs: SvgElementInstance;

  declare _animationController: InstanceType<typeof AnimationController>;

  declare _animation: RendererAnimationOptions;

  declare rtl?: boolean;

  declare encodeHtml?: boolean;

  declare _grayScaleFilter?: SvgElementInstance;

  declare _defsElementsStorage: DefsStorage;

  constructor(options: RendererOptions) {
    this.root = this._createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.1',

      // Backward compatibility
      fill: NONE,
      stroke: NONE,
      'stroke-width': 0,
    }).attr({ class: options.cssClass }).css({
      'line-height': 'normal', // T179515
      '-moz-user-select': NONE,
      '-webkit-user-select': NONE,
      '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
      display: 'block',
      overflow: 'hidden',
    });

    this._init();
    this.pathModified = !!options.pathModified;
    this._$container = $(options.container);
    this.root.append({ element: options.container });
    this._locker = 0;
    this._backed = false;
  }

  _init(): void {
    this._defs = this._createElement('defs').append(this.root);

    this._animationController = new AnimationController(this.root.element);
    this._animation = { enabled: true, duration: 1000, easing: 'easeOutCubic' };
  }

  setOptions(options: RendererSettings): this {
    this.rtl = !!options.rtl;
    this.encodeHtml = !!options.encodeHtml;

    this.updateAnimationOptions(options.animation || {});

    this.root.attr({ direction: this.rtl ? 'rtl' : 'ltr' });
    return this;
  }

  _createElement(tagName: string, attr?: SvgAttributes, type?: string): SvgElementInstance {
    const elem = new SvgElement(this, tagName, type);
    attr && elem.attr(attr);
    return elem;
  }

  lock(): this {
    if (this._locker === 0) {
      this._backed = !this._$container.is(':visible');
      if (this._backed) {
        backupRoot(this.root);
      }
    }
    ++this._locker;
    return this;
  }

  unlock(): this {
    --this._locker;
    if (this._locker === 0) {
      if (this._backed) {
        restoreRoot(this.root, this._$container[0]);
      }
      this._backed = false;
    }
    return this;
  }

  resize(width: number, height: number): this {
    if (width >= 0 && height >= 0) {
      this.root.attr({ width, height });
    }
    return this;
  }

  dispose(): this {
    let key;
    this.root.dispose();
    this._defs.dispose();
    this._animationController.dispose();

    fixFuncIriCallbacks.removeByRenderer(this);

    for (key in this) {
      this[key] = null;
    }
    return this;
  }

  animationEnabled(): boolean {
    return !!this._animation.enabled;
  }

  updateAnimationOptions(newOptions: ThemeValue): this {
    extend(this._animation, newOptions);
    return this;
  }

  stopAllAnimations(lock?: boolean): this {
    this._animationController[lock ? 'lock' : 'stop']();
    return this;
  }

  animateElement(element: SvgElementInstance, params: SvgAttributes, options: AnimationOptions): this {
    this._animationController.animateElement(element, params, options);
    return this;
  }

  svg(): string {
    return this.root.markup();
  }

  getRootOffset(): Coordinates | undefined {
    return this.root.getOffset();
  }

  onEndAnimation(endAnimation: () => void): void {
    this._animationController.onEndAnimation(endAnimation);
  }

  rect(x?: number, y?: number, width?: number, height?: number): RectSvgElementInstance {
    const elem = new RectSvgElement(this);
    return elem.attr({
      x: x || 0, y: y || 0, width: width || 0, height: height || 0,
    });
  }

  simpleRect(): SvgElementInstance {
    return this._createElement('rect');
  }

  circle(x?: number, y?: number, r?: number): SvgElementInstance {
    return this._createElement('circle', { cx: x || 0, cy: y || 0, r: r || 0 });
  }

  g(): SvgElementInstance {
    return this._createElement('g');
  }

  image(x?: number, y?: number, w?: number, h?: number, href?: string, location?: string): SvgElementInstance {
    const image = this._createElement('image', {
      x: x || 0,
      y: y || 0,
      width: w || 0,
      height: h || 0,
      preserveAspectRatio: preserveAspectRatioMap[normalizeEnum(location)] || NONE,
    });

    image.element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href || '');
    return image;
  }

  // to combine different d attributes use helper methods
  path(points?: ThemeValue, type?: string): PathSvgElementInstance {
    const elem = new PathSvgElement(this, type);
    return elem.attr({ points: points || [] });
  }

  // TODO check B232257
  // TODO animate end angle special case
  arc(x?: number, y?: number, innerRadius?: number, outerRadius?: number, startAngle?: number, endAngle?: number): ArcSvgElementInstance {
    const elem = new ArcSvgElement(this);
    return elem.attr({
      x: x || 0, y: y || 0, innerRadius: innerRadius || 0, outerRadius: outerRadius || 0, startAngle: startAngle || 0, endAngle: endAngle || 0,
    });
  }

  text(text?: ThemeValue, x?: number, y?: number): TextSvgElementInstance {
    const elem = new TextSvgElement(this);
    return elem.attr({ text, x: x || 0, y: y || 0 });
  }

  linearGradient(stops: GradientStop[], id = getNextDefsSvgId(), rotationAngle?: number): SvgElementInstance {
    const gradient = this._createElement('linearGradient', {
      id,
      gradientTransform: `rotate(${rotationAngle || 0})`,
    }).append(this._defs);
    gradient.id = id;

    this._createGradientStops(stops, gradient);

    return gradient;
  }

  radialGradient(stops: GradientStop[], id: string): SvgElementInstance {
    const gradient = this._createElement('radialGradient', { id }).append(this._defs);

    this._createGradientStops(stops, gradient);

    return gradient;
  }

  _createGradientStops(stops: GradientStop[], group: SvgElementInstance): void {
    stops.forEach((stop) => {
      this._createElement('stop', {
        offset: stop.offset,
        'stop-color': stop['stop-color'] ?? stop.color,
        'stop-opacity': stop.opacity,
      }).append(group);
    });
  }

  // appended automatically
  pattern(color: string, hatching?: Hatching, _id?: string): SvgElementInstance {
    hatching = hatching || {};

    const step = hatching.step || 6;
    const stepTo2 = step / 2;
    const stepBy15 = step * 1.5;
    const id = _id || getNextDefsSvgId();

    const d = normalizeEnum(hatching.direction) === 'right'
      ? `M ${stepTo2} ${-stepTo2} L ${-stepTo2} ${stepTo2} M 0 ${step} L ${step} 0 M ${stepBy15} ${stepTo2} L ${stepTo2} ${stepBy15}`
      : `M 0 0 L ${step} ${step} M ${-stepTo2} ${stepTo2} L ${stepTo2} ${stepBy15} M ${stepTo2} ${-stepTo2} L ${stepBy15} ${stepTo2}`;

    const pattern = this._createElement('pattern', {
      id, width: step, height: step, patternUnits: 'userSpaceOnUse',
    }).append(this._defs);
    pattern.id = id;

    const rect = this.rect(0, 0, step, step).attr({ fill: color, opacity: hatching.opacity }).append(pattern);
    const path = new PathSvgElement(this).attr({ d, 'stroke-width': hatching.width || 1, stroke: color }).append(pattern);

    /// #DEBUG
    pattern.rect = rect;
    pattern.path = path;
    /// #ENDDEBUG

    return pattern;
  }

  customPattern(id: string, template: PatternTemplate, width: number, height: number): SvgElementInstance {
    const option = {
      id,
      width,
      height,
      patternContentUnits: 'userSpaceOnUse',
      patternUnits: this._getPatternUnits(width, height),
    };
    const pattern = this._createElement('pattern', option).append(this._defs);

    template.render({ container: pattern.element });

    return pattern;
  }

  // @ts-expect-error returns userSpaceOnUse only for a non-zero size, undefined otherwise
  _getPatternUnits(width: number, height: number): string | undefined {
    if (Number(width) && Number(height)) {
      return 'userSpaceOnUse';
    }
  }

  _getPointsWithYOffset(points: number[], offset: number): number[] {
    return points.map((point, index) => {
      if (index % 2 !== 0) {
        return point + offset;
      }
      return point;
    });
  }

  // appended automatically
  clipShape(method: (...args: ThemeValue[]) => SvgElementInstance, methodArgs: ThemeValue): SvgElementInstance {
    const id = getNextDefsSvgId();
    let clipPath = this._createElement('clipPath', { id }).append(this._defs);
    const shape = method.apply(this, methodArgs).append(clipPath);
    shape.id = id;

    /// #DEBUG
    shape.clipPath = clipPath;
    /// #ENDDEBUG

    shape.remove = function (): never { throw new Error('Not implemented'); };
    shape.dispose = function (): SvgElementInstance {
      clipPath.dispose();
      // @ts-expect-error dispose() drops the reference
      clipPath = null;
      return this;
    };
    return shape;
  }

  // appended automatically
  clipRect(x?: number, y?: number, width?: number, height?: number): SvgElementInstance {
    return this.clipShape(this.rect, arguments);
  }

  // appended automatically
  clipCircle(x?: number, y?: number, radius?: number): SvgElementInstance {
    return this.clipShape(this.circle, arguments);
  }

  // appended automatically
  shadowFilter(x?: number, y?: number, width?: number, height?: number, offsetX?: number, offsetY?: number, blur?: number, color?: string, opacity?: number): SvgElementInstance {
    const id = getNextDefsSvgId();
    const filter = this._createElement('filter', {
      id, x: x || 0, y: y || 0, width: width || 0, height: height || 0,
    }).append(this._defs);
    const gaussianBlur = this._createElement('feGaussianBlur', { in: 'SourceGraphic', result: 'gaussianBlurResult', stdDeviation: blur || 0 }).append(filter);
    const offset = this._createElement('feOffset', {
      in: 'gaussianBlurResult', result: 'offsetResult', dx: offsetX || 0, dy: offsetY || 0,
    }).append(filter);
    const flood = this._createElement('feFlood', { result: 'floodResult', 'flood-color': color || '', 'flood-opacity': opacity }).append(filter);
    const composite = this._createElement('feComposite', {
      in: 'floodResult', in2: 'offsetResult', operator: 'in', result: 'compositeResult',
    }).append(filter);
    const finalComposite = this._createElement('feComposite', { in: 'SourceGraphic', in2: 'compositeResult', operator: 'over' }).append(filter);

    filter.id = id;
    filter.gaussianBlur = gaussianBlur;
    filter.offset = offset;
    filter.flood = flood;
    filter.composite = composite;
    filter.finalComposite = finalComposite;

    filter.attr = function (attrs: ThemeValue): SvgElementInstance {
      const that = this;
      const filterAttrs: SvgAttributes = {};
      const offsetAttrs: SvgAttributes = {};
      const floodAttrs: SvgAttributes = {};
      ('x' in attrs) && (filterAttrs.x = attrs.x);
      ('y' in attrs) && (filterAttrs.y = attrs.y);
      ('width' in attrs) && (filterAttrs.width = attrs.width);
      ('height' in attrs) && (filterAttrs.height = attrs.height);
      baseAttr(that, filterAttrs);

      ('blur' in attrs) && that.gaussianBlur.attr({ stdDeviation: attrs.blur });
      ('offsetX' in attrs) && (offsetAttrs.dx = attrs.offsetX);
      ('offsetY' in attrs) && (offsetAttrs.dy = attrs.offsetY);
      that.offset.attr(offsetAttrs);

      ('color' in attrs) && (floodAttrs['flood-color'] = attrs.color);
      ('opacity' in attrs) && (floodAttrs['flood-opacity'] = attrs.opacity);
      that.flood.attr(floodAttrs);

      return that;
    };

    return filter;
  }

  brightFilter(type: string, slope: number): SvgElementInstance {
    const id = getNextDefsSvgId();
    const filter = this._createElement('filter', { id }).append(this._defs);
    const componentTransferElement = this._createElement('feComponentTransfer').append(filter);
    const attrs = {
      type,
      slope,
    };

    filter.id = id;
    this._createElement('feFuncR', attrs).append(componentTransferElement);
    this._createElement('feFuncG', attrs).append(componentTransferElement);
    this._createElement('feFuncB', attrs).append(componentTransferElement);
    return filter;
  }

  getGrayScaleFilter(): SvgElementInstance {
    if (this._grayScaleFilter) {
      return this._grayScaleFilter;
    }

    const id = getNextDefsSvgId();
    const filter = this._createElement('filter', { id }).append(this._defs);

    this._createElement('feColorMatrix')
      .attr({ type: 'matrix', values: '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 0.6 0' })
      .append(filter);

    filter.id = id;
    this._grayScaleFilter = filter;

    return filter;
  }

  lightenFilter(id: string): SvgElementInstance {
    const coef = 1.3;
    const filter = this._createElement('filter', { id }).append(this._defs);

    this._createElement('feColorMatrix', {
      type: 'matrix',
      values: `${coef} 0 0 0 0 0 ${coef} 0 0 0 0 0 ${coef} 0 0 0 0 0 1 0`,
    }).append(filter);

    filter.id = id;

    return filter;
  }

  initDefsElements(): void {
    const storage = this._defsElementsStorage = this._defsElementsStorage || { byHash: {}, baseId: getNextDefsSvgId() };
    const { byHash } = storage;
    let name;

    for (name in byHash) {
      byHash[name].pattern.dispose();
    }
    storage.byHash = {};
    storage.refToHash = {};
    storage.nextId = 0;
  }

  drawPattern({ color, hatching }: SvgAttributes, storageId: string, nextId: number): SvgElementInstance {
    return this.pattern(color, hatching, `${storageId}-hatching-${nextId++}`);
  }

  drawFilter(_: SvgAttributes, storageId: string, nextId: number): SvgElementInstance {
    return this.lightenFilter(`${storageId}-lightening-${nextId++}`);
  }

  lockDefsElements(attrs: SvgAttributes, ref: string | null | undefined, type: string): string {
    const storage = this._defsElementsStorage;
    let storageItem;
    const hash = type === 'pattern' ? getHatchingHash(attrs) : LIGHTENING_HASH;
    const method = type === 'pattern' ? this.drawPattern : this.drawFilter;
    let pattern;

    // @ts-expect-error a missing ref reads refToHash.undefined (or .null), which never matches a hash
    if (storage.refToHash[ref] !== hash) {
      if (ref) {
        this.releaseDefsElements(ref);
      }
      storageItem = storage.byHash[hash];
      if (!storageItem) {
        pattern = method.call(this, attrs, storage.baseId, storage.nextId++);
        storageItem = storage.byHash[hash] = { pattern, count: 0 };
        storage.refToHash[pattern.id] = hash;
      }
      ++storageItem.count;
      ref = storageItem.pattern.id;
    }
    // @ts-expect-error ref is a stored id here: it already maps to the hash or has just been replaced
    return ref;
  }

  releaseDefsElements(ref: string): void {
    const storage = this._defsElementsStorage;
    const hash = storage.refToHash[ref];
    const storageItem = storage.byHash[hash];

    if (storageItem && --storageItem.count === 0) {
      storageItem.pattern.dispose();
      delete storage.byHash[hash];
      delete storage.refToHash[ref];
    }
  }
};

type RendererInstance = InstanceType<typeof Renderer>;

function getHatchingHash({ color, hatching }: SvgAttributes): string {
  return `@${color}::${hatching.step}:${hatching.width}:${hatching.opacity}:${hatching.direction}`;
}

// paths modifier
const fixFuncIriCallbacks = (function (): FuncIriCallbacks {
  let callbacks: FuncIriCallback[] = [];

  return {
    add(fn): void {
      callbacks.push(fn);
    },
    remove(fn): void {
      callbacks = callbacks.filter((el) => el !== fn);
    },
    removeByRenderer(renderer): void {
      callbacks = callbacks.filter((el) => el.renderer !== renderer);
    },
    fire(): void {
      callbacks.forEach((fn) => { fn(); });
    },
  };
}());

export const refreshPaths = function (): void {
  fixFuncIriCallbacks.fire();
};

/// #DEBUG
const DEBUG_set_SvgElement = function (value: typeof SvgElement): void {
  SvgElement = value;
};

const DEBUG_set_RectSvgElement = function (value: typeof RectSvgElement): void {
  RectSvgElement = value;
};

const DEBUG_set_PathSvgElement = function (value: typeof PathSvgElement): void {
  PathSvgElement = value;
};

const DEBUG_set_ArcSvgElement = function (value: typeof ArcSvgElement): void {
  ArcSvgElement = value;
};

const DEBUG_set_TextSvgElement = function (value: typeof TextSvgElement): void {
  TextSvgElement = value;
};

const DEBUG_set_Renderer = function (value: typeof Renderer): void {
  Renderer = value;
};
/// #ENDDEBUG

/// #DEBUG
exports.DEBUG_set_ArcSvgElement = DEBUG_set_ArcSvgElement;
exports.DEBUG_set_Renderer = DEBUG_set_Renderer;
exports.DEBUG_set_PathSvgElement = DEBUG_set_PathSvgElement;
exports.DEBUG_set_RectSvgElement = DEBUG_set_RectSvgElement;
exports.DEBUG_set_SvgElement = DEBUG_set_SvgElement;
exports.DEBUG_set_TextSvgElement = DEBUG_set_TextSvgElement;
/// #ENDDEBUG
