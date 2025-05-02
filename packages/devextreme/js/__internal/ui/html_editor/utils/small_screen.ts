import devices from '@js/core/devices';
import {
  // @ts-expect-error
  getCurrentScreenFactor,
  hasWindow,
} from '@js/core/utils/window';

export const isSmallScreen = (): boolean => {
  const screenFactor = hasWindow() ? getCurrentScreenFactor() : null;
  return devices.real().deviceType === 'phone' || screenFactor === 'xs';
};
