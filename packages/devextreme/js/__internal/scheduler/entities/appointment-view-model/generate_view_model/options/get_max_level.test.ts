import { describe, expect, it } from '@jest/globals';

import { getMaxLevel } from './get_max_level';

describe('getMaxLevel', () => {
  [false, true].forEach((isAdaptivityEnabled) => {
    it(`should return -1 for maxAppointmentsPerCell=unlimited, adaptivityEnabled=${isAdaptivityEnabled}`, () => {
      expect(getMaxLevel({ maxAppointmentsPerCell: 'unlimited', isAdaptivityEnabled } as any)).toBe(-1);
    });

    it(`should return 3 for maxAppointmentsPerCell=3, adaptivityEnabled=${isAdaptivityEnabled}`, () => {
      expect(getMaxLevel({ maxAppointmentsPerCell: 3, isAdaptivityEnabled } as any)).toBe(3);
    });
  });

  it('should return calculated value for maxAppointmentsPerCell=auto, adaptivityEnabled=false, viewOrientation=horizontal', () => {
    expect(getMaxLevel({
      maxAppointmentsPerCell: 'auto',
      cellSize: { width: 150, height: 80 },
      collectorSize: { width: 25, height: 20 },
      viewOrientation: 'horizontal',
      isTimelineView: false,
      isAdaptivityEnabled: false,
    })).toBe(3);
  });

  it('should return calculated value for maxAppointmentsPerCell=auto, adaptivityEnabled=false, viewOrientation=vertical', () => {
    expect(getMaxLevel({
      maxAppointmentsPerCell: 'auto',
      cellSize: { width: 150, height: 80 },
      collectorSize: { width: 25, height: 20 },
      viewOrientation: 'vertical',
      isTimelineView: false,
      isAdaptivityEnabled: false,
    })).toBe(2);
  });

  it('should return calculated value for maxAppointmentsPerCell=auto, adaptivityEnabled=true, viewOrientation=horizontal', () => {
    expect(getMaxLevel({
      maxAppointmentsPerCell: 'auto',
      cellSize: { width: 150, height: 80 },
      collectorSize: { width: 25, height: 20 },
      viewOrientation: 'horizontal',
      isTimelineView: false,
      isAdaptivityEnabled: true,
    })).toBe(0);
  });

  it('should return calculated value for maxAppointmentsPerCell=auto, adaptivityEnabled=true, viewOrientation=vertical', () => {
    expect(getMaxLevel({
      maxAppointmentsPerCell: 'auto',
      cellSize: { width: 150, height: 80 },
      collectorSize: { width: 25, height: 20 },
      viewOrientation: 'vertical',
      isTimelineView: false,
      isAdaptivityEnabled: true,
    })).toBe(4);
  });

  it('should return 0 for cell size less then collector size, viewOrientation=vertical', () => {
    expect(getMaxLevel({
      maxAppointmentsPerCell: 'auto',
      cellSize: { width: 20, height: 20 },
      collectorSize: { width: 30, height: 30 },
      viewOrientation: 'vertical',
      isTimelineView: false,
      isAdaptivityEnabled: true,
    })).toBe(0);
  });

  it('should return calculated value for timeline view, maxAppointmentsPerCell=auto, adaptivityEnabled=false, viewOrientation=horizontal', () => {
    expect(getMaxLevel({
      maxAppointmentsPerCell: 'auto',
      cellSize: { width: 150, height: 400 },
      collectorSize: { width: 25, height: 20 },
      viewOrientation: 'horizontal',
      isTimelineView: true,
      isAdaptivityEnabled: false,
    })).toBe(6);
  });
});
