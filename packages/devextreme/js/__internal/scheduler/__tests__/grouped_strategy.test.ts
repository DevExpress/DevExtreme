import {
  describe, expect, it,
} from '@jest/globals';

import type { WorkspaceGroupedStrategyConfig } from '../workspaces/types';
import HorizontalGroupedStrategy from '../workspaces/work_space_grouped_strategy_horizontal';
import VerticalGroupedStrategy from '../workspaces/work_space_grouped_strategy_vertical';

const createConfig = (
  overrides: Partial<WorkspaceGroupedStrategyConfig> = {},
): WorkspaceGroupedStrategyConfig => ({
  isGroupedByDate: () => false,
  getCellCount: () => 7,
  getGroupCount: () => 3,
  getRowCount: () => 48,
  getCellWidth: () => 75,
  getCellHeight: () => 50,
  getAllDayHeight: () => 30,
  getTimePanelWidth: () => 100,
  getGroupTableWidth: () => 60,
  getWorkSpaceWidth: () => 800,
  getWorkSpaceLeftOffset: () => 160,
  getIndicatorOffset: () => 10,
  getIndicationHeight: () => 200,
  getIndicationWidth: () => 300,
  getCellIndexByCoordinates: () => 5,
  supportAllDayRow: () => true,
  getScrollableScrollTop: () => 0,
  getScrollableContentElement: () => document.createElement('div'),
  getElement: () => document.createElement('div'),
  getHeaderPanelContainerElement: () => document.createElement('div'),
  isRtlEnabled: () => false,
  isShowAllDayPanel: () => true,
  isCrossScrollingEnabled: () => false,
  getStartDayHour: () => 0,
  getEndDayHour: () => 24,
  getHoursInterval: () => 0.5,
  getHeaderHeight: () => 40,
  ...overrides,
});

describe('HorizontalGroupedStrategy with config object', () => {
  it('should work with config interface instead of workspace', () => {
    const strategy = new HorizontalGroupedStrategy(
      createConfig({ getCellCount: () => 5, getGroupCount: () => 4 }),
    );

    const result = strategy.prepareCellIndexes({ rowIndex: 2, columnIndex: 3 }, 2);

    expect(result.columnIndex).toBe(3 + 2 * 5);
    expect(result.rowIndex).toBe(2);
  });
});

describe('VerticalGroupedStrategy with config object', () => {
  it('should work with config interface instead of workspace', () => {
    const strategy = new VerticalGroupedStrategy(createConfig({
      getRowCount: () => 10,
      supportAllDayRow: () => true,
      isShowAllDayPanel: () => true,
    }));

    const result = strategy.prepareCellIndexes({ rowIndex: 3, columnIndex: 2 }, 2, false);

    expect(result.rowIndex).toBe(3 + 2 * 10 + 2 + 1);
    expect(result.columnIndex).toBe(2);
  });
});
