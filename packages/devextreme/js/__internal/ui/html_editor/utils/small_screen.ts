import devices from '@js/core/devices';
import { getCurrentScreenFactor, hasWindow } from '@ts/core/utils/m_window';

export const isSmallScreen = (): boolean => {
  const screenFactor = hasWindow() ? getCurrentScreenFactor() : null;
  return devices.real().deviceType === 'phone' || screenFactor === 'xs';
};
