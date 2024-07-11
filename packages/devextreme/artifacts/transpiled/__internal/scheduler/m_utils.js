"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = void 0;
var _element = require("../../core/element");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _data = require("../../core/utils/data");
var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));
var _iterator = require("../../core/utils/iterator");
var _size = require("../../core/utils/size");
var _m_constants = require("./m_constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const utils = exports.utils = {
  dataAccessors: {
    getAppointmentSettings: element => (0, _renderer.default)(element).data(_m_constants.APPOINTMENT_SETTINGS_KEY),
    getAppointmentInfo: element => {
      const settings = utils.dataAccessors.getAppointmentSettings(element);
      return settings === null || settings === void 0 ? void 0 : settings.info;
    },
    create: (fields, currentDataAccessors, forceIsoDateParsing, dateSerializationFormat) => {
      const isDateField = field => field === 'startDate' || field === 'endDate';
      const defaultDataAccessors = {
        getter: {},
        setter: {},
        expr: {}
      };
      const dataAccessors = currentDataAccessors ? _extends({}, currentDataAccessors) : defaultDataAccessors;
      (0, _iterator.each)(fields, (name, expr) => {
        if (expr) {
          const getter = (0, _data.compileGetter)(expr);
          const setter = (0, _data.compileSetter)(expr);
          let dateGetter;
          let dateSetter;
          let serializationFormat;
          if (isDateField(name)) {
            dateGetter = object => {
              let value = getter(object);
              if (forceIsoDateParsing) {
                value = _date_serialization.default.deserializeDate(value);
              }
              return value;
            };
            dateSetter = (object, value) => {
              if (dateSerializationFormat) {
                serializationFormat = dateSerializationFormat;
              } else if (forceIsoDateParsing && !serializationFormat) {
                const oldValue = getter(object);
                serializationFormat = _date_serialization.default.getDateSerializationFormat(oldValue);
              }
              const newValue = _date_serialization.default.serializeDate(value, serializationFormat);
              setter(object, newValue);
            };
          }
          dataAccessors.getter[name] = dateGetter || getter;
          dataAccessors.setter[name] = dateSetter || setter;
          dataAccessors.expr[`${name}Expr`] = expr;
        } else {
          /* eslint-disable @typescript-eslint/no-dynamic-delete */
          delete dataAccessors.getter[name];
          delete dataAccessors.setter[name];
          delete dataAccessors.expr[`${name}Expr`];
          /* eslint-enable @typescript-eslint/no-dynamic-delete */
        }
      });
      return dataAccessors;
    }
  },
  DOM: {
    getHeaderHeight: header => header ? header._$element && parseInt((0, _size.getOuterHeight)(header._$element), 10) : 0
  },
  renovation: {
    renderComponent: (widget, parentElement, componentClass, componentName, viewModel) => {
      let component = widget[componentName];
      if (!component) {
        const container = (0, _element.getPublicElement)(parentElement);
        component = widget._createComponent(container, componentClass, viewModel);
        widget[componentName] = component;
      } else {
        // TODO: this is a workaround for setTablesSizes. Remove after CSS refactoring
        const $element = component.$element();
        const elementStyle = $element.get(0).style;
        const {
          height
        } = elementStyle;
        const {
          width
        } = elementStyle;
        component.option(viewModel);
        if (height) {
          (0, _size.setHeight)($element, height);
        }
        if (width) {
          (0, _size.setWidth)($element, width);
        }
      }
    }
  }
};