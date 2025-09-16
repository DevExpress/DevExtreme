import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import { getViewDisplayName } from '../utils/options/utils';
import type { SchedulerHeader } from './m_header';
import { getDropDownViewSwitcher, getTabViewSwitcher } from './m_view_switcher';

jest.mock('../utils/options/utils', () => ({
  getViewDisplayName: jest.fn(),
}));

const mockSchedulerHeader = {
  option: jest.fn(),
  _updateCurrentView: jest.fn(),
  _addEvent: jest.fn(),
} as unknown as SchedulerHeader;

const mockGetViewDisplayName = getViewDisplayName as jest.MockedFunction<typeof getViewDisplayName>;

describe('m_view_switcher localization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('localization change', () => {
    it('should update view names when locale changes from English to Russian', () => {
      mockGetViewDisplayName.mockImplementation((view) => {
        const viewMap: Record<string, string> = {
          day: 'Day',
          week: 'Week',
          month: 'Month',
        };
        return viewMap[view.type] || view.type;
      });

      const views = [
        { type: 'day', name: 'Day' },
        { type: 'week', name: 'Week' },
        { type: 'month', name: 'Month' },
      ];

      (mockSchedulerHeader.option as jest.Mock).mockImplementation((option) => {
        if (option === 'views') return views;
        if (option === 'currentView') return 'day';
        return undefined;
      });

      const englishResult = getTabViewSwitcher(mockSchedulerHeader, {});

      expect(englishResult.options.items).toEqual([
        { type: 'day', name: 'Day', text: 'Day' },
        { type: 'week', name: 'Week', text: 'Week' },
        { type: 'month', name: 'Month', text: 'Month' },
      ]);

      mockGetViewDisplayName.mockImplementation((view) => {
        const viewMap: Record<string, string> = {
          day: 'Den', // Day in Russian (transliterated)
          week: 'Nedelya', // Week in Russian (transliterated)
          month: 'Mesyats', // Month in Russian (transliterated)
        };
        return viewMap[view.type] || view.type;
      });

      const ruLocaleResult = getTabViewSwitcher(mockSchedulerHeader, {});

      expect(ruLocaleResult.options.items).toEqual([
        { type: 'day', name: 'Day', text: 'Den' },
        { type: 'week', name: 'Week', text: 'Nedelya' },
        { type: 'month', name: 'Month', text: 'Mesyats' },
      ]);
    });

    it('should work with dropdown view switcher localization', () => {
      mockGetViewDisplayName.mockImplementation((view) => {
        const viewMap: Record<string, string> = {
          day: 'Day',
          week: 'Week',
        };
        return viewMap[view.type] || view.type;
      });

      const views = [
        { type: 'day', name: 'Day' },
        { type: 'week', name: 'Week' },
      ];

      (mockSchedulerHeader.option as jest.Mock).mockImplementation((option) => {
        if (option === 'views') return views;
        if (option === 'currentView') return { type: 'day', name: 'Day' };
        return undefined;
      });

      const englishResult = getDropDownViewSwitcher(mockSchedulerHeader, {});

      expect(englishResult.options.items).toEqual([
        { type: 'day', name: 'Day', text: 'Day' },
        { type: 'week', name: 'Week', text: 'Week' },
      ]);

      mockGetViewDisplayName.mockImplementation((view) => {
        const viewMap: Record<string, string> = {
          day: 'Den',
          week: 'Nedelya',
        };
        return viewMap[view.type] || view.type;
      });

      const ruLocaleResult = getDropDownViewSwitcher(mockSchedulerHeader, {});

      expect(ruLocaleResult.options.items).toEqual([
        { type: 'day', name: 'Day', text: 'Den' },
        { type: 'week', name: 'Week', text: 'Nedelya' },
      ]);
    });
  });
});
