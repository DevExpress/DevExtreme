import {
  isMaterialBased, isFluent, isMaterial, isCompact, current,
} from '../../ui/themes';

const getThemeType = (): {
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

export default getThemeType;
