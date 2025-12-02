import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { getOuterHeight, setHeight, setWidth } from '@js/core/utils/size';

import { APPOINTMENT_SETTINGS_KEY } from './constants';
import type { AppointmentViewModelPlain } from './view_model/types';

export const utils = {
  dataAccessors: {
    getAppointmentSettings: (element) => $(element)
      .data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentViewModelPlain | undefined,
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
