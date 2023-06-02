import { ScreenSizeQualifier } from './types';

export const convertToScreenSizeQualifier = (width: number): ScreenSizeQualifier => {
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
