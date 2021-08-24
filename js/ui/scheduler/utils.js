import { getOuterHeight, setHeight, setWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { getResourceManager } from './instanceFactory';
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

        combine: (key, dataAccessors) => { // TODO get rid of it and rework resourceManager
            const result = extend(true, {}, dataAccessors);
            const resourceManager = getResourceManager(key);

            if(dataAccessors && resourceManager) {
                each(resourceManager._dataAccessors, (type, accessor) => {
                    result[type].resources = accessor;
                });
            }

            return result;
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
