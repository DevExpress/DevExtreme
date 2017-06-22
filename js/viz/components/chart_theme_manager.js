"use strict";

var commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    BaseThemeManager = require("../core/base_theme_manager").BaseThemeManager,
    _isString = typeUtils.isString,
    _isDefined = commonUtils.isDefined,
    _normalizeEnum = require("../core/utils").normalizeEnum,

    FONT = "font",
    COMMON_AXIS_SETTINGS = "commonAxisSettings",

    PIE_FONT_FIELDS = ["legend." + FONT, "title." + FONT, "title.subtitle." + FONT, "tooltip." + FONT, "loadingIndicator." + FONT, "export." + FONT, "commonSeriesSettings.label." + FONT],
    POLAR_FONT_FIELDS = PIE_FONT_FIELDS.concat([COMMON_AXIS_SETTINGS + ".label." + FONT, COMMON_AXIS_SETTINGS + ".title." + FONT]),
    CHART_FONT_FIELDS = POLAR_FONT_FIELDS.concat(["crosshair.label." + FONT]),

    chartToFontFieldsMap = {
        pie: PIE_FONT_FIELDS,
        chart: CHART_FONT_FIELDS,
        polar: POLAR_FONT_FIELDS
    };

var ThemeManager = BaseThemeManager.inherit((function() {
    var ctor = function(options, themeGroupName) {
        var that = this;

        that.callBase.apply(that, arguments);

        options = options || {};
        that._userOptions = options;
        that._mergeAxisTitleOptions = [];
        that._multiPieColors = {};
        that._themeSection = themeGroupName;

        that._fontFields = chartToFontFieldsMap[themeGroupName];

        // This is required because chart calls "_getOption" during "_init" stage
        // TODO: Remove it when chart stops doing that
        that._callback = commonUtils.noop;
    };

    var dispose = function() {
        var that = this;
        that.palette && that.palette.dispose();
        that.palette = that._userOptions = that._mergedSettings = that._multiPieColors = null;
        return that.callBase.apply(that, arguments);
    };

    var resetPalette = function() {
        this.palette.reset();
        this._multiPieColors = {};
    };

    var updatePalette = function(palette) {
        this.palette = this.createPalette(palette, { useHighlight: true });
    };

    var processTitleOptions = function(options) {
        return _isString(options) ? { text: options } : options;
    };

    var processAxisOptions = function(axisOptions) {
        if(!axisOptions) {
            return;
        }
        axisOptions = extend(true, {}, axisOptions);
        axisOptions.title = processTitleOptions(axisOptions.title);

        if(axisOptions.type === "logarithmic" && (axisOptions.logarithmBase <= 0) || (axisOptions.logarithmBase && !typeUtils.isNumeric(axisOptions.logarithmBase))) {
            axisOptions.logarithmBase = undefined;
            axisOptions.logarithmBaseError = true;
        }
        if(axisOptions.label) {
            if(axisOptions.label.alignment) {
                axisOptions.label["userAlignment"] = true;
            }
            if(_isString(axisOptions.label.overlappingBehavior)) {
                axisOptions.label.overlappingBehavior = { mode: axisOptions.label.overlappingBehavior };
            }
            if(!axisOptions.label.overlappingBehavior || !axisOptions.label.overlappingBehavior.mode) {
                axisOptions.label.overlappingBehavior = axisOptions.label.overlappingBehavior || {};
            }
        }
        return axisOptions;
    };

    var applyParticularAxisOptions = function(name, userOptions, rotated) {
        var theme = this._theme,
            position = !(rotated ^ (name === "valueAxis")) ? "horizontalAxis" : "verticalAxis",
            commonAxisSettings = processAxisOptions(this._userOptions["commonAxisSettings"], name);
        return extend(true, {}, theme.commonAxisSettings, theme[position], theme[name], commonAxisSettings, processAxisOptions(userOptions, name));
    };

    var mergeOptions = function(name, userOptions) {
        userOptions = userOptions || this._userOptions[name];
        var theme = this._theme[name],
            result = this._mergedSettings[name];
        if(result) { return result; }
        if(typeUtils.isPlainObject(theme) && typeUtils.isPlainObject(userOptions)) {
            result = extend(true, {}, theme, userOptions);
        } else {
            result = _isDefined(userOptions) ? userOptions : theme;
        }
        this._mergedSettings[name] = result;
        return result;
    };


    var applyParticularTheme = {
        base: mergeOptions,
        argumentAxis: applyParticularAxisOptions,
        valueAxisRangeSelector: function() {
            return mergeOptions.call(this, "valueAxis");
        },
        valueAxis: applyParticularAxisOptions,
        series: function(name, userOptions) {
            var that = this,
                theme = that._theme,
                userCommonSettings = that._userOptions.commonSeriesSettings || {},
                themeCommonSettings = theme.commonSeriesSettings,
                widgetType = that._themeSection.split(".").slice(-1)[0],
                type = _normalizeEnum(userOptions.type || userCommonSettings.type || themeCommonSettings.type || (widgetType === "pie" && theme.type)), //userCommonSettings.type && themeCommonSettings.type deprecated in 15.2 in pie
                settings,
                palette = that.palette,
                isBar = ~type.indexOf("bar"),
                isLine = ~type.indexOf("line"),
                isArea = ~type.indexOf("area"),
                isBubble = type === "bubble",
                mainSeriesColor,
                resolveLabelsOverlapping = that.getOptions("resolveLabelsOverlapping"),
                resolveLabelOverlapping = that.getOptions("resolveLabelOverlapping"),
                containerBackgroundColor = that.getOptions("containerBackgroundColor"),
                seriesVisibility;

            if(isBar || isBubble) {
                userOptions = extend(true, {}, userCommonSettings, userCommonSettings[type], userOptions);
                seriesVisibility = userOptions.visible;
                userCommonSettings = { type: {} };
                extend(true, userOptions, userOptions.point);
                userOptions.visible = seriesVisibility;
            }

            settings = extend(true, {}, themeCommonSettings, themeCommonSettings[type], userCommonSettings, userCommonSettings[type], userOptions);
            settings.type = type;
            settings.widgetType = widgetType;
            settings.containerBackgroundColor = containerBackgroundColor;
            if(widgetType !== "pie") {
                mainSeriesColor = settings.color || palette.getNextColor();
            } else {
                mainSeriesColor = function(argument, index) {
                    var cat = argument + index;
                    if(!that._multiPieColors[cat]) {
                        that._multiPieColors[cat] = palette.getNextColor();
                    }
                    return that._multiPieColors[cat];
                };
            }
            settings.mainSeriesColor = mainSeriesColor;
            settings.resolveLabelOverlapping = resolveLabelOverlapping;
            settings.resolveLabelsOverlapping = resolveLabelsOverlapping;

            if(settings.label && (isLine || (isArea && type !== "rangearea") || type === "scatter")) {
                settings.label.position = "outside";
            }

            return settings;
        },
        animation: function(name) {
            var userOptions = this._userOptions[name];
            userOptions = typeUtils.isPlainObject(userOptions) ? userOptions : _isDefined(userOptions) ? { enabled: !!userOptions } : {};
            return mergeOptions.call(this, name, userOptions);
        }
    };

    return {
        _themeSection: "chart",
        ctor: ctor,
        dispose: dispose,
        resetPalette: resetPalette,
        getOptions: function(name) {
            return (applyParticularTheme[name] || applyParticularTheme.base).apply(this, arguments);
        },
        refresh: function() {
            this._mergedSettings = {};
            return this.callBase.apply(this, arguments);
        },
        _initializeTheme: function() {
            var that = this;
            that.callBase.apply(that, arguments);
            that.updatePalette(that.getOptions("palette"));
        },
        resetOptions: function(name) {
            this._mergedSettings[name] = null;
        },
        update: function(options) {
            this._userOptions = options;
        },
        updatePalette: updatePalette
    };
})());

exports.ThemeManager = ThemeManager;
