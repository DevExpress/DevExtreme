import { DEFAULT_THEME } from './const';

export const getFullThemeName = (): string => process.env.THEME ?? DEFAULT_THEME;

export const getThemeName = (): string => getFullThemeName().split('.')[0];

export const getDarkThemeName = (): string => getFullThemeName().replace('light', 'dark');

export const isMaterial = (): boolean => getFullThemeName().startsWith('material');

export const isFluent = (): boolean => getFullThemeName().startsWith('fluent');

export const isMaterialBased = (): boolean => isMaterial() || isFluent();

export const getThemePostfix = (theme?: string): string => ` (${theme ?? getFullThemeName()})`;
