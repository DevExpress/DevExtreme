import { describe, expect, it } from '@jest/globals';

import { getAppointmentCollectorGeometry } from './get_appointment_collector_geometry';

describe('getAppointmentCollectorGeometry', () => {
  it('should return collector position at the start, horizontal', () => {
    const entity = { columnIndex: 3 };

    expect(getAppointmentCollectorGeometry(entity, {
      collectorPosition: 'start',
      cellSize: { width: 100, height: 80 },
      collectorSize: { width: 20, height: 20 },
      collectorWithMarginsSize: { width: 26, height: 26 },
      viewOrientation: 'horizontal',
    })).toEqual({
      height: 20,
      left: 300,
      top: 0,
      width: 20,
    });
  });

  it('should return collector position at the end, horizontal', () => {
    const entity = { columnIndex: 3 };

    expect(getAppointmentCollectorGeometry(entity, {
      collectorPosition: 'end',
      cellSize: { width: 100, height: 80 },
      collectorSize: { width: 20, height: 20 },
      collectorWithMarginsSize: { width: 26, height: 26 },
      viewOrientation: 'horizontal',
    })).toEqual({
      height: 20,
      left: 300,
      top: 54,
      width: 20,
    });
  });
});
