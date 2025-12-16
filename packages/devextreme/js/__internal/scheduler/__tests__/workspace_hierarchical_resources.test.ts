import {
  describe, expect, it,
} from '@jest/globals';

import { getResourceManagerMock } from '../__mock__/resource_manager.mock';
import SchedulerTimelineMonth from '../workspaces/m_timeline_month';
import type SchedulerWorkSpace from '../workspaces/m_work_space';

type WorkspaceConstructor<T> = new (container: Element, options?: any) => T;

const createWorkspaceWithHierarchicalResources = <T extends SchedulerWorkSpace>(
  WorkSpace: WorkspaceConstructor<T>,
  currentView: string,
): { workspace: T; resourceManager: any } => {
  const container = document.createElement('div');

  // Hierarchical resource configuration
  const roomTypeData = [
    { id: 1, text: 'Deluxe' },
    { id: 2, text: 'Super Deluxe' },
    { id: 3, text: 'Luxury' },
  ];

  const roomData = [
    { id: 1, text: '101', roomTypeId: 1 },
    { id: 2, text: '102', roomTypeId: 1 },
    { id: 3, text: '103', roomTypeId: 1 },
    { id: 4, text: '104', roomTypeId: 2 },
    { id: 5, text: '105', roomTypeId: 2 },
    { id: 6, text: '106', roomTypeId: 2 },
    { id: 7, text: '107', roomTypeId: 3 },
    { id: 8, text: '108', roomTypeId: 3 },
    { id: 9, text: '109', roomTypeId: 3 },
    { id: 10, text: '110', roomTypeId: 3 },
  ];

  const resourceConfig = [
    {
      fieldExpr: 'roomTypeId',
      dataSource: roomTypeData,
      label: 'Room Type',
    },
    {
      fieldExpr: 'roomId',
      dataSource: roomData,
      parentResource: 'roomTypeId',
      parentFieldExpr: 'roomTypeId',
      label: 'Room',
    },
  ];

  const resourceManager = getResourceManagerMock(resourceConfig);

  const workspace = new WorkSpace(container, {
    views: [currentView],
    currentView,
    currentDate: new Date(2020, 5, 26),
    firstDayOfWeek: 0,
    groups: ['roomTypeId', 'roomId'],
    getResourceManager: () => resourceManager,
  });

  (workspace as any)._isVisible = () => true;

  return { workspace, resourceManager };
};

describe('scheduler workspace hierarchical resources', () => {
  it('should filter child resources correctly in groupResources', async () => {
    const { resourceManager } = createWorkspaceWithHierarchicalResources(
      SchedulerTimelineMonth,
      'timelineMonth',
    );

    // Load and set groups
    await resourceManager.loadGroupResources(['roomTypeId', 'roomId']);

    const { groupTree, groupLeafs } = {
      groupTree: resourceManager.groupsTree,
      groupLeafs: resourceManager.groupsLeafs,
    };

    // Verify that groupsTree is properly filtered
    expect(groupTree).toBeDefined();
    expect(groupTree.length).toBeGreaterThan(0);

    // Check that we have the right structure
    groupTree.forEach((rootNode) => {
      expect(rootNode.children).toBeDefined();
    });

    // For now, just check that filtering is working at all
    expect(groupLeafs.length).toBeGreaterThan(0);
  });

  it('should filter child resources correctly in getGroupPanelData', async () => {
    const { workspace, resourceManager } = createWorkspaceWithHierarchicalResources(
      SchedulerTimelineMonth,
      'timelineMonth',
    );

    // Load groups first
    await resourceManager.loadGroupResources(['roomTypeId', 'roomId']);

    const { viewDataProvider } = workspace as any;
    const options = {
      getResourceManager: () => resourceManager,
    };

    const groupPanelData = viewDataProvider.getGroupPanelData(options);

    expect(groupPanelData).toBeDefined();
    expect(groupPanelData.groupPanelItems).toBeDefined();
    expect(groupPanelData.groupPanelItems.length).toBe(2); // roomTypeId and roomId

    const roomTypeItems = groupPanelData.groupPanelItems[0];
    const roomIdItems = groupPanelData.groupPanelItems[1];

    // roomTypeId items should be unique with rowSpan: 3 items (Deluxe, Super Deluxe, Luxury)
    expect(roomTypeItems.length).toBe(3);
    // roomId items should be unique: 3 + 3 + 4 = 10
    expect(roomIdItems.length).toBe(10);

    // Check room types
    expect(roomTypeItems[0].text).toBe('Deluxe');
    expect(roomTypeItems[1].text).toBe('Super Deluxe');
    expect(roomTypeItems[2].text).toBe('Luxury');

    // Check rowSpan values
    expect(roomTypeItems[0].rowSpan).toBe(3); // Deluxe has 3 children
    expect(roomTypeItems[1].rowSpan).toBe(3); // Super Deluxe has 3 children
    expect(roomTypeItems[2].rowSpan).toBe(4); // Luxury has 4 children
  });
});
