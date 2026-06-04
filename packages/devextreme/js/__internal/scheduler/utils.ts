import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight, setHeight, setWidth } from '@js/core/utils/size';

import { APPOINTMENT_SETTINGS_KEY } from './constants';
import type { AppointmentViewModelPlain } from './view_model/types';

interface HeaderWithElement {
  [key: string]: unknown;
}

interface RenovationWidget {
  [key: string]: unknown;
}

export const utils = {
  dataAccessors: {
    getAppointmentSettings: (
      element: Element,
    ): AppointmentViewModelPlain | undefined => $(element)
      .data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentViewModelPlain | undefined,
  },
  DOM: {
    getHeaderHeight: (
      header: HeaderWithElement | null | undefined,
    ): number => {
      const $element = header?._$element as
        dxElementWrapper | undefined;
      return $element
        ? parseInt(getOuterHeight($element), 10)
        : 0;
    },
  },
  renovation: {
    renderComponent: (
      widget: RenovationWidget,
      parentElement: dxElementWrapper,
      componentClass: unknown,
      componentName: string,
      viewModel: Record<string, unknown>,
    ): void => {
      let component = widget[componentName] as
        Record<string, Function> | undefined;
      if (!component) {
        const container = getPublicElement(parentElement);
        const createComponent = widget._createComponent as
          Function;
        component = createComponent(
          container,
          componentClass,
          viewModel,
        ) as Record<string, Function>;
        widget[componentName] = component;
      } else {
        const $element = component.$element() as
          dxElementWrapper;
        const elementStyle = ($element.get(0) as HTMLElement).style;
        const { height } = elementStyle;
        const { width } = elementStyle;

        (component.option)(viewModel);

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
