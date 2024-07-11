"use strict";

exports.visibility = exports.resize = exports.keyboard = exports.hover = exports.focus = exports.dxClick = exports.click = exports.active = void 0;
var _events_engine = _interopRequireDefault(require("./core/events_engine"));
var _keyboard_processor = _interopRequireDefault(require("./core/keyboard_processor"));
var _index = require("./utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function addNamespace(event, namespace) {
  return namespace ? (0, _index.addNamespace)(event, namespace) : event;
}
function executeAction(action, args) {
  return typeof action === 'function' ? action(args) : action.execute(args);
}
const active = exports.active = {
  on: ($el, active, inactive, opts) => {
    const {
      selector,
      showTimeout,
      hideTimeout,
      namespace
    } = opts;
    _events_engine.default.on($el, addNamespace('dxactive', namespace), selector, {
      timeout: showTimeout
    }, event => executeAction(active, {
      event,
      element: event.currentTarget
    }));
    _events_engine.default.on($el, addNamespace('dxinactive', namespace), selector, {
      timeout: hideTimeout
    }, event => executeAction(inactive, {
      event,
      element: event.currentTarget
    }));
  },
  off: ($el, _ref) => {
    let {
      namespace,
      selector
    } = _ref;
    _events_engine.default.off($el, addNamespace('dxactive', namespace), selector);
    _events_engine.default.off($el, addNamespace('dxinactive', namespace), selector);
  }
};
const resize = exports.resize = {
  on: function ($el, resize) {
    let {
      namespace
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _events_engine.default.on($el, addNamespace('dxresize', namespace), resize);
  },
  off: function ($el) {
    let {
      namespace
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _events_engine.default.off($el, addNamespace('dxresize', namespace));
  }
};
const hover = exports.hover = {
  on: ($el, start, end, _ref2) => {
    let {
      selector,
      namespace
    } = _ref2;
    _events_engine.default.on($el, addNamespace('dxhoverend', namespace), selector, event => end(event));
    _events_engine.default.on($el, addNamespace('dxhoverstart', namespace), selector, event => executeAction(start, {
      element: event.target,
      event
    }));
  },
  off: ($el, _ref3) => {
    let {
      selector,
      namespace
    } = _ref3;
    _events_engine.default.off($el, addNamespace('dxhoverstart', namespace), selector);
    _events_engine.default.off($el, addNamespace('dxhoverend', namespace), selector);
  }
};
const visibility = exports.visibility = {
  on: ($el, shown, hiding, _ref4) => {
    let {
      namespace
    } = _ref4;
    _events_engine.default.on($el, addNamespace('dxhiding', namespace), hiding);
    _events_engine.default.on($el, addNamespace('dxshown', namespace), shown);
  },
  off: ($el, _ref5) => {
    let {
      namespace
    } = _ref5;
    _events_engine.default.off($el, addNamespace('dxhiding', namespace));
    _events_engine.default.off($el, addNamespace('dxshown', namespace));
  }
};
const focus = exports.focus = {
  on: ($el, focusIn, focusOut, _ref6) => {
    let {
      namespace
    } = _ref6;
    _events_engine.default.on($el, addNamespace('focusin', namespace), focusIn);
    _events_engine.default.on($el, addNamespace('focusout', namespace), focusOut);
  },
  off: ($el, _ref7) => {
    let {
      namespace
    } = _ref7;
    _events_engine.default.off($el, addNamespace('focusin', namespace));
    _events_engine.default.off($el, addNamespace('focusout', namespace));
  },
  trigger: $el => _events_engine.default.trigger($el, 'focus')
};
const dxClick = exports.dxClick = {
  on: function ($el, click) {
    let {
      namespace
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _events_engine.default.on($el, addNamespace('dxclick', namespace), click);
  },
  off: function ($el) {
    let {
      namespace
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _events_engine.default.off($el, addNamespace('dxclick', namespace));
  }
};
const click = exports.click = {
  on: function ($el, click) {
    let {
      namespace
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _events_engine.default.on($el, addNamespace('click', namespace), click);
  },
  off: function ($el) {
    let {
      namespace
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _events_engine.default.off($el, addNamespace('click', namespace));
  }
};
let index = 0;
const keyboardProcessors = {};
const generateListenerId = () => `keyboardProcessorId${index++}`;
const keyboard = exports.keyboard = {
  on: (element, focusTarget, handler) => {
    const listenerId = generateListenerId();
    keyboardProcessors[listenerId] = new _keyboard_processor.default({
      element,
      focusTarget,
      handler
    });
    return listenerId;
  },
  off: listenerId => {
    if (listenerId && keyboardProcessors[listenerId]) {
      keyboardProcessors[listenerId].dispose();
      delete keyboardProcessors[listenerId];
    }
  },
  // NOTE: For tests
  _getProcessor: listenerId => keyboardProcessors[listenerId]
};