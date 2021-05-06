import type {
  Area, Handle, AreaObject, AreaProp, MovingSides,
} from './common/types.d';
import { isWindow } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import {
  getOuterWidth,
  getInnerWidth,
  getOuterHeight,
  getInnerHeight,
  getOffset,
} from '../../../core/utils/size';

const borderStyles = {
  left: 'borderLeftWidth',
  top: 'borderTopWidth',
  right: 'borderRightWidth',
  bottom: 'borderBottomWidth',
};

function getBorderWidth(el: HTMLElement, direction: Handle): number {
  if (!isWindow(el)) {
    const borderWidth = el.style[borderStyles[direction]];

    return parseInt(borderWidth, 10) || 0;
  }

  return 0;
}

const correctGeometry = (
  area: Area,
  mainEl: HTMLElement,
  el: (HTMLElement | undefined) = undefined,
): Area => {
  const { width, height, offset } = area;
  const { left, top } = offset;
  const areaBorderLeft = el ? getBorderWidth(el, 'left') : 0;
  const areaBorderTop = el ? getBorderWidth(el, 'top') : 0;

  return {
    width: width - getOuterWidth(mainEl) - getInnerWidth(mainEl),
    height: height - getOuterHeight(mainEl) - getInnerHeight(mainEl),
    offset: {
      left: left + areaBorderLeft + getBorderWidth(mainEl, 'left'),
      top: top + areaBorderTop + getBorderWidth(mainEl, 'top'),
    },
  };
};

export const getAreaFromElement = (el: HTMLElement, mainEl: HTMLElement): Area => correctGeometry({
  width: getInnerWidth(el),
  height: getInnerHeight(el),
  offset: extend({ top: 0, left: 0 }, isWindow(el) ? {} : getOffset(el)),
}, mainEl, el);

export const getAreaFromObject = ({
  left, top, right, bottom,
}: AreaObject, mainEl: HTMLElement): Area => correctGeometry({
  width: right - left,
  height: bottom - top,
  offset: { left, top },
}, mainEl);

export const getMovingSides = (el: HTMLElement): MovingSides => {
  const { className } = el;
  const hasCornerTopLeftClass = className.includes('dx-resizable-handle-corner-top-left');
  const hasCornerTopRightClass = className.includes('dx-resizable-handle-corner-top-right');
  const hasCornerBottomLeftClass = className.includes('dx-resizable-handle-corner-bottom-left');
  const hasCornerBottomRightClass = className.includes('dx-resizable-handle-corner-bottom-right');

  return {
    top: className.includes('dx-resizable-handle-top') || hasCornerTopLeftClass || hasCornerTopRightClass,
    left: className.includes('dx-resizable-handle-left') || hasCornerTopLeftClass || hasCornerBottomLeftClass,
    bottom: className.includes('dx-resizable-handle-bottom') || hasCornerBottomLeftClass || hasCornerBottomRightClass,
    right: className.includes('dx-resizable-handle-right') || hasCornerTopRightClass || hasCornerBottomRightClass,
  };
};

export function getDragOffsets(
  area: Area,
  handleEl: HTMLElement,
  areaProp: AreaProp | undefined,
): ({
    maxLeftOffset: number;
    maxRightOffset: number;
    maxTopOffset: number;
    maxBottomOffset: number;
  }
  ) {
  const hWidth = getOuterWidth(handleEl);
  const hHeight = getOuterHeight(handleEl);
  const hOffset = getOffset(handleEl);
  const areaOffset = area.offset;
  const isAreaWindow = isWindow(areaProp);
  const scrollOffset = {
    scrollX: isAreaWindow ? (areaProp as Window).pageXOffset : 0,
    scrollY: isAreaWindow ? (areaProp as Window).pageYOffset : 0,
  };

  return {
    maxLeftOffset: hOffset.left - areaOffset.left - scrollOffset.scrollX,
    maxRightOffset: areaOffset.left + area.width - hOffset.left - hWidth + scrollOffset.scrollX,
    maxTopOffset: hOffset.top - areaOffset.top - scrollOffset.scrollY,
    maxBottomOffset: areaOffset.top + area.height - hOffset.top - hHeight + scrollOffset.scrollY,
  };
}

export const filterOffsets = (
  offset: { x: number; y: number },
  handleEl: HTMLElement,
): { x: number; y: number } => {
  const sides = getMovingSides(handleEl);
  const offsetX = !sides.left && !sides.right ? 0 : offset.x;
  const offsetY = !sides.top && !sides.bottom ? 0 : offset.y;

  return { x: offsetX, y: offsetY };
};
