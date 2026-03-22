import { WorkspaceScale } from './scale';

const createMockWorkspace = (overrides: Record<string, unknown> = {}) => ({
  positionHelper: {
    getResizableStep: jest.fn(() => 42),
  },
  getDOMElementsMetaData: jest.fn(() => ({
    dateTableCellsMeta: [[{
      left: 0, top: 0, width: 100, height: 50,
    }]],
    allDayPanelCellsMeta: [{
      left: 0, top: 0, width: 100, height: 30,
    }],
  })),
  viewDataProvider: {
    getCellData: jest.fn((rowIndex: number, columnIndex: number) => ({
      startDate: new Date(2024, 0, 1 + columnIndex),
      endDate: new Date(2024, 0, 2 + columnIndex),
      index: rowIndex * 7 + columnIndex,
    })),
  },
  isVerticalGroupedWorkSpace: jest.fn(() => false),
  type: 'day' as const,
  ...overrides,
});

describe('WorkspaceScale', () => {
  describe('getResizableStep', () => {
    it('should delegate to workspace positionHelper', () => {
      const workspace = createMockWorkspace();
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.getResizableStep()).toBe(42);
      expect(workspace.positionHelper.getResizableStep).toHaveBeenCalled();
    });

    it('should return 0 when workspace is undefined', () => {
      const scale = new WorkspaceScale(() => undefined);

      expect(scale.getResizableStep()).toBe(0);
    });
  });

  describe('getDOMElementsMetaData', () => {
    it('should delegate to workspace', () => {
      const workspace = createMockWorkspace();
      const scale = new WorkspaceScale(() => workspace);

      const meta = scale.getDOMElementsMetaData();

      expect(meta).toEqual({
        dateTableCellsMeta: [[{
          left: 0, top: 0, width: 100, height: 50,
        }]],
        allDayPanelCellsMeta: [{
          left: 0, top: 0, width: 100, height: 30,
        }],
      });
      expect(workspace.getDOMElementsMetaData).toHaveBeenCalled();
    });

    it('should return undefined when workspace is undefined', () => {
      const scale = new WorkspaceScale(() => undefined);

      expect(scale.getDOMElementsMetaData()).toBeUndefined();
    });
  });

  describe('viewDataProvider', () => {
    it('should return workspace viewDataProvider', () => {
      const workspace = createMockWorkspace();
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.viewDataProvider).toBe(workspace.viewDataProvider);
    });

    it('should return undefined when workspace is undefined', () => {
      const scale = new WorkspaceScale(() => undefined);

      expect(scale.viewDataProvider).toBeUndefined();
    });
  });

  describe('getCellDateInfo', () => {
    it('should return startDate, endDate, and index from viewDataProvider', () => {
      const workspace = createMockWorkspace();
      const scale = new WorkspaceScale(() => workspace);

      const info = scale.getCellDateInfo(0, 2, false, false);

      expect(info).toEqual({
        startDate: new Date(2024, 0, 3),
        endDate: new Date(2024, 0, 4),
        index: 2,
      });
      expect(workspace.viewDataProvider.getCellData).toHaveBeenCalledWith(0, 2, false, false);
    });

    it('should pass isAllDay and rtlEnabled to viewDataProvider', () => {
      const workspace = createMockWorkspace();
      const scale = new WorkspaceScale(() => workspace);

      scale.getCellDateInfo(1, 3, true, true);

      expect(workspace.viewDataProvider.getCellData).toHaveBeenCalledWith(1, 3, true, true);
    });

    it('should return undefined when workspace is undefined', () => {
      const scale = new WorkspaceScale(() => undefined);

      expect(scale.getCellDateInfo(0, 0, false, false)).toBeUndefined();
    });
  });

  describe('getCellGeometry', () => {
    it('should return cellWidth, cellHeight, cellCountInRow from dateTable', () => {
      const workspace = createMockWorkspace({
        getDOMElementsMetaData: jest.fn(() => ({
          dateTableCellsMeta: [[
            {
              left: 0, top: 0, width: 120, height: 60,
            },
            {
              left: 120, top: 0, width: 120, height: 60,
            },
          ]],
          allDayPanelCellsMeta: [{
            left: 0, top: 0, width: 120, height: 30,
          }],
        })),
      });
      const scale = new WorkspaceScale(() => workspace);

      const geometry = scale.getCellGeometry(0, 0, false);

      expect(geometry).toEqual({
        cellWidth: 120,
        cellHeight: 60,
        cellCountInRow: 2,
      });
    });

    it('should use allDayPanelCellsMeta when isAllDay and not vertical grouped', () => {
      const workspace = createMockWorkspace({
        getDOMElementsMetaData: jest.fn(() => ({
          dateTableCellsMeta: [[{
            left: 0, top: 0, width: 100, height: 50,
          }]],
          allDayPanelCellsMeta: [
            {
              left: 0, top: 0, width: 200, height: 40,
            },
            {
              left: 200, top: 0, width: 200, height: 40,
            },
          ],
        })),
        isVerticalGroupedWorkSpace: jest.fn(() => false),
      });
      const scale = new WorkspaceScale(() => workspace);

      const geometry = scale.getCellGeometry(0, 1, true);

      expect(geometry).toEqual({
        cellWidth: 200,
        cellHeight: 40,
        cellCountInRow: 2,
      });
    });

    it('should use dateTableCellsMeta when isAllDay but vertical grouped', () => {
      const workspace = createMockWorkspace({
        isVerticalGroupedWorkSpace: jest.fn(() => true),
      });
      const scale = new WorkspaceScale(() => workspace);

      const geometry = scale.getCellGeometry(0, 0, true);

      expect(geometry).toEqual({
        cellWidth: 100,
        cellHeight: 50,
        cellCountInRow: 1,
      });
    });

    it('should return undefined when workspace is undefined', () => {
      const scale = new WorkspaceScale(() => undefined);

      expect(scale.getCellGeometry(0, 0, false)).toBeUndefined();
    });
  });

  describe('isVerticalGroupedWorkSpace', () => {
    it('should delegate to workspace', () => {
      const workspace = createMockWorkspace({
        isVerticalGroupedWorkSpace: jest.fn(() => true),
      });
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.isVerticalGroupedWorkSpace()).toBe(true);
    });

    it('should return false for non-vertical grouping', () => {
      const workspace = createMockWorkspace();
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.isVerticalGroupedWorkSpace()).toBe(false);
    });
  });

  describe('isDateAndTimeView', () => {
    it('should return true for day view', () => {
      const workspace = createMockWorkspace({ type: 'day' });
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.isDateAndTimeView()).toBe(true);
    });

    it('should return false for month view', () => {
      const workspace = createMockWorkspace({ type: 'month' });
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.isDateAndTimeView()).toBe(false);
    });

    it('should return false for timelineMonth view', () => {
      const workspace = createMockWorkspace({ type: 'timelineMonth' });
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.isDateAndTimeView()).toBe(false);
    });

    it('should return true for week view', () => {
      const workspace = createMockWorkspace({ type: 'week' });
      const scale = new WorkspaceScale(() => workspace);

      expect(scale.isDateAndTimeView()).toBe(true);
    });
  });

  describe('workspace replacement', () => {
    it('should follow workspace getter to current workspace', () => {
      const workspaceA = createMockWorkspace({
        positionHelper: { getResizableStep: jest.fn(() => 10) },
      });
      const workspaceB = createMockWorkspace({
        positionHelper: { getResizableStep: jest.fn(() => 20) },
      });

      let current: ReturnType<typeof createMockWorkspace> = workspaceA;
      const scale = new WorkspaceScale(() => current);

      expect(scale.getResizableStep()).toBe(10);

      current = workspaceB;

      expect(scale.getResizableStep()).toBe(20);
    });
  });
});
