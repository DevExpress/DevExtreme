import {
  describe, expect, it,
} from '@jest/globals';
import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '@ts/scheduler/constants';

import type { GroupRenderItem, ViewType } from '../../../types';
import type { GroupNode } from '../../../utils/resource_manager/types';
import {
  getAppointmentKey,
  getCellDuration,
  getDatesWithoutTime,
  getGroupPanelData,
  getIsGroupedAllDayPanel,
  getKeyByGroup,
  getSkippedHoursInRange,
  getTimelineGroupPanelRows,
  isAppointmentTakesAllDay,
  isGroupingByDate,
  isHorizontalGroupingApplied,
  isVerticalGroupingApplied,
} from '../index';

const isWeekend = (date: Date): boolean => [0, 6].includes(date.getDay());

describe('base utils', () => {
  describe('getDatesWithoutTime', () => {
    it('should trim dates correctly', () => {
      expect(getDatesWithoutTime(
        new Date(2021, 10, 23, 11, 11),
        new Date(2021, 10, 24, 12, 12),
      )).toEqual([
        new Date(2021, 10, 23),
        new Date(2021, 10, 25),
      ]);
    });
  });

  describe('getAppointmentTakesAllDay', () => {
    describe('allDayPanelMode is all', () => {
      it('should return true if all day appointment', () => {
        const appointment = {
          allDay: true,
          startDate: new Date(2022, 0, 1, 8),
          endDate: new Date(2022, 0, 1, 12),
        };

        expect(isAppointmentTakesAllDay(appointment, 'all'))
          .toBe(true);
      });

      it('should return true if appointment takes all day', () => {
        const appointment = {
          allDay: false,
          startDate: new Date(2022, 0, 1, 8),
          endDate: new Date(2022, 0, 2, 12),
        };

        expect(isAppointmentTakesAllDay(appointment, 'all'))
          .toBe(true);
      });

      it('should return false if appointment does not take all day', () => {
        const appointment = {
          allDay: false,
          startDate: new Date(2022, 0, 1, 10),
          endDate: new Date(2022, 0, 1, 11),
        };

        expect(isAppointmentTakesAllDay(appointment, 'all'))
          .toBe(false);
      });

      it('should return false if appointment duration > view duration', () => {
        const appointment = {
          allDay: false,
          startDate: new Date(2022, 0, 1, 8),
          endDate: new Date(2022, 0, 1, 13),
        };

        expect(isAppointmentTakesAllDay(appointment, 'all'))
          .toBe(false);
      });

      [
        undefined,
        null,
      ].forEach((endDate) => {
        it(`should return false if endDate is ${endDate}`, () => {
          const appointment = {
            allDay: false,
            startDate: new Date(2022, 0, 1, 8),
            endDate,
          };

          expect(isAppointmentTakesAllDay(appointment, 'all'))
            .toBe(false);
        });
      });
    });

    describe('allDayPanelMode is hidden', () => {
      it('should return true if all day appointment', () => {
        const appointment = {
          allDay: true,
          startDate: new Date(2022, 0, 1, 8),
          endDate: new Date(2022, 0, 1, 12),
        };

        expect(isAppointmentTakesAllDay(appointment, 'hidden'))
          .toBe(false);
      });
    });

    describe('allDayPanelMode is allDay', () => {
      it('should return true if all day appointment', () => {
        const appointment = {
          allDay: true,
          startDate: new Date(2022, 0, 1, 8),
          endDate: new Date(2022, 0, 1, 12),
        };

        expect(isAppointmentTakesAllDay(appointment, 'allDay'))
          .toBe(true);
      });

      it('should return true if appointment takes all day', () => {
        const appointment = {
          allDay: false,
          startDate: new Date(2022, 0, 1, 8),
          endDate: new Date(2022, 0, 2, 12),
        };

        expect(isAppointmentTakesAllDay(appointment, 'allDay'))
          .toBe(false);
      });
    });
  });

  describe('getAppointmentKey', () => {
    const testViewModel = {
      key: '1-2-10-20',
      appointment: {
        startDate: new Date('2021-08-05T10:00:00.000Z'),
        endDate: new Date('2021-08-05T12:00:00.000Z'),
        text: 'Some text',
      },

      geometry: {
        empty: false,
        left: 1,
        top: 2,
        width: 10,
        height: 20,
        leftVirtualWidth: 1,
        topVirtualHeight: 2,
      },

      info: {
        appointment: {
          startDate: new Date('2021-08-05T10:00:00.000Z'),
          endDate: new Date('2021-08-05T12:00:00.000Z'),
        },
        sourceAppointment: {
          groupIndex: 99,
        },
        dateText: '1AM - 2PM',
        resourceColor: '#1A2BC',
      },
    };

    it('should generate correct key', () => {
      expect(getAppointmentKey(testViewModel.geometry))
        .toBe('1-2-10-20');
    });
  });

  describe('getCellDuration', () => {
    [
      ...[
        'day', 'week', 'workWeek',
        'timelineDay', 'timelineWeek', 'timelineWorkWeek',
      ].map((item) => ({
        viewType: item,
        expected: 90000000,
      })),
      {
        viewType: 'month',
        expected: 32400000,
      },
      {
        viewType: 'timelineMonth',
        expected: 86400000,
      },
    ].forEach(({ viewType, expected }) => {
      it(`should return correct result if ${viewType} view`, () => {
        expect(getCellDuration(viewType as ViewType, 9, 18, 25))
          .toEqual(expected);
      });
    });
  });

  describe('getSkippedHoursInRange', () => {
    describe('default', () => {
      it('should skip large interval', () => {
        const mockViewDataProvider = {
          isDateSkipped: (date: Date) => date.getDay() >= 6,
          getViewOptions: () => ({
            startDayHour: 0,
            endDayHour: 24,
          }),
          viewType: 'week',
        };

        const result = getSkippedHoursInRange(
          new Date(2021, 9, 8, 23, 23),
          new Date(2021, 12, 28, 18, 18),
          true,
          mockViewDataProvider as any,
        );

        expect(result)
          .toBe(384);
      });

      it('should skip 2 weekend days if startDate and endDate inside weekend', () => {
        const mockViewDataProvider = {
          isDateSkipped: (date: Date) => isWeekend(date),
          getViewOptions: () => ({
            startDayHour: 0,
            endDayHour: 24,
          }),
          viewType: 'week',
        };

        const result = getSkippedHoursInRange(
          new Date(2021, 3, 3),
          new Date(2021, 3, 4, 0, 0, 0, 1),
          true,
          mockViewDataProvider as any,
        );

        expect(result)
          .toBe(48);
      });
    });

    describe('border conditions', () => {
      const mockViewDataProvider = {
        isDateSkipped: (date: Date) => isWeekend(date),
        getViewOptions: () => ({
          startDayHour: 0,
          endDayHour: 24,
        }),
        viewType: 'week',
      };

      it('should not skip weekend if endDate at 0 border of weekend', () => {
        const result = getSkippedHoursInRange(
          new Date(2021, 3, 2),
          new Date(2021, 3, 3),
          true,
          mockViewDataProvider as any,
        );

        expect(result)
          .toBe(24);
      });

      it('should skip weekend if endDate > 0 border of weekend', () => {
        const result = getSkippedHoursInRange(
          new Date(2021, 3, 2),
          new Date(2021, 3, 3, 0, 0, 0, 1),
          true,
          mockViewDataProvider as any,
        );

        expect(result)
          .toBe(24);
      });

      it('should skip 1 weekend day if endDate is at the end of the weekend day', () => {
        const result = getSkippedHoursInRange(
          new Date(2021, 3, 2),
          new Date(2021, 3, 3, 23, 59, 59),
          true,
          mockViewDataProvider as any,
        );

        expect(result)
          .toBe(24);
      });

      it('should skip 2 weekend days if endDate is at 0 border of the first week day', () => {
        const result = getSkippedHoursInRange(
          new Date(2021, 3, 2),
          new Date(2021, 3, 5, 0, 0, 0, 1),
          true,
          mockViewDataProvider as any,
        );

        expect(result)
          .toBe(48);
      });
    });

    describe('startDayHour and endDayHour and allDay = false', () => {
      interface TestParams {
        startDate: Date;
        endDate: Date;
        startDayHour: number;
        endDayHour: number;
        expectedHours: number;
      }

      it.each<TestParams>([
        {
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 6),
          startDayHour: 0,
          endDayHour: 24,
          expectedHours: 48,
        },
        {
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 6),
          startDayHour: 7,
          endDayHour: 17,
          expectedHours: 20,
        },
        {
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 6),
          startDayHour: 0,
          endDayHour: 18,
          expectedHours: 36,
        },
        {
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 6),
          startDayHour: 8,
          endDayHour: 24,
          expectedHours: 32,
        },
        {
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 4, 13),
          startDayHour: 10,
          endDayHour: 16,
          expectedHours: 6 + 3,
        },
        {
          startDate: new Date(2024, 1, 4, 12),
          endDate: new Date(2024, 1, 6),
          startDayHour: 10,
          endDayHour: 16,
          expectedHours: 4,
        },
        {
          startDate: new Date(2024, 1, 4, 8),
          endDate: new Date(2024, 1, 6),
          startDayHour: 10,
          endDayHour: 16,
          expectedHours: 6,
        },
        {
          startDate: new Date(2024, 1, 2, 13, 0),
          endDate: new Date(2024, 1, 3, 18, 0),
          startDayHour: 12,
          endDayHour: 16,
          expectedHours: 4,
        },
      ])('should return correct number of skipped hours', ({
        startDate,
        endDate,
        expectedHours,
        startDayHour,
        endDayHour,
      }) => {
        const mockViewDataProvider = {
          isDateSkipped: (date: Date) => isWeekend(date),
          getViewOptions: () => ({
            startDayHour,
            endDayHour,
          }),
          viewType: 'week',
        };

        const result = getSkippedHoursInRange(
          startDate,
          endDate,
          false,
          mockViewDataProvider as any,
        );
        expect(result).toBe(expectedHours);
      });

      it.each<{ startDate: Date; endDate: Date; expectedHours: number }>([
        {
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 6),
          expectedHours: 16,
        },
        {
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 4),
          expectedHours: 8,
        },
        {
          startDate: new Date(2024, 1, 4),
          endDate: new Date(2024, 1, 6),
          expectedHours: 8,
        },
      ])('should return correct number of skipped hours for timeline view', ({
        startDate,
        endDate,
        expectedHours,
      }) => {
        const mockViewDataProvider = {
          isDateSkipped: (date: Date) => isWeekend(date),
          getViewOptions: () => ({
            startDayHour: 11,
            endDayHour: 19,
          }),
          viewType: 'timelineWeek',
        };

        const result = getSkippedHoursInRange(
          startDate,
          endDate,
          true,
          mockViewDataProvider as any,
        );
        expect(result).toBe(expectedHours);
      });
    });
  });

  describe('getGroupPanelData', () => {
    // group1 (2 items) x group2 (2 items), uniform 2-level tree
    const groupsTreeBase: GroupNode[] = [
      {
        id: 1,
        resourceText: 'item 1',
        color: 'color 1',
        resourceIndex: 'group1',
        grouped: { group1: 1 },
        children: [
          {
            id: 1, resourceText: 'item 3', color: 'color 3', resourceIndex: 'group2', grouped: { group1: 1, group2: 1 }, children: [],
          },
          {
            id: 2, resourceText: 'item 4', color: 'color 4', resourceIndex: 'group2', grouped: { group1: 1, group2: 2 }, children: [],
          },
        ],
      },
      {
        id: 2,
        resourceText: 'item 2',
        color: 'color 2',
        resourceIndex: 'group1',
        grouped: { group1: 2 },
        children: [
          {
            id: 1, resourceText: 'item 3', color: 'color 3', resourceIndex: 'group2', grouped: { group1: 2, group2: 1 }, children: [],
          },
          {
            id: 2, resourceText: 'item 4', color: 'color 4', resourceIndex: 'group2', grouped: { group1: 2, group2: 2 }, children: [],
          },
        ],
      },
    ];

    const renderItem = (
      id: number | string,
      text: string,
      color: string | undefined,
      key: string,
      resourceIndex: string,
      colSpan: number,
      extra: Partial<GroupRenderItem> = {},
    ): GroupRenderItem => ({
      id,
      text,
      color,
      key,
      resourceIndex,
      data: { id, text, color },
      colSpan,
      ...extra,
    });

    it('should transform a uniform-depth tree into per-depth rows with real colSpan', () => {
      const groupPanelData = getGroupPanelData(groupsTreeBase, 1, false, 3);

      expect(groupPanelData.maxDepth).toBe(2);
      expect(groupPanelData.baseColSpan).toBe(3);
      expect(groupPanelData.groupTree[0].leafCount).toBe(2);
      expect(groupPanelData.groupTree[0].children[0].leafCount).toBe(1);
      expect(groupPanelData.groupPanelItems).toEqual([
        [
          renderItem(1, 'item 1', 'color 1', 'group1_1', 'group1', 6),
          renderItem(2, 'item 2', 'color 2', 'group1_2', 'group1', 6),
        ],
        [
          renderItem(1, 'item 3', 'color 3', 'group1_1_group2_1', 'group2', 3),
          renderItem(2, 'item 4', 'color 4', 'group1_1_group2_2', 'group2', 3),
          renderItem(1, 'item 3', 'color 3', 'group1_2_group2_1', 'group2', 3),
          renderItem(2, 'item 4', 'color 4', 'group1_2_group2_2', 'group2', 3),
        ],
      ]);
    });

    it('should work for a single-level tree (maxDepth 1, no rowSpan)', () => {
      const groups: GroupNode[] = [
        {
          id: 1, resourceText: 'item 1', color: 'color 1', resourceIndex: 'group1', grouped: { group1: 1 }, children: [],
        },
        {
          id: 2, resourceText: 'item 2', color: 'color 2', resourceIndex: 'group1', grouped: { group1: 2 }, children: [],
        },
      ];
      const groupPanelData = getGroupPanelData(groups, 1, false, 5);

      expect(groupPanelData.maxDepth).toBe(1);
      expect(groupPanelData.groupPanelItems).toEqual([
        [
          renderItem(1, 'item 1', 'color 1', 'group1_1', 'group1', 5),
          renderItem(2, 'item 2', 'color 2', 'group1_2', 'group1', 5),
        ],
      ]);
    });

    it('should fill a childless (shallower) branch down via rowSpan for non-uniform depth', () => {
      const groups: GroupNode[] = [
        {
          id: 'A',
          resourceText: 'Building A',
          resourceIndex: 'buildingId',
          grouped: { buildingId: 'A' },
          children: [
            {
              id: 1, resourceText: 'Room A1', resourceIndex: 'roomId', grouped: { buildingId: 'A', roomId: 1 }, children: [],
            },
          ],
        },
        {
          id: 'B', resourceText: 'Building B', resourceIndex: 'buildingId', grouped: { buildingId: 'B' }, children: [],
        },
      ];
      const groupPanelData = getGroupPanelData(groups, 1, false, 1);

      expect(groupPanelData.maxDepth).toBe(2);
      expect(groupPanelData.groupPanelItems).toEqual([
        [
          renderItem('A', 'Building A', undefined, 'buildingId_A', 'buildingId', 1),
          renderItem('B', 'Building B', undefined, 'buildingId_B', 'buildingId', 1, { rowSpan: 2 }),
        ],
        [
          renderItem(1, 'Room A1', undefined, 'buildingId_A_roomId_1', 'roomId', 1),
        ],
      ]);
    });

    it('should transform grouping data into group items correctly when appointments are grouped by date', () => {
      const groupPanelData = getGroupPanelData(groupsTreeBase, 2, true, 7);

      expect(groupPanelData.groupPanelItems).toEqual([
        [
          renderItem(1, 'item 1', 'color 1', 'group1_1_group_by_date_0', 'group1', 14, { isFirstGroupCell: true, isLastGroupCell: false }),
          renderItem(2, 'item 2', 'color 2', 'group1_2_group_by_date_0', 'group1', 14, { isFirstGroupCell: false, isLastGroupCell: true }),
          renderItem(1, 'item 1', 'color 1', 'group1_1_group_by_date_1', 'group1', 14, { isFirstGroupCell: true, isLastGroupCell: false }),
          renderItem(2, 'item 2', 'color 2', 'group1_2_group_by_date_1', 'group1', 14, { isFirstGroupCell: false, isLastGroupCell: true }),
        ],
        [
          renderItem(1, 'item 3', 'color 3', 'group1_1_group2_1_group_by_date_0', 'group2', 7, { isFirstGroupCell: true, isLastGroupCell: false }),
          renderItem(2, 'item 4', 'color 4', 'group1_1_group2_2_group_by_date_0', 'group2', 7, { isFirstGroupCell: false, isLastGroupCell: false }),
          renderItem(1, 'item 3', 'color 3', 'group1_2_group2_1_group_by_date_0', 'group2', 7, { isFirstGroupCell: false, isLastGroupCell: false }),
          renderItem(2, 'item 4', 'color 4', 'group1_2_group2_2_group_by_date_0', 'group2', 7, { isFirstGroupCell: false, isLastGroupCell: true }),
          renderItem(1, 'item 3', 'color 3', 'group1_1_group2_1_group_by_date_1', 'group2', 7, { isFirstGroupCell: true, isLastGroupCell: false }),
          renderItem(2, 'item 4', 'color 4', 'group1_1_group2_2_group_by_date_1', 'group2', 7, { isFirstGroupCell: false, isLastGroupCell: false }),
          renderItem(1, 'item 3', 'color 3', 'group1_2_group2_1_group_by_date_1', 'group2', 7, { isFirstGroupCell: false, isLastGroupCell: false }),
          renderItem(2, 'item 4', 'color 4', 'group1_2_group2_2_group_by_date_1', 'group2', 7, { isFirstGroupCell: false, isLastGroupCell: true }),
        ],
      ]);
      expect(groupPanelData.baseColSpan).toBe(7);
    });
  });

  describe('getTimelineGroupPanelRows', () => {
    it('should keep a single stacked row for flat timeline grouping', () => {
      const groups: GroupNode[] = [
        {
          id: 0, resourceText: 'Group_0', resourceIndex: 'any', grouped: { any: 0 }, children: [],
        },
        {
          id: 1, resourceText: 'Group_1', resourceIndex: 'any', grouped: { any: 1 }, children: [],
        },
      ];
      const groupPanelData = getGroupPanelData(groups, 1, false, 3);
      const timelineRows = getTimelineGroupPanelRows(groupPanelData, false);

      expect(timelineRows).toEqual(groupPanelData.groupPanelItems);
      expect(timelineRows).toHaveLength(1);
    });

    it('should keep depth rows for multi-group cartesian timeline grouping', () => {
      const groups: GroupNode[] = [
        {
          id: 1,
          resourceText: 'item 1',
          resourceIndex: 'group1',
          grouped: { group1: 1 },
          children: [
            {
              id: 1, resourceText: 'item 3', resourceIndex: 'group2', grouped: { group1: 1, group2: 1 }, children: [],
            },
            {
              id: 2, resourceText: 'item 4', resourceIndex: 'group2', grouped: { group1: 1, group2: 2 }, children: [],
            },
          ],
        },
        {
          id: 2,
          resourceText: 'item 2',
          resourceIndex: 'group1',
          grouped: { group1: 2 },
          children: [
            {
              id: 1, resourceText: 'item 3', resourceIndex: 'group2', grouped: { group1: 2, group2: 1 }, children: [],
            },
            {
              id: 2, resourceText: 'item 4', resourceIndex: 'group2', grouped: { group1: 2, group2: 2 }, children: [],
            },
          ],
        },
      ];
      const groupPanelData = getGroupPanelData(groups, 1, false, 3, false);
      const timelineRows = getTimelineGroupPanelRows(groupPanelData, false);

      expect(timelineRows).toEqual(groupPanelData.groupPanelItems);
      expect(timelineRows).toHaveLength(2);
    });

    it('should use one row per leaf path for hierarchical timeline grouping', () => {
      const groups: GroupNode[] = [
        {
          id: 'A',
          resourceText: 'Building A',
          resourceIndex: 'buildingId',
          grouped: { buildingId: 'A' },
          children: [
            {
              id: 1, resourceText: 'Room A1', resourceIndex: 'roomId', grouped: { buildingId: 'A', roomId: 1 }, children: [],
            },
          ],
        },
        {
          id: 'B', resourceText: 'Building B', resourceIndex: 'buildingId', grouped: { buildingId: 'B' }, children: [],
        },
      ];
      const groupPanelData = getGroupPanelData(groups, 1, false, 1, true);
      const timelineRows = getTimelineGroupPanelRows(groupPanelData, false);

      expect(timelineRows).toEqual([
        [
          expect.objectContaining({ key: 'buildingId_A', text: 'Building A' }),
          expect.objectContaining({ key: 'buildingId_A_roomId_1', text: 'Room A1' }),
        ],
        [
          expect.objectContaining({ key: 'buildingId_B', text: 'Building B' }),
        ],
      ]);
      expect(timelineRows).not.toEqual(groupPanelData.groupPanelItems);
    });
  });

  describe('getKeyByGroup', () => {
    it('should generate key from group', () => {
      expect(getKeyByGroup(0, true))
        .toBe('0');
      expect(getKeyByGroup(1, true))
        .toBe('1');
    });

    it('should return 0 when group orientation is horizontal', () => {
      expect(getKeyByGroup(32, false))
        .toBe('0');
    });

    it('should return "0" when groupIndex is undefined', () => {
      expect(getKeyByGroup(undefined, false))
        .toBe('0');
    });
  });

  describe('getIsGroupedAllDayPanel', () => {
    it('should return false if all-day-panel is a part of the header', () => {
      expect(getIsGroupedAllDayPanel(false, false))
        .toBe(false);
      expect(getIsGroupedAllDayPanel(false, true))
        .toBe(false);
    });

    it('should return false in case of horizontal grouping', () => {
      expect(getIsGroupedAllDayPanel(true, false))
        .toBe(false);
    });

    it('should return true if all-day-panel is not a part of the header and vertical grouping is used', () => {
      expect(getIsGroupedAllDayPanel(true, true))
        .toBe(true);
    });
  });

  describe('isVerticalGroupingApplied', () => {
    it('should return true if group orientation is vertical', () => {
      expect(isVerticalGroupingApplied(1, VERTICAL_GROUP_ORIENTATION))
        .toBe(true);
    });

    it('should return false if group orientation is not vertical', () => {
      expect(isVerticalGroupingApplied(1, HORIZONTAL_GROUP_ORIENTATION))
        .toBe(false);
      expect(isVerticalGroupingApplied(1))
        .toBe(false);
    });

    it('should return false if groups are empty', () => {
      expect(isVerticalGroupingApplied(0, VERTICAL_GROUP_ORIENTATION))
        .toBe(false);
    });
  });

  describe('isHorizontalGroupingApplied', () => {
    it('should return true if group orientation is horizontal and groups length is more than 0', () => {
      expect(isHorizontalGroupingApplied(1, HORIZONTAL_GROUP_ORIENTATION))
        .toBe(true);
    });

    it('should return false if group orientation is not horizontal', () => {
      expect(isHorizontalGroupingApplied(1, VERTICAL_GROUP_ORIENTATION))
        .toBe(false);
      expect(isHorizontalGroupingApplied(1))
        .toBe(false);
    });

    it('should return false if groups length is 0', () => {
      expect(isHorizontalGroupingApplied(0, HORIZONTAL_GROUP_ORIENTATION))
        .toBe(false);
    });
  });

  describe('isGroupingByDate', () => {
    it('should return true if group orientation is horizontal and groupByDate is true', () => {
      expect(isGroupingByDate(1, HORIZONTAL_GROUP_ORIENTATION, true))
        .toBe(true);
    });

    it('should return false if group orientation is horizontal and groupByDate is false', () => {
      expect(isGroupingByDate(1, HORIZONTAL_GROUP_ORIENTATION, false))
        .toBe(false);
    });

    it('should return false if group orientation is vertical', () => {
      expect(isGroupingByDate(1, VERTICAL_GROUP_ORIENTATION, false))
        .toBe(false);
    });
  });
});
