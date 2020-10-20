/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */

import {
  Point,
  PathType,
  Segment,
  LabelAlignment,
} from './types.d';
import { isDefined } from '../../../../core/utils/type';
import domAdapter from '../../../../core/dom_adapter';
import { normalizeEnum } from '../../../../viz/core/utils';
import SvgGraphicsProps from './base_graphics_props';

const KEY_FONT_SIZE = 'font-size';
const NONE = 'none';
const DEFAULT_FONT_SIZE = 12;
const SHARPING_CORRECTION = 0.5;

export interface TextItem {
  value: string;
  height?: number;
  line?: number;
  inherits?: boolean;
  style?: { [key: string]: any };
  className?: string;
  tspan?: SVGTSpanElement;
  stroke?: SVGTSpanElement;
}

export const getNextDefsSvgId = ((): (() => string) => {
  let numDefsSvgElements = 1;
  return (): string => `DevExpress_${numDefsSvgElements++}`;
})();

/* function isObjectArgument(value: unknown): boolean {
  return value && (typeof value !== 'string');
} */

export const getFuncIri = (id: string, pathModified: boolean): string => (
  id !== null ? `url(${pathModified ? window.location.href.split('#')[0] : ''}#${id})` : id
);

export const extend = (target: object, source: object): object => {
  target = { ...target, ...source };

  return target;
};

type buildSimpleSegmentFn = (points: (Point|number)[], close: boolean, list: Segment[]) => Segment[];

function buildSegments(points: (Point|number)[]|number[][], buildSimpleSegment: buildSimpleSegmentFn, close: boolean): Segment[] {
  let i: number;
  let ii: number;
  const list: Segment[] = [];
  if (Array.isArray(points[0])) {
    for (i = 0, ii = points.length; i < ii; ++i) {
      buildSimpleSegment(points[i] as number[], close, list);
    }
  } else {
    buildSimpleSegment(points as (Point|number)[], close, list);
  }
  return list;
}

function buildSimpleLineSegment(points: (Point|number)[], close: boolean, list: Segment[]): Segment[] {
  let i = 0;
  const k0 = list.length;
  let k = k0;
  const ii = (points || []).length;
  if (ii) {
    // backward compatibility
    if ((points[0] as Point).x !== undefined) {
      const arrPoints = points as Point[];
      for (; i < ii;) {
        list[k++] = ['L', arrPoints[i].x, arrPoints[i++].y];
      }
    } else {
      const arrPoints = points as number[];
      for (; i < ii;) {
        list[k++] = ['L', arrPoints[i++], arrPoints[i++]];
      }
    }
    list[k0][0] = 'M';
  } else {
    list[k] = ['M', 0, 0];
  }
  close && list.push(['Z']);

  return list;
}

function buildSimpleCurveSegment(points: (Point|number)[], close: boolean, list: Segment[]): Segment[] {
  let i: number;
  let k = list.length;
  const ii = (points || []).length;
  if (ii) {
    // backward compatibility
    if (points[0] as Point !== undefined) {
      const arrPoints = points as Point[];
      list[k++] = ['M', arrPoints[0].x, arrPoints[0].y];
      for (i = 1; i < ii;) {
        list[k++] = [
          'C',
          arrPoints[i].x,
          arrPoints[i++].y,
          arrPoints[i].x,
          arrPoints[i++].y,
          arrPoints[i].x,
          arrPoints[i++].y,
        ];
      }
    } else {
      const arrPoints = points as number[];
      list[k++] = ['M', arrPoints[0], arrPoints[1]];
      for (i = 2; i < ii;) {
        list[k++] = [
          'C',
          arrPoints[i++],
          arrPoints[i++],
          arrPoints[i++],
          arrPoints[i++],
          arrPoints[i++],
          arrPoints[i++],
        ];
      }
    }
  } else {
    list[k] = ['M', 0, 0];
  }
  close && list.push(['Z']);

  return list;
}

function buildLineSegments(points: (Point|number)[]|number[][], close: boolean): Segment[] {
  return buildSegments(points, buildSimpleLineSegment, close);
}

function buildCurveSegments(points: (Point|number)[]|number[][], close: boolean): Segment[] {
  return buildSegments(points, buildSimpleCurveSegment, close);
}

export const buildPathSegments = (points: (Point|number)[]|number[][], type: PathType): Segment[] => {
  let list: Segment[] = [['M', 0, 0]];
  if (type === 'line') {
    list = buildLineSegments(points, false);
  } else if (type === 'area') {
    list = buildLineSegments(points, true);
  } else if (type === 'bezier') {
    list = buildCurveSegments(points, false);
  } else if (type === 'bezierarea') {
    list = buildCurveSegments(points, true);
  }

  return list;
};

export const combinePathParam = (segments: Segment[]): string => {
  const d: unknown[] = [];
  const ii = segments.length;
  let segment: Segment;
  for (let i = 0; i < ii; ++i) {
    segment = segments[i];
    for (let j = 0, jj = segment.length; j < jj; ++j) {
      d.push(segment[j]);
    }
  }

  return d.join(' ');
};

function prepareConstSegment(constSeg: Segment, type: PathType): void {
  const x: any = constSeg[constSeg.length - 2];
  const y: any = constSeg[constSeg.length - 1];

  if (type === 'line' || type === 'area') {
    constSeg[0] = 'L';
  } else if (type === 'bezier' || type === 'bezierarea') {
    constSeg[0] = 'C';
    constSeg[1] = x;
    constSeg[3] = x;
    constSeg[5] = x;
    constSeg[2] = y;
    constSeg[4] = y;
    constSeg[6] = y;
  }
}

function makeEqualLineSegments(short: Segment[], long: Segment[], type: PathType): void {
  const constSeg: Segment = [...short[short.length - 1]] as Segment;
  let i = short.length;
  prepareConstSegment(constSeg, type);
  for (; i < long.length; i++) {
    short[i] = [...constSeg] as Segment;
  }
}

function makeEqualAreaSegments(short: Segment[], long: Segment[], type: PathType): void {
  let i: number;
  let head: Segment[];
  const shortLength = short.length;
  const longLength = long.length;
  let constsSeg1: Segment;
  let constsSeg2: Segment;

  if ((shortLength - 1) % 2 === 0 && (longLength - 1) % 2 === 0) {
    i = (shortLength - 1) / 2 - 1;
    head = short.slice(0, i + 1);
    constsSeg1 = [...head[head.length - 1]] as Segment;
    constsSeg2 = [...short.slice(i + 1)[0]] as Segment;
    prepareConstSegment(constsSeg1, type);
    prepareConstSegment(constsSeg2, type);
    for (let j = i; j < (longLength - 1) / 2 - 1; j++) {
      short.splice(j + 1, 0, constsSeg1);
      short.splice(j + 3, 0, constsSeg2);
    }
  }
}

export const compensateSegments = (oldSegments: Segment[], newSegments: Segment[], type: PathType): Segment[] => {
  const oldLength = oldSegments.length;
  const newLength = newSegments.length;
  let originalNewSegments: Segment[] = [];
  const makeEqualSegments = (type.indexOf('area') !== -1) ? makeEqualAreaSegments : makeEqualLineSegments;

  if (oldLength === 0) {
    for (let i = 0; i < newLength; i++) {
      oldSegments.push([...newSegments[i]] as Segment);
    }
  } else if (oldLength < newLength) {
    makeEqualSegments(oldSegments, newSegments, type);
  } else if (oldLength > newLength) {
    originalNewSegments = [...newSegments];
    makeEqualSegments(newSegments, oldSegments, type);
  }

  return originalNewSegments;
};

export const getElementBBox = (element: Element): SVGRect => {
  let bBox: SVGRect = new SVGRect(0, 0, 0, 0);

  if (element as SVGGraphicsElement !== undefined) {
    bBox = (element as SVGGraphicsElement).getBBox();
  } else if (element as HTMLElement !== undefined) {
    const el: HTMLElement = element as HTMLElement;
    bBox = new SVGRect(0, 0, el.offsetWidth, el.offsetHeight);
  }

  return bBox;
};

function maxLengthFontSize(fontSize1?: number, fontSize2?: number): number {
  const height1 = fontSize1 || DEFAULT_FONT_SIZE;
  const height2 = fontSize2 || DEFAULT_FONT_SIZE;

  return height1 > height2 ? height1 : height2;
}

function orderHtmlTree(list: TextItem[], line: number, node: Node, parentStyle: any, parentClassName: string): number {
  let style;
  const realStyle = (node as HTMLElement).style;

  if (isDefined((node as Text).wholeText)) {
    list.push({
      value: (node as Text).wholeText,
      style: parentStyle,
      className: parentClassName,
      line,
      height: parseFloat(parentStyle.fontSize) || 0,
    });
  } else if ((node as Element).tagName === 'BR') {
    ++line;
  } else if (domAdapter.isElementNode(node)) {
    style = extend(style = {}, parentStyle);
    switch ((node as Element).tagName) {
      case 'B':
      case 'STRONG':
        style.fontWeight = 'bold';
        break;
      case 'I':
      case 'EM':
        style.fontStyle = 'italic';
        break;
      case 'U':
        style.textDecoration = 'underline';
        break;
      default:
        break;
    }
    realStyle.color && (style.fill = realStyle.color);
    realStyle.fontSize && (style.fontSize = realStyle.fontSize);
    realStyle.fontStyle && (style.fontStyle = realStyle.fontStyle);
    realStyle.fontWeight && (style.fontWeight = realStyle.fontWeight);
    realStyle.textDecoration && (style.textDecoration = realStyle.textDecoration);
    for (let i = 0, nodes = node.childNodes, ii = nodes.length; i < ii; ++i) {
      line = orderHtmlTree(list, line, nodes[i], style, (node as Element).className || parentClassName);
    }
  }

  return line;
}

function adjustLineHeights(items: TextItem[]): void {
  let currentItem = items[0];
  let item: TextItem;
  for (let i = 1, ii = items.length; i < ii; ++i) {
    item = items[i];
    if (item.line === currentItem.line) {
      // T177039
      currentItem.height = maxLengthFontSize(currentItem.height, item.height);
      currentItem.inherits = currentItem.inherits || item.height === 0;
      item.height = NaN;
    } else {
      currentItem = item;
    }
  }
}

export const removeExtraAttrs = (html: string): string => {
  const findTagAttrs = /(?:(<[a-z0-9]+\s*))([\s\S]*?)(>|\/>)/gi;
  const findStyleAndClassAttrs = /(style|class)\s*=\s*(["'])(?:(?!\2).)*\2\s?/gi;

  return html.replace(findTagAttrs, (_, p1, p2, p3) => {
    p2 = ((p2?.match(findStyleAndClassAttrs)) || []).map((str: string) => str).join(' ');
    return p1 + p2 + p3;
  });
};

export const parseHTML = (text: string): TextItem[] => {
  const items: TextItem[] = [];
  const div = domAdapter.createElement('div');
  div.innerHTML = text.replace(/\r/g, '').replace(/\n/g, '<br/>');
  orderHtmlTree(items, 0, div, {}, '');
  adjustLineHeights(items);

  return items;
};

export const parseMultiline = (text: string): TextItem[] => {
  const texts = text.replace(/\r/g, '').split(/\n/g);
  const items: TextItem[] = [];
  for (let i = 0; i < texts.length; i++) {
    items.push({ value: texts[i].trim(), height: 0, line: i });
  }
  return items;
};

export const getTextWidth = (text: TextItem): number => {
  const { value, tspan } = text;
  return value.length && tspan ? tspan.getSubStringLength(0, value.length) : 0;
};

export const setTextNodeAttribute = (item: TextItem, name: string, value: any): void => {
  item.tspan?.setAttribute(name, value);
  item.stroke?.setAttribute(name, value);
};

export const getItemLineHeight = (item: TextItem, defaultValue: number): number => (
  item.inherits ? maxLengthFontSize(item.height, defaultValue) : (item.height || defaultValue)
);

export const getLineHeight = (styles: { [key: string]: any } | undefined): number => (
  // eslint-disable-next-line no-restricted-globals
  styles && !isNaN(parseFloat(styles[KEY_FONT_SIZE])) ? parseFloat(styles[KEY_FONT_SIZE]) : DEFAULT_FONT_SIZE
);

export const textsAreEqual = (newItems: TextItem[], renderedItems?: TextItem[]): boolean => {
  if (!renderedItems || renderedItems.length !== newItems.length) return false;

  return renderedItems.every((item, index) => (item.value === newItems[index].value));
};

export const convertAlignmentToAnchor = (value?: LabelAlignment, rtl = false): string | undefined => (
  value ? { left: rtl ? 'end' : 'start', center: 'middle', right: rtl ? 'start' : 'end' }[value] : undefined
);

function applyTransformation(element: SVGElement, props: SvgGraphicsProps, x?: number, y?: number): void {
  const {
    sharp,
    sharpDirection,
    strokeWidth,
    translateX,
    translateY,
    rotate,
    rotateX,
    rotateY,
    scaleX,
    scaleY,
  } = props;
  const transformations: string[] = [];
  const transDir = sharpDirection === 'backward' ? -1 : 1;
  const strokeOdd = (strokeWidth || 0) % 2;
  const correctionX = (strokeOdd && (sharp === 'h' || sharp === true)) ? SHARPING_CORRECTION * transDir : 0;
  const correctionY = (strokeOdd && (sharp === 'v' || sharp === true)) ? SHARPING_CORRECTION * transDir : 0;

  if (translateX || translateY || correctionX || correctionY) {
    transformations.push(`translate(${((translateX || 0) + correctionX)},${((translateY || 0) + correctionY)})`);
  }

  if (rotate) {
    transformations.push(`rotate(${rotate},${(rotateX || x || 0)},${(rotateY || y || 0)})`);
  }

  const scaleXDefined = isDefined(scaleX);
  const scaleYDefined = isDefined(scaleY);
  if (scaleXDefined || scaleYDefined) {
    transformations.push(`scale(${(scaleXDefined ? scaleX : 1)},${(scaleYDefined ? scaleY : 1)})`);
  }

  if (transformations.length) {
    element.setAttribute('transform', transformations.join(' '));
  }
}

function applyDashStyle(element: SVGGraphicsElement, props: SvgGraphicsProps): void {
  const { dashStyle, strokeWidth } = props;

  const recalculateDashStyle = isDefined(dashStyle) || isDefined(strokeWidth);

  if (recalculateDashStyle && isDefined(dashStyle)) {
    let value = dashStyle || '';
    const sw = strokeWidth || 1;
    const key = 'stroke-dasharray';

    value = value === null ? '' : normalizeEnum(value);

    if (value === '' || value === 'solid' || value === NONE) {
      element.removeAttribute(key);
    } else {
      let dashArray: unknown[] = [];
      dashArray = value.replace(/longdash/g, '8,3,').replace(/dash/g, '4,3,').replace(/dot/g, '1,3,').replace(/,$/, '')
        .split(',');
      let i = dashArray.length;
      while (i--) {
        dashArray[i] = parseInt((dashArray[i] as string), 10) * sw;
      }
      element.setAttribute(key, dashArray.join(','));
    }
  }
}

export const applyGraphicProps = (element: SVGGraphicsElement, props: SvgGraphicsProps, x?: number, y?: number): void => {
  applyDashStyle(element, props);
  applyTransformation(element, props, x, y);
};
