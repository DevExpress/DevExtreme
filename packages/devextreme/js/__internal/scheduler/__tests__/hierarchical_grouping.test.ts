import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import type { Appointment, Properties } from '@js/ui/scheduler';
import { hierarchicalRoomsConfigMock } from '@ts/scheduler/__mock__/resource_manager.mock';
import type Scheduler from '@ts/scheduler/scheduler';
import type ViewDataProvider from '@ts/scheduler/workspaces/view_model/view_data_provider';

import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_HEIGHT, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';
import type { SchedulerModel } from './__mock__/model/scheduler';

// A 3 hour day with a 60 min cellDuration makes every leaf group 3 rows tall
const ROWS_IN_GROUP = 3;
const GROUP_HEIGHT = ROWS_IN_GROUP * DEFAULT_CELL_HEIGHT;

const createAppointment = (text: string, roomId: unknown): Appointment => ({
  text,
  roomId,
  startDate: new Date(2015, 1, 9, 9),
  endDate: new Date(2015, 1, 9, 10),
} as Appointment);

const getViewDataProvider = (scheduler: Scheduler): ViewDataProvider => (
  (scheduler as unknown as { _workSpace: { viewDataProvider: ViewDataProvider } })._workSpace
    .viewDataProvider
);

const getGroupCount = (scheduler: Scheduler): number => (
  (scheduler as unknown as { resourceManager: { groupCount: () => number } })
    .resourceManager.groupCount()
);

const createHierarchicalScheduler = (
  dataSource: Appointment[] = [],
): ReturnType<typeof createScheduler> => createScheduler({
  currentView: 'day',
  views: [{ type: 'day', groupOrientation: 'vertical' }],
  currentDate: new Date(2015, 1, 9),
  startDayHour: 9,
  endDayHour: 12,
  cellDuration: 60,
  showAllDayPanel: false,
  groups: ['roomId'],
  resources: [{ ...hierarchicalRoomsConfigMock }] as unknown as Properties['resources'],
  dataSource,
  height: 1200,
});

const getAppointmentTops = (POM: SchedulerModel): Record<string, number> => POM
  .getAppointments()
  .reduce<Record<string, number>>((result, appointment) => {
    result[appointment.getText()] = appointment.getGeometry().top;
    return result;
  }, {});

describe('Hierarchical grouping', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    const $scheduler = $('.dx-scheduler');
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    fx.off = false;
  });

  it('should create one contiguous group band per hierarchy leaf, parents excluded', async () => {
    const { scheduler } = await createHierarchicalScheduler();
    const viewDataProvider = getViewDataProvider(scheduler);

    expect(getGroupCount(scheduler)).toBe(4);
    expect([0, 1, 2, 3].map((groupIndex) => viewDataProvider.getCellsGroup(groupIndex))).toEqual([
      { roomId: 11 },
      { roomId: 12 },
      { roomId: 21 },
      { roomId: 'solo' },
    ]);

    expect([0, 1, 2, 3].map(
      (groupIndex) => viewDataProvider.getRowCountInGroup(groupIndex),
    )).toEqual([ROWS_IN_GROUP, ROWS_IN_GROUP, ROWS_IN_GROUP, ROWS_IN_GROUP]);

    expect([0, 1, 2, 3].map(
      (groupIndex) => viewDataProvider.getLastGroupCellPosition(groupIndex),
    )).toEqual([
      { rowIndex: 2, columnIndex: 0 },
      { rowIndex: 5, columnIndex: 0 },
      { rowIndex: 8, columnIndex: 0 },
      { rowIndex: 11, columnIndex: 0 },
    ]);

    expect(document.querySelectorAll('.dx-scheduler-date-table-row')).toHaveLength(12);
  });

  it('should render an appointment in the band of its own leaf', async () => {
    const { POM } = await createHierarchicalScheduler([
      createAppointment('Room 11', 11),
      createAppointment('Room 12', 12),
      createAppointment('Room 21', 21),
      createAppointment('Solo room', 'solo'),
    ]);

    expect(getAppointmentTops(POM)).toEqual({
      'Room 11': 0,
      'Room 12': GROUP_HEIGHT,
      'Room 21': GROUP_HEIGHT * 2,
      'Solo room': GROUP_HEIGHT * 3,
    });
  });

  it('should not render an appointment bound to a parent id', async () => {
    const { POM } = await createHierarchicalScheduler([
      createAppointment('Board rooms', 'board'),
      createAppointment('Room 21', 21),
    ]);

    expect(POM.getAppointments().map((appointment) => appointment.getText()))
      .toEqual(['Room 21']);
  });

  it('should render an allowMultiple appointment in each of its leaf bands', async () => {
    const { POM } = await createScheduler({
      currentView: 'day',
      views: [{ type: 'day', groupOrientation: 'vertical' }],
      currentDate: new Date(2015, 1, 9),
      startDayHour: 9,
      endDayHour: 12,
      cellDuration: 60,
      showAllDayPanel: false,
      groups: ['roomId'],
      resources: [{
        ...hierarchicalRoomsConfigMock,
        allowMultiple: true,
      }] as unknown as Properties['resources'],
      dataSource: [createAppointment('Shared', [12, 'solo'])],
      height: 1200,
    });

    expect(POM.getAppointments().map((appointment) => appointment.getGeometry().top))
      .toEqual([GROUP_HEIGHT, GROUP_HEIGHT * 3]);
  });
});
