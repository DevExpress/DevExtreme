export const THEME = {
  generic: 'generic.light',
  fluent: 'fluent.blue.light',
  'fluent-next': 'fluent-next.blue.light',
  material: 'material.blue.light',
};

export const DEFAULT_THEME_NAME = THEME.fluent;

export const isMaterial = (theme = process.env.THEME) => theme?.startsWith('material');
export const isFluent = (theme = process.env.THEME) => (theme ?? DEFAULT_THEME_NAME).startsWith('fluent');
export const getThemePostfix = (theme = DEFAULT_THEME_NAME) => ` (${theme})`;

export const getScreenshotName = (baseName, theme) => {
  const themePostfix = getThemePostfix(theme);
  return baseName.endsWith('.png')
    ? baseName.replace('.png', `${themePostfix}.png`)
    : `${baseName}${themePostfix}.png`;
};
