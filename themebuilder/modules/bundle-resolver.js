module.exports = (theme, colorScheme) => {
    colorScheme = colorScheme.replace(/-/g, '.');
    const themePart = (theme !== 'generic' ? theme + '.' : '');
    return `bundles/dx.${themePart}${colorScheme}.less`;
};
