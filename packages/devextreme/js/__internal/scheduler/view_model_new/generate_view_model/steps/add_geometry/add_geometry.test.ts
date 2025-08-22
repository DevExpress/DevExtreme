import {
  describe, it,
} from '@jest/globals';

// import type { GeometryOptions } from '../../types';
// import { monthIntervals } from '../__mock__/month.mock';
// import { addGeometry } from './add_geometry';

describe('geometry', () => {
  // describe('month view', () => {
  //   const options: GeometryOptions = {
  //     intervals: monthIntervals,
  //     intervalSize: { width: 7 * 200, height: 80 },
  //     cellSize: { width: 200, height: 80 },
  //     maxAppointmentsPerCell: 3,
  //     viewOrientation: 'horizontal',
  //     groupOrientation: 'horizontal',
  //     isGroupByDate: false,
  //     isTimeline: false,
  //   };
  //   const items = [{
  //     startDate: new Date(2025, 0, 1).getTime(),
  //     endDate: new Date(2025, 0, 3).getTime(),
  //     groupIndex: 0,
  //     cellIndex: 0,
  //     rowIndex: 0,
  //     columnIndex: 0,
  //     level: 0,
  //   }, {
  //     startDate: new Date(2025, 0, 18).getTime(),
  //     endDate: new Date(2025, 0, 22).getTime(),
  //     groupIndex: 0,
  //     cellIndex: 17,
  //     rowIndex: 2,
  //     columnIndex: 3,
  //     level: 1,
  //   }, {
  //     startDate: new Date(2025, 0, 28).getTime(),
  //     endDate: new Date(2025, 0, 29).getTime(),
  //     groupIndex: 0,
  //     cellIndex: 27,
  //     rowIndex: 3,
  //     columnIndex: 6,
  //     level: 2,
  //   }];
  //   const expected = [{
  //     ...items[0],
  //     left: 0,
  //     top: expect.closeTo(53.3, 1),
  //     width: 400,
  //     height: expect.closeTo(26.7, 1),
  //   }, {
  //     ...items[1],
  //     left: 3 * 200,
  //     top: expect.closeTo(2 * 80 + 26.7, 1),
  //     width: 800,
  //     height: expect.closeTo(26.7, 1),
  //   }, {
  //     ...items[2],
  //     left: 6 * 200,
  //     top: 3 * 80,
  //     width: 200,
  //     height: expect.closeTo(26.7, 1),
  //   }];
  //
  //   it('should render ungrouped appointments', () => {
  //     expect(addGeometry(items, options, 0)).toEqual(expected);
  //   });
  //
  //   it('should render appointments grouped horizontally', () => {
  //     const groupIndex = 3;
  //     const leftOffset = 3 * 1400;
  //     const groupedItems = items.map((item) => ({ ...item, groupIndex }));
  //     expect(addGeometry(
  //       groupedItems,
  //       { ...options, groupOrientation: 'horizontal' },
  //       10,
  //     )).toEqual([{
  //       ...expected[0],
  //       ...groupedItems[0],
  //       left: leftOffset + expected[0].left,
  //     }, {
  //       ...expected[1],
  //       ...groupedItems[1],
  //       left: leftOffset + expected[1].left,
  //     }, {
  //       ...expected[2],
  //       ...groupedItems[2],
  //       left: leftOffset + expected[2].left,
  //     }]);
  //   });
  //
  //   it('should render appointments grouped horizontally by date', () => {
  //     const groupIndex = 3;
  //     const groupedItems = items.map((item) => ({ ...item, groupIndex }));
  //     expect(addGeometry(
  //       groupedItems,
  //       { ...options, groupOrientation: 'horizontal', isGroupByDate: true },
  //       10,
  //     )).toEqual([{
  //       ...expected[0],
  //       ...groupedItems[0],
  //       left: 3 * 200 + expected[0].left,
  //     }, {
  //       ...expected[1],
  //       ...groupedItems[1],
  //       left: (3 * 10 + 3) * 200 + expected[1].left,
  //     }, {
  //       ...expected[2],
  //       ...groupedItems[2],
  //       left: (6 * 10 + 3) * 200 + expected[2].left,
  //     }]);
  //   });
  //
  //   it('should render appointments grouped vertically', () => {
  //     const groupIndex = 3;
  //     const groupedItems = items.map((item) => ({ ...item, groupIndex }));
  //     expect(addGeometry(
  //       groupedItems,
  //       { ...options, groupOrientation: 'vertical' },
  //       10,
  //     )).toEqual([{
  //       ...expected[0],
  //       ...groupedItems[0],
  //       top: expect.closeTo(3 * 80 * 4 + 53.3, 1),
  //     }, {
  //       ...expected[1],
  //       ...groupedItems[1],
  //       top: expect.closeTo(3 * 80 * 4 + 2 * 80 + 26.7, 1),
  //     }, {
  //       ...expected[2],
  //       ...groupedItems[2],
  //       top: 3 * 80 * 4 + 3 * 80,
  //     }]);
  //   });
  // });

  [
    { view: 'day', maxAppointmentsPerCell: 3 },
    { view: 'timelineDay', maxAppointmentsPerCell: 3 },
    { view: 'month', maxAppointmentsPerCell: 3 },
    { view: 'timelineMonth', maxAppointmentsPerCell: 3 },

    { view: 'day', maxAppointmentsPerCell: 'unlimited' },
    { view: 'timelineDay', maxAppointmentsPerCell: 'unlimited' },
    { view: 'month', maxAppointmentsPerCell: 'unlimited' },
    { view: 'timelineMonth', maxAppointmentsPerCell: 'unlimited' },
  ].forEach(() => {
    it.todo('should render several appointments in one cell');
  });

  [
    { view: 'day', maxAppointmentsPerCell: 3 },
    { view: 'timelineDay', maxAppointmentsPerCell: 3 },
    { view: 'month', maxAppointmentsPerCell: 3 },
    { view: 'timelineMonth', maxAppointmentsPerCell: 3 },
  ].forEach(() => {
    it.todo('should render appointments with collector');
  });

  [
    { view: 'day' },
    { view: 'timelineDay' },
    { view: 'month' },
    { view: 'timelineMonth' },
  ].forEach(() => {
    [
      { grouping: 'horizontal' },
      { view: 'vertical' },
      { view: 'horizontal - byDate' },
    ].forEach(() => {
      it.todo('should render appointments with grouping');
    });
  });

  it.todo('should render appointments in adaptivity mode');
});
