/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { noop as _noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isFunction } from '@js/core/utils/type';
// PLUGINS_SECTION
// T422022
import { plugin } from '@ts/viz/core/export';
import BaseWidget from '@ts/viz/core/m_base_widget';
// PLUGINS_SECTION
import { plugin as tooltipPlugin } from '@ts/viz/core/tooltip';
import { pointInCanvas } from '@ts/viz/core/utils';
import { Translator2D } from '@ts/viz/translators/translator2d';

const DEFAULT_LINE_SPACING = 2;
const TOOLTIP_TABLE_BORDER_SPACING = 0;
const TOOLTIP_TABLE_KEY_VALUE_SPACE = 15;
const EVENT_NS = 'sparkline-tooltip';
const POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS);

const _extend = extend;
const _floor = Math.floor;

function inCanvas({ width, height }, x, y) {
  return pointInCanvas({
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
  }, x, y);
}

function pointerHandler({ data }) {
  const that = data.widget;

  that._enableOutHandler();
  that._showTooltip();
}

function getDefaultTemplate({ lineSpacing, size }, textAlign) {
  const lineHeight = `${(lineSpacing ?? DEFAULT_LINE_SPACING) + size}px`;

  return function ({ valueText }, container) {
    const table = $('<table>').css({
      borderSpacing: TOOLTIP_TABLE_BORDER_SPACING,
      lineHeight,
    });

    for (let i = 0; i < valueText.length; i += 2) {
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

function createAxis(isHorizontal?) {
  const translator = new Translator2D({}, {}, { shiftZeroValue: !isHorizontal, isHorizontal: !!isHorizontal });

  return {
    getTranslator() {
      return translator;
    },
    update(range, canvas, options) {
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
    },
  };
}

let _initTooltip;

const BaseSparkline = BaseWidget.inherit({
  _getLayoutItems: _noop,
  _useLinks: false,

  _themeDependentChanges: ['OPTIONS'],

  _initCore() {
    const that = this;
    that._tooltipTracker = that._renderer.root;
    that._tooltipTracker.attr({ 'pointer-events': 'visible' });
    that._createHtmlElements();
    that._initTooltipEvents();

    that._argumentAxis = createAxis(true);
    that._valueAxis = createAxis();
  },

  _getDefaultSize() {
    return this._defaultSize;
  },

  _disposeCore() {
    this._disposeWidgetElements();
    this._disposeTooltipEvents();
    this._ranges = null;
  },

  _optionChangesOrder: ['OPTIONS'],

  _change_OPTIONS() {
    this._prepareOptions();
    this._change(['UPDATE']);
  },

  _customChangesOrder: ['UPDATE'],

  _change_UPDATE() {
    this._update();
  },

  _update() {
    const that = this;
    if (that._tooltipShown) {
      that._tooltipShown = false;
      that._tooltip.hide();
    }
    that._cleanWidgetElements();
    that._updateWidgetElements();
    that._drawWidgetElements();
  },

  _updateWidgetElements() {
    const canvas = this._getCorrectCanvas();
    this._updateRange();

    this._argumentAxis.update(this._ranges.arg, canvas, this._getStick());
    this._valueAxis.update(this._ranges.val, canvas);
  },

  _getStick() { },

  _applySize(rect) {
    this._allOptions.size = { width: rect[2] - rect[0], height: rect[3] - rect[1] };
    this._change(['UPDATE']);
  },

  _setupResizeHandler: _noop,

  _prepareOptions() {
    return _extend(true, {}, this._themeManager.theme(), this.option());
  },

  _getTooltipCoords() {
    const canvas = this._canvas;
    const rootOffset = this._renderer.getRootOffset();
    return {
      x: (canvas.width / 2) + rootOffset.left,
      y: (canvas.height / 2) + rootOffset.top,
    };
  },

  _initTooltipEvents() {
    const data = { widget: this };

    this._renderer.root.off(`.${EVENT_NS}`)
      .on(POINTER_ACTION, data, pointerHandler);
  },

  _showTooltip() {
    const that = this;
    let tooltip;

    if (!that._tooltipShown) {
      that._tooltipShown = true;
      tooltip = that._getTooltip();
      tooltip.isEnabled() && that._tooltip.show(that._getTooltipData(), that._getTooltipCoords(), {});
    }
  },

  _hideTooltip() {
    if (this._tooltipShown) {
      this._tooltipShown = false;
      this._tooltip.hide();
    }
  },

  _stopCurrentHandling() {
    this._hideTooltip();
  },

  _enableOutHandler() {
    const that = this;
    if (that._outHandler) {
      return;
    }

    const handler = ({ pageX, pageY }) => {
      const { left, top } = that._renderer.getRootOffset();
      const x = _floor(pageX - left);
      const y = _floor(pageY - top);

      if (!inCanvas(that._canvas, x, y)) {
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

  _disposeTooltipEvents() {
    this._tooltipTracker.off();
    this._disableOutHandler();
    this._renderer.root.off(`.${EVENT_NS}`);
  },

  _getTooltip() {
    const that = this;
    if (!that._tooltip) {
      _initTooltip.apply(this, arguments);
      that._setTooltipRendererOptions(that._tooltipRendererOptions);
      that._tooltipRendererOptions = null;
      that._setTooltipOptions();
    }
    return that._tooltip;
  },
});

export default BaseSparkline;
BaseSparkline.addPlugin(tooltipPlugin);

// These are sparklines specifics on using tooltip - they cannot be omitted because of tooltip laziness.
_initTooltip = BaseSparkline.prototype._initTooltip;
BaseSparkline.prototype._initTooltip = _noop;
const _disposeTooltip = BaseSparkline.prototype._disposeTooltip;
BaseSparkline.prototype._disposeTooltip = function () {
  if (this._tooltip) {
    _disposeTooltip.apply(this, arguments);
    this._tooltipShown = false;
  }
};
BaseSparkline.prototype._setTooltipRendererOptions = function () {
  const options = this._getRendererOptions();
  if (this._tooltip) {
    this._tooltip.setRendererOptions(options);
  } else {
    this._tooltipRendererOptions = options;
  }
};
BaseSparkline.prototype._setTooltipOptions = function () {
  if (this._tooltip) {
    const options = this._getOption('tooltip');
    const defaultContentTemplate = this._getDefaultTooltipTemplate(options);
    const contentTemplateOptions = defaultContentTemplate ? { contentTemplate: defaultContentTemplate } : {};
    const optionsToUpdate = _extend(contentTemplateOptions, options, {
      enabled: options.enabled && this._isTooltipEnabled(),
    });
    this._tooltip.update(optionsToUpdate);
  }
};

BaseSparkline.prototype._getDefaultTooltipTemplate = function (options) {
  let defaultTemplateNeeded = true;
  const textAlign = this.option('rtlEnabled') ? 'left' : 'right';

  if (isFunction(options.customizeTooltip)) {
    this._tooltip.update(options);

    const formatObject = this._getTooltipData();
    const customizeResult = options.customizeTooltip.call(formatObject, formatObject) ?? {};

    defaultTemplateNeeded = !('html' in customizeResult) && !('text' in customizeResult);
  }

  return defaultTemplateNeeded && getDefaultTemplate(options.font, textAlign);
};

const exportPlugin = extend(true, {}, plugin, {
  init: _noop,
  dispose: _noop,
  customize: null,
  members: {
    _getExportMenuOptions: null,
  },
});

BaseSparkline.addPlugin(exportPlugin);
