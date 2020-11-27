import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import { getWindow, hasWindow } from '../../core/utils/window';
import domAdapter from '../../core/dom_adapter';
import { isNumeric, isFunction, isDefined, isObject as _isObject, type } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import _windowResizeCallbacks from '../../core/utils/resize_callbacks';
import { extend } from '../../core/utils/extend';
import { BaseThemeManager } from '../core/base_theme_manager';
import DOMComponent from '../../core/dom_component';
import { changes, replaceInherit } from './helpers';
import { parseScalar as _parseScalar } from './utils';
import warnings from './errors_warnings';
import { Renderer } from './renderers/renderer';
import _Layout from './layout';
import devices from '../../core/devices';
import eventsEngine from '../../events/core/events_engine';
import { when } from '../../core/utils/deferred';
import {
    createEventTrigger,
    createResizeHandler,
    createIncidentOccurred } from './base_widget.utils';
const _floor = Math.floor;
const _log = warnings.log;

const OPTION_RTL_ENABLED = 'rtlEnabled';

const SIZED_ELEMENT_CLASS = 'dx-sized-element';

const _option = DOMComponent.prototype.option;

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

function defaultOnIncidentOccurred(e) {
    if(!e.component._eventsStrategy.hasEvent('incidentOccurred')) {
        _log.apply(null, [e.target.id].concat(e.target.args || []));
    }
}

function pickPositiveValue(values) {
    return values.reduce(function(result, value) {
        return (value > 0 && !result) ? value : result;
    }, 0);
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


const getEmptyComponent = function() {
    const emptyComponentConfig = {
        _initTemplates() {},
        ctor(element, options) {
            this.callBase(element, options);
            const sizedElement = domAdapter.createElement('div');

            const width = options && isNumeric(options.width) ? options.width + 'px' : '100%';
            const height = options && isNumeric(options.height) ? options.height + 'px' : this._getDefaultSize().height + 'px';

            domAdapter.setStyle(sizedElement, 'width', width);
            domAdapter.setStyle(sizedElement, 'height', height);

            domAdapter.setClass(sizedElement, SIZED_ELEMENT_CLASS);
            domAdapter.insertElement(element, sizedElement);
        }
    };

    const EmptyComponent = DOMComponent.inherit(emptyComponentConfig);
    const originalInherit = EmptyComponent.inherit;

    EmptyComponent.inherit = function(config) {
        for(const field in config) {
            if(isFunction(config[field]) && field.substr(0, 1) !== '_' && field !== 'option' || field === '_dispose' || field === '_optionChanged') {
                config[field] = noop;
            }
        }

        return originalInherit.call(this, config);
    };

    return EmptyComponent;
};

function callForEach(functions) {
    functions.forEach(c => c());
}

const isServerSide = !hasWindow();

function sizeIsValid(value) {
    return isDefined(value) && value > 0;
}

const baseWidget = isServerSide ? getEmptyComponent() : DOMComponent.inherit({
    _eventsMap: {
        'onIncidentOccurred': { name: 'incidentOccurred' },
        'onDrawn': { name: 'drawn' }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onIncidentOccurred: defaultOnIncidentOccurred
        });
    },

    _useLinks: true,

    _init: function() {
        const that = this;

        that._$element.children('.' + SIZED_ELEMENT_CLASS).remove();

        that.callBase.apply(that, arguments);
        that._changesLocker = 0;
        that._optionChangedLocker = 0;
        that._asyncFirstDrawing = true;
        that._changes = changes();
        that._suspendChanges();
        that._themeManager = that._createThemeManager();
        that._themeManager.setCallback(function() {
            that._requestChange(that._themeDependentChanges);
        });
        that._renderElementAttributes();
        that._initRenderer();
        // Shouldn't "_useLinks" be passed to the renderer instead of doing 3 checks here?
        const linkTarget = that._useLinks && that._renderer.root;
        // There is an implicit relation between `_useLinks` and `loading indicator` - it uses links
        // Though this relation is not ensured in code we will immediately know when it is broken - `loading indicator` will break on construction
        linkTarget && linkTarget.enableLinks().virtualLink('core').virtualLink('peripheral');
        that._renderVisibilityChange();
        that._attachVisibilityChangeHandlers();
        that._toggleParentsScrollSubscription(this._isVisible());
        that._initEventTrigger();
        that._incidentOccurred = createIncidentOccurred(that.NAME, that._eventTrigger);
        that._layout = new _Layout();
        // Such solution is used only to avoid writing lots of "after" for all core elements in all widgets
        // May be later a proper solution would be found
        linkTarget && linkTarget.linkAfter('core');
        that._initPlugins();
        that._initCore();
        linkTarget && linkTarget.linkAfter();
        that._change(that._initialChanges);
    },

    _createThemeManager() {
        return new BaseThemeManager(this._getThemeManagerOptions());
    },

    _getThemeManagerOptions() {
        return {
            themeSection: this._themeSection,
            fontFields: this._fontFields
        };
    },

    _initialChanges: ['LAYOUT', 'RESIZE_HANDLER', 'THEME', 'DISABLED'],

    _initPlugins: function() {
        const that = this;
        each(that._plugins, function(_, plugin) {
            plugin.init.call(that);
        });
    },

    _disposePlugins: function() {
        const that = this;
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
        const that = this;

        if(--that._changesLocker === 0 && that._changes.count() > 0 && !that._applyingChanges) {
            that._renderer.lock();
            that._applyingChanges = true;
            that._applyChanges();
            that._changes.reset();
            that._applyingChanges = false;
            that._changesApplied();
            that._renderer.unlock();
            if(that._optionsQueue) {
                that._applyQueuedOptions();
            }
            that.resolveItemsDeferred(that._legend ? [that._legend] : []);
            that._optionChangedLocker++;
            that._notify();
            that._optionChangedLocker--;
        }
    },

    resolveItemsDeferred(items) {
        this._resolveDeferred(this._getTemplatesItems(items));
    },

    _collectTemplatesFromItems(items) {
        return items.reduce((prev, i) => {
            return {
                items: prev.items.concat(i.getTemplatesDef()),
                groups: prev.groups.concat(i.getTemplatesGroups())
            };
        }, { items: [], groups: [] });
    },

    _getTemplatesItems(items) {
        const elements = this._collectTemplatesFromItems(items);
        const extraItems = this._getExtraTemplatesItems();
        return {
            items: extraItems.items.concat(elements.items),
            groups: extraItems.groups.concat(elements.groups),
            launchRequest: [extraItems.launchRequest],
            doneRequest: [extraItems.doneRequest]
        };
    },

    _getExtraTemplatesItems() {
        return {
            items: [],
            groups: [],
            launchRequest: () => {},
            doneRequest: () => {}
        };
    },

    _resolveDeferred({ items, launchRequest, doneRequest, groups }) {
        const that = this;

        that._setGroupsVisibility(groups, 'hidden');

        if(that._changesApplying) {
            that._changesApplying = false;
            callForEach(doneRequest);
            return;
        }

        let syncRendering = true;
        when.apply(that, items).done(() => {
            if(syncRendering) {
                that._setGroupsVisibility(groups, 'visible');
                return;
            }
            callForEach(launchRequest);
            that._changesApplying = true;
            const changes = ['LAYOUT', 'FULL_RENDER'];
            if(that._asyncFirstDrawing) {
                changes.push('FORCE_FIRST_DRAWING');
                that._asyncFirstDrawing = false;
            } else {
                changes.push('FORCE_DRAWING');
            }
            that._requestChange(changes);
            that._setGroupsVisibility(groups, 'visible');
        });
        syncRendering = false;
    },

    _setGroupsVisibility(groups, visibility) {
        groups.forEach(g => g.attr({ visibility: visibility }));
    },

    _applyQueuedOptions: function() {
        const that = this;
        const queue = that._optionsQueue;

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
        const that = this;
        const changes = that._changes;
        const order = that._totalChangesOrder;
        let i;
        const ii = order.length;

        for(i = 0; i < ii; ++i) {
            if(changes.has(order[i])) {
                that['_change_' + order[i]]();
            }
        }
    },

    _optionChangesOrder: ['EVENTS', 'THEME', 'RENDERER', 'RESIZE_HANDLER'],

    _layoutChangesOrder: ['ELEMENT_ATTR', 'CONTAINER_SIZE', 'LAYOUT'],

    _customChangesOrder: ['DISABLED'],

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
        this._change(['CONTAINER_SIZE']);
    },

    _change_CONTAINER_SIZE: function() {
        this._updateSize();
    },

    _change_LAYOUT: function() {
        this._setContentSize();
    },

    _change_DISABLED: function() {
        const renderer = this._renderer;
        const root = renderer.root;

        if(this.option('disabled')) {
            this._initDisabledState = root.attr('pointer-events');
            root.attr({
                'pointer-events': 'none',
                filter: renderer.getGrayScaleFilter().id
            });
        } else {
            if(root.attr('pointer-events') === 'none') {
                root.attr({
                    'pointer-events': isDefined(this._initDisabledState) ? this._initDisabledState : null,
                    'filter': null
                });
            }
        }
    },

    _themeDependentChanges: ['RENDERER'],

    _initRenderer: function() {
        const that = this;
        // Canvas is calculated before the renderer is created in order to capture actual size of the container
        that._canvas = that._calculateCanvas();
        that._renderer = new Renderer({ cssClass: that._rootClassPrefix + ' ' + that._rootClass, pathModified: that.option('pathModified'), container: that._$element[0] });
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
        this._requestChange(['CONTAINER_SIZE']);

        const visible = this._isVisible();
        this._toggleParentsScrollSubscription(visible);
        !visible && this._stopCurrentHandling();
    },

    _toggleParentsScrollSubscription: function(subscribe) {
        let $parents = $(this._renderer.root.element).parents();
        const scrollEvents = 'scroll.viz_widgets';

        if(devices.real().platform === 'generic') {
            $parents = $parents.add(getWindow());
        }

        this._proxiedTargetParentsScrollHandler = this._proxiedTargetParentsScrollHandler
            || (function() { this._stopCurrentHandling(); }).bind(this);

        eventsEngine.off($().add(this._$prevRootParents), scrollEvents, this._proxiedTargetParentsScrollHandler);

        if(subscribe) {
            eventsEngine.on($parents, scrollEvents, this._proxiedTargetParentsScrollHandler);
            this._$prevRootParents = $parents;
        }
    },

    _stopCurrentHandling: noop,

    _dispose: function() {
        const that = this;
        that.callBase.apply(that, arguments);
        that._toggleParentsScrollSubscription(false);
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
        const that = this;
        that._eventTrigger = createEventTrigger(that._eventsMap, function(name) { return that._createActionByOption(name); });
    },

    _calculateCanvas: function() {
        const that = this;
        const size = that.option('size') || {};
        const margin = that.option('margin') || {};
        const defaultCanvas = that._getDefaultSize() || {};
        const getSizeOfSide = (size, side) => {
            if(sizeIsValid(size[side]) || !hasWindow()) {
                return 0;
            }
            const elementSize = that._$element[side]();
            return elementSize <= 1 ? 0 : elementSize;
        };
        const elementWidth = getSizeOfSide(size, 'width');
        const elementHeight = getSizeOfSide(size, 'height');
        let canvas = {
            width: size.width <= 0 ? 0 : _floor(pickPositiveValue([size.width, elementWidth, defaultCanvas.width])),
            height: size.height <= 0 ? 0 : _floor(pickPositiveValue([size.height, elementHeight, defaultCanvas.height])),
            left: pickPositiveValue([margin.left, defaultCanvas.left]),
            top: pickPositiveValue([margin.top, defaultCanvas.top]),
            right: pickPositiveValue([margin.right, defaultCanvas.right]),
            bottom: pickPositiveValue([margin.bottom, defaultCanvas.bottom])
        };
        // This for backward compatibility - widget was not rendered when canvas is empty.
        // Now it will be rendered but because of "width" and "height" of the root both set to 0 it will not be visible.
        if(canvas.width - canvas.left - canvas.right <= 0 || canvas.height - canvas.top - canvas.bottom <= 0) {
            canvas = { width: 0, height: 0 };
        }
        return canvas;
    },

    _updateSize: function() {
        const that = this;
        const canvas = that._calculateCanvas();

        that._renderer.fixPlacement();
        if(areCanvasesDifferent(that._canvas, canvas) || that.__forceRender /* for charts */) {
            that._canvas = canvas;
            that._recreateSizeDependentObjects(true);
            that._renderer.resize(canvas.width, canvas.height);
            that._change(['LAYOUT']);
        }
    },

    _recreateSizeDependentObjects: noop,

    _getMinSize: function() {
        return [0, 0];
    },

    _getAlignmentRect: noop,

    _setContentSize: function() {
        const canvas = this._canvas;
        const layout = this._layout;
        let rect = canvas.width > 0 && canvas.height > 0 ? [canvas.left, canvas.top, canvas.width - canvas.right, canvas.height - canvas.bottom] : [0, 0, 0, 0];

        rect = layout.forward(rect, this._getMinSize());
        const nextRect = this._applySize(rect) || rect;
        layout.backward(nextRect, this._getAlignmentRect() || nextRect);
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
        const theme = this._themeManager.theme(name);
        const option = this.option(name);
        return isScalar ? (option !== undefined ? option : theme) : extend(true, {}, theme, option);
    },

    _setupResizeHandler: function() {
        const that = this;
        const redrawOnResize = _parseScalar(this._getOption('redrawOnResize', true), true);

        if(that._resizeHandler) {
            that._removeResizeHandler();
        }

        that._resizeHandler = createResizeHandler(function() {
            if(redrawOnResize) {
                that._requestChange(['CONTAINER_SIZE']);
            } else {
                that._renderer.fixPlacement();
            }
        });
        _windowResizeCallbacks.add(that._resizeHandler);
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
        const that = this;
        // The "_initialized" flag is checked because first time "beginUpdate" is called in the constructor.
        if(that._initialized && that._isUpdateAllowed()) {
            that._onBeginUpdate();
            that._suspendChanges();
        }
        that.callBase.apply(that, arguments);
        return that;
    },

    endUpdate: function() {
        this.callBase();
        this._isUpdateAllowed() && this._resumeChanges();

        return this;
    },

    option: function(name) {
        const that = this;
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
        const that = this;

        return function() {
            _option.apply(that, args);
        };
    },

    // For quite a long time the following method were abstract (from the Component perspective).
    // Now they are not but that basic functionality is not required here.
    _clean: noop,
    _render: noop,

    _optionChanged: function(arg) {
        const that = this;
        if(that._optionChangedLocker) {
            return;
        }

        const partialChanges = that.getPartialChangeOptionsName(arg);
        let changes = [];

        if(partialChanges.length > 0) {
            partialChanges.forEach(pc => changes.push(that._partialOptionChangesMap[pc]));
        } else {
            changes.push(that._optionChangesMap[arg.name]);
        }

        changes = changes.filter(c => !!c);

        if(that._eventTrigger.change(arg.name)) {
            that._change(['EVENTS']);
        } else if(changes.length > 0) {
            that._change(changes);
        } else {
            that.callBase.apply(that, arguments);
        }
    },

    _notify: noop,

    _changesApplied: noop,

    _optionChangesMap: {
        size: 'CONTAINER_SIZE',
        margin: 'CONTAINER_SIZE',
        redrawOnResize: 'RESIZE_HANDLER',
        theme: 'THEME',
        rtlEnabled: 'THEME',
        encodeHtml: 'THEME',
        elementAttr: 'ELEMENT_ATTR',
        disabled: 'DISABLED'
    },

    _partialOptionChangesMap: { },

    _partialOptionChangesPath: { },

    getPartialChangeOptionsName: function(changedOption) {
        const that = this;
        const fullName = changedOption.fullName;
        const sections = fullName.split(/[.]/);
        const name = changedOption.name;
        const value = changedOption.value;
        const options = this._partialOptionChangesPath[name];
        const partialChangeOptionsName = [];

        if(options) {
            if(options === true) {
                partialChangeOptionsName.push(name);
            } else {
                options.forEach(op => {
                    fullName.indexOf(op) >= 0 && partialChangeOptionsName.push(op);
                });
                if(sections.length === 1) {
                    if(type(value) === 'object') {
                        that._addOptionsNameForPartialUpdate(value, options, partialChangeOptionsName);
                    } else if(type(value) === 'array') {
                        if(value.length > 0 && value.every(item => that._checkOptionsForPartialUpdate(item, options))) {
                            value.forEach(item => that._addOptionsNameForPartialUpdate(item, options, partialChangeOptionsName));
                        }
                    }
                }
            }
        }

        return partialChangeOptionsName.filter((value, index, self) => self.indexOf(value) === index);
    },

    _checkOptionsForPartialUpdate: function(optionObject, options) {
        return !Object.keys(optionObject).some((key) => options.indexOf(key) === -1);
    },

    _addOptionsNameForPartialUpdate: function(optionObject, options, partialChangeOptionsName) {
        const optionKeys = Object.keys(optionObject);

        if(this._checkOptionsForPartialUpdate(optionObject, options)) {
            optionKeys.forEach((key) => options.indexOf(key) > -1 && partialChangeOptionsName.push(key));
        }
    },

    _visibilityChanged: function() {
        this.render();
    },

    _setThemeAndRtl: function() {
        this._themeManager.setTheme(this.option('theme'), this.option(OPTION_RTL_ENABLED));
    },

    _getRendererOptions: function() {
        return {
            rtl: this.option(OPTION_RTL_ENABLED),
            encodeHtml: this.option('encodeHtml'),
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
        const canvas = this._canvas || {};
        return { width: canvas.width, height: canvas.height };
    },

    isReady: getFalse,

    _dataIsReady: getTrue,

    _resetIsReady: function() {
        this.isReady = getFalse;
    },

    _drawn: function() {
        const that = this;
        that.isReady = getFalse;
        if(that._dataIsReady()) {
            that._renderer.onEndAnimation(function() {
                that.isReady = getTrue;
            });
        }
        that._eventTrigger('drawn', {});
    }
});

export default baseWidget;

replaceInherit(baseWidget);
