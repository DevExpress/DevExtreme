"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBodyOverflowManager = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _common = require("../../../core/utils/common");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const overflowManagerMock = {
  setOverflow: _common.noop,
  restoreOverflow: _common.noop
};
const createBodyOverflowManager = () => {
  if (!(0, _window.hasWindow)()) {
    return overflowManagerMock;
  }
  const window = (0, _window.getWindow)();
  const {
    documentElement
  } = _dom_adapter.default.getDocument();
  const body = _dom_adapter.default.getBody();
  const isIosDevice = _devices.default.real().platform === 'ios';
  const prevSettings = {
    overflow: null,
    overflowX: null,
    overflowY: null,
    paddingRight: null,
    position: null,
    top: null,
    left: null
  };
  const setBodyPositionFixed = () => {
    if ((0, _type.isDefined)(prevSettings.position) || body.style.position === 'fixed') {
      return;
    }
    const {
      scrollY,
      scrollX
    } = window;
    prevSettings.position = body.style.position;
    prevSettings.top = body.style.top;
    prevSettings.left = body.style.left;
    body.style.setProperty('position', 'fixed');
    body.style.setProperty('top', `${-scrollY}px`);
    body.style.setProperty('left', `${-scrollX}px`);
  };
  const restoreBodyPositionFixed = () => {
    if (!(0, _type.isDefined)(prevSettings.position)) {
      return;
    }
    const scrollY = -parseInt(body.style.top, 10);
    const scrollX = -parseInt(body.style.left, 10);
    ['position', 'top', 'left'].forEach(property => {
      if (prevSettings[property]) {
        body.style.setProperty(property, prevSettings[property]);
      } else {
        body.style.removeProperty(property);
      }
    });
    window.scrollTo(scrollX, scrollY);
    prevSettings.position = null;
  };
  const setBodyPaddingRight = () => {
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth;
    if (prevSettings.paddingRight || scrollBarWidth <= 0) {
      return;
    }
    const paddingRight = window.getComputedStyle(body).getPropertyValue('padding-right');
    const computedBodyPaddingRight = parseInt(paddingRight, 10);
    prevSettings.paddingRight = computedBodyPaddingRight;
    body.style.setProperty('padding-right', `${computedBodyPaddingRight + scrollBarWidth}px`);
  };
  const setBodyOverflow = () => {
    setBodyPaddingRight();
    if (prevSettings.overflow || body.style.overflow === 'hidden') {
      return;
    }
    prevSettings.overflow = body.style.overflow;
    prevSettings.overflowX = body.style.overflowX;
    prevSettings.overflowY = body.style.overflowY;
    body.style.setProperty('overflow', 'hidden');
  };
  const restoreBodyPaddingRight = () => {
    if (!(0, _type.isDefined)(prevSettings.paddingRight)) {
      return;
    }
    if (prevSettings.paddingRight) {
      body.style.setProperty('padding-right', `${prevSettings.paddingRight}px`);
    } else {
      body.style.removeProperty('padding-right');
    }
    prevSettings.paddingRight = null;
  };
  const restoreBodyOverflow = () => {
    restoreBodyPaddingRight();
    ['overflow', 'overflowX', 'overflowY'].forEach(property => {
      if (!(0, _type.isDefined)(prevSettings[property])) {
        return;
      }
      const propertyInKebabCase = property.replace(/(X)|(Y)/, symbol => `-${symbol.toLowerCase()}`);
      if (prevSettings[property]) {
        body.style.setProperty(propertyInKebabCase, prevSettings[property]);
      } else {
        body.style.removeProperty(propertyInKebabCase);
      }
      prevSettings[property] = null;
    });
  };
  return {
    setOverflow: isIosDevice ? setBodyPositionFixed : setBodyOverflow,
    restoreOverflow: isIosDevice ? restoreBodyPositionFixed : restoreBodyOverflow
  };
};
exports.createBodyOverflowManager = createBodyOverflowManager;