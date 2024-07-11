"use strict";

var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _knockout = _interopRequireDefault(require("knockout"));
var _type = require("../../core/utils/type");
var _event_registrator_callbacks = _interopRequireDefault(require("../../events/core/event_registrator_callbacks"));
var _index = require("../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

if (_knockout.default) {
  _event_registrator_callbacks.default.add(function (name) {
    const koBindingEventName = (0, _index.addNamespace)(name, name + 'Binding');
    _knockout.default.bindingHandlers[name] = {
      update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        const $element = (0, _renderer.default)(element);
        const unwrappedValue = _knockout.default.utils.unwrapObservable(valueAccessor());
        const eventSource = unwrappedValue.execute ? unwrappedValue.execute : unwrappedValue;
        _events_engine.default.off($element, koBindingEventName);
        _events_engine.default.on($element, koBindingEventName, (0, _type.isPlainObject)(unwrappedValue) ? unwrappedValue : {}, function (e) {
          eventSource.call(viewModel, viewModel, e);
        });
      }
    };
  });
}