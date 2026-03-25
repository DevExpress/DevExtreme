import type { Orientation } from '@js/common';

import type {
  AbstractSize, Geometry, RealSize, X, Y,
} from './types';

export function getAbstractSizeByViewOrientation(
  size: Geometry, viewOrientation: Orientation,
): X & Y;
export function getAbstractSizeByViewOrientation(
  size: RealSize, viewOrientation: Orientation,
): AbstractSize;
export function getAbstractSizeByViewOrientation(
  size: Geometry | RealSize,
  viewOrientation: Orientation,
): AbstractSize | X & Y {
  const abstractSize: AbstractSize = {
    sizeY: viewOrientation === 'horizontal' ? size.height : size.width,
    sizeX: viewOrientation === 'horizontal' ? size.width : size.height,
  };

  if (!('top' in size && 'left' in size)) {
    return abstractSize;
  }

  return {
    ...abstractSize,
    offsetY: viewOrientation === 'horizontal' ? size.top : size.left,
    offsetX: viewOrientation === 'horizontal' ? size.left : size.top,
  };
}

export function getRealSizeByViewOrientation(
  size: X & Y, viewOrientation: Orientation,
): Geometry;
export function getRealSizeByViewOrientation(
  size: AbstractSize, viewOrientation: Orientation,
): RealSize;
export function getRealSizeByViewOrientation(
  size: AbstractSize | X & Y,
  viewOrientation: Orientation,
): RealSize | Geometry {
  const realSize: RealSize = {
    height: viewOrientation === 'horizontal' ? size.sizeY : size.sizeX,
    width: viewOrientation === 'horizontal' ? size.sizeX : size.sizeY,
  };

  if (!('offsetY' in size && 'offsetX' in size)) {
    return realSize;
  }

  return {
    ...realSize,
    top: viewOrientation === 'horizontal' ? size.offsetY : size.offsetX,
    left: viewOrientation === 'horizontal' ? size.offsetX : size.offsetY,
  };
}
