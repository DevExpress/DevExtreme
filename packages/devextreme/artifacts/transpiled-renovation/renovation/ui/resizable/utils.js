"use strict";

exports.getAreaFromObject = exports.getAreaFromElement = exports.filterOffsets = exports.borderWidthStyles = void 0;
exports.getDragOffsets = getDragOffsets;
exports.getMovingSides = void 0;
var _type = require("../../../core/utils/type");
var _extend = require("../../../core/utils/extend");
var _size = require("../../../core/utils/size");
const borderWidthStyles = exports.borderWidthStyles = {
  left: 'borderLeftWidth',
  top: 'borderTopWidth',
  right: 'borderRightWidth',
  bottom: 'borderBottomWidth'
};
function getBorderWidth(el, direction) {
  if (!(0, _type.isWindow)(el)) {
    const borderWidth = el.style[borderWidthStyles[direction]];
    return parseInt(borderWidth, 10) || 0;
  }
  return 0;
}
const correctGeometry = function (area, mainEl) {
  let el = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  const {
    height,
    offset,
    width
  } = area;
  const {
    left,
    top
  } = offset;
  const areaBorderLeft = el ? getBorderWidth(el, 'left') : 0;
  const areaBorderTop = el ? getBorderWidth(el, 'top') : 0;
  return {
    width: width - (0, _size.getOuterWidth)(mainEl) - (0, _size.getInnerWidth)(mainEl),
    height: height - (0, _size.getOuterHeight)(mainEl) - (0, _size.getInnerHeight)(mainEl),
    offset: {
      left: left + areaBorderLeft + getBorderWidth(mainEl, 'left'),
      top: top + areaBorderTop + getBorderWidth(mainEl, 'top')
    }
  };
};
const getAreaFromElement = (el, mainEl) => correctGeometry({
  width: (0, _size.getInnerWidth)(el),
  height: (0, _size.getInnerHeight)(el),
  offset: (0, _extend.extend)({
    top: 0,
    left: 0
  }, (0, _type.isWindow)(el) ? {} : (0, _size.getOffset)(el))
}, mainEl, el);
exports.getAreaFromElement = getAreaFromElement;
const getAreaFromObject = (_ref, mainEl) => {
  let {
    bottom,
    left,
    right,
    top
  } = _ref;
  return correctGeometry({
    width: right - left,
    height: bottom - top,
    offset: {
      left,
      top
    }
  }, mainEl);
};
exports.getAreaFromObject = getAreaFromObject;
const getMovingSides = el => {
  const {
    className
  } = el;
  const hasCornerTopLeftClass = className.includes('dx-resizable-handle-corner-top-left');
  const hasCornerTopRightClass = className.includes('dx-resizable-handle-corner-top-right');
  const hasCornerBottomLeftClass = className.includes('dx-resizable-handle-corner-bottom-left');
  const hasCornerBottomRightClass = className.includes('dx-resizable-handle-corner-bottom-right');
  return {
    top: className.includes('dx-resizable-handle-top') || hasCornerTopLeftClass || hasCornerTopRightClass,
    left: className.includes('dx-resizable-handle-left') || hasCornerTopLeftClass || hasCornerBottomLeftClass,
    bottom: className.includes('dx-resizable-handle-bottom') || hasCornerBottomLeftClass || hasCornerBottomRightClass,
    right: className.includes('dx-resizable-handle-right') || hasCornerTopRightClass || hasCornerBottomRightClass
  };
};
exports.getMovingSides = getMovingSides;
function getDragOffsets(area, handleEl, areaProp) {
  const hWidth = (0, _size.getOuterWidth)(handleEl);
  const hHeight = (0, _size.getOuterHeight)(handleEl);
  const hOffset = (0, _size.getOffset)(handleEl);
  const areaOffset = area.offset;
  const isAreaWindow = (0, _type.isWindow)(areaProp);
  const scrollOffset = {
    scrollX: isAreaWindow ? areaProp.pageXOffset : 0,
    scrollY: isAreaWindow ? areaProp.pageYOffset : 0
  };
  return {
    maxLeftOffset: hOffset.left - areaOffset.left - scrollOffset.scrollX,
    maxRightOffset: areaOffset.left + area.width - hOffset.left - hWidth + scrollOffset.scrollX,
    maxTopOffset: hOffset.top - areaOffset.top - scrollOffset.scrollY,
    maxBottomOffset: areaOffset.top + area.height - hOffset.top - hHeight + scrollOffset.scrollY
  };
}
const filterOffsets = (offset, handleEl) => {
  const sides = getMovingSides(handleEl);
  const offsetX = !sides.left && !sides.right ? 0 : offset.x;
  const offsetY = !sides.top && !sides.bottom ? 0 : offset.y;
  return {
    x: offsetX,
    y: offsetY
  };
};
exports.filterOffsets = filterOffsets;