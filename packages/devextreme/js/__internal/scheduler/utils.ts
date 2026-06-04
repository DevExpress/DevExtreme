import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight, setHeight, setWidth } from '@js/core/utils/size';

import { APPOINTMENT_SETTINGS_KEY } from './constants';
import type { AppointmentViewModelPlain } from './view_model/types';

export const utils = {
  dataAccessors: {
    getAppointmentSettings: (
      element: unknown,
    ): AppointmentViewModelPlain | undefined => $(element as Element)
      .data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentViewModelPlain | undefined,
  },
  DOM: {
    getHeaderHeight: (header: unknown): number => {
      const $element = (header as Record<string, unknown>)
        ?._$element as dxElementWrapper | undefined;
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
      let component = w[componentName] as
        Record<string, Function> | undefined;
      if (!component) {
        const container = getPublicElement(parentElement);
        const createComponent = w._createComponent as Function;
        component = createComponent(
          container,
          componentClass,
          viewModel,
        ) as Record<string, Function>;
        w[componentName] = component;
      } else {
        const $element = component.$element() as
          dxElementWrapper;
        const elementStyle = (
          $element.get(0) as HTMLElement
        ).style;
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
