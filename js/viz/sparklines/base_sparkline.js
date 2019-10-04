var eventsEngine = require("../../events/core/events_engine"),
    domAdapter = require("../../core/dom_adapter").default,
    ready = require("../../core/utils/ready_callbacks").add,
    isFunction = require("../../core/utils/type").isFunction,
    BaseWidget = require("../core/base_widget"),
    extend = require("../../core/utils/extend").extend,

    DEFAULT_LINE_SPACING = 2,
    DEFAULT_EVENTS_DELAY = 100,

    eventUtils = require("../../events/utils"),
    translator2DModule = require("../translators/translator2d"),

    _extend = extend,
    _noop = require("../../core/utils/common").noop;

function generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled) {
    var lineSpacing = fontOptions.lineSpacing,
        lineHeight = ((lineSpacing !== undefined && lineSpacing !== null) ? lineSpacing : DEFAULT_LINE_SPACING) + fontOptions.size;

    return function(customizeObject) {
        var html = "",
            vt = customizeObject.valueText;
        for(var i = 0; i < vt.length; i += 2) {
            html += "<tr><td>" + vt[i] + "</td><td style='width: 15px'></td><td style='text-align: " + (rtlEnabled ? "left" : "right") + "'>" + vt[i + 1] + "</td></tr>";
        }

        return { html: "<table style='border-spacing:0px; line-height: " + lineHeight + "px'>" + html + "</table>" };
    };
}

function generateCustomizeTooltipCallback(customizeTooltip, fontOptions, rtlEnabled) {
    var defaultCustomizeTooltip = generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled);

    if(isFunction(customizeTooltip)) {
        return function(customizeObject) {
            var res = customizeTooltip.call(customizeObject, customizeObject);
            if(!("html" in res) && !("text" in res)) {
                _extend(res, defaultCustomizeTooltip.call(customizeObject, customizeObject));
            }
            return res;
        };
    } else {
        return defaultCustomizeTooltip;
    }
}

function createAxis(isHorizontal) {
    var translator = new translator2DModule.Translator2D({}, {}, { shiftZeroValue: !isHorizontal, isHorizontal: !!isHorizontal });

    return {
        getTranslator: function() {
            return translator;
        },
        update: function(range, canvas, options) {
            translator.update(range, canvas, options);
        },
        getVisibleArea() {
            const visibleArea = translator.getCanvasVisibleArea();
            return [visibleArea.min, visibleArea.max];
        },
        visualRange: _noop,
        calculateInterval: _noop,
        getMarginOptions() {
            return {};
        }
    };
}

var BaseSparkline = BaseWidget.inherit({
    _getLayoutItems: _noop,
    _useLinks: false,

    _themeDependentChanges: ["OPTIONS"],

    _initCore: function() {
        var that = this;
        that._tooltipTracker = that._renderer.root;
        that._tooltipTracker.attr({ "pointer-events": "visible" });
        that._createHtmlElements();
        that._initTooltipEvents();

        that._argumentAxis = createAxis(true);
        that._valueAxis = createAxis();
    },

    _getDefaultSize: function() {
        return this._defaultSize;
    },

    _disposeCore: function() {
        this._disposeWidgetElements();
        this._disposeTooltipEvents();
        this._ranges = null;
    },

    _optionChangesOrder: ["OPTIONS"],

    _change_OPTIONS: function() {
        this._prepareOptions();
        this._change(["UPDATE"]);
    },

    _customChangesOrder: ["UPDATE"],

    _change_UPDATE: function() {
        this._update();
    },

    _update: function() {
        var that = this;
        if(that._tooltipShown) {
            that._tooltipShown = false;
            that._tooltip.hide();
        }
        that._cleanWidgetElements();
        that._updateWidgetElements();
        that._drawWidgetElements();
    },

    _updateWidgetElements: function() {
        var canvas = this._getCorrectCanvas();
        this._updateRange();

        this._argumentAxis.update(this._ranges.arg, canvas, this._getStick());
        this._valueAxis.update(this._ranges.val, canvas);
    },

    _getStick: function() { },

    _applySize: function(rect) {
        this._allOptions.size = { width: rect[2] - rect[0], height: rect[3] - rect[1] };
        this._change(["UPDATE"]);
    },

    _setupResizeHandler: _noop,

    _prepareOptions: function() {
        return _extend(true, {}, this._themeManager.theme(), this.option());
    },

    _getTooltipCoords: function() {
        var canvas = this._canvas,
            rootOffset = this._renderer.getRootOffset();
        return {
            x: (canvas.width / 2) + rootOffset.left,
            y: (canvas.height / 2) + rootOffset.top
        };
    },

    _initTooltipEvents: function() {
        var that = this,
            data = { widget: that };

        that._showTooltipCallback = function() {
            var tooltip;

            if(!that._tooltipShown) {
                that._tooltipShown = true;
                tooltip = that._getTooltip();
                tooltip.isEnabled() && that._tooltip.show(that._getTooltipData(), that._getTooltipCoords(), {});
            }
            ///#DEBUG
            that._DEBUG_showCallback && that._DEBUG_showCallback();
            ///#ENDDEBUG
        };
        that._hideTooltipCallback = function() {
            ///#DEBUG
            var tooltipWasShown = that._tooltipShown;
            ///#ENDDEBUG
            that._hideTooltipTimeout = null;
            if(that._tooltipShown) {
                that._tooltipShown = false;
                that._tooltip.hide();
            }
            ///#DEBUG
            that._DEBUG_hideCallback && that._DEBUG_hideCallback(tooltipWasShown);
            ///#ENDDEBUG
        };
        that._disposeCallbacks = function() {
            that = that._showTooltipCallback = that._hideTooltipCallback = that._disposeCallbacks = null;
        };
        that._tooltipTracker.on(mouseEvents, data).on(touchEvents, data);

        // for ie11
        that._tooltipTracker.on(menuEvents);
    },

    _stopCurrentHandling() {
        this._hideTooltip();
    },

    _disposeTooltipEvents: function() {
        var that = this;
        clearTimeout(that._hideTooltipTimeout);

        that._tooltipTracker.off();
        that._disposeCallbacks();
    },

    _getTooltip: function() {
        var that = this;
        if(!that._tooltip) {
            _initTooltip.apply(this, arguments);
            that._setTooltipRendererOptions(that._tooltipRendererOptions);
            that._tooltipRendererOptions = null;
            that._setTooltipOptions();
        }
        return that._tooltip;
    }
});

// for ie11
var menuEvents = {
    "contextmenu.sparkline-tooltip": function(event) {
        if(eventUtils.isTouchEvent(event) || eventUtils.isPointerEvent(event)) {
            event.preventDefault();
        }
    },
    "MSHoldVisual.sparkline-tooltip": function(event) {
        event.preventDefault();
    }
};

var mouseEvents = {
    "mouseover.sparkline-tooltip": function(event) {
        isPointerDownCalled = false;
        var widget = event.data.widget;
        widget._x = event.pageX;
        widget._y = event.pageY;
        widget._tooltipTracker.off(mouseMoveEvents).on(mouseMoveEvents, event.data);
        widget._showTooltip();
    },
    "mouseout.sparkline-tooltip": function(event) {
        if(isPointerDownCalled) {
            return;
        }
        var widget = event.data.widget;
        widget._tooltipTracker.off(mouseMoveEvents);
        widget._hideTooltip(DEFAULT_EVENTS_DELAY);
    }
};

var mouseMoveEvents = {
    "mousemove.sparkline-tooltip": function(event) {
        var widget = event.data.widget;
        widget._x = event.pageX;
        widget._y = event.pageY;
        widget._showTooltip();
    }
};

var active_touch_tooltip_widget = null,
    touchStartTooltipProcessing = function(event) {
        var widget = active_touch_tooltip_widget;
        if(widget && widget !== event.data.widget) {
            widget._hideTooltip(DEFAULT_EVENTS_DELAY);
        }
        widget = active_touch_tooltip_widget = event.data.widget;
        widget._showTooltip();
        widget._touch = true;
    },
    touchStartDocumentProcessing = function() {
        var widget = active_touch_tooltip_widget;
        if(widget) {
            if(!widget._touch) {
                widget._hideTooltip(DEFAULT_EVENTS_DELAY);
                active_touch_tooltip_widget = null;
            }
            widget._touch = null;
        }
    },
    touchEndDocumentProcessing = function() {
        var widget = active_touch_tooltip_widget;
        if(widget) {
            widget._hideTooltip(DEFAULT_EVENTS_DELAY);
            active_touch_tooltip_widget = null;
        }
    },
    isPointerDownCalled = false;


var touchEvents = {
    "pointerdown.sparkline-tooltip": touchStartTooltipProcessing,
    "touchstart.sparkline-tooltip": touchStartTooltipProcessing
};
ready(function() {
    eventsEngine.subscribeGlobal(domAdapter.getDocument(), {
        "pointerdown.sparkline-tooltip": function() {
            isPointerDownCalled = true;
            touchStartDocumentProcessing();
        },
        "touchstart.sparkline-tooltip": touchStartDocumentProcessing,
        "pointerup.sparkline-tooltip": touchEndDocumentProcessing,
        "touchend.sparkline-tooltip": touchEndDocumentProcessing
    });
});

module.exports = BaseSparkline;

///#DEBUG
module.exports._DEBUG_reset = function() {
    active_touch_tooltip_widget = null;
};
///#ENDDEBUG

// PLUGINS_SECTION
BaseSparkline.addPlugin(require("../core/tooltip").plugin);

// These are sparklines specifics on using tooltip - they cannot be omitted because of tooltip laziness.
var _initTooltip = BaseSparkline.prototype._initTooltip;
BaseSparkline.prototype._initTooltip = _noop;
var _disposeTooltip = BaseSparkline.prototype._disposeTooltip;
BaseSparkline.prototype._disposeTooltip = function() {
    if(this._tooltip) {
        _disposeTooltip.apply(this, arguments);
    }
};
BaseSparkline.prototype._setTooltipRendererOptions = function() {
    var options = this._getRendererOptions();
    if(this._tooltip) {
        this._tooltip.setRendererOptions(options);
    } else {
        this._tooltipRendererOptions = options;
    }
};
BaseSparkline.prototype._setTooltipOptions = function() {
    var tooltip = this._tooltip,
        options = tooltip && this._getOption("tooltip");
    tooltip && tooltip.update(_extend({}, options, {
        customizeTooltip: generateCustomizeTooltipCallback(options.customizeTooltip, options.font, this.option("rtlEnabled")),
        enabled: options.enabled && this._isTooltipEnabled()
    }));
};

BaseSparkline.prototype._showTooltip = function() {
    var that = this;

    ///#DEBUG
    ++that._DEBUG_clearHideTooltipTimeout;
    ///#ENDDEBUG
    clearTimeout(that._hideTooltipTimeout);
    that._hideTooltipTimeout = null;
    that._showTooltipCallback();
};

BaseSparkline.prototype._hideTooltip = function(delay) {
    var that = this;

    ///#DEBUG
    ++that._DEBUG_clearShowTooltipTimeout;
    ///#ENDDEBUG
    clearTimeout(that._hideTooltipTimeout);
    if(delay) {
        ///#DEBUG
        ++that._DEBUG_hideTooltipTimeoutSet;
        ///#ENDDEBUG
        that._hideTooltipTimeout = setTimeout(that._hideTooltipCallback, delay);
    } else {
        that._hideTooltipCallback();
    }
};

// PLUGINS_SECTION
// T422022
var exportPlugin = extend(true, {}, require("../core/export").plugin, {
    init: _noop,
    dispose: _noop,
    customize: null,
    members: {
        _getExportMenuOptions: null
    }
});

BaseSparkline.addPlugin(exportPlugin);
