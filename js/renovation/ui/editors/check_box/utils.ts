import { isMaterial, isCompact, current } from '../../../../ui/themes';

const defaultIconSizes = [
  [22, 16], // generic, generic-compact
  [18, 16], // material, material-compact
];

const defaultFontSizes = [
  [ // for not checked checkbox
    [12, 8], // generic, generic-compact
    [20, 18], // material, material-compact
  ],
  [ // for checked checkbox
    [16, 10], // generic, generic-compact
    [16, 14], // material, material-compact
  ],
];

function getThemeType(): { isMaterialTheme: boolean; isCompactTheme: boolean } {
  const theme = current();

  return {
    isMaterialTheme: isMaterial(theme),
    isCompactTheme: isCompact(theme),
  };
}

function getDefaultIconSize(): number {
  const { isMaterialTheme, isCompactTheme } = getThemeType();

  return defaultIconSizes[+isMaterialTheme][+isCompactTheme];
}

function getDefaultFontSize(isChecked: boolean): number {
  const { isMaterialTheme, isCompactTheme } = getThemeType();

  return defaultFontSizes[+isChecked][+isMaterialTheme][+isCompactTheme];
}

function getFontSizeByIconSize(
  iconSize: number,
  isChecked: boolean,
): number {
  const defaultFontSize = getDefaultFontSize(isChecked);
  const defaultIconSize = getDefaultIconSize();

  const fontToIconSizeRatio = defaultFontSize / defaultIconSize;

  return Math.ceil(fontToIconSizeRatio * iconSize);
}

export {
  getDefaultFontSize,
  getDefaultIconSize,
  getFontSizeByIconSize,
};
