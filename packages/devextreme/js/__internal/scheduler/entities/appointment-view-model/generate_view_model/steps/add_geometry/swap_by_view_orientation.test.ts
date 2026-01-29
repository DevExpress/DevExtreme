import { describe, expect, it } from '@jest/globals';

import {
  getAbstractSizeByViewOrientation,
  getRealSizeByViewOrientation,
} from './swap_by_view_orientation';

describe('swap utils', () => {
  describe('getAbstractSizeByViewOrientation', () => {
    it('should swap sizes for vertical view orientation', () => {
      expect(getAbstractSizeByViewOrientation({
        width: 100,
        height: 200,
        left: 50,
        top: 75,
      }, 'vertical')).toEqual({
        sizeX: 200,
        sizeY: 100,
        offsetX: 75,
        offsetY: 50,
      });
    });

    it('should swap sizes for horizontal view orientation', () => {
      expect(getAbstractSizeByViewOrientation({
        width: 100,
        height: 200,
        left: 50,
        top: 75,
      }, 'horizontal')).toEqual({
        sizeX: 100,
        sizeY: 200,
        offsetX: 50,
        offsetY: 75,
      });
    });
  });

  describe('getRealSizeByViewOrientation', () => {
    it('should swap back sizes for vertical view orientation', () => {
      expect(getRealSizeByViewOrientation({
        sizeX: 200,
        sizeY: 100,
        offsetX: 75,
        offsetY: 50,
      }, 'vertical')).toEqual({
        width: 100,
        height: 200,
        left: 50,
        top: 75,
      });
    });

    it('should swap back sizes for horizontal view orientation', () => {
      expect(getRealSizeByViewOrientation({
        sizeX: 100,
        sizeY: 200,
        offsetX: 50,
        offsetY: 75,
      }, 'horizontal')).toEqual({
        width: 100,
        height: 200,
        left: 50,
        top: 75,
      });
    });
  });
});
