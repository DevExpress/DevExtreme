"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _class = _interopRequireDefault(require("../../core/class"));
var _index = require("../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const COMPOSITION_START_EVENT = 'compositionstart';
const COMPOSITION_END_EVENT = 'compositionend';
const KEYDOWN_EVENT = 'keydown';
const NAMESPACE = 'KeyboardProcessor';
const createKeyDownOptions = e => {
  return {
    keyName: (0, _index.normalizeKeyName)(e),
    key: e.key,
    code: e.code,
    ctrl: e.ctrlKey,
    location: e.location,
    metaKey: e.metaKey,
    shift: e.shiftKey,
    alt: e.altKey,
    which: e.which,
    originalEvent: e
  };
};
const KeyboardProcessor = _class.default.inherit({
  _keydown: (0, _index.addNamespace)(KEYDOWN_EVENT, NAMESPACE),
  _compositionStart: (0, _index.addNamespace)(COMPOSITION_START_EVENT, NAMESPACE),
  _compositionEnd: (0, _index.addNamespace)(COMPOSITION_END_EVENT, NAMESPACE),
  ctor: function (options) {
    options = options || {};
    if (options.element) {
      this._element = (0, _renderer.default)(options.element);
    }
    if (options.focusTarget) {
      this._focusTarget = options.focusTarget;
    }
    this._handler = options.handler;
    if (this._element) {
      this._processFunction = e => {
        const focusTargets = (0, _renderer.default)(this._focusTarget).toArray();
        const isNotFocusTarget = this._focusTarget && this._focusTarget !== e.target && !focusTargets.includes(e.target);
        const shouldSkipProcessing = this._isComposingJustFinished && e.which === 229 || this._isComposing || isNotFocusTarget;
        this._isComposingJustFinished = false;
        if (!shouldSkipProcessing) {
          this.process(e);
        }
      };
      this._toggleProcessingWithContext = this.toggleProcessing.bind(this);
      _events_engine.default.on(this._element, this._keydown, this._processFunction);
      _events_engine.default.on(this._element, this._compositionStart, this._toggleProcessingWithContext);
      _events_engine.default.on(this._element, this._compositionEnd, this._toggleProcessingWithContext);
    }
  },
  dispose: function () {
    if (this._element) {
      _events_engine.default.off(this._element, this._keydown, this._processFunction);
      _events_engine.default.off(this._element, this._compositionStart, this._toggleProcessingWithContext);
      _events_engine.default.off(this._element, this._compositionEnd, this._toggleProcessingWithContext);
    }
    this._element = undefined;
    this._handler = undefined;
  },
  process: function (e) {
    this._handler(createKeyDownOptions(e));
  },
  toggleProcessing: function (_ref) {
    let {
      type
    } = _ref;
    this._isComposing = type === COMPOSITION_START_EVENT;
    this._isComposingJustFinished = !this._isComposing;
  }
});
KeyboardProcessor.createKeyDownOptions = createKeyDownOptions;
var _default = exports.default = KeyboardProcessor;
module.exports = exports.default;
module.exports.default = exports.default;