"use strict";

var _jquery = _interopRequireDefault(require("jquery"));
var _use_jquery = _interopRequireDefault(require("./use_jquery"));
var _version = require("../../core/utils/version");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _index = require("../../events/utils/index");
var _event_registrator = _interopRequireDefault(require("../../events/core/event_registrator"));
var _hook_touch_props = _interopRequireDefault(require("../../events/core/hook_touch_props"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

const useJQuery = (0, _use_jquery.default)();
if (useJQuery) {
  if ((0, _version.compare)(_jquery.default.fn.jquery, [3]) < 0) {
    const POINTER_TYPE_MAP = {
      2: 'touch',
      3: 'pen',
      4: 'mouse'
    };
    (0, _iterator.each)(['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel', 'MSPointerOver', 'MSPointerOut', 'mouseenter', 'mouseleave', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave'], function () {
      _jquery.default.event.fixHooks[this] = {
        filter: function (event, originalEvent) {
          const pointerType = originalEvent.pointerType;
          if ((0, _type.isNumeric)(pointerType)) {
            event.pointerType = POINTER_TYPE_MAP[pointerType];
          }
          return event;
        },
        props: _jquery.default.event.mouseHooks.props.concat(['pointerId', 'pointerType', 'originalTarget', 'width', 'height', 'pressure', 'result', 'tiltX', 'charCode', 'tiltY', 'detail', 'isPrimary', 'prevValue'])
      };
    });
    (0, _iterator.each)(['touchstart', 'touchmove', 'touchend', 'touchcancel'], function () {
      _jquery.default.event.fixHooks[this] = {
        filter: function (event, originalEvent) {
          (0, _hook_touch_props.default)(function (name, hook) {
            event[name] = hook(originalEvent);
          });
          return event;
        },
        props: _jquery.default.event.mouseHooks.props.concat(['touches', 'changedTouches', 'targetTouches', 'detail', 'result', 'originalTarget', 'charCode', 'prevValue'])
      };
    });
    _jquery.default.event.fixHooks['wheel'] = _jquery.default.event.mouseHooks;
    const DX_EVENT_HOOKS = {
      props: _jquery.default.event.mouseHooks.props.concat(['pointerType', 'pointerId', 'pointers'])
    };
    _event_registrator.default.callbacks.add(function (name) {
      _jquery.default.event.fixHooks[name] = DX_EVENT_HOOKS;
    });
    const fix = function (event, originalEvent) {
      const fixHook = _jquery.default.event.fixHooks[originalEvent.type] || _jquery.default.event.mouseHooks;
      const props = fixHook.props ? _jquery.default.event.props.concat(fixHook.props) : _jquery.default.event.props;
      let propIndex = props.length;
      while (propIndex--) {
        const prop = props[propIndex];
        event[prop] = originalEvent[prop];
      }
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    };
    (0, _index.setEventFixMethod)(fix);
  } else {
    (0, _hook_touch_props.default)(function (name, hook) {
      _jquery.default.event.addProp(name, hook);
    });
  }
}