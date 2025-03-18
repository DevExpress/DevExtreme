import {
  describe, expect, it, jest,
} from '@jest/globals';

import {
  CALENDAR_BUTTON_NAME, DATE_NAVIGATOR_CLASS, DEFAULT_ITEMS, NEXT_BUTTON_NAME,
} from './constants';
import { getDateNavigator } from './m_date_navigator';

describe('getDateNavigator', () => {
  it('should return default options in case of item is empty', () => {
    expect(getDateNavigator({} as any, {})).toEqual({
      widget: 'dxButtonGroup',
      cssClass: DATE_NAVIGATOR_CLASS,
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
    expect(getDateNavigator({} as any, {
      customField: 'customField',
      options: {
        customOption: 'customOption',
        items: ['dateInterval', 'next', { key: 'customButton' }],
      },
    })).toEqual({
      widget: 'dxButtonGroup',
      cssClass: DATE_NAVIGATOR_CLASS,
      customField: 'customField',
      options: {
        stylingMode: 'contained',
        selectionMode: 'none',
        customOption: 'customOption',
        items: [
          expect.objectContaining({ key: CALENDAR_BUTTON_NAME }),
          expect.objectContaining({ key: NEXT_BUTTON_NAME }),
          expect.objectContaining({ key: 'customButton' }),
        ],
        onItemClick: expect.any(Function),
      },
    });
  });
  it('should handle default and custom click callback', () => {
    const customClick = jest.fn();
    const event = { itemData: { clickHandler: jest.fn() } };
    const config = getDateNavigator({} as any, {
      options: { onItemClick: customClick },
    });

    config.options.onItemClick(event);

    expect(customClick).toHaveBeenCalledWith(event);
    expect(event.itemData.clickHandler).toHaveBeenCalledWith(event);
    expect(config).toEqual({
      widget: 'dxButtonGroup',
      cssClass: DATE_NAVIGATOR_CLASS,
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
