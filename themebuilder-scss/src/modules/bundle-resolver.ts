export default (theme: string, colorScheme: string): string => {
  const dottedColorScheme = colorScheme.replace(/-/g, '.');
  const themePart: string = (theme !== 'generic' ? `${theme}.` : '');
  return `bundles/dx.${themePart}${dottedColorScheme}.scss`;
};
