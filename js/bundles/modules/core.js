"use strict";

var DevExpress = window.DevExpress = window.DevExpress || {};

var errors = DevExpress.errors = require("../../core/errors");

if(DevExpress._DEVEXTREME_BUNDLE_INITIALIZED) {
    throw errors.Error("E0024");
}
DevExpress._DEVEXTREME_BUNDLE_INITIALIZED = true;

DevExpress.clientExporter = require("../../client_exporter");

DevExpress.VERSION = require("../../core/version");

DevExpress.Class = require("../../core/class");
DevExpress.DOMComponent = require("../../core/dom_component");
///#DEBUG
DevExpress.Component = require("../../core/component");
///#ENDDEBUG
DevExpress.registerComponent = require("../../core/component_registrator");
DevExpress.devices = require("../../core/devices");

DevExpress.Color = require("../../color");

var $ = require("../../core/renderer");
var compareVersions = require("../../core/utils/version").compare;
if(compareVersions($.fn.jquery, [1, 10]) < 0) {
    throw errors.Error("E0012");
}

var animationFrame = require("../../animation/frame");
/**
 * @name requestAnimationFrame
 * @publicName requestAnimationFrame(callback)
 * @type method
 * @deprecated utils_requestAnimationFrame
 * @extend_doc
 */
DevExpress.requestAnimationFrame = function() {
    errors.log("W0000", "DevExpress.requestAnimationFrame", "15.2", "Use the 'DevExpress.utils.requestAnimationFrame' method instead.");
    return animationFrame.requestAnimationFrame.apply(animationFrame, arguments);
};

/**
 * @name cancelAnimationFrame
 * @publicName cancelAnimationFrame(requestID)
 * @type method
 * @deprecated utils_cancelAnimationFrame
 * @extend_doc
 */
DevExpress.cancelAnimationFrame = function() {
    errors.log("W0000", "DevExpress.cancelAnimationFrame", "15.2", "Use the 'DevExpress.utils.cancelAnimationFrame' method instead.");
    return animationFrame.cancelAnimationFrame.apply(animationFrame, arguments);
};

DevExpress.EventsMixin = require("../../core/events_mixin");

/**
 * @name utils
 * @publicName utils
 */
DevExpress.utils = {};

DevExpress.utils.requestAnimationFrame = animationFrame.requestAnimationFrame;
DevExpress.utils.cancelAnimationFrame = animationFrame.cancelAnimationFrame;

DevExpress.utils.initMobileViewport = require("../../mobile/init_mobile_viewport/init_mobile_viewport").initMobileViewport;

// TODO: MODULARITY: Remove this
DevExpress.utils.extendFromObject = require("../../core/utils/extend").extendFromObject;
DevExpress.utils.createComponents = require("../../core/utils/dom").createComponents;
DevExpress.utils.triggerShownEvent = require("../../core/utils/dom").triggerShownEvent;
DevExpress.utils.triggerHidingEvent = require("../../core/utils/dom").triggerHidingEvent;
DevExpress.utils.resetActiveElement = require("../../core/utils/dom").resetActiveElement;
DevExpress.utils.findBestMatches = require("../../core/utils/common").findBestMatches;
DevExpress.createQueue = require("../../core/utils/queue").create;
DevExpress.utils.dom = require("../../core/utils/dom");
DevExpress.utils.common = require("../../core/utils/common");
DevExpress.utils.date = require("../../core/utils/date");
DevExpress.utils.browser = require("../../core/utils/browser");
DevExpress.utils.inflector = require("../../core/utils/inflector");
DevExpress.utils.resizeCallbacks = require("../../core/utils/window").resizeCallbacks;
DevExpress.utils.console = require("../../core/utils/console");
DevExpress.utils.string = require("../../core/utils/string");
DevExpress.utils.support = require("../../core/utils/support");

DevExpress.processHardwareBackButton = require("../../mobile/process_hardware_back_button");

DevExpress.viewPort = require("../../core/utils/view_port").value;

DevExpress.hideTopOverlay = require("../../mobile/hide_top_overlay");

DevExpress.formatHelper = require("../../format_helper");

var config = DevExpress.config = require("../../core/config");

/**
 * @name rtlEnabled
 * @publicName rtlEnabled
 * @type boolean
 * @default false
 * @deprecated config
 */

Object.defineProperty(DevExpress, 'rtlEnabled', {
    get: function() {
        errors.log("W0003", "DevExpress", "rtlEnabled", "16.1", "Use the 'DevExpress.config' method instead");
        return config().rtlEnabled;
    },
    set: function(value) {
        errors.log("W0003", "DevExpress", "rtlEnabled", "16.1", "Use the 'DevExpress.config' method instead");
        config({ rtlEnabled: value });
    }
});

Object.defineProperty(DevExpress, 'designMode', {
    get: function() {
        return config().designMode;
    },
    set: function(value) {
        config({ designMode: value });
    }
});

DevExpress.animationPresets = require("../../animation/presets/presets").presets;
DevExpress.fx = require("../../animation/fx");
DevExpress.TransitionExecutor = require("../../animation/transition_executor/transition_executor").TransitionExecutor;
DevExpress.AnimationPresetCollection = require("../../animation/presets/presets").PresetCollection;

module.exports = DevExpress.events = {};
DevExpress.events.click = require("../../events/click");
DevExpress.events.utils = require("../../events/utils");
DevExpress.events.GestureEmitter = require("../../events/gesture/emitter.gesture");

DevExpress.localization = require("../../localization");

module.exports = DevExpress;
