module.exports = (theme, colorScheme) => {
    colorScheme = colorScheme.replace(/-/g, ".");
    const themePart = (theme !== "generic" ? theme + "." : "");
    return `bundles/${theme}/dx.${themePart}${colorScheme}.less`;
};
