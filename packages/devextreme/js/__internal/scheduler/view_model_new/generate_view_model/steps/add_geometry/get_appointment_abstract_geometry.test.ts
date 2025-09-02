/**
 * @timezone Europe/Belgrade
 */

import { describe, expect, it } from '@jest/globals';

import { getAppointmentX, getAppointmentY } from './get_appointment_abstract_geometry';

describe('appointment position utils', () => {
  describe('getAppointmentX', () => {
    const cellSize = { sizeX: 200, sizeY: 100 };
    const cells = [{
      min: 0, max: 20, cellIndex: 0, columnIndex: 0, rowIndex: 0,
    }, {
      min: 20, max: 40, cellIndex: 1, columnIndex: 1, rowIndex: 0,
    }, {
      min: 50, max: 70, cellIndex: 2, columnIndex: 2, rowIndex: 0,
    }, {
      min: 70, max: 90, cellIndex: 3, columnIndex: 3, rowIndex: 0,
    }];

    it('should return X position inside one cell', () => {
      const entity = {
        startDate: 10, endDate: 15, cellIndex: 0, endCellIndex: 0, columnIndex: 0,
      };

      expect(getAppointmentX(entity, cellSize, cells)).toEqual({ offsetX: 100, sizeX: 50 });
    });

    it('should return X position inside cells with gap', () => {
      const entity = {
        startDate: 22, endDate: 72, cellIndex: 1, endCellIndex: 3, columnIndex: 1,
      };

      expect(getAppointmentX(entity, cellSize, cells)).toEqual({ offsetX: 220, sizeX: 400 });
    });

    it('should return correct X position through DST', () => {
      const entity = {
        startDate: new Date(2019, 9, 26).getTime(),
        endDate: new Date(2019, 9, 29).getTime(),
        cellIndex: 0,
        endCellIndex: 1,
        columnIndex: 0,
      };

      expect(getAppointmentX(entity, cellSize, [{
        min: new Date(2019, 9, 25).getTime(),
        max: new Date(2019, 9, 27).getTime(),
        cellIndex: 0,
        columnIndex: 0,
        rowIndex: 0,
      }, {
        min: new Date(2019, 9, 27).getTime(),
        max: new Date(2019, 9, 29).getTime(),
        cellIndex: 1,
        columnIndex: 1,
        rowIndex: 0,
      }])).toEqual({ offsetX: 100, sizeX: 300 });
    });

    // TODO: add test for hours
    it.todo('should return correct X position through DST with 30 minutes cells');
  });

  describe('getAppointmentY', () => {
    it('should return Y position inside interval according to level for collector at the start', () => {
      const entity = { level: 4, maxLevel: 10, isAllDayPanelOccupied: false };

      expect(getAppointmentY(
        entity,
        { sizeX: 200, sizeY: 105 },
        5,
        'start',
      )).toEqual({ offsetY: 45, sizeY: 10 });
    });

    it('should return Y position inside interval according to level for collector at the end', () => {
      const entity = { level: 7, maxLevel: 10, isAllDayPanelOccupied: false };

      expect(getAppointmentY(
        entity,
        { sizeX: 200, sizeY: 105 },
        5,
        'end',
      )).toEqual({ offsetY: 70, sizeY: 10 });
    });

    it('should return Y position inside all day interval according to level for collector at the end', () => {
      const entity = { level: 7, maxLevel: 10, isAllDayPanelOccupied: true };

      expect(getAppointmentY(
        entity,
        { sizeX: 200, sizeY: 105 },
        5,
        'end',
      )).toEqual({ offsetY: 75, sizeY: 10 });
    });
  });
});
