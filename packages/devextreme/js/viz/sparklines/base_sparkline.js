import eventsEngine from '../../common/core/events/core/events_engine';
import domAdapter from '../../core/dom_adapter';
import { isFunction } from '../../core/utils/type';
import BaseWidget from '../../__internal/viz/core/m_base_widget';
import { extend } from '../../core/utils/extend';
import { addNamespace } from '../../common/core/events/utils/index';
import pointerEvents from '../../common/core/events/pointer';
import { pointInCanvas } from '../core/utils';
import $ from '../../core/renderer';

const DEFAULT_LINE_SPACING = 2;
const TOOLTIP_TABLE_BORDER_SPACING = 0;
const TOOLTIP_TABLE_KEY_VALUE_SPACE = 15;
const EVENT_NS = 'sparkline-tooltip';
const POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS);

import { Translator2D } from '../translators/translator2d';

const _extend = extend;
const _floor = Math.floor;
import { noop as _noop } from '../../core/utils/common';

function inCanvas({ width, height }, x, y) {
    return pointInCanvas({
        left: 0,
        top: 0,
        right: width,
        bottom: height,
        width,
        height
    }, x, y);
}

function pointerHandler({ data }) {
    const that = data.widget;

    that._enableOutHandler();
    that._showTooltip();
}

function getDefaultTemplate({ lineSpacing, size }, textAlign) {
    const lineHeight = `${(lineSpacing ?? DEFAULT_LINE_SPACING) + size}px`;

    return function({ valueText }, container) {
        const table = $('<table>').css({
            borderSpacing: TOOLTIP_TABLE_BORDER_SPACING,
            lineHeight
        });

        for(let i = 0; i < valueText.length; i += 2) {
            const tr = $('<tr>');
            $('<td>')
                .text(valueText[i])
                .appendTo(tr);

            $('<td>')
                .css({ width: TOOLTIP_TABLE_KEY_VALUE_SPACE })
                .appendTo(tr);

            $('<td>')
                .css({ textAlign })
                .text(valueText[i + 1])
                .appendTo(tr);

            table.append(tr);
        }

        container.append(table);
    };
}

function createAxis(isHorizontal) {
    const translator = new Translator2D({}, {}, { shiftZeroValue: !isHorizontal, isHorizontal: !!isHorizontal });

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
        },
        aggregatedPointBetweenTicks() {
            return false;
        }
    };
}

/* eslint-disable-next-line */
let _initTooltip;

const BaseSparkline = BaseWidget.inherit({
    _getLayoutItems: _noop,
    _useLinks: false,

    _themeDependentChanges: ['OPTIONS'],

    _initCore: function() {
        const that = this;
        that._tooltipTracker = that._renderer.root;
        that._tooltipTracker.attr({ 'pointer-events': 'visible' });
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

    _optionChangesOrder: ['OPTIONS'],

    _change_OPTIONS: function() {
        this._prepareOptions();
        this._change(['UPDATE']);
    },

    _customChangesOrder: ['UPDATE'],

    _change_UPDATE: function() {
        this._update();
    },

    _update: function() {
        const that = this;
        if(that._tooltipShown) {
            that._tooltipShown = false;
            that._tooltip.hide();
        }
        that._cleanWidgetElements();
        that._updateWidgetElements();
        that._drawWidgetElements();
    },

    _updateWidgetElements: function() {
        const canvas = this._getCorrectCanvas();
        this._updateRange();

        this._argumentAxis.update(this._ranges.arg, canvas, this._getStick());
        this._valueAxis.update(this._ranges.val, canvas);
    },

    _getStick: function() { },

    _applySize: function(rect) {
        this._allOptions.size = { width: rect[2] - rect[0], height: rect[3] - rect[1] };
        this._change(['UPDATE']);
    },

    _setupResizeHandler: _noop,

    _prepareOptions: function() {
        return _extend(true, {}, this._themeManager.theme(), this.option());
    },

    _getTooltipCoords: function() {
        const canvas = this._canvas;
        const rootOffset = this._renderer.getRootOffset();
        return {
            x: (canvas.width / 2) + rootOffset.left,
            y: (canvas.height / 2) + rootOffset.top
        };
    },

    _initTooltipEvents() {
        const data = { widget: this };

        this._renderer.root.off('.' + EVENT_NS)
            .on(POINTER_ACTION, data, pointerHandler);
    },

    _showTooltip() {
        const that = this;
        let tooltip;

        if(!that._tooltipShown) {
            that._tooltipShown = true;
            tooltip = that._getTooltip();
            tooltip.isEnabled() && that._tooltip.show(that._getTooltipData(), that._getTooltipCoords(), {});
        }
    },

    _hideTooltip() {
        if(this._tooltipShown) {
            this._tooltipShown = false;
            this._tooltip.hide();
        }
    },

    _stopCurrentHandling() {
        this._hideTooltip();
    },

    _enableOutHandler() {
        const that = this;
        if(that._outHandler) {
            return;
        }

        const handler = ({ pageX, pageY }) =>{
            const { left, top } = that._renderer.getRootOffset();
            const x = _floor(pageX - left);
            const y = _floor(pageY - top);

            if(!inCanvas(that._canvas, x, y)) {
                that._hideTooltip();
                that._disableOutHandler();
            }
        };

        eventsEngine.on(domAdapter.getDocument(), POINTER_ACTION, handler);
        this._outHandler = handler;
    },

    _disableOutHandler() {
        this._outHandler && eventsEngine.off(domAdapter.getDocument(), POINTER_ACTION, this._outHandler);
        this._outHandler = null;
    },

    _disposeTooltipEvents: function() {
        this._tooltipTracker.off();
        this._disableOutHandler();
        this._renderer.root.off('.' + EVENT_NS);
    },

    _getTooltip: function() {
        const that = this;
        if(!that._tooltip) {
            _initTooltip.apply(this, arguments);
            that._setTooltipRendererOptions(that._tooltipRendererOptions);
            that._tooltipRendererOptions = null;
            that._setTooltipOptions();
        }
        return that._tooltip;
    }
});

export default BaseSparkline;

// PLUGINS_SECTION
import { plugin as tooltipPlugin } from '../core/tooltip';
BaseSparkline.addPlugin(tooltipPlugin);

// These are sparklines specifics on using tooltip - they cannot be omitted because of tooltip laziness.
_initTooltip = BaseSparkline.prototype._initTooltip;
BaseSparkline.prototype._initTooltip = _noop;
const _disposeTooltip = BaseSparkline.prototype._disposeTooltip;
BaseSparkline.prototype._disposeTooltip = function() {
    if(this._tooltip) {
        _disposeTooltip.apply(this, arguments);
    }
};
BaseSparkline.prototype._setTooltipRendererOptions = function() {
    const options = this._getRendererOptions();
    if(this._tooltip) {
        this._tooltip.setRendererOptions(options);
    } else {
        this._tooltipRendererOptions = options;
    }
};
BaseSparkline.prototype._setTooltipOptions = function() {
    if(this._tooltip) {
        const options = this._getOption('tooltip');
        const defaultContentTemplate = this._getDefaultTooltipTemplate(options);
        const contentTemplateOptions = defaultContentTemplate ? { contentTemplate: defaultContentTemplate } : {};
        const optionsToUpdate = _extend(contentTemplateOptions, options, {
            enabled: options.enabled && this._isTooltipEnabled()
        });
        this._tooltip.update(optionsToUpdate);
    }
};

BaseSparkline.prototype._getDefaultTooltipTemplate = function(options) {
    let defaultTemplateNeeded = true;
    const textAlign = this.option('rtlEnabled') ? 'left' : 'right';

    if(isFunction(options.customizeTooltip)) {
        this._tooltip.update(options);

        const formatObject = this._getTooltipData();
        const customizeResult = options.customizeTooltip.call(formatObject, formatObject) ?? {};

        defaultTemplateNeeded = !('html' in customizeResult) && !('text' in customizeResult);
    }

    return defaultTemplateNeeded && getDefaultTemplate(options.font, textAlign);
};

// PLUGINS_SECTION
// T422022
import { plugin } from '../core/export';
const exportPlugin = extend(true, {}, plugin, {
    init: _noop,
    dispose: _noop,
    customize: null,
    members: {
        _getExportMenuOptions: null
    }
});

BaseSparkline.addPlugin(exportPlugin);
