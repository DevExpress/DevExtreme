import {
  current, isFluent, isMaterial, isMaterialBased,
} from '@js/ui/themes';

export const getThemeType = (): {
  isMaterial: boolean; isFluent: boolean; isMaterialBased: boolean;
} => {
  const theme = current();

  return {
    isMaterial: isMaterial(theme),
    isFluent: isFluent(theme),
    isMaterialBased: isMaterialBased(theme),
  };
};
