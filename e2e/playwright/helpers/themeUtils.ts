// The theme travels one way: the THEME variable names the default of a run, the config turns it
// into the "theme" option, the fixture applies it to the page. These helpers are handed the theme
// that is in effect — reading the environment here would be a second source that can disagree.
export const getThemeName = (theme: string): string => theme.split('.')[0];

export const getDarkThemeName = (theme: string): string => theme.replace('light', 'dark');

export const isMaterial = (theme: string): boolean => theme.startsWith('material');

export const isFluent = (theme: string): boolean => theme.startsWith('fluent');

export const isMaterialBased = (theme: string): boolean => isMaterial(theme) || isFluent(theme);

export const getThemePostfix = (theme: string): string => ` (${theme})`;
