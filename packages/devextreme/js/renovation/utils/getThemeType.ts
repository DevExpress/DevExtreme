import {
  isFluent, isMaterial, isCompact, current,
} from '../../ui/themes';

const getThemeType = (): { isCompact: boolean; isMaterial: boolean; isFluent: boolean } => {
  const theme = current();

  return {
    isCompact: isCompact(theme),
    isMaterial: isMaterial(theme),
    isFluent: isFluent(theme),
  };
};

export default getThemeType;
