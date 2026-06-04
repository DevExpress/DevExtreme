import type { dxElementWrapper } from '@js/core/renderer';
import { getOuterWidth } from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';

type SizeValue = number | string | (() => number | string) | null | undefined;

const getElementWidth = ($element: dxElementWrapper): number | undefined => {
  if (hasWindow()) {
    return getOuterWidth($element) as number;
  }

  return undefined;
};

const getSizeValue = (size: SizeValue): number | string | undefined => {
  const normalized = size === null ? undefined : size;

  if (typeof normalized === 'function') {
    return normalized();
  }

  return normalized;
};

export { getElementWidth, getSizeValue };
