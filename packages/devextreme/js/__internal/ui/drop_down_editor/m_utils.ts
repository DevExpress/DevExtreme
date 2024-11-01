import type { dxElementWrapper } from '@js/core/renderer';
import { getOuterWidth } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';

const getElementWidth = function ($element: dxElementWrapper) {
  if (hasWindow()) {
    return getOuterWidth($element);
  }
};

const getSizeValue = function (size) {
  if (size === null) {
    size = undefined;
  }
  if (typeof size === 'function') {
    size = size();
  }

  return size;
};

export { getElementWidth, getSizeValue };
