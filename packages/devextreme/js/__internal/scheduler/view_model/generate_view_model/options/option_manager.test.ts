import {
  describe, expect, it, jest,
} from '@jest/globals';
import type Scheduler from '@ts/scheduler/m_scheduler';
import type { DOMMetaData } from '@ts/scheduler/types';

import type { CollectorCSS, RealSize } from '../steps/add_geometry/types';
import { OptionManager, type WorkspaceLayoutData } from './option_manager';

const createDOMMetaData = (
  width: number,
  height: number,
): DOMMetaData => ({
  dateTableCellsMeta: [[{
    top: 0, left: 0, width, height,
  }]],
  allDayPanelCellsMeta: [],
});

const createCollectorCSS = (): CollectorCSS => ({
  width: '12px',
  height: '13px',
  marginLeft: '2px',
  marginRight: '3px',
  marginTop: '4px',
  marginBottom: '5px',
});

const viewOptions = new Map<string, unknown>([
  ['allDayPanelMode', 'hidden'],
  ['cellDuration', 30],
  ['groupByDate', false],
  ['hiddenWeekDays', []],
  ['maxAppointmentsPerCell', 2],
  ['showAllDayPanel', false],
  ['snapToCellsMode', undefined],
  ['startDayHour', 0],
  ['endDayHour', 24],
]);

const schedulerOptions = new Map<string, unknown>([
  ['adaptivityEnabled', false],
  ['rtlEnabled', false],
]);

const createSchedulerStore = (workspace: unknown): Scheduler => ({
  currentView: {
    type: 'day',
    groupOrientation: 'vertical',
    skippedDays: [],
  },
  resourceManager: {
    groupCount: () => 2,
  },
  getViewOffsetMs: () => 0,
  getViewOption: (name: string) => viewOptions.get(name),
  option: (name: string) => schedulerOptions.get(name),
  isVirtualScrolling: () => false,
  getWorkSpace: () => workspace,
}) as unknown as Scheduler;

describe('OptionManager', () => {
  it('should use injected layout data for geometry options', () => {
    const workspace = {
      getDateRange: (): Date[] => [new Date(2025, 0, 1), new Date(2025, 0, 2)],
      getPanelDOMSize: jest.fn((): never => { throw new Error('Unexpected workspace size measure'); }),
      getCollectorDimension: jest.fn((): never => { throw new Error('Unexpected workspace collector measure'); }),
      getDOMElementsMetaData: jest.fn((): never => { throw new Error('Unexpected workspace metadata measure'); }),
    };
    const layoutData: WorkspaceLayoutData = {
      getPanelDOMSize: (): RealSize => ({ width: 500, height: 600 }),
      getCollectorDimension: (): CollectorCSS => createCollectorCSS(),
      getDOMElementsMetaData: (): DOMMetaData => createDOMMetaData(110, 40),
      getGroupHeights: (): number[] => [100, 200],
    };
    const optionManager = new OptionManager(createSchedulerStore(workspace), layoutData);

    const result = optionManager.getGeometryOptions('regularPanel');

    expect(result.panelSize).toEqual({ width: 500, height: 600 });
    expect(result.cellSize).toEqual({ width: 110, height: 40 });
    expect(result.collectorSize).toEqual({ width: 20, height: 20 });
    expect(result.groupHeights).toEqual([100, 200]);
  });

  it('should use workspace layout data when injected layout data is not specified', () => {
    const workspace = {
      getDateRange: (): Date[] => [new Date(2025, 0, 1), new Date(2025, 0, 2)],
      getPanelDOMSize: (): RealSize => ({ width: 300, height: 400 }),
      getCollectorDimension: (): CollectorCSS => createCollectorCSS(),
      getDOMElementsMetaData: (): DOMMetaData => createDOMMetaData(120, 50),
    };
    const optionManager = new OptionManager(createSchedulerStore(workspace));

    const result = optionManager.getGeometryOptions('regularPanel');

    expect(result.panelSize).toEqual({ width: 300, height: 400 });
    expect(result.cellSize).toEqual({ width: 120, height: 50 });
    expect(result.collectorSize).toEqual({ width: 20, height: 20 });
    expect(result.groupHeights).toBeUndefined();
  });
});
