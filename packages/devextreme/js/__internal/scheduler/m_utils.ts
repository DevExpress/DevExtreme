import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
import { each } from '@js/core/utils/iterator';
import { getOuterHeight, setHeight, setWidth } from '@js/core/utils/size';

import { APPOINTMENT_SETTINGS_KEY } from './m_constants';

export const utils = {
  dataAccessors: {
    getAppointmentSettings: (element) => $(element).data(APPOINTMENT_SETTINGS_KEY),

    getAppointmentInfo: (element) => {
      const settings: any = utils.dataAccessors.getAppointmentSettings(element);
      return settings?.info;
    },

    create: (
      fields,
      currentDataAccessors,
      forceIsoDateParsing,
      dateSerializationFormat,
    ) => {
      const isDateField = (field) => field === 'startDate' || field === 'endDate';
      const defaultDataAccessors = {
        getter: {},
        setter: {},
        expr: {},
      };
      const dataAccessors = currentDataAccessors
        ? { ...currentDataAccessors }
        : defaultDataAccessors;

      each(fields, (name: any, expr) => {
        if (expr) {
          const getter: any = compileGetter(expr);
          const setter: any = compileSetter(expr);

          let dateGetter;
          let dateSetter;
          let serializationFormat;

          if (isDateField(name)) {
            dateGetter = (object) => {
              let value = getter(object);
              if (forceIsoDateParsing) {
                value = dateSerialization.deserializeDate(value);
              }
              return value;
            };
            dateSetter = (object, value) => {
              if (dateSerializationFormat) {
                serializationFormat = dateSerializationFormat;
              } else if (forceIsoDateParsing && !serializationFormat) {
                const oldValue = getter(object);

                serializationFormat = dateSerialization.getDateSerializationFormat(oldValue);
              }

              const newValue = dateSerialization.serializeDate(
                value,
                serializationFormat,
              );

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
    },
  },
  DOM: {
    getHeaderHeight: (header) => (header
      ? header._$element && parseInt(getOuterHeight(header._$element), 10)
      : 0),
  },
  renovation: {
    renderComponent: (widget, parentElement, componentClass, componentName, viewModel) => {
      let component = widget[componentName];
      if (!component) {
        const container = getPublicElement(parentElement);
        component = widget._createComponent(container, componentClass, viewModel);
        widget[componentName] = component;
      } else {
        const $element = component.$element();
        const elementStyle = $element.get(0).style;
        const { height } = elementStyle;
        const { width } = elementStyle;

        component.option(viewModel);

        if (height) {
          setHeight($element, height);
        }
        if (width) {
          setWidth($element, width);
        }
      }
    },
  },
};
