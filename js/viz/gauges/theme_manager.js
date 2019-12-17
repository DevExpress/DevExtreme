var extend = require('../../core/utils/extend').extend,
    _extend = extend,
    BaseThemeManager = require('../core/base_theme_manager').BaseThemeManager;

var ThemeManager = BaseThemeManager.inherit({
    ctor(options) {
        this.callBase.apply(this, arguments);
        this._subTheme = options.subTheme;
    },

    _initializeTheme: function() {
        var that = this,
            subTheme;
        if(that._subTheme) {
            subTheme = _extend(true, {}, that._theme[that._subTheme], that._theme);
            _extend(true, that._theme, subTheme);
        }
        that.callBase.apply(that, arguments);
    }
});

module.exports = { ThemeManager };
