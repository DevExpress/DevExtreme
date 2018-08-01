var BaseThemeManager = require("../core/base_theme_manager").BaseThemeManager;

exports.ThemeManager = BaseThemeManager.inherit({
    _themeSection: "map",

    _fontFields: [
        "layer:area.label.font",
        "layer:marker:dot.label.font", "layer:marker:bubble.label.font", "layer:marker:pie.label.font", "layer:marker:image.label.font",
        "tooltip.font", "legend.font", "title.font", "title.subtitle.font", "loadingIndicator.font", "export.font"
    ]
});
