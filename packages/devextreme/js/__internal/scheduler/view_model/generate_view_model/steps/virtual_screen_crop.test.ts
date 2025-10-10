import { describe, expect, it } from '@jest/globals';

import type { VirtualCropOptions } from './add_geometry/types';
import { cropByVirtualScreen } from './virtual_screen_crop';

const options: VirtualCropOptions = {
  isVirtualScrolling: true,
  getVirtualScreen: () => ({
    left: 500,
    right: 1000,
    top: 500,
    bottom: 1000,
  }),
};

describe('cropByVirtualScreen', () => {
  it('should do nothing for isVirtualScrolling=false', () => {
    const entities = [1, 2, 3] as any;
    expect(cropByVirtualScreen(entities, {
      ...options,
      isVirtualScrolling: false,
    })).toEqual(entities);
  });

  it('should filter out items out of the bounds', () => {
    const entities = [
      {
        groupIndex: 0, left: 0, top: 0, width: 200, height: 200,
      },
      {
        groupIndex: 0, left: 0, top: 100000, width: 200, height: 200,
      },
      {
        groupIndex: 0, left: 100000, top: 0, width: 200, height: 200,
      },
      {
        groupIndex: 0, left: 100000, top: 100000, width: 200, height: 200,
      },
    ];

    expect(cropByVirtualScreen(entities, options)).toEqual([]);
  });

  it('should crop items cross the bounds', () => {
    const entities = [
      {
        groupIndex: 0, left: 400, top: 450, width: 200, height: 200,
      },
      {
        groupIndex: 0, left: 400, top: 950, width: 200, height: 200,
      },
      {
        groupIndex: 0, left: 900, top: 450, width: 200, height: 200,
      },
      {
        groupIndex: 0, left: 900, top: 950, width: 200, height: 200,
      },
    ];

    expect(cropByVirtualScreen(entities, options)).toEqual([
      {
        groupIndex: 0, left: 500, top: 500, width: 100, height: 150,
      },
      {
        groupIndex: 0, left: 500, top: 950, width: 100, height: 50,
      },
      {
        groupIndex: 0, left: 900, top: 500, width: 100, height: 150,
      },
      {
        groupIndex: 0, left: 900, top: 950, width: 100, height: 50,
      },
    ]);
  });

  it('should not crop items inside of the bounds', () => {
    const entities = [
      {
        groupIndex: 0, left: 500, top: 600, width: 200, height: 200,
      },
      {
        groupIndex: 0, left: 700, top: 800, width: 200, height: 200,
      },
    ];

    expect(cropByVirtualScreen(entities, options)).toEqual(entities);
  });
});
