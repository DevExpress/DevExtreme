/**
 * @timezone Europe/Belgrade
 */

import { describe, expect, it } from '@jest/globals';

import { getAppointmentGeometry, getAppointmentX, getAppointmentY } from './get_appointment_geometry';

describe('appointment position utils', () => {
  describe('getAppointmentX', () => {
    it('should return X position inside interval according to dates', () => {
      const entity = { startDate: 12, endDate: 17 };

      expect(getAppointmentX(entity, {
        min: 0, max: 20, sizeX: 200, sizeY: 100,
      })).toEqual({ offsetX: 120, sizeX: 50 });
    });

    it('should return correct X position through DST', () => {
      const entity = {
        startDate: new Date(2019, 9, 26).getTime(),
        endDate: new Date(2019, 9, 29).getTime(),
      };

      expect(getAppointmentX(entity, {
        min: new Date(2019, 9, 20).getTime(),
        max: new Date(2019, 9, 30).getTime(),
        sizeX: 200,
        sizeY: 100,
      })).toEqual({ offsetX: 120, sizeX: 60 });
    });
  });

  describe('getAppointmentY', () => {
    it('should return Y position inside interval according to level for collector at the start', () => {
      const entity = { level: 4, maxLevel: 10 };

      expect(getAppointmentY(
        entity,
        { sizeX: 200, sizeY: 105 },
        5,
        'start',
      )).toEqual({ offsetY: 45, sizeY: 10 });
    });

    it('should return Y position inside interval according to level for collector at the end', () => {
      const entity = { level: 7, maxLevel: 10 };

      expect(getAppointmentY(
        entity,
        { sizeX: 200, sizeY: 105 },
        5,
        'end',
      )).toEqual({ offsetY: 70, sizeY: 10 });
    });
  });

  describe('getAppointmentGeometry', () => {
    it('should return position inside interval for entity horizontal orientation', () => {
      const entity = {
        startDate: 23,
        endDate: 23 + 15,
        level: 7,
        maxLevel: 10,
        items: [],
      };

      expect(getAppointmentGeometry(
        entity as any,
        {
          min: 20, max: 40, sizeX: 200, sizeY: 124,
        },
        {
          collectorPosition: 'start',
          cellSize: { width: 100, height: 80 },
          collectorSize: { width: 18, height: 20 },
          collectorWithMarginsSize: { width: 20, height: 24 },
          viewOrientation: 'horizontal',
        },
      )).toEqual({
        offsetY: 94, sizeY: 10, offsetX: 30, sizeX: 150,
      });
    });

    it('should return position inside interval for entity vertical orientation', () => {
      const entity = {
        startDate: 23,
        endDate: 23 + 15,
        level: 7,
        maxLevel: 10,
        items: [],
      };

      expect(getAppointmentGeometry(
        entity as any,
        {
          min: 20, max: 40, sizeX: 200, sizeY: 124,
        },
        {
          collectorPosition: 'start',
          cellSize: { width: 100, height: 80 },
          collectorSize: { width: 20, height: 18 },
          collectorWithMarginsSize: { width: 24, height: 20 },
          viewOrientation: 'vertical',
        },
      )).toEqual({
        offsetY: 94, sizeY: 10, offsetX: 30, sizeX: 150,
      });
    });

    it('should return position inside interval for entity, collector at the end', () => {
      const entity = {
        startDate: 23,
        endDate: 23 + 15,
        level: 7,
        maxLevel: 10,
        items: [],
      };

      expect(getAppointmentGeometry(
        entity as any,
        {
          min: 20, max: 40, sizeX: 200, sizeY: 124,
        },
        {
          collectorPosition: 'end',
          cellSize: { width: 100, height: 80 },
          collectorSize: { width: 20, height: 18 },
          collectorWithMarginsSize: { width: 24, height: 20 },
          viewOrientation: 'vertical',
        },
      )).toEqual({
        offsetY: 70, sizeY: 10, offsetX: 30, sizeX: 150,
      });
    });

    it('should return position inside interval for collector and children horizontal orientation', () => {
      const entity = {
        columnIndex: 3,
        items: [{}],
      };

      expect(getAppointmentGeometry(
        entity as any,
        {
          min: 20, max: 40, sizeX: 200, sizeY: 124,
        },
        {
          collectorPosition: 'start',
          cellSize: { width: 100, height: 80 },
          collectorSize: { width: 18, height: 20 },
          collectorWithMarginsSize: { width: 20, height: 24 },
          viewOrientation: 'horizontal',
        },
      )).toEqual({
        offsetY: 0, sizeY: 20, offsetX: 300, sizeX: 18,
      });
    });

    it('should return position inside interval for collector and children vertical orientation', () => {
      const entity = {
        columnIndex: 5,
        items: [{}],
      };

      expect(getAppointmentGeometry(
        entity as any,
        {
          min: 20, max: 40, sizeX: 200, sizeY: 124,
        },
        {
          collectorPosition: 'start',
          cellSize: { width: 100, height: 80 },
          collectorSize: { width: 18, height: 20 },
          collectorWithMarginsSize: { width: 20, height: 24 },
          viewOrientation: 'vertical',
        },
      )).toEqual({
        offsetY: 0, sizeY: 18, offsetX: 5 * 80, sizeX: 20,
      });
    });

    it('should return position inside interval for collector and children, collector at the end', () => {
      const entity = {
        columnIndex: 0,
        items: [{}],
      };

      expect(getAppointmentGeometry(
        entity as any,
        {
          min: 20, max: 40, sizeX: 200, sizeY: 124,
        },
        {
          collectorPosition: 'end',
          cellSize: { width: 100, height: 80 },
          collectorSize: { width: 18, height: 20 },
          collectorWithMarginsSize: { width: 20, height: 24 },
          viewOrientation: 'vertical',
        },
      )).toEqual({
        offsetY: 82, sizeY: 18, offsetX: 0, sizeX: 20,
      });
    });
  });
});
