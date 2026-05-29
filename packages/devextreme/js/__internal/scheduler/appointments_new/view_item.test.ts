import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import fx from '@ts/common/core/animation/fx';

import { createAppointmentCollector, getAppointmentCollectorProperties } from './__mock__/appointment_collector';
import { createBaseAppointment, getBaseAppointmentViewProperties } from './__mock__/base_appointment_view';
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
    it('should have correct tabindex at init', async () => {
      const instance = await createViewItem({ tabIndex: -1 });

      expect(instance.$element().attr('tabindex')).toBe('-1');
    });

    it('should set tabindex attr on setTabIndex', async () => {
      const instance = await createViewItem({ tabIndex: 2 });

      instance.setTabIndex(2);

      expect(instance.$element().attr('tabindex')).toBe('2');
    });

    it('should have correct tabindex after setTabIndex(-1) when being focused', async () => {
      const instance = await createViewItem({ tabIndex: 1 });

      (instance.$element().get(0) as HTMLElement).focus();
      instance.setTabIndex(-1);

      expect(instance.$element().attr('tabindex')).toBe('-1');
    });

    it('should have dx-state-focused class on focus', async () => {
      const instance = await createViewItem({ tabIndex: 0 });

      (instance.$element().get(0) as HTMLElement).focus();

      expect(instance.$element().hasClass('dx-state-focused')).toBe(true);
    });

    it('should not have dx-state-focused class at init', async () => {
      const instance = await createViewItem({ tabIndex: 0 });

      expect(instance.$element().hasClass('dx-state-focused')).not.toBe(true);
    });

    it('should not have dx-state-focused class after unfocus', async () => {
      const instance = await createViewItem({ tabIndex: 0 });

      const element = instance.$element().get(0) as HTMLElement;
      element.focus();
      element.blur();

      expect(instance.$element().hasClass('dx-state-focused')).not.toBe(true);
    });
  });

  describe('Callbacks', () => {
    it('should call onFocusIn callback on focus', async () => {
      const onFocusIn = jest.fn();

      const instance = await createViewItem({ onFocusIn, tabIndex: 0 });

      (instance.$element().get(0) as HTMLElement).focus();

      expect(onFocusIn).toHaveBeenCalled();
    });

    it('should call onFocusOut callback on blur', async () => {
      const onFocusOut = jest.fn();

      const instance = await createViewItem({ onFocusOut, tabIndex: 0 });

      const element = instance.$element().get(0) as HTMLElement;
      element.focus();
      element.blur();

      expect(onFocusOut).toHaveBeenCalled();
    });

    it('should call onKeyDown callback on enter key press', async () => {
      const onKeyDown = jest.fn();

      const instance = await createViewItem({ onKeyDown, tabIndex: 0 });

      const element = instance.$element().get(0) as HTMLElement;
      element.click();
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(onKeyDown).toHaveBeenCalledWith(instance, expect.objectContaining({ key: 'Enter' }));
    });
  });
});
