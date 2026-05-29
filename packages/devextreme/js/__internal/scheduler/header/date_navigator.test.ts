import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { ToolbarItem } from '@js/ui/scheduler';

import {
  CLASS, DEFAULT_ITEMS, getDateNavigator, ITEMS_NAME,
} from './date_navigator';
import type { SchedulerHeader } from './header';

describe('getDateNavigator', () => {
  it('should return default options in case of item is empty', () => {
    expect(getDateNavigator({} as SchedulerHeader, {})).toEqual({
      location: 'before',
      name: 'dateNavigator',
      widget: 'dxButtonGroup',
      cssClass: CLASS.container,
      options: {
        stylingMode: 'contained',
        selectionMode: 'none',
        items: [
          expect.objectContaining({ key: DEFAULT_ITEMS[0] }),
          expect.objectContaining({ key: DEFAULT_ITEMS[1] }),
          expect.objectContaining({ key: DEFAULT_ITEMS[2] }),
        ],
        onItemClick: expect.any(Function),
      },
    });
  });
  it('should return replace items in correct order with custom options', () => {
    expect(getDateNavigator({} as SchedulerHeader, {
      customField: 'customField',
      options: {
        customOption: 'customOption',
        items: ['dateInterval', 'next', { key: 'customButton' }],
      },
    } as ToolbarItem)).toEqual({
      location: 'before',
      name: 'dateNavigator',
      widget: 'dxButtonGroup',
      cssClass: CLASS.container,
      customField: 'customField',
      options: {
        stylingMode: 'contained',
        selectionMode: 'none',
        customOption: 'customOption',
        items: [
          expect.objectContaining({ key: ITEMS_NAME.calendarButton }),
          expect.objectContaining({ key: ITEMS_NAME.nextButton }),
          expect.objectContaining({ key: 'customButton' }),
        ],
        onItemClick: expect.any(Function),
      },
    });
  });
  it('should handle default and custom click callback', () => {
    const customClick = jest.fn();
    const event = { itemData: { clickHandler: jest.fn() } };
    const config = getDateNavigator({} as SchedulerHeader, {
      options: { onItemClick: customClick },
    });

    config.options.onItemClick(event);

    expect(customClick).toHaveBeenCalledWith(event);
    expect(event.itemData.clickHandler).toHaveBeenCalledWith(event);
    expect(config).toEqual({
      location: 'before',
      name: 'dateNavigator',
      widget: 'dxButtonGroup',
      cssClass: CLASS.container,
      options: {
        stylingMode: 'contained',
        selectionMode: 'none',
        items: [
          expect.objectContaining({ key: DEFAULT_ITEMS[0] }),
          expect.objectContaining({ key: DEFAULT_ITEMS[1] }),
          expect.objectContaining({ key: DEFAULT_ITEMS[2] }),
        ],
        onItemClick: expect.any(Function),
      },
    });
  });
});
