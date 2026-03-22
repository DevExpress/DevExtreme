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
  viewDataProvider: { getCellData: jest.fn() },
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
