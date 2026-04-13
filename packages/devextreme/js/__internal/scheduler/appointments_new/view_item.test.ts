import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import fx from '@ts/common/core/animation/fx';

import { createAppointmentCollector, getAppointmentCollectorProperties } from './__mock__/appointment_collector';
import { createBaseAppointment, getBaseAppointmentViewProperties } from './__mock__/appointment_properties';
import type { BaseAppointmentView, BaseAppointmentViewProperties } from './appointment/base_appointment';
import type { AppointmentCollector, AppointmentCollectorProperties } from './appointment_collector';
import type { ViewItemProperties } from './view_item';

const defaultAppointmentData = {
  title: 'Test appointment',
  startDate: new Date(2024, 0, 1, 9, 0),
  endDate: new Date(2024, 0, 1, 10, 0),
};

describe.each([
  'BaseAppointment',
  'AppointmentCollector',
])('ViewItem Common - %s', (viewItemName) => {
  beforeEach(() => {
    fx.off = true;

    const $container = $('<div>')
      .addClass('container')
      .appendTo(document.body);

    $('<div>')
      .addClass('root')
      .appendTo($container);
  });

  afterEach(() => {
    $('.container').remove();
    fx.off = false;
    jest.useRealTimers();
  });

  const createViewItem = (
    properties: Partial<ViewItemProperties> = {},
  ): Promise<BaseAppointmentView | AppointmentCollector> => {
    const baseProperties: ViewItemProperties = {
      tabIndex: 0,
      sortedIndex: 0,
      onFocusIn: () => {},
      onFocusOut: () => {},
      onKeyDown: () => {},
    };

    if (viewItemName === 'BaseAppointment') {
      const extendedProperties: BaseAppointmentViewProperties = {
        ...baseProperties,
        ...getBaseAppointmentViewProperties(defaultAppointmentData),
        ...properties,
      };

      return createBaseAppointment(extendedProperties);
    }

    const extendedProperties: AppointmentCollectorProperties = {
      ...baseProperties,
      ...getAppointmentCollectorProperties([defaultAppointmentData]),
      ...properties,
    };

    return Promise.resolve(createAppointmentCollector(extendedProperties));
  };

  describe('Focus', () => {
    it('should have tabindex -1 by default', async () => {
      const instance = await createViewItem();

      expect(instance.$element().attr('tabindex')).toBe('-1');
    });

    it('should set tabindex attr on makeFocusable', async () => {
      const instance = await createViewItem({ tabIndex: 2 });

      instance.makeFocusable();

      expect(instance.$element().attr('tabindex')).toBe('2');
    });

    it('should update tabindex attr on setTabIndex if appointment is focusable', async () => {
      const instance = await createViewItem();

      instance.makeFocusable();
      instance.setTabIndex(1);

      expect(instance.$element().attr('tabindex')).toBe('1');
    });

    it('should not update tabindex attr on setTabIndex if appointment is not focusable', async () => {
      const instance = await createViewItem();

      instance.setTabIndex(1);

      expect(instance.$element().attr('tabindex')).toBe('-1');
    });

    it('should set correct tabindex after setTabIndex and makeFocusable calls', async () => {
      const instance = await createViewItem();

      instance.setTabIndex(1);
      instance.makeFocusable();

      expect(instance.$element().attr('tabindex')).toBe('1');
    });

    it('should focus on element when focus method is called', async () => {
      const instance = await createViewItem();

      instance.focus();

      expect(document.activeElement).toBe(instance.$element().get(0));
    });

    it('should call onFocusIn callback on focus', async () => {
      const onFocusIn = jest.fn();

      const instance = await createViewItem({ onFocusIn });

      instance.focus();

      expect(onFocusIn).toHaveBeenCalled();
      expect(instance.$element().attr('tabindex')).toBe('0');
      expect(instance.$element().hasClass('dx-state-focused')).toBe(true);
    });

    it('should call onFocusOut callback on blur', async () => {
      const onFocusOut = jest.fn();

      const instance = await createViewItem({ onFocusOut });

      instance.focus();
      (instance.$element().get(0) as HTMLElement).blur();

      expect(onFocusOut).toHaveBeenCalled();
      expect(instance.$element().attr('tabindex')).toBe('-1');
      expect(instance.$element().hasClass('dx-state-focused')).toBe(false);
    });

    it('should be focusable after click', async () => {
      const instance = await createViewItem({ tabIndex: 1 });

      const element = instance.$element().get(0) as HTMLElement;

      element.click();

      expect(element.getAttribute('tabindex')).toBe('1');
      expect(element.classList.contains('dx-state-focused')).toBe(true);
      expect(document.activeElement).toBe(element);
    });

    it('should have correct tabindex after setTabIndex(-1) when being focused', async () => {
      const instance = await createViewItem({ tabIndex: 1 });

      instance.focus();
      instance.setTabIndex(-1);

      expect(instance.$element().attr('tabindex')).toBe('-1');
    });
  });

  describe('Key down', () => {
    it('should call onKeyDown callback on enter key press', async () => {
      const onKeyDown = jest.fn();

      const instance = await createViewItem({ onKeyDown });

      instance.focus();
      instance.$element().get(0)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }), 0);
    });
  });
});
