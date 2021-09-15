import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { APPOINTMENT_SETTINGS_KEY } from './constants';
import { getPublicElement } from '../../core/element';

export const utils = {
    dataAccessors: {
        getAppointmentSettings: element => {
            return $(element).data(APPOINTMENT_SETTINGS_KEY);
        },

        getAppointmentInfo: element => {
            const settings = utils.dataAccessors.getAppointmentSettings(element);
            return settings?.info;
        },

        combine: (dataAccessors, resourceDataAccessors) => { // TODO get rid of it and rework resourceManager
            const result = extend(true, {}, dataAccessors);

            if(dataAccessors) {
                each(resourceDataAccessors, (type, accessor) => {
                    result[type].resources = accessor;
                });
            }

            return result;
        }
    },
    DOM: {
        getHeaderHeight: (header) => {
            return header._$element && parseInt(header._$element.outerHeight(), 10);
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

                height && $element.height(height);
                width && $element.width(width);
            }
        }
    }
};
