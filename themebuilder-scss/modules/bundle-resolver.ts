export default function(theme: string, colorScheme: string) {
    colorScheme = colorScheme.replace(/-/g, '.');
    const themePart: string = (theme !== 'generic' ? theme + '.' : '');
    return `bundles/dx.${themePart}${colorScheme}.scss`;
}
