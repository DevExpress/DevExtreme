import { ScreenSize } from './types';

export const defaultScreenFactorFunc = (width: number): ScreenSize => {
  if (width < 768) {
    return 'xs';
  }
  if (width < 992) {
    return 'sm';
  }
  if (width < 1200) {
    return 'md';
  }

  return 'lg';
};
