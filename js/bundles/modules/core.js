import { getWindow } from '../../core/utils/window';
import errors from '../../core/errors';
import * as exporter from '../../exporter';
import excelExporter from '../../excel_exporter';
import pdfExporter from '../../pdf_exporter';
import { version } from '../../core/version';
import Class from '../../core/class';
import DOMComponent from '../../core/dom_component';
import { Component } from '../../core/component';
import registerComponent from '../../core/component_registrator';
import devices from '../../core/devices';
import color from '../../color';
import { cancelAnimationFrame, requestAnimationFrame } from '../../animation/frame';
import { initMobileViewport } from '../../mobile/init_mobile_viewport/init_mobile_viewport';
import { getTimeZones } from '../../time_zone_utils';
import { extendFromObject } from '../../core/utils/extend';
import { triggerHidingEvent, triggerShownEvent } from '../../events/visibility_change';
import * as dom from '../../core/utils/dom';
import * as common from '../../core/utils/common';
import { create as createQueue } from '../../core/utils/queue';
import date from '../../core/utils/date';
import browser from '../../core/utils/browser';
import * as inflector from '../../core/utils/inflector';
import * as iterator from '../../core/utils/iterator';
import readyCallbacks from '../../core/utils/ready_callbacks';
import resizeCallbacks from '../../core/utils/resize_callbacks';
import * as console from '../../core/utils/console';
import * as string from '../../core/utils/string';
import * as support from '../../core/utils/support';
import ajax from '../../core/utils/ajax';
import { value as viewPort } from '../../core/utils/view_port';
import hideTopOverlay from '../../mobile/hide_top_overlay';
import formatHelper from '../../format_helper';
import config from '../../core/config';
import { presets, PresetCollection } from '../../animation/presets/presets';
import fx from '../../animation/fx';
import { TransitionExecutor } from '../../animation/transition_executor/transition_executor';
import events from '../../events';
import eventsClick from '../../events/click';
import eventsUtils from '../../events/utils';
import GestureEmitter from '../../events/gesture/emitter.gesture';
import localization from '../../localization';
import { renderedCallbacks } from '../../core/templates/template_base';
import { setTemplateEngine } from '../../core/templates/template_engine_registry';

const window = getWindow();

const DevExpress = window.DevExpress = window.DevExpress || {};

DevExpress.errors = errors;

if(DevExpress._DEVEXTREME_BUNDLE_INITIALIZED) {
    throw errors.Error('E0024');
}
DevExpress._DEVEXTREME_BUNDLE_INITIALIZED = true;

DevExpress.clientExporter = exporter;
DevExpress.excelExporter = excelExporter;
DevExpress.pdfExporter = pdfExporter;

DevExpress.VERSION = version;

DevExpress.Class = Class;
DevExpress.DOMComponent = DOMComponent;

DevExpress.Component = Component;

DevExpress.registerComponent = registerComponent;
DevExpress.devices = devices;

DevExpress.Color = color;

/**
 * @name utils
 * @namespace DevExpress
 */
DevExpress.utils = {};

DevExpress.utils.requestAnimationFrame = requestAnimationFrame;
DevExpress.utils.cancelAnimationFrame = cancelAnimationFrame;

DevExpress.utils.initMobileViewport = initMobileViewport;

DevExpress.utils.getTimeZones = getTimeZones;

// TODO: MODULARITY: Remove this
DevExpress.utils.extendFromObject = extendFromObject;
DevExpress.utils.triggerShownEvent = triggerShownEvent;
DevExpress.utils.triggerHidingEvent = triggerHidingEvent;
DevExpress.utils.resetActiveElement = dom.resetActiveElement;
DevExpress.utils.findBestMatches = common.findBestMatches;
DevExpress.createQueue = createQueue;
DevExpress.utils.dom = dom;
DevExpress.utils.common = common;
DevExpress.utils.date = date;
DevExpress.utils.browser = browser;
DevExpress.utils.inflector = inflector;
DevExpress.utils.iterator = iterator;
DevExpress.utils.readyCallbacks = readyCallbacks;
DevExpress.utils.resizeCallbacks = resizeCallbacks;
DevExpress.utils.console = console;
DevExpress.utils.string = string;
DevExpress.utils.support = support;
DevExpress.utils.ajax = ajax;

DevExpress.viewPort = viewPort;

DevExpress.hideTopOverlay = hideTopOverlay;

DevExpress.formatHelper = formatHelper;
DevExpress.config = config;

DevExpress.animationPresets = presets;
DevExpress.fx = fx;
DevExpress.TransitionExecutor = TransitionExecutor;
DevExpress.AnimationPresetCollection = PresetCollection;

DevExpress.events = events;

DevExpress.events.click = eventsClick;
DevExpress.events.utils = eventsUtils;
DevExpress.events.GestureEmitter = GestureEmitter;

DevExpress.localization = localization;

DevExpress.templateRendered = renderedCallbacks;
DevExpress.setTemplateEngine = setTemplateEngine;

export default DevExpress;
