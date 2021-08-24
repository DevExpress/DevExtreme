import { getOuterHeight, setHeight, setWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
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
