import { getOuterHeight, setHeight, setWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import { each } from '../../core/utils/iterator';
import { APPOINTMENT_SETTINGS_KEY } from './constants';
import { getPublicElement } from '../../core/element';
import { compileGetter, compileSetter } from '../../core/utils/data';
import dateSerialization from '../../core/utils/date_serialization';

export const utils = {
    dataAccessors: {
        getAppointmentSettings: element => {
            return $(element).data(APPOINTMENT_SETTINGS_KEY);
        },

        getAppointmentInfo: element => {
            const settings = utils.dataAccessors.getAppointmentSettings(element);
            return settings?.info;
        },

        create: (
            fields,
            currentDataAccessors,
            forceIsoDateParsing,
            getDateSerializationFormat,
            setDateSerializationFormat
        ) => {
            const isDateField = (field) => field === 'startDate' || field === 'endDate';
            const defaultDataAccessors = {
                getter: {},
                setter: {},
                expr: {}
            };
            const dataAccessors = currentDataAccessors
                ? { ...currentDataAccessors }
                : defaultDataAccessors;

            each(fields, (name, expr) => {
                if(expr) {
                    const getter = compileGetter(expr);
                    const setter = compileSetter(expr);

                    let dateGetter;
                    let dateSetter;

                    if(isDateField(name)) {
                        dateGetter = function() {
                            let value = getter(...arguments);
                            if(forceIsoDateParsing) {
                                if(!getDateSerializationFormat()) {
                                    const format = dateSerialization.getDateSerializationFormat(value);
                                    if(format && setDateSerializationFormat) {
                                        setDateSerializationFormat(format);
                                    }
                                }
                                value = dateSerialization.deserializeDate(value);
                            }
                            return value;
                        };
                        dateSetter = function(object, value) {
                            if(forceIsoDateParsing || getDateSerializationFormat()) {
                                value = dateSerialization.serializeDate(value, getDateSerializationFormat());
                            }
                            setter.call(this, object, value);
                        };
                    }
                    dataAccessors.getter[name] = dateGetter || getter;
                    dataAccessors.setter[name] = dateSetter || setter;
                    dataAccessors.expr[`${name}Expr`] = expr;
                } else {
                    delete dataAccessors.getter[name];
                    delete dataAccessors.setter[name];
                    delete dataAccessors.expr[`${name}Expr`];
                }
            });

            return dataAccessors;
        }
    },
    DOM: {
        getHeaderHeight: (header) => {
            return header._$element && parseInt(getOuterHeight(header._$element), 10);
        },
    },
    renovation: {
        renderComponent: (widget, parentElement, componentClass, componentName, viewModel) => {
            let component = widget[componentName];
            if(!component) {
                const container = getPublicElement(parentElement);
                component = widget._createComponent(container, componentClass, viewModel);
                widget[componentName] = component;
            } else {
                // TODO: this is a workaround for setTablesSizes. Remove after CSS refactoring
                const $element = component.$element();
                const elementStyle = $element.get(0).style;
                const height = elementStyle.height;
                const width = elementStyle.width;

                component.option(viewModel);

                if(height) {
                    setHeight($element, height);
                }
                if(width) {
                    setWidth($element, width);
                }
            }
        }
    }
};
