var $ = require("../../core/renderer"),
    window = require("../../core/utils/window").getWindow(),
    CalendarStrategy = require("./ui.date_box.strategy.calendar"),
    TimeView = require("./ui.time_view"),
    dateLocalization = require("../../localization/date"),
    extend = require("../../core/utils/extend").extend,
    Box = require("../box"),
    uiDateUtils = require("./ui.date_utils");

var SHRINK_VIEW_SCREEN_WIDTH = 573,
    DATEBOX_ADAPTIVITY_MODE_CLASS = "dx-datebox-adaptivity-mode";

var CalendarWithTimeStrategy = CalendarStrategy.inherit({

    NAME: "CalendarWithTime",

    getDefaultOptions: function() {
        return extend(this.callBase(), {
            applyValueMode: "useButtons",
            buttonsLocation: "bottom after",
            showPopupTitle: false
        });
    },

    getDisplayFormat: function(displayFormat) {
        return displayFormat || "shortdateshorttime";
    },

    _is24HourFormat: function() {
        return dateLocalization.is24HourFormat(this.getDisplayFormat(this.dateBox.option("displayFormat")));
    },

    _renderWidget: function() {
        this.callBase();

        this._timeView = this.dateBox._createComponent($("<div>"), TimeView, {
            value: this.dateBoxValue(),
            _showClock: !this._isShrinkView(),
            use24HourFormat: this._is24HourFormat(),
            onValueChanged: this._valueChangedHandler.bind(this),
            stylingMode: this.dateBox.option("stylingMode")
        });

        this._timeView.registerKeyHandler("escape", this._escapeHandler.bind(this));
    },

    renderOpenedState: function() {
        this.callBase();
        var popup = this._getPopup();

        if(popup) {
            popup._wrapper().toggleClass(DATEBOX_ADAPTIVITY_MODE_CLASS, this._isSmallScreen());
        }

        clearTimeout(this._repaintTimer);

        this._repaintTimer = setTimeout((function() {
            this._getPopup() && this._getPopup().repaint();
        }).bind(this), 0);
    },

    isAdaptivityChanged: function() {
        var isAdaptiveMode = this._isShrinkView(),
            currentAdaptiveMode = this._currentAdaptiveMode;

        if(isAdaptiveMode !== currentAdaptiveMode) {
            this._currentAdaptiveMode = isAdaptiveMode;
            return currentAdaptiveMode !== undefined;
        }

        return this.callBase();
    },

    _updateValue: function(preventDefaultValue) {
        var date = this.dateBoxValue();

        if(!date && !preventDefaultValue) {
            date = new Date();
            uiDateUtils.normalizeTime(date);
        }

        this.callBase();

        if(this._timeView) {
            date && this._timeView.option("value", date);
            this._timeView.option("use24HourFormat", this._is24HourFormat());
        }
    },

    _isSmallScreen: function() {
        return $(window).width() <= SHRINK_VIEW_SCREEN_WIDTH;
    },

    _isShrinkView: function() {
        return !this.dateBox.option("showAnalogClock") || (this.dateBox.option("adaptivityEnabled") && this._isSmallScreen());
    },

    _getBoxItems: function() {
        var items = [{ ratio: 0, shrink: 0, baseSize: "auto", name: "calendar" }];

        if(!this._isShrinkView()) {
            items.push({ ratio: 0, shrink: 0, baseSize: "auto", name: "time" });
        }

        return items;
    },

    renderPopupContent: function() {
        this.callBase();
        this._currentAdaptiveMode = this._isShrinkView();

        var $popupContent = this._getPopup().$content();

        this._box = this.dateBox._createComponent($("<div>").appendTo($popupContent), Box, {
            direction: "row",
            crossAlign: "start",
            items: this._getBoxItems(),
            itemTemplate: (function(data) {
                var $container = $("<div>");

                switch(data.name) {
                    case "calendar":
                        $container.append(this._widget.$element());
                        if(this._isShrinkView()) $container.append(this._timeView.$element());
                        break;
                    case "time":
                        $container.append(this._timeView.$element());
                        break;
                }

                return $container;
            }).bind(this)
        });

        this._attachTabHandler();
    },

    popupConfig: function(popupConfig) {
        var calendarPopupConfig = this.callBase(popupConfig),
            result = extend(calendarPopupConfig, {
                onShowing: (function() {
                    if(this._box.option("_layoutStrategy") === "fallback") {
                        var clockMinWidth = this._getPopup().$content().find(".dx-timeview-clock").css("minWidth");

                        this._timeView.$element().css("maxWidth", clockMinWidth);
                    }
                }).bind(this),
            });

        return result;
    },

    getFirstPopupElement: function() {
        return this._timeView._hourBox.$element().find("input");
    },

    _attachTabHandler: function() {
        var dateBox = this.dateBox,
            handler = function(e) {
                if(e.shiftKey) {
                    e.preventDefault();
                    dateBox.focus();
                }
            };

        this._timeView._hourBox.registerKeyHandler("tab", handler);
    },

    _preventFocusOnPopup: function(e) {
        if(!$(e.target).hasClass("dx-texteditor-input")) {
            this.callBase.apply(this, arguments);
            if(!this.dateBox._hasFocusClass()) {
                this.dateBox.focus();
            }
        }
    },

    getValue: function() {
        var date = this._widget.option("value"),
            time = this._timeView.option("value");

        date = date ? new Date(date) : new Date();
        date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());

        return date;
    },

    dispose: function() {
        clearTimeout(this._removeMinWidthTimer);
        clearTimeout(this._repaintTimer);
        this.callBase();
    }
});

module.exports = CalendarWithTimeStrategy;
