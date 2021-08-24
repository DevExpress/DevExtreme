import { isMaterial, isCompact, current } from '../../../../ui/themes';

function getThemeType(): { isMaterialTheme: boolean; isCompactTheme: boolean } {
  const theme = current();

  return {
    isMaterialTheme: isMaterial(theme),
    isCompactTheme: isCompact(theme),
  };
}

function getDefaultIconSize(): number {
  const { isMaterialTheme, isCompactTheme } = getThemeType();

  let defaultIconSize = 22;
  if (isCompactTheme) {
    defaultIconSize = 16;
  } else if (isMaterialTheme) {
    defaultIconSize = 18;
  }

  return defaultIconSize;
}

function getDefaultFontSize(): number {
  const { isCompactTheme } = getThemeType();

  const defaultFontSize = isCompactTheme ? 12 : 16;
  return defaultFontSize;
}

function getFontSizeByIconSize(iconSize: number): number {
  const defaultFontSize = getDefaultFontSize();
  const defaultIconSize = getDefaultIconSize();

  const fontToIconSizeRatio = defaultFontSize / defaultIconSize;

  return Math.ceil(fontToIconSizeRatio * iconSize);
}

export {
  getDefaultIconSize,
  getFontSizeByIconSize,
};
