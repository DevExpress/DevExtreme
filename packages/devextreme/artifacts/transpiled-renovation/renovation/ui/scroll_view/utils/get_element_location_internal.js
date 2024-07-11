"use strict";

exports.getElementLocationInternal = getElementLocationInternal;
var _inflector = require("../../../../core/utils/inflector");
var _get_relative_offset = require("./get_relative_offset");
var _consts = require("../common/consts");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function getElementLocationInternal(targetElement, direction, containerElement, scrollOffset, offset) {
  const additionalOffset = _extends({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }, offset);
  const isVertical = direction === _consts.DIRECTION_VERTICAL;
  const prop = isVertical ? 'top' : 'left';
  const inverseProp = isVertical ? 'bottom' : 'right';
  const dimension = isVertical ? 'height' : 'width';
  const containerOffsetSize = containerElement[`offset${(0, _inflector.titleize)(dimension)}`];
  const containerClientSize = containerElement[`client${(0, _inflector.titleize)(dimension)}`];
  const containerSize = containerElement.getBoundingClientRect()[dimension];
  const elementSize = targetElement.getBoundingClientRect()[dimension];
  let scale = 1;
  if (Math.abs(containerSize - containerOffsetSize) > 1) {
    scale = containerSize / containerOffsetSize;
  }
  const relativeElementOffset = (0, _get_relative_offset.getRelativeOffset)(_consts.SCROLLABLE_CONTENT_CLASS, targetElement)[prop] / scale;
  const containerScrollOffset = scrollOffset[prop];
  const relativeStartOffset = containerScrollOffset - relativeElementOffset + additionalOffset[prop];
  const relativeEndOffset = containerScrollOffset - relativeElementOffset - elementSize / scale + containerClientSize - additionalOffset[inverseProp];
  if (relativeStartOffset <= 0 && relativeEndOffset >= 0) {
    return containerScrollOffset;
  }
  return containerScrollOffset - (Math.abs(relativeStartOffset) > Math.abs(relativeEndOffset) ? relativeEndOffset : relativeStartOffset);
}