"use strict";

var noop = require("../../core/utils/common").noop,
    each = require("../../core/utils/iterator").each,
    version = require("../../core/version"),
    _windowResizeCallbacks = require("../../core/utils/window").resizeCallbacks,
    _stringFormat = require("../../core/utils/string").format,
    _isObject = require("../../core/utils/type").isObject,
    extend = require("../../core/utils/extend").extend,

    _floor = Math.floor,
    DOMComponent = require("../../core/dom_component"),
    helpers = require("./helpers"),
    _parseScalar = require("./utils").parseScalar,
    errors = require("./errors_warnings"),
    _log = errors.log,
    rendererModule = require("./renderers/renderer"),

    _Layout = require("./layout"),

    OPTION_RTL_ENABLED = "rtlEnabled",

    _option = DOMComponent.prototype.option;

function getTrue() {
    return true;
}

function getFalse() {
    return false;
}

function areCanvasesDifferent(canvas1, canvas2) {
    return !(canvas1.width === canvas2.width && canvas1.height === canvas2.height &&
        canvas1.left === canvas2.left && canvas1.top === canvas2.top && canvas1.right === canvas2.right && canvas1.bottom === canvas2.bottom);
}

function createResizeHandler(callback) {
    var timeout,
        handler = function() {
            clearTimeout(timeout);
            timeout = setTimeout(callback, 100);
        };

    handler.dispose = function() {
        clearTimeout(timeout);
        return this;
    };

    return handler;
}

function defaultOnIncidentOccurred(e) {
    _log.apply(null, [e.target.id].concat(e.target.args || []));
}

// TODO: Such ugly declaration is because of jshint
var createIncidentOccurred = function(widgetName, eventTrigger) {
    return incidentOccurred;
    function incidentOccurred(id, args) {
        eventTrigger("incidentOccurred", {
            target: {
                id: id,
                type: id[0] === "E" ? "error" : "warning",
                args: args,
                text: _stringFormat.apply(null, [errors.ERROR_MESSAGES[id]].concat(args || [])),
                widget: widgetName,
                version: version
            }
        });
    }
};

function pickPositiveValue(value, defaultValue) {
    return Number(value > 0 ? value : (defaultValue || 0));
}

// TODO - Changes handling
// * Provide more validation - something like
//     _changes: [{
//         code: "THEME",
//         options: ["theme"],
//         type: "option",
//         handler: function () {
//             this._setThemeAndRtl();
//         }
//     }, {
//         code: "CONTAINER_SIZE",
//         options: ["size", "option"],
//         type: "layout",
//         handler: function () {
//             this._updateSize();
//         }
//     }]

module.exports = DOMComponent.inherit({
    _eventsMap: {
        "onIncidentOccurred": { name: "incidentOccurred" },
        "onDrawn": { name: "drawn" }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onIncidentOccurred: defaultOnIncidentOccurred
        });
    },

    _useLinks: true,

    _init: function() {
        var that = this,
            linkTarget;
        that.callBase.apply(that, arguments);
        that._changesLocker = 0;
        that._changes = helpers.changes();
        that._suspendChanges();
        that._themeManager = that._createThemeManager();
        that._themeManager.setCallback(function() {
            that._requestChange(that._themeDependentChanges);
        });
        that._renderElementAttributes();
        that._initRenderer();
        // Shouldn't "_useLinks" be passed to the renderer instead of doing 3 checks here?
        linkTarget = that._useLinks && that._renderer.root;
        // There is an implicit relation between `_useLinks` and `loading indicator` - it uses links
        // Though this relation is not ensured in code we will immediately know when it is broken - `loading indicator` will break on construction
        linkTarget && linkTarget.enableLinks().virtualLink("core").virtualLink("peripheral");
        that._renderVisibilityChange();
        that._initEventTrigger();
        that._incidentOccurred = createIncidentOccurred(that.NAME, that._eventTrigger);
        that._layout = new _Layout();
        // Such solution is used only to avoid writing lots of "after" for all core elements in all widgets
        // May be later a proper solution would be found
        linkTarget && linkTarget.linkAfter("core");
        that._initPlugins();
        that._initCore();
        linkTarget && linkTarget.linkAfter();
        that._change(that._initialChanges);
        that._resumeChanges();
    },

    _initialChanges: ["LAYOUT", "RESIZE_HANDLER", "THEME"],

    _initPlugins: function() {
        var that = this;
        each(that._plugins, function(_, plugin) {
            plugin.init.call(that);
        });
    },

    _disposePlugins: function() {
        var that = this;
        each(that._plugins.slice().reverse(), function(_, plugin) {
            plugin.dispose.call(that);
        });
    },

    _change: function(codes) {
        this._changes.add(codes);
    },

    _suspendChanges: function() {
        ++this._changesLocker;
    },

    _resumeChanges: function() {
        var that = this;

        if(--that._changesLocker === 0 && that._changes.count() > 0 && !that._applyingChanges) {
            that._renderer.lock();
            that._applyingChanges = true;
            that._applyChanges();
            that._changes.reset();
            that._applyingChanges = false;
            that._renderer.unlock();
            if(that._optionsQueue) {
                that._applyQueuedOptions();
            }
        }
    },

    _applyQueuedOptions: function() {
        var that = this,
            queue = that._optionsQueue;

        that._optionsQueue = null;
        that.beginUpdate();
        each(queue, function(_, action) {
            action();
        });
        that.endUpdate();
    },

    _requestChange: function(codes) {
        this._suspendChanges();
        this._change(codes);
        this._resumeChanges();
    },

    _applyChanges: function() {
        var that = this,
            changes = that._changes,
            order = that._totalChangesOrder,
            i,
            ii = order.length;

        for(i = 0; i < ii; ++i) {
            if(changes.has(order[i])) {
                that["_change_" + order[i]]();
            }
        }
    },

    _optionChangesOrder: ["EVENTS", "THEME", "RENDERER", "RESIZE_HANDLER"],

    _layoutChangesOrder: ["ELEMENT_ATTR", "CONTAINER_SIZE", "LAYOUT"],

    _customChangesOrder: [],

    _change_EVENTS: function() {
        this._eventTrigger.applyChanges();
    },

    _change_THEME: function() {
        this._setThemeAndRtl();
    },

    _change_RENDERER: function() {
        this._setRendererOptions();
    },

    _change_RESIZE_HANDLER: function() {
        this._setupResizeHandler();
    },

    _change_ELEMENT_ATTR: function() {
        this._renderElementAttributes();
        this._change(["CONTAINER_SIZE"]);
    },

    _change_CONTAINER_SIZE: function() {
        this._updateSize();
    },

    _change_LAYOUT: function() {
        this._setContentSize();
    },

    _themeDependentChanges: ["RENDERER"],

    _initRenderer: function() {
        var that = this;
        // Canvas is calculated before the renderer is created in order to capture actual size of the container
        that._canvas = that._calculateCanvas();
        that._renderer = new rendererModule.Renderer({ cssClass: that._rootClassPrefix + " " + that._rootClass, pathModified: that.option("pathModified"), container: that._$element[0] });
        that._renderer.resize(that._canvas.width, that._canvas.height);
    },

    _disposeRenderer: function() {
        ///#DEBUG
        // NOTE: This is temporary - until links mechanism is stabilized
        this._useLinks && this._renderer.root.checkLinks();
        ///#ENDDEBUG
        this._renderer.dispose();
    },

    _getAnimationOptions: noop,

    render: function() {
        this._requestChange(["CONTAINER_SIZE"]);
        this._onRender();
    },

    // This is actually added only to make tooltip pluggable. This is bad but much better than entire tooltip in BaseWidget.
    _onRender: noop,

    _dispose: function() {
        var that = this;
        that.callBase.apply(that, arguments);
        that._removeResizeHandler();
        that._layout.dispose();
        that._eventTrigger.dispose();
        that._disposeCore();
        that._disposePlugins();
        that._disposeRenderer();
        that._themeManager.dispose();
        that._themeManager = that._renderer = that._eventTrigger = null;
    },

    _initEventTrigger: function() {
        var that = this;
        that._eventTrigger = createEventTrigger(that._eventsMap, function(name) { return that._createActionByOption(name); });
    },

    _calculateCanvas: function() {
        var that = this,
            size = that.option("size") || {},
            margin = that.option("margin") || {},
            defaultCanvas = that._getDefaultSize() || {},
            canvas = {
                width: size.width <= 0 ? 0 : _floor(pickPositiveValue(size.width, that._$element.width() || defaultCanvas.width)),
                height: size.height <= 0 ? 0 : _floor(pickPositiveValue(size.height, that._$element.height() || defaultCanvas.height)),
                left: pickPositiveValue(margin.left, defaultCanvas.left || 0),
                top: pickPositiveValue(margin.top, defaultCanvas.top || 0),
                right: pickPositiveValue(margin.right, defaultCanvas.right || 0),
                bottom: pickPositiveValue(margin.bottom, defaultCanvas.bottom || 0)
            };
        // This for backward compatibility - widget was not rendered when canvas is empty.
        // Now it will be rendered but because of "width" and "height" of the root both set to 0 it will not be visible.
        if(canvas.width - canvas.left - canvas.right <= 0 || canvas.height - canvas.top - canvas.bottom <= 0) {
            canvas = { width: 0, height: 0 };
        }
        return canvas;
    },

    _updateSize: function() {
        var that = this,
            canvas = that._calculateCanvas();
        if(areCanvasesDifferent(that._canvas, canvas) || that.__forceRender /*for charts*/) {
            that._canvas = canvas;
            that._renderer.resize(canvas.width, canvas.height);
            that._change(["LAYOUT"]);
        }
    },

    _setContentSize: function() {
        var canvas = this._canvas,
            layout = this._layout,
            rect = canvas.width > 0 && canvas.height > 0 ? [canvas.left, canvas.top, canvas.width - canvas.right, canvas.height - canvas.bottom] : [0, 0, 0, 0],
            nextRect;

        rect = layout.forward(rect);
        nextRect = this._applySize(rect) || rect;
        layout.backward(nextRect);
    },

    ///#DEBUG
    DEBUG_getCanvas: function() {
        return this._canvas;
    },

    DEBUG_getEventTrigger: function() {
        return this._eventTrigger;
    },
    ///#ENDDEBUG

    _getOption: function(name, isScalar) {
        var theme = this._themeManager.theme(name),
            option = this.option(name);
        return isScalar ? (option !== undefined ? option : theme) : extend(true, {}, theme, option);
    },

    _setupResizeHandler: function() {
        if(_parseScalar(this._getOption("redrawOnResize", true), true)) {
            this._addResizeHandler();
        } else {
            this._removeResizeHandler();
        }
    },

    _addResizeHandler: function() {
        var that = this;
        if(!that._resizeHandler) {
            that._resizeHandler = createResizeHandler(function() {
                that._requestChange(["CONTAINER_SIZE"]);
            });
            _windowResizeCallbacks.add(that._resizeHandler);
        }
    },

    _removeResizeHandler: function() {
        if(this._resizeHandler) {
            _windowResizeCallbacks.remove(this._resizeHandler);
            this._resizeHandler.dispose();
            this._resizeHandler = null;
        }
    },

    // This is actually added only to make loading indicator pluggable. This is bad but much better than entire loading indicator in BaseWidget.
    _onBeginUpdate: noop,

    beginUpdate: function() {
        var that = this;
        // The "_initialized" flag is checked because first time "beginUpdate" is called in the constructor.
        if(that._initialized && that._updateLockCount === 0) {
            that._onBeginUpdate();
            that._suspendChanges();
        }
        that.callBase.apply(that, arguments);
        return that;
    },

    endUpdate: function() {
        var that = this,
            initialized = that._initialized;
        // The "_initialized" flag is checked because first time "endUpdate" is called in the constructor.
        // Local is used because the flag is toggled in the base method.
        that.callBase.apply(that, arguments);
        if(initialized && that._updateLockCount === 0) {
            that._resumeChanges();
        }
        return that;
    },

    option: function(name) {
        var that = this;
        // NOTE: `undefined` has to be returned because base option setter returns `undefined`.
        // `argument.length` and `isObject` checks are copypaste from Component.
        if(that._initialized && that._applyingChanges && (arguments.length > 1 || _isObject(name))) {
            that._optionsQueue = that._optionsQueue || [];
            that._optionsQueue.push(that._getActionForUpdating(arguments));
        } else {
            return _option.apply(that, arguments);
        }
    },

    _getActionForUpdating: function(args) {
        var that = this;

        return that._deprecatedOptionsSuppressed ? function() { //T479911
            that._suppressDeprecatedWarnings();
            _option.apply(that, args);
            that._resumeDeprecatedWarnings();
        } : function() {
            _option.apply(that, args);
        };
    },

    // For quite a long time the following method were abstract (from the Component perspective).
    // Now they are not but that basic functionality is not required here.
    _clean: noop,
    _render: noop,

    _optionChanged: function(arg) {
        var that = this;
        if(that._eventTrigger.change(arg.name)) {
            that._change(["EVENTS"]);
        } else if(that._optionChangesMap[arg.name]) {
            that._change([that._optionChangesMap[arg.name]]);
        } else {
            that.callBase.apply(that, arguments);
        }
    },

    _optionChangesMap: {
        size: "CONTAINER_SIZE",
        margin: "CONTAINER_SIZE",
        redrawOnResize: "RESIZE_HANDLER",
        theme: "THEME",
        rtlEnabled: "THEME",
        encodeHtml: "THEME",
        elementAttr: "ELEMENT_ATTR"
    },

    _visibilityChanged: function() {
        this.render();
    },

    _setThemeAndRtl: function() {
        this._themeManager.setTheme(this.option("theme"), this.option(OPTION_RTL_ENABLED));
    },

    _getRendererOptions: function() {
        return {
            rtl: this.option(OPTION_RTL_ENABLED),
            encodeHtml: this.option("encodeHtml"),
            animation: this._getAnimationOptions()
        };
    },

    _setRendererOptions: function() {
        this._renderer.setOptions(this._getRendererOptions());
    },

    svg: function() {
        return this._renderer.svg();
    },

    getSize: function() {
        var canvas = this._canvas || {};
        return { width: canvas.width, height: canvas.height };
    },

    isReady: getFalse,

    _dataIsReady: getTrue,

    _resetIsReady: function() {
        this.isReady = getFalse;
    },

    _drawn: function() {
        var that = this;
        that.isReady = getFalse;
        if(that._dataIsReady()) {
            that._renderer.onEndAnimation(function() {
                that.isReady = getTrue;
            });
        }
        that._eventTrigger("drawn", {});
    }
});

helpers.replaceInherit(module.exports);

function createEventTrigger(eventsMap, callbackGetter) {
    var triggers = {};

    each(eventsMap, function(name, info) {
        if(info.name) {
            createEvent(name);
        }
    });
    var changes;
    triggerEvent.change = function(name) {
        var eventInfo = eventsMap[name];
        if(eventInfo) {
            (changes = changes || {})[name] = eventInfo;
        }
        return !!eventInfo;
    };
    triggerEvent.applyChanges = function() {
        if(changes) {
            each(changes, function(name, eventInfo) {
                createEvent(eventInfo.newName || name);
            });
            changes = null;
        }
    };
    triggerEvent.dispose = function() {
        eventsMap = callbackGetter = triggers = null;
    };

    return triggerEvent;

    function createEvent(name) {
        var eventInfo = eventsMap[name];

        triggers[eventInfo.name] = callbackGetter(name);
    }

    function triggerEvent(name, arg, complete) {
        triggers[name](arg);
        complete && complete();
    }
}
///#DEBUG
module.exports.DEBUG_createEventTrigger = createEventTrigger;
module.exports.DEBUG_createIncidentOccurred = createIncidentOccurred;
module.exports.DEBUG_stub_createIncidentOccurred = function(stub) {
    createIncidentOccurred = stub;
};
module.exports.DEBUG_restore_createIncidentOccurred = function() {
    createIncidentOccurred = module.exports.DEBUG_createIncidentOccurred;
};
module.exports.DEBUG_createResizeHandler = createResizeHandler;
///#ENDDEBUG
