"use strict";

exports.Plaque = void 0;
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
const _excluded = ["x", "y", "canvas", "offsetX", "offsetY", "offset"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const math = Math;
const round = math.round;
const max = math.max;
const min = math.min;
const sin = math.sin;
const cos = math.cos;
const asin = math.asin;
const PI = math.PI;
const buildPath = function () {
  for (var _len = arguments.length, points = new Array(_len), _key = 0; _key < _len; _key++) {
    points[_key] = arguments[_key];
  }
  return points.join('');
};
function getArc(cornerRadius, xDirection, yDirection) {
  return `a ${cornerRadius} ${cornerRadius} 0 0 1 ${xDirection * cornerRadius} ${yDirection * cornerRadius}`;
}
function getAbsoluteArc(cornerRadius, x, y) {
  return `A ${cornerRadius} ${cornerRadius} 0 0 1 ${x} ${y}`;
}
function rotateX(x, y, angle, x0, y0) {
  return (x - x0) * round(cos(angle)) + (y - y0) * round(sin(angle)) + x0;
}
function rotateY(x, y, angle, x0, y0) {
  return -(x - x0) * round(sin(angle)) + (y - y0) * round(cos(angle)) + y0;
}
function rotateSize(options, angle) {
  if (angle % 90 === 0 && angle % 180 !== 0) {
    return {
      width: options.height,
      height: options.width
    };
  }
  return options;
}
function getCloudAngle(_ref, x, y, anchorX, anchorY) {
  let {
    width,
    height
  } = _ref;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const xr = Math.ceil(x + halfWidth);
  const xl = Math.floor(x - halfWidth);
  const yt = Math.floor(y - halfHeight);
  const yb = Math.ceil(y + halfHeight);

  // 1 | 2 | 3
  // 8 | 0 | 4
  // 7 | 6 | 5
  if (anchorX < xl && anchorY < yt ||
  // 1
  anchorX >= xl && anchorX <= xr && anchorY < yt // 2
  ) {
    return 270;
  }
  if (anchorX > xr && anchorY > yb ||
  // 5
  anchorX >= xl && anchorX <= xr && anchorY > yb // 6
  ) {
    return 90;
  } else if (anchorX < xl && anchorY > yb ||
  // 7
  anchorX < xl && anchorY >= yt && anchorY <= yb // 8
  ) {
    return 180;
  }
  return 0; // 0, 3, 4
}
function getCloudPoints(_ref2, x, y, anchorX, anchorY, _ref3, bounded) {
  let {
    width,
    height
  } = _ref2;
  let {
    arrowWidth,
    cornerRadius = 0
  } = _ref3;
  const halfArrowWidth = arrowWidth / 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const xr = Math.ceil(x + halfWidth);
  const xl = Math.floor(x - halfWidth);
  const yt = Math.floor(y - halfHeight);
  const yb = Math.ceil(y + halfHeight);
  const leftTopCorner = [xl, yt];
  const rightTopCorner = [xr, yt];
  const rightBottomCorner = [xr, yb];
  const leftBottomCorner = [xl, yb];
  const arrowX = anchorX <= xl ? xl : xr <= anchorX ? xr : anchorX;
  const arrowY = anchorY <= yt ? yt : yb <= anchorY ? yb : anchorY;
  const arrowBaseBottom = min(arrowY + halfArrowWidth, yb);
  const arrowBaseTop = max(arrowY - halfArrowWidth, yt);
  const arrowBaseLeft = max(arrowX - halfArrowWidth, xl);
  cornerRadius = Math.min(width / 2, height / 2, cornerRadius);
  let points;
  leftTopCorner[1] += cornerRadius;
  rightTopCorner[0] -= cornerRadius;
  rightBottomCorner[1] -= cornerRadius;
  leftBottomCorner[0] += cornerRadius;
  // 1 | 2 | 3
  // 8 | 0 | 4
  // 7 | 6 | 5
  if (!bounded || xl <= anchorX && anchorX <= xr && yt <= anchorY && anchorY <= yb) {
    // 0
    points = buildPath(leftTopCorner, getArc(cornerRadius, 1, -1), 'L', rightTopCorner, getArc(cornerRadius, 1, 1), 'L', rightBottomCorner, getArc(cornerRadius, -1, 1), 'L', leftBottomCorner, getArc(cornerRadius, -1, -1));
  } else if (anchorX > xr && anchorY < yt) {
    // 3
    const arrowAngle = arrowWidth / cornerRadius || 0;
    const angle = PI / 4 + arrowAngle / 2;
    const endAngle = PI / 4 - arrowAngle / 2;
    const arrowEndPointX = rightTopCorner[0] + cos(endAngle) * cornerRadius;
    const arrowEndPointY = rightTopCorner[1] + (1 - sin(endAngle)) * cornerRadius;
    let arrowArc = buildPath('L', rightTopCorner, getArc(cornerRadius, cos(angle), 1 - sin(angle)), 'L', [anchorX, anchorY, arrowEndPointX, arrowEndPointY], getAbsoluteArc(cornerRadius, rightTopCorner[0] + cornerRadius, rightTopCorner[1] + cornerRadius));
    if (Math.abs(angle) > PI / 2) {
      arrowArc = buildPath('L', [arrowBaseLeft, yt, anchorX, anchorY, xr, arrowBaseBottom]);
    }
    points = buildPath(leftTopCorner, getArc(cornerRadius, 1, -1), arrowArc, 'L', rightBottomCorner, getArc(cornerRadius, -1, 1), 'L', leftBottomCorner, getArc(cornerRadius, -1, -1));
  } else if (anchorX > xr && anchorY >= yt && anchorY <= yb) {
    // 4
    let arrowArc;
    if (arrowBaseTop >= rightTopCorner[1] + cornerRadius && arrowBaseBottom <= rightBottomCorner[1]) {
      arrowArc = buildPath(getArc(cornerRadius, 1, 1), 'L', [xr, arrowBaseTop, anchorX, anchorY, xr, arrowBaseBottom], 'L', rightBottomCorner, getArc(cornerRadius, -1, 1));
    } else if (arrowBaseTop < rightTopCorner[1] + cornerRadius && arrowBaseBottom >= rightTopCorner[1] + cornerRadius && arrowBaseBottom <= rightBottomCorner[1]) {
      const arrowWidthRest = rightTopCorner[1] + cornerRadius - arrowBaseTop;
      const angle = arrowWidthRest / cornerRadius;
      const arrowBaseTopX = rightTopCorner[0] + cos(angle) * cornerRadius;
      const arrowBaseTopY = rightTopCorner[1] + (1 - sin(angle)) * cornerRadius;
      arrowArc = buildPath(getArc(cornerRadius, cos(angle), 1 - sin(angle)), 'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, xr, arrowBaseBottom], 'L', rightBottomCorner, getArc(cornerRadius, -1, 1));
    } else if (arrowBaseTop < rightTopCorner[1] + cornerRadius && arrowBaseBottom < rightTopCorner[1] + cornerRadius) {
      const arrowWidthRest = rightTopCorner[1] + cornerRadius - arrowBaseTop;
      const arrowAngle = arrowWidthRest / cornerRadius;
      const angle = arrowAngle;
      const arrowBaseTopX = rightTopCorner[0] + cos(angle) * cornerRadius;
      const arrowBaseTopY = rightTopCorner[1] + (1 - sin(angle)) * cornerRadius;
      const bottomAngle = Math.sin((rightTopCorner[1] + cornerRadius - arrowBaseBottom) / cornerRadius);
      const arrowBaseBottomX = rightTopCorner[0] + cornerRadius * cos(bottomAngle);
      const arrowBaseBottomY = rightTopCorner[1] + cornerRadius * (1 - sin(bottomAngle));
      arrowArc = buildPath(getArc(cornerRadius, cos(angle), 1 - sin(angle)), 'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY], getAbsoluteArc(cornerRadius, rightTopCorner[0] + cornerRadius, rightTopCorner[1] + cornerRadius), 'L', rightBottomCorner, getArc(cornerRadius, -1, 1));
    } else if (arrowBaseTop <= rightTopCorner[1] + cornerRadius && arrowBaseBottom >= rightBottomCorner[1]) {
      const topAngle = asin((rightTopCorner[1] + cornerRadius - arrowBaseTop) / cornerRadius);
      const arrowBaseTopX = rightTopCorner[0] + cornerRadius * cos(topAngle);
      const arrowBaseTopY = rightTopCorner[1] + cornerRadius * (1 - sin(topAngle));
      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * sin(bottomAngle);
      arrowArc = buildPath(getArc(cornerRadius, cos(topAngle), 1 - sin(topAngle)), 'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY], getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius, rightBottomCorner[1] + cornerRadius));
    } else if (arrowBaseTop > rightTopCorner[1] + cornerRadius && arrowBaseTop <= rightBottomCorner[1] && arrowBaseBottom > rightBottomCorner[1]) {
      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * sin(bottomAngle);
      arrowArc = buildPath(getArc(cornerRadius, 1, 1), 'L', [xr, arrowBaseTop, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY], getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius, rightBottomCorner[1] + cornerRadius));
    } else if (arrowBaseTop > rightTopCorner[1] + cornerRadius && arrowBaseBottom > rightBottomCorner[1]) {
      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * sin(bottomAngle);
      const topAngle = asin((arrowBaseTop - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseTopX = rightBottomCorner[0] + cornerRadius * (cos(topAngle) - 1);
      const arrowBaseTopY = rightBottomCorner[1] + cornerRadius * sin(topAngle);
      arrowArc = buildPath(getArc(cornerRadius, 1, 1), 'L', rightBottomCorner, getArc(cornerRadius, cos(topAngle) - 1, sin(topAngle)), 'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY], getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius, rightBottomCorner[1] + cornerRadius));
    }
    points = buildPath(leftTopCorner, getArc(cornerRadius, 1, -1), 'L', rightTopCorner, arrowArc, 'L', leftBottomCorner, getArc(cornerRadius, -1, -1));
  }
  return buildPath('M', points, 'Z');
}
class Plaque {
  constructor(options, widget, root, contentTemplate) {
    let bounded = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    let measureContent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : (_, g) => g.getBBox();
    let moveContentGroup = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : (_, g, x, y) => g.move(x, y);
    this.widget = widget;
    this.options = options;
    this.root = root;
    this.contentTemplate = contentTemplate;
    this.bonded = bounded;
    this.measureContent = measureContent;
    this.moveContentGroup = moveContentGroup;
  }
  draw(_ref4) {
    let {
        x: anchorX,
        y: anchorY,
        canvas = {},
        offsetX,
        offsetY,
        offset = 0
      } = _ref4,
      restProps = _objectWithoutPropertiesLoose(_ref4, _excluded);
    const options = this.options;
    let {
      x,
      y
    } = options;
    const bounds = {
      xl: canvas.left,
      xr: canvas.width - canvas.right,
      width: canvas.width - canvas.right - canvas.left,
      yt: canvas.top,
      yb: canvas.height - canvas.bottom,
      height: canvas.height - canvas.bottom - canvas.top
    };
    if (!((0, _type.isDefined)(anchorX) && (0, _type.isDefined)(anchorY)) && !((0, _type.isDefined)(x) && (0, _type.isDefined)(y))) {
      return false;
    }
    if ((0, _type.isDefined)(anchorX) && (anchorX < bounds.xl || bounds.xr < anchorX || anchorY < bounds.yt || bounds.yb < anchorY)) {
      return false;
    }
    if (!this._root) {
      this._draw();
    }
    const shadowSettings = (0, _extend.extend)({
      x: '-50%',
      y: '-50%',
      width: '200%',
      height: '200%'
    }, options.shadow);
    const contentWidth = options.width > 0 ? options.width : null;
    const contentHeight = options.height > 0 ? options.height : null;
    const onRender = () => {
      var _this$_root;
      const bBox = this._contentBBox = this.measureContent(this.widget, this._contentGroup);
      const size = this._size = {
        width: max(contentWidth, bBox.width) + options.paddingLeftRight * 2,
        height: max(contentHeight, bBox.height) + options.paddingTopBottom * 2,
        offset
      };
      const xOff = shadowSettings.offsetX;
      const yOff = shadowSettings.offsetY;
      const blur = shadowSettings.blur * 2 + 1;
      const lm = max(blur - xOff, 0); // left margin
      const rm = max(blur + xOff, 0); // right margin
      const tm = max(blur - yOff, 0); // top margin
      const bm = max(blur + yOff, 0); // bottom margin

      this.margins = {
        lm,
        rm,
        tm,
        bm
      };
      if (!(0, _type.isDefined)(x)) {
        if ((0, _type.isDefined)(offsetX)) {
          x = anchorX + offsetX;
        } else {
          if (bounds.width < size.width) {
            x = round(bounds.xl + bounds.width / 2);
          } else {
            x = min(max(anchorX, Math.ceil(bounds.xl + size.width / 2 + lm)), Math.floor(bounds.xr - size.width / 2 - rm));
          }
        }
      } else {
        x += offsetX || 0;
        if (!(0, _type.isDefined)(anchorX)) {
          anchorX = x;
        }
      }
      if (!(0, _type.isDefined)(y)) {
        if ((0, _type.isDefined)(offsetY)) {
          y = anchorY + offsetY;
        } else {
          const y_top = anchorY - options.arrowLength - size.height / 2 - offset;
          const y_bottom = anchorY + options.arrowLength + size.height / 2 + offset;
          if (bounds.height < size.height + options.arrowLength) {
            y = round(bounds.yt + size.height / 2);
          } else if (y_top - size.height / 2 - tm < bounds.yt) {
            if (y_bottom + size.height / 2 + bm < bounds.yb) {
              y = y_bottom;
              anchorY += offset;
            } else {
              y = round(bounds.yt + size.height / 2);
            }
          } else {
            y = y_top;
            anchorY -= offset;
          }
        }
      } else {
        y += offsetY || 0;
        if (!(0, _type.isDefined)(anchorY)) {
          anchorY = y + size.height / 2;
        }
      }
      this.anchorX = anchorX;
      this.anchorY = anchorY;
      this.move(x, y);
      (_this$_root = this._root) === null || _this$_root === void 0 || _this$_root.append(this.root);
    };
    if (this.contentTemplate.render) {
      this.contentTemplate.render({
        model: options,
        container: this._contentGroup.element,
        onRendered: onRender
      });
    } else {
      return this.contentTemplate(_extends({
        group: this._contentGroup,
        onRender
      }, restProps));
    }
    return true;
  }
  _draw() {
    const renderer = this.widget._renderer;
    const options = this.options;
    const shadowSettings = (0, _extend.extend)({
      x: '-50%',
      y: '-50%',
      width: '200%',
      height: '200%'
    }, options.shadow);
    const shadow = this._shadow = renderer.shadowFilter().attr(shadowSettings);
    const cloudSettings = {
      opacity: options.opacity,
      'stroke-width': 0,
      fill: options.color
    };
    const borderOptions = options.border || {};
    if (borderOptions.visible) {
      (0, _extend.extend)(cloudSettings, {
        'stroke-width': borderOptions.width,
        stroke: borderOptions.color,
        'stroke-opacity': borderOptions.opacity,
        dashStyle: borderOptions.dashStyle
      });
    }
    const group = this._root = renderer.g().append(this.root);
    if (options.type) {
      group.attr({
        class: `dxc-${options.type}-annotation`
      });
    }
    const cloudGroup = renderer.g().attr({
      filter: shadow.id
    }).append(group);
    this._cloud = renderer.path([], 'area').attr(cloudSettings).sharp().append(cloudGroup);
    this._contentGroup = renderer.g().append(group);
  }
  getBBox() {
    const size = this._size || {};
    const margins = this.margins || {};
    const rotationAngle = getCloudAngle(size, this.x, this.y, this.anchorX, this.anchorY);
    return {
      x: Math.floor(this.x - size.width / 2 - margins.lm),
      y: Math.floor(this.y - size.height / 2 - margins.tm - (rotationAngle === 270 ? this.options.arrowLength : 0)),
      width: size.width + margins.lm + margins.rm,
      height: size.height + margins.tm + margins.bm + (rotationAngle === 90 || rotationAngle === 270 ? this.options.arrowLength : 0)
    };
  }
  clear() {
    if (this._root) {
      this._root.remove();
      this._shadow.remove();
      this._root = null;
    }
    return this;
  }
  customizeCloud(attr) {
    if (this._cloud) {
      this._cloud.attr(attr);
    }
  }
  moveRoot(x, y) {
    if (this._root) {
      this._root.move(x, y);
    }
  }
  move(x, y) {
    x = round(x);
    y = round(y);
    this.x = x;
    this.y = y;
    const rotationAngle = getCloudAngle(this._size, x, y, this.anchorX, this.anchorY);
    const radRotationAngle = rotationAngle * PI / 180;
    this._cloud.attr({
      d: getCloudPoints(rotateSize(this._size, rotationAngle), x, y, rotateX(this.anchorX, this.anchorY, radRotationAngle, x, y), rotateY(this.anchorX, this.anchorY, radRotationAngle, x, y), this.options, this.bonded)
    }).rotate(rotationAngle, x, y);
    this.moveContentGroup(this.widget, this._contentGroup, x - this._contentBBox.x - this._contentBBox.width / 2, y - this._contentBBox.y - this._contentBBox.height / 2);
  }
  hitTest(x, y) {
    const {
      width,
      height
    } = this._size || {};
    return Math.abs(x - this.x) <= width / 2 && Math.abs(y - this.y) <= height / 2;
  }
}
exports.Plaque = Plaque;