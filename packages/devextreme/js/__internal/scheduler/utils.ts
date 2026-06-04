import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight, setHeight, setWidth } from '@js/core/utils/size';

import { APPOINTMENT_SETTINGS_KEY } from './constants';
import type { AppointmentViewModelPlain } from './view_model/types';

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
      return h?._$element
        ? parseInt(getOuterHeight(h._$element as dxElementWrapper), 10)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = widget as any;
      let component = w[componentName];
      if (!component) {
        const container = getPublicElement(parentElement);
        component = w._createComponent(container, componentClass, viewModel);
        w[componentName] = component;
      } else {
        const $element = component.$element() as dxElementWrapper;
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
