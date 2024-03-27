import {
  current, isCompact, isFluent, isMaterial, isMaterialBased,
} from '@js/ui/themes';

export const getThemeType = (): {
  isCompact: boolean; isMaterial: boolean; isFluent: boolean; isMaterialBased: boolean;
} => {
  const theme = current();

  return {
    isCompact: isCompact(theme),
    isMaterial: isMaterial(theme),
    isFluent: isFluent(theme),
    isMaterialBased: isMaterialBased(theme),
  };
};
