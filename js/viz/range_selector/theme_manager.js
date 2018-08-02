var BaseThemeManager = require("../core/base_theme_manager").BaseThemeManager;

exports.ThemeManager = BaseThemeManager.inherit({
    _themeSection: "rangeSelector",
    _fontFields: ["scale.label.font", "sliderMarker.font", "loadingIndicator.font", "export.font", "title.font", "title.subtitle.font"]
});
