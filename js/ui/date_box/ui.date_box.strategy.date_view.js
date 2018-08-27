var $ = require("../../core/renderer"),
    window = require("../../core/utils/window").getWindow(),
    DateView = require("./ui.date_view"),
    DateBoxStrategy = require("./ui.date_box.strategy"),
    support = require("../../core/utils/support"),
    extend = require("../../core/utils/extend").extend,
    themes = require("../themes"),
    dateUtils = require("./ui.date_utils"),
    messageLocalization = require("../../localization/message");

var DateViewStrategy = DateBoxStrategy.inherit({

    NAME: "DateView",

    getDefaultOptions: function() {
        return extend(this.callBase(), {
            openOnFieldClick: true,
            applyButtonText: messageLocalization.format("Done")
        });
    },

    getDisplayFormat: function(displayFormat) {
        return displayFormat || dateUtils.FORMATS_MAP[this.dateBox.option("type")];
    },

    popupConfig: function(config) {
        var themeName = themes.current();

        return {
            showTitle: true,
            toolbarItems: this.dateBox._popupToolbarItemsConfig(),
            onInitialized: config.onInitialized,

            defaultOptionsRules: [
                {
                    device: function(device) {
                        return device.platform === "win" && device.version && device.version[0] === 8;
                    },
                    options: {
                        showNames: true
                    }
                },
                {
                    device: function(device) {
                        return device.platform === "win" && device.phone && device.version && device.version[0] === 8;
                    },
                    options: {
                        animation: null
                    }
                },
                {
                    device: function() {
                        return themes.isWin8(themeName);
                    },
                    options: {
                        fullScreen: true
                    }
                },
                {
                    device: { platform: "android" },
                    options: {
                        width: 333,
                        height: 331
                    }
                },
                {
                    device: function(device) {
                        var platform = device.platform,
                            version = device.version;
                        return platform === "generic" || platform === "ios" || (platform === "win" && version && version[0] === 10);
                    },
                    options: {
                        width: "auto",
                        height: "auto"
                    }
                },
                {
                    device: function(device) {
                        var platform = device.platform,
                            phone = device.phone;

                        return platform === "generic" && phone;
                    },
                    options: {
                        width: 333,
                        maxWidth: "100%",
                        maxHeight: "100%",
                        height: "auto",
                        position: {
                            collision: "flipfit flip"
                        }
                    }
                },
                {
                    device: function(device) {
                        return device.phone && themes.isWin10(themeName);
                    },
                    options: {
                        width: 333,
                        height: "auto"
                    }
                },
                {
                    device: { platform: "ios", phone: true },
                    options: {
                        width: "100%",
                        position: {
                            my: "bottom",
                            at: "bottom",
                            of: window
                        }
                    }
                }
            ]
        };
    },

    _renderWidget: function() {
        if(support.inputType(this.dateBox.option("mode")) && this.dateBox._isNativeType() || this.dateBox.option("readOnly")) {
            if(this._widget) {
                this._widget.$element().remove();
                this._widget = null;
            }

            return;
        }

        var popup = this._getPopup();

        if(this._widget) {
            this._widget.option(this._getWidgetOptions());
        } else {
            var element = $("<div>").appendTo(popup.$content());
            this._widget = this._createWidget(element);
        }

        this._widget.$element().appendTo(this._getWidgetContainer());
    },

    _getWidgetName: function() {
        return DateView;
    },

    _getWidgetOptions: function() {
        return {
            value: this.dateBoxValue() || new Date(),
            type: this.dateBox.option("type"),
            minDate: this.dateBox.dateOption("min") || new Date(1900, 1, 1),
            maxDate: this.dateBox.dateOption("max") || new Date(Date.now() + 50 * dateUtils.ONE_YEAR),
            onDisposing: (function() {
                this._widget = null;
            }).bind(this)
        };
    }
});

module.exports = DateViewStrategy;
