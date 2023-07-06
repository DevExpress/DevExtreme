import { getWindow, hasWindow } from '../../../../core/utils/window';

export function getDevicePixelRatio(): number {
  return hasWindow() ? getWindow().devicePixelRatio : 1;
}
