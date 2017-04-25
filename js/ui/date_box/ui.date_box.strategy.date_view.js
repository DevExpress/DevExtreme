"use strict";

var $ = require("jquery"),
    DateView = require("./ui.date_view"),
    DateBoxStrategy = require("./ui.date_box.strategy"),
    support = require("../../core/utils/support"),
    themes = require("../themes"),
    dateUtils = require("./ui.date_utils"),
    messageLocalization = require("../../localization/message");

var DateViewStrategy = DateBoxStrategy.inherit({

    NAME: "DateView",

    getDefaultOptions: function() {
        return $.extend(this.callBase(), {
            openOnFieldClick: true,
            applyButtonText: messageLocalization.format("Done")
        });
    },

    getDisplayFormat: function(displayFormat) {
        return displayFormat || dateUtils.FORMATS_MAP[this.dateBox.option("type")];
    },

    popupConfig: function() {
        return {
            showTitle: true,
            toolbarItems: this.dateBox._popupToolbarItemsConfig(),

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
                        var currentTheme = (themes.current() || "").split(".")[0];
                        return currentTheme === "win8";
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
                        height: "auto",
                        position: {
                            collision: "flipfit flip"
                        }
                    }
                },
                {
                    device: function(device) {
                        var currentTheme = (themes.current() || "").split(".")[0];
                        return device.phone && currentTheme === "win10";
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
                this._widget.element().remove();
                this._widget = null;
            }

            return;
        }

        var popup = this._getPopup();

        if(this._widget) {
            this._widget.option(this._getWidgetOptions());
        } else {
            var element = $("<div>").appendTo(popup.content());
            this._widget = this._createWidget(element);
        }

        this._widget.element().appendTo(this._getWidgetContainer());
    },

    _getWidgetName: function() {
        return DateView;
    },

    _getWidgetOptions: function() {
        return {
            value: this.dateBoxValue() || new Date(),
            type: this.dateBox.option("type"),
            minDate: this.dateBox.dateOption("min") || new Date(1900, 1, 1),
            maxDate: this.dateBox.dateOption("max") || new Date($.now() + 50 * dateUtils.ONE_YEAR),
            onDisposing: $.proxy(function() {
                this._widget = null;
            }, this)
        };
    },

    _updateValue: function() {
        this._widget && this._widget.option("value", this.dateBoxValue());
    }
});

module.exports = DateViewStrategy;
