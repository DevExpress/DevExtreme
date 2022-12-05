export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? 'generic.light';
  return `-theme=${themeName.replace(/\./g, '-')}`;
};
