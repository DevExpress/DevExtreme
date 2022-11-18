export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme as string) || 'generic.light';
  return `-theme=${themeName.replace(/\./g, '-')}`;
};
