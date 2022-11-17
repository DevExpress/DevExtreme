export const getThemePostfix = (theme?: string): string => {
  const themeName = theme ?? process.env.theme as string;
  return `-theme=${themeName.replace(/\./g, '-')}`;
};
