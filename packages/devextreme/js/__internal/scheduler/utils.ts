import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight, setHeight, setWidth } from '@js/core/utils/size';

import { APPOINTMENT_SETTINGS_KEY } from './constants';
import type { AppointmentViewModelPlain } from './view_model/types';

interface RenovationWidget {
  $element: () => dxElementWrapper;
  option: (options: Record<string, unknown>) => void;
}

type CreateComponentFn = (
  element: string | HTMLElement | dxElementWrapper | Element,
  component: unknown,
  config: Record<string, unknown>,
) => RenovationWidget;

export const utils = {
  dataAccessors: {
    getAppointmentSettings: (
      element: dxElementWrapper,
    ): AppointmentViewModelPlain | undefined => $(element)
      .data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentViewModelPlain | undefined,
  },
  DOM: {
    getHeaderHeight: (header: unknown): number => {
      const h = header as Record<string, unknown> | null | undefined;
      const $element = h?._$element as dxElementWrapper | undefined;
      return $element
        ? parseInt(getOuterHeight($element), 10)
        : 0;
    },
  },
  renovation: {
    renderComponent: (
      widget: unknown,
      parentElement: dxElementWrapper,
      componentClass: unknown,
      componentName: string,
      viewModel: Record<string, unknown>,
    ): void => {
      const w = widget as Record<string, unknown>;
      let component = w[componentName] as RenovationWidget | undefined;
      if (!component) {
        const container = getPublicElement(parentElement);
        const createFn = w._createComponent as CreateComponentFn;
        component = createFn.call(w, container, componentClass, viewModel);
        w[componentName] = component;
      } else {
        const $element = component.$element();
        const elementStyle = ($element.get(0) as HTMLElement).style;
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
