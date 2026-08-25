import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';

import type { GroupedStrategyConfig } from './work_space_grouped_strategy_config';
import VerticalGroupedStrategy from './work_space_grouped_strategy_vertical';

jest.mock('@ts/scheduler/r1/utils/index', (): {
  calculateDayDuration: (startDayHour: number, endDayHour: number) => number;
} => ({
  calculateDayDuration: (startDayHour: number, endDayHour: number): number => (
    endDayHour - startDayHour
  ),
}));

const createElement = ({
  height = 0,
  left = 0,
  right = 0,
  width = 0,
}: {
  height?: number;
  left?: number;
  right?: number;
  width?: number;
}): Element => ({
  getBoundingClientRect: (): DOMRect => ({
    height,
    left,
    right,
    width,
  }) as DOMRect,
}) as unknown as Element;

const createConfig = (
  options: Partial<GroupedStrategyConfig> = {},
): GroupedStrategyConfig => ({
  getRowCount: (): number => 48,
  getCellCount: (): number => 7,
  getGroupCount: (): number => 3,
  getCellHeight: (): number => 10,
  getCellWidth: (): number => 100,
  getTimePanelWidth: (): number => 50,
  getGroupTableWidth: (): number => 40,
  getAllDayHeight: (): number => 20,
  getWorkSpaceWidth: (): number => 700,
  getWorkSpaceLeftOffset: (): number => 0,
  getIndicatorOffset: (): number => 30,
  getIndicationHeight: (): number => 70,
  getIndicationWidth: (): number => 100,
  getScrollableScrollTop: (): number => 10,
  getScrollableContentElement: (): Element => createElement({ width: 800 }),
  getElement: (): Element => createElement({ width: 900 }),
  getHeaderPanelContainerElement: (): Element => createElement({ height: 20 }),
  getCellIndexByCoordinates: (): number => 0,
  supportAllDayRow: (): boolean => false,
  isGroupedByDate: (): boolean => false,
  showAllDayPanel: (): boolean => false,
  startDayHour: (): number => 0,
  endDayHour: (): number => 24,
  hoursInterval: (): number => 0.5,
  crossScrollingEnabled: (): boolean => false,
  rtlEnabled: (): boolean => false,
  getHeaderHeight: (): number => 5,
  ...options,
});

describe('VerticalGroupedStrategy', () => {
  it('should use uniform group heights when group heights are not specified', () => {
    const strategy = new VerticalGroupedStrategy(createConfig());

    expect(strategy.getGroupVerticalOffset(2)).toEqual({
      top: 2 * 480,
      height: 480,
    });
  });

  it('should use cumulative group heights for group bounds', () => {
    const strategy = new VerticalGroupedStrategy(createConfig({
      getGroupHeights: (): number[] => [100, 200, 300],
    }));

    expect(strategy.getGroupVerticalOffset(2)).toEqual({
      top: 100 + 200,
      height: 300,
    });
  });

  it('should offset group bounds by the all-day row height, not by the cell height', () => {
    const strategy = new VerticalGroupedStrategy(createConfig({
      getGroupHeights: (): number[] => [100, 200, 300],
      supportAllDayRow: (): boolean => true,
      showAllDayPanel: (): boolean => true,
    }));

    expect(strategy.getGroupVerticalOffset(2)).toEqual({
      top: 100 + 200 + 20 * 3,
      height: 300,
    });
  });

  it('should use cumulative group heights for indicator offset', () => {
    const strategy = new VerticalGroupedStrategy(createConfig({
      getGroupHeights: (): number[] => [100, 200, 300],
      supportAllDayRow: (): boolean => true,
      showAllDayPanel: (): boolean => true,
    }));
    const cssMock = jest.fn<(name: string, value?: unknown) => unknown>();
    const $indicator = { css: cssMock } as unknown as dxElementWrapper;

    strategy.shiftIndicator($indicator, 15, 0, 2);

    expect(cssMock).toHaveBeenCalledWith('left', 30 + 40);
    expect(cssMock).toHaveBeenCalledWith('top', 15 + 100 + 200 + 20 * 3);
  });

  it('should use group height for shader max height', () => {
    const strategy = new VerticalGroupedStrategy(createConfig({
      getGroupHeights: (): number[] => [100, 200],
      supportAllDayRow: (): boolean => true,
      showAllDayPanel: (): boolean => true,
    }));

    const result = strategy.getShaderMaxHeight(1);

    expect(result).toBe(200 + 10);
  });
});
