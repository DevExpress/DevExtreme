"use strict";

exports.default = void 0;
var _swipe = require("../swipe");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _dom_component = _interopRequireDefault(require("../../core/dom_component"));
var _iterator = require("../../core/utils/iterator");
var _index = require("../utils/index");
var _extend = require("../../core/utils/extend");
var _public_component = require("../../core/utils/public_component");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DX_SWIPEABLE = 'dxSwipeable';
const SWIPEABLE_CLASS = 'dx-swipeable';
const ACTION_TO_EVENT_MAP = {
  'onStart': _swipe.start,
  'onUpdated': _swipe.swipe,
  'onEnd': _swipe.end,
  'onCancel': 'dxswipecancel'
};
const IMMEDIATE_TIMEOUT = 180;
const Swipeable = _dom_component.default.inherit({
  _getDefaultOptions: function () {
    return (0, _extend.extend)(this.callBase(), {
      elastic: true,
      immediate: false,
      immediateTimeout: IMMEDIATE_TIMEOUT,
      direction: 'horizontal',
      itemSizeFunc: null,
      onStart: null,
      onUpdated: null,
      onEnd: null,
      onCancel: null
    });
  },
  _render: function () {
    this.callBase();
    this.$element().addClass(SWIPEABLE_CLASS);
    this._attachEventHandlers();
  },
  _attachEventHandlers: function () {
    this._detachEventHandlers();
    if (this.option('disabled')) {
      return;
    }
    const NAME = this.NAME;
    this._createEventData();
    (0, _iterator.each)(ACTION_TO_EVENT_MAP, function (actionName, eventName) {
      const action = this._createActionByOption(actionName, {
        context: this
      });
      eventName = (0, _index.addNamespace)(eventName, NAME);
      _events_engine.default.on(this.$element(), eventName, this._eventData, function (e) {
        return action({
          event: e
        });
      });
    }.bind(this));
  },
  _createEventData: function () {
    this._eventData = {
      elastic: this.option('elastic'),
      itemSizeFunc: this.option('itemSizeFunc'),
      direction: this.option('direction'),
      immediate: this.option('immediate'),
      immediateTimeout: this.option('immediateTimeout')
    };
  },
  _detachEventHandlers: function () {
    _events_engine.default.off(this.$element(), '.' + DX_SWIPEABLE);
  },
  _optionChanged: function (args) {
    switch (args.name) {
      case 'disabled':
      case 'onStart':
      case 'onUpdated':
      case 'onEnd':
      case 'onCancel':
      case 'elastic':
      case 'immediate':
      case 'itemSizeFunc':
      case 'direction':
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'rtlEnabled':
        break;
      default:
        this.callBase(args);
    }
  },
  _useTemplates: function () {
    return false;
  }
});
(0, _public_component.name)(Swipeable, DX_SWIPEABLE);
var _default = exports.default = Swipeable;
module.exports = exports.default;
module.exports.default = exports.default;