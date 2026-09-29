/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isFunction } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
// PLUGINS_SECTION
// T422022
import BaseWidget from '@ts/viz/core/base_widget';
import { plugin } from '@ts/viz/core/export';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
// PLUGINS_SECTION
import type { TooltipPluginMembers } from '@ts/viz/core/tooltip';
import { plugin as tooltipPlugin } from '@ts/viz/core/tooltip';
import { pointInCanvas } from '@ts/viz/core/utils';
import { Translator2D } from '@ts/viz/translators/translator2d';

const DEFAULT_LINE_SPACING = 2;
const TOOLTIP_TABLE_BORDER_SPACING = 0;
const TOOLTIP_TABLE_KEY_VALUE_SPACE = 15;
const EVENT_NS = 'sparkline-tooltip';
const POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS);

const { _initTooltip: initTooltip } = tooltipPlugin.members;

export interface SparklineSize {
  width: number;
  height: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface SparklineAxis {
  getTranslator: () => ThemeValue;
  update: (range: ThemeValue, canvas: ThemeValue, options?: ThemeValue) => void;
  getVisibleArea: () => number[];
  visualRange: () => void;
  calculateInterval: () => void;
  getMarginOptions: () => ThemeValue;
  aggregatedPointBetweenTicks: () => boolean;
}

interface TooltipCoords {
  x: number;
  y: number;
}

interface PointerEventData {
  pageX: number;
  pageY: number;
}

function inCanvas({ width, height }: SparklineSize, x: number, y: number): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return pointInCanvas({
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
  }, x, y);
}

function pointerHandler({ data }: { data: { widget: BaseSparkline } }): void {
  const { widget } = data;

  widget._enableOutHandler();
  widget._showTooltip();
}

function getDefaultTemplate(
  { lineSpacing, size }: ThemeValue,
  textAlign: string,
): (formatObject: ThemeValue, container: ThemeValue) => void {
  const lineHeight = `${(lineSpacing ?? DEFAULT_LINE_SPACING) + size}px`;

  return function defaultTemplate({ valueText }: ThemeValue, container: ThemeValue): void {
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

function createAxis(isHorizontal?: boolean): SparklineAxis {
  const translator = new Translator2D({}, {}, {
    shiftZeroValue: !isHorizontal,
    isHorizontal: !!isHorizontal,
  });

  return {
    getTranslator(): ThemeValue {
      return translator;
    },
    update(range: ThemeValue, canvas: ThemeValue, options?: ThemeValue): void {
      translator.update(range, canvas, options);
    },
    getVisibleArea(): number[] {
      const visibleArea: { min: number; max: number } = translator.getCanvasVisibleArea();
      return [visibleArea.min, visibleArea.max];
    },
    visualRange: noop,
    calculateInterval: noop,
    getMarginOptions(): ThemeValue {
      return {};
    },
    aggregatedPointBetweenTicks(): boolean {
      return false;
    },
  };
}

interface BaseSparkline extends TooltipPluginMembers {}

abstract class BaseSparkline extends BaseWidget {
  _tooltipTracker;

  _argumentAxis!: SparklineAxis;

  _valueAxis!: SparklineAxis;

  _ranges: ThemeValue;

  _allOptions: ThemeValue;

  _defaultSize!: SparklineSize;

  _tooltipShown?: boolean;

  _outHandler?: ((event: PointerEventData) => void) | null;

  _tooltipRendererOptions: ThemeValue;

  _initCore(): void {
    this._tooltipTracker = this._renderer.root;
    this._tooltipTracker.attr({ 'pointer-events': 'visible' });
    this._createHtmlElements();
    this._initTooltipEvents();

    this._argumentAxis = createAxis(true);
    this._valueAxis = createAxis();
  }

  _getDefaultSize(): SparklineSize {
    return this._defaultSize;
  }

  _disposeCore(): void {
    this._disposeWidgetElements();
    this._disposeTooltipEvents();
    this._ranges = null;
  }

  _change_OPTIONS(): void {
    this._prepareOptions();
    this._change(['UPDATE']);
  }

  _change_UPDATE(): void {
    this._update();
  }

  _update(): void {
    if (this._tooltipShown) {
      this._tooltipShown = false;
      this._tooltip.hide();
    }
    this._cleanWidgetElements();
    this._updateWidgetElements();
    this._drawWidgetElements();
  }

  _updateWidgetElements(): void {
    const canvas = this._getCorrectCanvas();
    this._updateRange();

    this._argumentAxis.update(this._ranges.arg, canvas, this._getStick());
    this._valueAxis.update(this._ranges.val, canvas);
  }

  _getStick(): { stick: boolean } | undefined {
    return undefined;
  }

  _applySize(rect: number[]): void {
    this._allOptions.size = { width: rect[2] - rect[0], height: rect[3] - rect[1] };
    this._change(['UPDATE']);
  }

  _prepareOptions(): ThemeValue {
    return extend(true, {}, this._themeManager.theme(), this.option());
  }

  _getTooltipCoords(): TooltipCoords {
    const canvas = this._canvas;
    const rootOffset = this._renderer.getRootOffset();
    return {
      x: (canvas.width / 2) + rootOffset.left,
      y: (canvas.height / 2) + rootOffset.top,
    };
  }

  _initTooltipEvents(): void {
    const data = { widget: this };

    this._renderer.root.off(`.${EVENT_NS}`)
      .on(POINTER_ACTION, data, pointerHandler);
  }

  _showTooltip(): void {
    if (!this._tooltipShown) {
      this._tooltipShown = true;
      const tooltip = this._getTooltip();
      if (tooltip.isEnabled()) {
        this._tooltip.show(this._getTooltipData(), this._getTooltipCoords(), {});
      }
    }
  }

  _hideTooltip(): void {
    if (this._tooltipShown) {
      this._tooltipShown = false;
      this._tooltip.hide();
    }
  }

  _stopCurrentHandling(): void {
    this._hideTooltip();
  }

  _enableOutHandler(): void {
    if (this._outHandler) {
      return;
    }

    const handler = ({ pageX, pageY }: PointerEventData): void => {
      const { left, top } = this._renderer.getRootOffset();
      const x = Math.floor(pageX - left);
      const y = Math.floor(pageY - top);

      if (!inCanvas(this._canvas, x, y)) {
        this._hideTooltip();
        this._disableOutHandler();
      }
    };

    eventsEngine.on(domAdapter.getDocument(), POINTER_ACTION, handler);
    this._outHandler = handler;
  }

  _disableOutHandler(): void {
    if (this._outHandler) {
      eventsEngine.off(domAdapter.getDocument(), POINTER_ACTION, this._outHandler);
    }
    this._outHandler = null;
  }

  _disposeTooltipEvents(): void {
    this._tooltipTracker.off();
    this._disableOutHandler();
    this._renderer.root.off(`.${EVENT_NS}`);
  }

  _getTooltip(): ThemeValue {
    if (!this._tooltip) {
      initTooltip.call(this);
      this._setTooltipRendererOptions();
      this._tooltipRendererOptions = null;
      this._setTooltipOptions();
    }
    return this._tooltip;
  }

  _getDefaultTooltipTemplate(options: ThemeValue): ThemeValue {
    let defaultTemplateNeeded = true;
    const textAlign = this.option('rtlEnabled') ? 'left' : 'right';

    if (isFunction(options.customizeTooltip)) {
      this._tooltip.update(options);

      const formatObject = this._getTooltipData();
      const customizeResult = options.customizeTooltip.call(formatObject, formatObject) ?? {};

      defaultTemplateNeeded = !('html' in customizeResult) && !('text' in customizeResult);
    }

    return defaultTemplateNeeded && getDefaultTemplate(options.font, textAlign);
  }

  abstract _createHtmlElements(): void;

  abstract _disposeWidgetElements(): void;

  abstract _cleanWidgetElements(): void;

  abstract _drawWidgetElements(): void;

  abstract _updateRange(): void;

  abstract _getCorrectCanvas(): ThemeValue;

  abstract _getTooltipData(): ThemeValue;

  abstract _isTooltipEnabled(): boolean;
}

setupWidgetPrototype(BaseSparkline, {
  _getLayoutItems: noop,
  _useLinks: false,
  _themeDependentChanges: ['OPTIONS'],
  _optionChangesOrder: ['OPTIONS'],
  _customChangesOrder: ['UPDATE'],
  _setupResizeHandler: noop,
});

BaseSparkline.addPlugin(tooltipPlugin);

// These are sparklines specifics on using tooltip - they cannot be omitted because of
// tooltip laziness.
const { _disposeTooltip: disposeTooltip } = BaseSparkline.prototype;

function disposeLazyTooltip(this: BaseSparkline): void {
  if (this._tooltip) {
    disposeTooltip.call(this);
    this._tooltipShown = false;
  }
}

function setLazyTooltipRendererOptions(this: BaseSparkline): void {
  const options = this._getRendererOptions();
  if (this._tooltip) {
    this._tooltip.setRendererOptions(options);
  } else {
    this._tooltipRendererOptions = options;
  }
}

function setLazyTooltipOptions(this: BaseSparkline): void {
  if (this._tooltip) {
    const options = this._getOption('tooltip');
    const defaultContentTemplate = this._getDefaultTooltipTemplate(options);
    const contentTemplateOptions = defaultContentTemplate
      ? { contentTemplate: defaultContentTemplate }
      : {};
    const optionsToUpdate = extend(contentTemplateOptions, options, {
      enabled: options.enabled && this._isTooltipEnabled(),
    });
    this._tooltip.update(optionsToUpdate);
  }
}

BaseSparkline.prototype._initTooltip = noop;
BaseSparkline.prototype._disposeTooltip = disposeLazyTooltip;
BaseSparkline.prototype._setTooltipRendererOptions = setLazyTooltipRendererOptions;
BaseSparkline.prototype._setTooltipOptions = setLazyTooltipOptions;

const exportPlugin = extend(true, {}, plugin, {
  init: noop,
  dispose: noop,
  customize: null,
  members: {
    _getExportMenuOptions: null,
  },
});

BaseSparkline.addPlugin(exportPlugin);

export default BaseSparkline;
