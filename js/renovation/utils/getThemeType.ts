import { isMaterial, isCompact, current } from '../../ui/themes';

const getThemeType = (): { isCompact: boolean; isMaterial: boolean } => {
  const theme = current();

  return {
    isCompact: isCompact(theme),
    isMaterial: isMaterial(theme),
  };
};

export default getThemeType;
