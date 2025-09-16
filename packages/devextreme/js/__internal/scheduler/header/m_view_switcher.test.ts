import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import messageLocalization from '@js/common/core/localization/message';

import type { SchedulerHeader } from './m_header';
import { getDropDownViewSwitcher, getTabViewSwitcher } from './m_view_switcher';

jest.mock('@js/common/core/localization/message', () => ({
  format: jest.fn(),
}));

const mockSchedulerHeader = {
  option: jest.fn(),
  _updateCurrentView: jest.fn(),
  _addEvent: jest.fn(),
} as unknown as SchedulerHeader;

const mockMessageLocalization = messageLocalization as jest.Mocked<typeof messageLocalization>;

describe('m_view_switcher localization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('localization change', () => {
    it('should update view names when locale changes from English to Russian', () => {
      mockMessageLocalization.format.mockImplementation((key) => {
        const localizationMap: Record<string, string> = {
          'dxScheduler-switcherDay': 'Day',
          'dxScheduler-switcherWeek': 'Week',
          'dxScheduler-switcherMonth': 'Month',
        };
        return localizationMap[key];
      });

      const views = [
        { type: 'day', name: 'Day' },
        { type: 'week', name: 'Week' },
        { type: 'month', name: 'Month' },
      ];

      (mockSchedulerHeader.option as jest.Mock).mockImplementation((option) => {
        if (option === 'views') return views;
        if (option === 'currentView') return { type: 'day', name: 'Day' };
        return undefined;
      });

      const englishResult = getTabViewSwitcher(mockSchedulerHeader, {});

      expect(englishResult.options.items).toEqual([
        { type: 'day', name: 'Day', text: 'Day' },
        { type: 'week', name: 'Week', text: 'Week' },
        { type: 'month', name: 'Month', text: 'Month' },
      ]);

      mockMessageLocalization.format.mockImplementation((key) => {
        const localizationMap: Record<string, string> = {
          'dxScheduler-switcherDay': 'Day (RU)',
          'dxScheduler-switcherWeek': 'Week (RU)',
          'dxScheduler-switcherMonth': 'Month (RU)',
        };
        return localizationMap[key];
      });

      const ruLocaleResult = getTabViewSwitcher(mockSchedulerHeader, {});

      expect(ruLocaleResult.options.items).toEqual([
        { type: 'day', name: 'Day', text: 'Day' },
        { type: 'week', name: 'Week', text: 'Week' },
        { type: 'month', name: 'Month', text: 'Month' },
      ]);
    });

    it('should work with dropdown view switcher localization', () => {
      mockMessageLocalization.format.mockImplementation((key) => {
        const localizationMap: Record<string, string> = {
          'dxScheduler-switcherDay': 'Day',
          'dxScheduler-switcherWeek': 'Week',
        };
        return localizationMap[key];
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

      mockMessageLocalization.format.mockImplementation((key) => {
        const localizationMap: Record<string, string> = {
          'dxScheduler-switcherDay': 'Day (RU)',
          'dxScheduler-switcherWeek': 'Week (RU)',
        };
        return localizationMap[key];
      });

      const ruLocaleResult = getDropDownViewSwitcher(mockSchedulerHeader, {});

      expect(ruLocaleResult.options.items).toEqual([
        { type: 'day', name: 'Day', text: 'Day' },
        { type: 'week', name: 'Week', text: 'Week' },
      ]);
    });
  });
});
