export const getThemeName = (theme: string): string => theme.split('.')[0];

export const getDarkThemeName = (theme: string): string => theme.replace('light', 'dark');

export const isMaterial = (theme: string): boolean => theme.startsWith('material');

export const isFluent = (theme: string): boolean => theme.startsWith('fluent');

export const isMaterialBased = (theme: string): boolean => isMaterial(theme) || isFluent(theme);

export const getThemePostfix = (theme: string): string => ` (${theme})`;
