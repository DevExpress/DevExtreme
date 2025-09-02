import { describe, expect, it } from '@jest/globals';

import { getCollectorSize } from './get_collector_size';

describe('getCollectorSize', () => {
  it('should return px collector size', () => {
    expect(getCollectorSize(
      { width: 150, height: 80 },
      {
        width: '25px', height: '20px', marginLeft: '3px', marginRight: '3px', marginTop: '5px', marginBottom: '5px',
      },
      0,
    )).toEqual({
      collectorSize: { width: 25, height: 20 },
      collectorWithMarginsSize: { width: 31, height: 30 },
    });
  });

  it('should use cell size when collector size is not px', () => {
    expect(getCollectorSize(
      { width: 150, height: 80 },
      {
        width: 'auto', height: 'auto', marginLeft: '3px', marginRight: '3px', marginTop: '5px', marginBottom: '5px',
      },
      0,
    )).toEqual({
      collectorSize: { width: 144, height: 20 },
      collectorWithMarginsSize: { width: 150, height: 30 },
    });
  });

  it('should use cell size for all day panel', () => {
    expect(getCollectorSize(
      { width: 150, height: 80 },
      {
        width: 'auto', height: 'auto', marginLeft: '3px', marginRight: '3px', marginTop: '5px', marginBottom: '5px',
      },
      100,
    )).toEqual({
      collectorSize: { width: 100, height: 20 },
      collectorWithMarginsSize: { width: 106, height: 30 },
    });
  });
});
