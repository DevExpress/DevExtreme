import { move, resetPosition } from '@js/common/core/animation/translator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { setStyle } from '@js/core/utils/style';
import { touch } from '@js/core/utils/support';
import { isDefined, isWindow } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import { pairToObject, splitPair } from '@ts/core/utils/common';

import type {
  AxisBounds,
  AxisPositionData,
  CollisionSide,
  PositionOptions,
  PositionResult,
  PositionTarget,
} from './types';

const window = getWindow();

const horzRe = /left|right/;
const vertRe = /top|bottom/;
const collisionRe = /fit|flip|none/;
const scaleRe = /scale\(.+?\)/;

const normalizeAlign = function normalizeAlign(raw: unknown): { h: string; v: string } {
  const result = {
    h: 'center',
    v: 'center',
  };

  const pair = splitPair(raw);

  if (pair) {
    each(pair, function normalizeAlignPart(this: unknown) {
      const w = String(this).toLowerCase();
      if (horzRe.test(w)) {
        result.h = w;
      } else if (vertRe.test(w)) {
        result.v = w;
      }
    });
  }

  return result;
};

const normalizeOffset = function normalizeOffset(
  raw: unknown,
  preventRound?: boolean,
): { h: number; v: number } {
  return pairToObject(raw, preventRound);
};

const normalizeCollision = function normalizeCollision(raw: unknown): { h: string; v: string } {
  const pair = splitPair(raw);
  let h = String(pair && pair[0]).toLowerCase();
  let v = String(pair && pair[1]).toLowerCase();

  if (!collisionRe.test(h)) {
    h = 'none';
  }
  if (!collisionRe.test(v)) {
    v = h;
  }

  return { h, v };
};

const getAlignFactor = function getAlignFactor(align: string): number {
  switch (align) {
    case 'center':
      return 0.5;
    case 'right':
    case 'bottom':
      return 1;
    default:
      return 0;
  }
};

const inverseAlign = function inverseAlign(align: string): string {
  switch (align) {
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    default:
      return align;
  }
};

const calculateOversize = function calculateOversize(
  data: AxisPositionData,
  bounds: AxisBounds,
): number {
  let oversize = 0;

  if (data.myLocation < bounds.min) {
    oversize += bounds.min - data.myLocation;
  }

  if (data.myLocation > bounds.max) {
    oversize += data.myLocation - bounds.max;
  }

  return oversize;
};

const collisionSide = function collisionSide(
  direction: 'h' | 'v',
  data: AxisPositionData,
  bounds: AxisBounds,
): CollisionSide {
  if (data.myLocation < bounds.min) {
    return direction === 'h' ? 'left' : 'top';
  }
  if (data.myLocation > bounds.max) {
    return direction === 'h' ? 'right' : 'bottom';
  }
  return 'none';
};

// TODO: rename?
const initMyLocation = function initMyLocation(data: AxisPositionData): void {
  data.myLocation = data.atLocation
        + getAlignFactor(data.atAlign) * data.atSize
        - getAlignFactor(data.myAlign) * data.mySize
        + data.offset;
};

interface CollisionResolvers {
  fit: (data: AxisPositionData, bounds: AxisBounds) => void;
  flip: (data: AxisPositionData, bounds: AxisBounds) => void;
  // eslint-disable-next-line spellcheck/spell-checker
  flipfit: (data: AxisPositionData, bounds: AxisBounds) => void;
  none: (data: AxisPositionData) => void;
}

const collisionResolvers: CollisionResolvers = {

  fit(data, bounds) {
    let result = false;
    if (data.myLocation > bounds.max) {
      data.myLocation = bounds.max;
      result = true;
    }
    if (data.myLocation < bounds.min) {
      data.myLocation = bounds.min;
      result = true;
    }

    data.fit = result;
  },

  flip(data, bounds) {
    data.flip = false;

    if (data.myAlign === 'center' && data.atAlign === 'center') {
      return;
    }

    if (data.myLocation < bounds.min || data.myLocation > bounds.max) {
      const inverseData = extend({}, data, {
        myAlign: inverseAlign(data.myAlign),
        atAlign: inverseAlign(data.atAlign),
        offset: -data.offset,
      });

      initMyLocation(inverseData);
      inverseData.oversize = calculateOversize(inverseData, bounds);

      if (
        (inverseData.myLocation >= bounds.min && inverseData.myLocation <= bounds.max)
        || data.oversize > inverseData.oversize
      ) {
        data.myLocation = inverseData.myLocation;
        data.oversize = inverseData.oversize;
        data.flip = true;
      }
    }
  },

  // eslint-disable-next-line spellcheck/spell-checker
  flipfit(data, bounds) {
    this.flip(data, bounds);
    this.fit(data, bounds);
  },

  none(data) {
    data.oversize = 0;
  },
};

// eslint-disable-next-line @typescript-eslint/init-declarations -- set by calculateScrollbarWidth
let scrollbarWidth: number | undefined;

const calculateScrollbarWidth = function calculateScrollbarWidth(): void {
  const $scrollDiv = $('<div>').css({
    width: 100,
    height: 100,
    overflow: 'scroll',
    position: 'absolute',
    top: -9999,
  }).appendTo($('body'));
  // @ts-expect-error get(0) is typed as Element
  const result = $scrollDiv.get(0).offsetWidth - $scrollDiv.get(0).clientWidth;

  $scrollDiv.remove();

  scrollbarWidth = result;
};

const defaultPositionResult = {
  h: {
    location: 0,
    flip: false,
    fit: false,
    oversize: 0,
  },
  v: {
    location: 0,
    flip: false,
    fit: false,
    oversize: 0,
  },
};

// NOTE: Setting the 'element.style' requires creating attributeNode when both of the conditions
//       met:
//       - a form contains an input with the name property set to "style";
//       - a form contains a dx-validator (or other popup widget).
//       T941581
const setScaleProperty = function setScaleProperty(
  element: Element & { style?: unknown },
  scale: string,
  styleAttr: string,
  isEmpty: boolean,
): void {
  const stylePropIsValid = isDefined(element.style) && !domAdapter.isNode(element.style);
  const newStyleValue = isEmpty ? styleAttr.replace(scale, '') : styleAttr;

  if (stylePropIsValid) {
    setStyle(element, newStyleValue, false);
  } else {
    const styleAttributeNode = domAdapter.createAttribute('style');
    styleAttributeNode.value = newStyleValue;
    element.setAttributeNode(styleAttributeNode);
  }
};

const getOffsetWithoutScale = function getOffsetWithoutScale(
  $startElement: dxElementWrapper,
  $currentElement: dxElementWrapper = $startElement,
): Coordinates | undefined {
  const currentElement = $currentElement.get(0);
  if (!currentElement) {
    return $startElement.offset();
  }

  const style = currentElement.getAttribute?.('style') ?? '';
  const scale = scaleRe.exec(style)?.[0];
  // eslint-disable-next-line @typescript-eslint/init-declarations -- set in both branches
  let offset: Coordinates | undefined;

  if (scale) {
    setScaleProperty(currentElement, scale, style, true);
    offset = getOffsetWithoutScale($startElement, $currentElement.parent());
    setScaleProperty(currentElement, scale, style, false);
  } else {
    offset = getOffsetWithoutScale($startElement, $currentElement.parent());
  }

  return offset;
};

const calculatePosition = function calculatePosition(
  what: PositionTarget,
  options?: PositionOptions,
): PositionResult {
  const $what = $(what);
  // @ts-expect-error offset() is typed as possibly undefined
  const currentOffset: Coordinates = $what.offset();
  const result: PositionResult = extend(true, {}, defaultPositionResult, {
    h: { location: currentOffset.left },
    v: { location: currentOffset.top },
  });

  if (!options) {
    return result;
  }

  const my = normalizeAlign(options.my);
  const at = normalizeAlign(options.at);
  // @ts-expect-error renderer() is typed without event objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element, selector, window, event
  let of: any = ($(options.of).length && options.of) || window;
  const offset = normalizeOffset(options.offset, options.precise);
  const collision = normalizeCollision(options.collision);
  const { boundary } = options;
  const boundaryOffset = normalizeOffset(options.boundaryOffset, options.precise);

  const h: AxisPositionData = {
    // @ts-expect-error getOuterWidth() can be undefined; the location fields are set below
    mySize: getOuterWidth($what),
    myAlign: my.h,
    atAlign: at.h,
    offset: offset.h,
    collision: collision.h,
    boundaryOffset: boundaryOffset.h,
  };

  const v: AxisPositionData = {
    // @ts-expect-error getOuterHeight() can be undefined; the location fields are set below
    mySize: getOuterHeight($what),
    myAlign: my.v,
    atAlign: at.v,
    offset: offset.v,
    collision: collision.v,
    boundaryOffset: boundaryOffset.v,
  };

  if (of.preventDefault) {
    h.atLocation = of.pageX;
    v.atLocation = of.pageY;
    h.atSize = 0;
    v.atSize = 0;
  } else {
    of = $(of);
    if (isWindow(of[0])) {
      h.atLocation = of.scrollLeft();
      v.atLocation = of.scrollTop();
      const device = devices.real();

      if (device.deviceType === 'phone' && of[0].visualViewport) {
        h.atLocation = Math.max(h.atLocation, of[0].visualViewport.offsetLeft);
        v.atLocation = Math.max(v.atLocation, of[0].visualViewport.offsetTop);
        h.atSize = of[0].visualViewport.width;
        v.atSize = of[0].visualViewport.height;
      } else {
        const isIos = device.platform === 'ios';

        h.atSize = getWidth(of);
        v.atSize = isIos ? of[0].innerHeight : getHeight(of);
      }
    } else if (of[0].nodeType === 9) {
      h.atLocation = 0;
      v.atLocation = 0;
      h.atSize = getWidth(of);
      v.atSize = getHeight(of);
    } else {
      const ofRect = getBoundingRect(of.get(0));
      // @ts-expect-error offset() is typed as possibly undefined
      const o: Coordinates = getOffsetWithoutScale(of);
      h.atLocation = o.left;
      v.atLocation = o.top;
      h.atSize = Math.max(ofRect.width, getOuterWidth(of));
      v.atSize = Math.max(ofRect.height, getOuterHeight(of));
    }
  }

  initMyLocation(h);
  initMyLocation(v);

  const bounds = (function calculateBounds(): { h: AxisBounds; v: AxisBounds } {
    const win = $(window);
    const windowWidth = getWidth(win.get(0));
    const windowHeight = getHeight(win.get(0));
    // @ts-expect-error scrollLeft() is typed as a setter only
    let left: number = win.scrollLeft();
    // @ts-expect-error scrollTop() is typed as a setter only
    let top: number = win.scrollTop();
    const documentElement = domAdapter.getDocumentElement();
    const hZoomLevel = touch ? documentElement.clientWidth / windowWidth : 1;
    const vZoomLevel = touch ? documentElement.clientHeight / windowHeight : 1;

    if (scrollbarWidth === undefined) {
      calculateScrollbarWidth();
    }

    let boundaryWidth = windowWidth;
    let boundaryHeight = windowHeight;

    if (boundary && !isWindow(boundary)) {
      const $boundary = $(boundary);
      // @ts-expect-error offset() is typed as possibly undefined
      const boundaryPosition: Coordinates = $boundary.offset();
      left = boundaryPosition.left;
      top = boundaryPosition.top;

      boundaryWidth = Number(getWidth($boundary));
      boundaryHeight = Number(getHeight($boundary));
    }

    return {
      h: {
        min: left + h.boundaryOffset,
        max: left + boundaryWidth / hZoomLevel - h.mySize - h.boundaryOffset,
      },
      v: {
        min: top + v.boundaryOffset,
        max: top + boundaryHeight / vZoomLevel - v.mySize - v.boundaryOffset,
      },
    };
  }());

  h.oversize = calculateOversize(h, bounds.h);
  v.oversize = calculateOversize(v, bounds.v);

  h.collisionSide = collisionSide('h', h, bounds.h);
  v.collisionSide = collisionSide('v', v, bounds.v);

  if (collisionResolvers[h.collision]) {
    collisionResolvers[h.collision](h, bounds.h);
  }

  if (collisionResolvers[v.collision]) {
    collisionResolvers[v.collision](v, bounds.v);
  }

  const preciser = function preciser(number: number): number {
    return options.precise ? number : Math.round(number);
  };

  extend(true, result, {
    h: {
      location: preciser(h.myLocation),
      oversize: preciser(h.oversize),
      fit: h.fit,
      flip: h.flip,
      collisionSide: h.collisionSide,
    },
    v: {
      location: preciser(v.myLocation),
      oversize: preciser(v.oversize),
      fit: v.fit,
      flip: v.flip,
      collisionSide: v.collisionSide,
    },
    precise: options.precise,
  });

  return result;
};

function position(what: PositionTarget): Coordinates | undefined;
function position(
  what: PositionTarget,
  options: PositionOptions | PositionResult,
): PositionResult | undefined;
function position(
  what: PositionTarget,
  options?: PositionOptions | PositionResult,
): Coordinates | PositionResult | undefined;
function position(
  what: PositionTarget,
  options?: PositionOptions | PositionResult,
): Coordinates | PositionResult | undefined {
  const $what = $(what);

  if (!$what.length) {
    return undefined;
  }

  if (!options) {
    return $what.offset();
  }

  resetPosition($what, true);

  // @ts-expect-error offset() is typed as possibly undefined
  const offset: Coordinates = getOffsetWithoutScale($what);
  const targetPosition = options.h && options.v
    ? options
    : calculatePosition($what, options);

  const preciser = function preciser(number: number): number {
    return options.precise ? number : Math.round(number);
  };

  move($what, {
    left: targetPosition.h.location - preciser(offset.left),
    top: targetPosition.v.location - preciser(offset.top),
  });

  return targetPosition;
}

const offset = function offset(element: PositionOptions['of']): Coordinates | null | undefined {
  // @ts-expect-error renderer() is typed without event objects
  const domElement = $(element).get(0);
  if (isWindow(domElement)) {
    return null;
  } if (domElement && 'pageY' in domElement && 'pageX' in domElement) {
    // @ts-expect-error get(0) is typed as Element, but an event has pageX and pageY
    return { top: domElement.pageY, left: domElement.pageX };
  }

  return $(domElement).offset();
};

// @ts-expect-error inverseAlign is assigned right below
if (!position.inverseAlign) {
  position.inverseAlign = inverseAlign;
}

// @ts-expect-error normalizeAlign is assigned right below
if (!position.normalizeAlign) {
  position.normalizeAlign = normalizeAlign;
}

export default {
  calculateScrollbarWidth,
  calculate: calculatePosition,
  setup: position,
  offset,
};
