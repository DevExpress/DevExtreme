/* eslint-disable import/no-commonjs */
const windowUtils = require('../../core/utils/window');
const window = windowUtils.getWindow();

const DevExpress = window.DevExpress = window.DevExpress || {};

const errors = DevExpress.errors = require('../../core/errors');

if(DevExpress._DEVEXTREME_BUNDLE_INITIALIZED) {
    throw errors.Error('E0024');
}
DevExpress._DEVEXTREME_BUNDLE_INITIALIZED = true;

DevExpress.clientExporter = require('../../exporter');
DevExpress.excelExporter = require('../../common/export/excel');
DevExpress.pdfExporter = require('../../common/export/pdf');

DevExpress.VERSION = require('../../core/version').version;
DevExpress.assertDevExtremeVersion = require('../../core/version_check').assertDevExtremeVersion;

DevExpress.Class = require('../../core/class');
DevExpress.DOMComponent = require('../../core/dom_component');

DevExpress.Component = require('../../core/component').Component;

DevExpress.registerComponent = require('../../core/component_registrator');
DevExpress.devices = require('../../common/core/environment').devices;
DevExpress.trial = require('../../core/trial_panel');

DevExpress.Color = require('../../color');

const animationFrame = require('../../common/core/animation/frame');

/**
 * @name utils
 * @namespace DevExpress
 */
DevExpress.utils = {};

DevExpress.utils.requestAnimationFrame = animationFrame.requestAnimationFrame;
DevExpress.utils.cancelAnimationFrame = animationFrame.cancelAnimationFrame;

DevExpress.utils.initMobileViewport = require('../../common/core/environment').initMobileViewport;

DevExpress.utils.getTimeZones = require('../../common/core/environment').getTimeZones;

// TODO: MODULARITY: Remove this
DevExpress.utils.extendFromObject = require('../../core/utils/extend').extendFromObject;
DevExpress.utils.triggerShownEvent = require('../../common/core/events/visibility_change').triggerShownEvent;
DevExpress.utils.triggerHidingEvent = require('../../common/core/events/visibility_change').triggerHidingEvent;
DevExpress.utils.resetActiveElement = require('../../core/utils/dom').resetActiveElement;
DevExpress.utils.findBestMatches = require('../../core/utils/common').findBestMatches;
DevExpress.createQueue = require('../../core/utils/queue').create;
DevExpress.utils.dom = require('../../core/utils/dom');
DevExpress.utils.common = require('../../core/utils/common');
DevExpress.utils.date = require('../../core/utils/date');
DevExpress.utils.browser = require('../../core/utils/browser');
DevExpress.utils.inflector = require('../../core/utils/inflector');
DevExpress.utils.iterator = require('../../core/utils/iterator');
DevExpress.utils.readyCallbacks = require('../../core/utils/ready_callbacks');
DevExpress.utils.resizeCallbacks = require('../../core/utils/resize_callbacks');
DevExpress.utils.console = require('../../core/utils/console');
DevExpress.utils.string = require('../../core/utils/string');
DevExpress.utils.support = require('../../core/utils/support');
DevExpress.utils.ajax = require('../../core/utils/ajax');

DevExpress.viewPort = require('../../core/utils/view_port').value;

DevExpress.hideTopOverlay = require('../../common/core/environment').hideTopOverlay;

DevExpress.formatHelper = require('../../format_helper');
DevExpress.config = require('../../common').config;

DevExpress.animationPresets = require('../../common/core/animation/presets/presets').presets;
DevExpress.fx = require('../../common/core/animation').fx;
DevExpress.TransitionExecutor = require('../../common/core/animation/transition_executor/transition_executor').TransitionExecutor;
DevExpress.AnimationPresetCollection = require('../../common/core/animation/presets/presets').PresetCollection;

DevExpress.events = require('../../common/core/events');

DevExpress.events.click = require('../../common/core/events/click');
DevExpress.events.utils = require('../../common/core/events/utils/index');
DevExpress.events.GestureEmitter = require('../../common/core/events/gesture/emitter.gesture');

DevExpress.localization = require('../../common/core/localization');

DevExpress.templateRendered = require('../../core/templates/template_base').renderedCallbacks;
DevExpress.setTemplateEngine = require('../../core/templates/template_engine_registry').setTemplateEngine;

module.exports = DevExpress;
