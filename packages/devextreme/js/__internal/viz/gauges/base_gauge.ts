import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import formatHelper from '@js/format_helper';
import { paintedColor } from '@ts/core/utils/css_variables';
import type DOMComponent from '@ts/core/widget/dom_component';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import BaseWidget from '@ts/viz/core/base_widget';
import { plugin as exportPlugin } from '@ts/viz/core/export';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { plugin as loadingIndicatorPlugin } from '@ts/viz/core/loading_indicator';
import { plugin as titlePlugin } from '@ts/viz/core/title';
import { plugin as tooltipPlugin } from '@ts/viz/core/tooltip';
import { getAppropriateFormat } from '@ts/viz/core/utils';
import themeManagerModule from '@ts/viz/gauges/theme_manager';
import type { TrackerParameters } from '@ts/viz/gauges/tracker';
import Tracker from '@ts/viz/gauges/tracker';
import { Translator1D } from '@ts/viz/translators/translator1d';

const { format } = formatHelper;

export interface GaugeAnimationSettings {
  duration: number;
  easing: ThemeValue;
  step?: (pos: number) => void;
  complete?: () => void;
}

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface GaugeFormatOptions {
  format?: ThemeValue;
  customizeText?: (this: ThemeValue, formatObject: ThemeValue) => ThemeValue;
}

export abstract class BaseGauge extends BaseWidget {
  static addPlugin: (plugin: ThemeValue) => void;

  static getInstance: typeof DOMComponent.getInstance;

  _valueChangingLocker!: number;

  _translator;

  _tracker;

  _innerRect!: Rect;

  _area;

  _isValidDomain?: boolean;

  _animationSettings!: GaugeAnimationSettings | null;

  _containerBackgroundColor;

  _defaultFormatOptions;

  _noAnimation?: boolean;

  _resizing?: boolean;

  _titleBBoxCache: ThemeValue;

  _createThemeManager(): ThemeValue {
    return new themeManagerModule.ThemeManager(this._getThemeManagerOptions());
  }

  _initCore(): void {
    const { root } = this._renderer;

    this._valueChangingLocker = 0;
    this._translator = this._factory.createTranslator();

    this._tracker = this._factory.createTracker({ renderer: this._renderer, container: root });

    this._setTrackerCallbacks();
  }

  _beginValueChanging(): void {
    this._resetIsReady();
    this._onBeginUpdate();
    this._valueChangingLocker += 1;
  }

  _endValueChanging(): void {
    this._valueChangingLocker -= 1;
    if (this._valueChangingLocker === 0) {
      this._drawn();
    }
  }

  _setTrackerCallbacks(): void {
    const renderer = this._renderer;
    const tooltip = this._tooltip;

    this._tracker.setCallbacks({
      'tooltip-show': (target: ThemeValue, info: ThemeValue, callback: ThemeValue): ThemeValue => {
        const tooltipParameters = target.getTooltipParameters();
        const offset = renderer.getRootOffset();
        const formatObject = extend({
          value: tooltipParameters.value,
          valueText: tooltip.formatValue(tooltipParameters.value),
          color: paintedColor(tooltipParameters.color, renderer.root.element),
        }, info);

        return tooltip.show(formatObject, {
          x: tooltipParameters.x + offset.left,
          y: tooltipParameters.y + offset.top,
          offset: tooltipParameters.offset,
        }, { target: info }, undefined, callback);
      },
      'tooltip-hide': (): ThemeValue => tooltip.hide(),
    });
  }

  _dispose(...args: unknown[]): void {
    this._cleanCore();
    super._dispose(...args);
  }

  _disposeCore(): void {
    this._themeManager.dispose();
    this._tracker.dispose();

    this._tracker = null;
    this._translator = null;
  }

  _cleanCore(): void {
    this._tracker.deactivate();
    this._noAnimation = false;
    this._cleanContent();
  }

  _renderCore(): void {
    if (!this._isValidDomain) return;

    this._renderContent();
    this._renderGraphicObjects();
    this._tracker.setTooltipState(this._tooltip.isEnabled());
    this._tracker.activate();
    this._noAnimation = false;
    /// #DEBUG
    if (this._debug_rendered) {
      this._debug_rendered();
    }
    /// #ENDDEBUG
  }

  _applyChanges(...args: unknown[]): void {
    super._applyChanges(...args);
    this._noAnimation = false;
    this._resizing = false;
  }

  _setContentSize(...args: unknown[]): void {
    this._noAnimation = this._changes.count() === 2;
    this._resizing = this._noAnimation;
    super._setContentSize(...args);
  }

  _getChangesRequireCoreUpdate(): string[] {
    return ['DOMAIN', 'MOSTLY_TOTAL', 'EXPORT'];
  }

  _isTitleBBoxChanged(): boolean {
    const titleBBox = this._title.getLayoutOptions();
    const hasTitleHeightChanged = titleBBox.height !== this._titleBBoxCache?.height;
    const hasTitleYChanged = titleBBox.y !== this._titleBBoxCache?.y;
    const hasVerticalAlignmentChanged = titleBBox.verticalAlignment
      !== this._titleBBoxCache?.verticalAlignment;

    this._titleBBoxCache = null;

    return hasTitleHeightChanged || hasTitleYChanged || hasVerticalAlignmentChanged;
  }

  _forceCoreUpdate(): boolean {
    const isTriggeredByTitleOnly = this._changes.has('TITLE')
      && !this._getChangesRequireCoreUpdate().some((change) => this._changes.has(change));

    if (isTriggeredByTitleOnly) {
      return this._isTitleBBoxChanged();
    }

    return true;
  }

  _applySize(rect: number[]): number[] {
    /// #DEBUG
    this._DEBUG_rootRect = rect;
    /// #ENDDEBUG
    this._innerRect = {
      left: rect[0], top: rect[1], right: rect[2], bottom: rect[3],
    };
    // If loading indicator is shown it is got hidden at the end of "_renderCore" - during "_drawn".
    // Then "loadingIndicator" option is changed.
    // It causes another "_setContentSize" execution (inside of the first one). Layout backwards
    // during inner "_setContentSize" and clears its cache and then backwards again during outer
    // "_setContentSize" when "_cache" is null - so it fails.
    // The following code dirtily preserves layout cache for the outer backward.
    // The appropriate solution is to remove heavy rendering from "_applySize" - it should be done
    // later during some other change processing.
    // It would be even better to somehow defer any inside option changes - so they all are applied
    // after all changes are processed.
    const layoutCache = this._layout._cache;

    if (this._forceCoreUpdate()) {
      this._cleanCore();
      this._renderCore();
    }

    this._layout._cache = this._layout._cache || layoutCache;
    return [rect[0], this._innerRect.top, rect[2], this._innerRect.bottom];
  }

  _change_DOMAIN(): void {
    this._setupDomain();
  }

  _change_MOSTLY_TOTAL(): void {
    this._applyMostlyTotalChange();
  }

  _setupDomain(): void {
    this._setupDomainCore();
    // T130599
    this._isValidDomain = isFinite(
      1 / (this._translator.getDomain()[1] - this._translator.getDomain()[0]),
    );
    if (!this._isValidDomain) {
      this._incidentOccurred('W2301');
    }
    this._change(['MOSTLY_TOTAL']);
  }

  _applyMostlyTotalChange(): void {
    this._setupCodomain();
    this._setupAnimationSettings();
    this._setupDefaultFormat();
    this._change(['LAYOUT']);
  }

  _setupAnimationSettings(): void {
    let option = this.option('animation');
    this._animationSettings = null;
    if (option === undefined || option) {
      option = extend({
        enabled: true,
        duration: 1000,
        easing: 'easeOutCubic',
      }, option);
      if (option.enabled && option.duration > 0) {
        this._animationSettings = { duration: Number(option.duration), easing: option.easing };
      }
    }
    //  It is better to place it here than to create separate function for one line of code
    this._containerBackgroundColor = this.option('containerBackgroundColor')
      || this._themeManager.theme().containerBackgroundColor;
  }

  _setupDefaultFormat(): void {
    const domain = this._translator.getDomain();
    this._defaultFormatOptions = getAppropriateFormat(
      domain[0],
      domain[1],
      this._getApproximateScreenRange(),
    );
  }

  abstract _setupDomainCore(): void;

  abstract _cleanContent(): void;

  abstract _renderContent(): void;

  abstract _setupCodomain(): void;

  abstract _getApproximateScreenRange(): number;
}

setupWidgetPrototype(BaseGauge, {
  _rootClassPrefix: 'dxg',
  _themeSection: 'gauge',
  _titleBBoxCache: null,
  _initialChanges: ['DOMAIN'],
  _themeDependentChanges: ['DOMAIN'],
  _optionChangesMap: {
    subtitle: 'MOSTLY_TOTAL',
    indicator: 'MOSTLY_TOTAL',
    geometry: 'MOSTLY_TOTAL',
    animation: 'MOSTLY_TOTAL',
    startValue: 'DOMAIN',
    endValue: 'DOMAIN',
  },
  _optionChangesOrder: ['DOMAIN', 'MOSTLY_TOTAL'],
  _updateExtraElements: noop,
  _factory: {
    createTranslator(): ThemeValue {
      return new Translator1D();
    },

    createTracker(parameters: TrackerParameters): Tracker {
      return new Tracker(parameters);
    },
  },
});

//  TODO: find a better place for it
export function formatValue(
  value: number,
  options?: GaugeFormatOptions,
  extra?: ThemeValue,
): string {
  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const formatOptions: GaugeFormatOptions = options ?? {};
  const text = format(normalizedValue, formatOptions.format);
  if (typeof formatOptions.customizeText === 'function') {
    const formatObject = extend({ value: normalizedValue, valueText: text }, extra);
    return String(formatOptions.customizeText.call(formatObject, formatObject));
  }
  return text;
}

//  TODO: find a better place for it
export function getSampleText(translator: ThemeValue, options?: GaugeFormatOptions): string {
  const text1 = formatValue(translator.getDomainStart(), options);
  const text2 = formatValue(translator.getDomainEnd(), options);
  return text1.length >= text2.length ? text1 : text2;
}

function compareArraysElements(array1: ThemeValue[], array2: ThemeValue[]): boolean {
  for (let i = 0; i < array1.length; i += 1) {
    const bothValuesAreNaN = Number.isNaN(array1[i]) && Number.isNaN(array2[i]);
    if (!bothValuesAreNaN && array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

export function compareArrays(array1: ThemeValue, array2: ThemeValue): boolean {
  return Boolean(array1 && array2 && array1.length === array2.length)
    && compareArraysElements(array1, array2);
}

// PLUGINS_SECTION
BaseGauge.addPlugin(exportPlugin);
BaseGauge.addPlugin(titlePlugin);
BaseGauge.addPlugin(tooltipPlugin);
BaseGauge.addPlugin(loadingIndicatorPlugin);

// These are gauges specifics on using tooltip - they require refactoring.
const { _setTooltipOptions: setTooltipOptions } = BaseGauge.prototype;
BaseGauge.prototype._setTooltipOptions = function setTooltipOptionsWithTracker(
  this: BaseGauge,
  ...args: unknown[]
): void {
  setTooltipOptions.apply(this, args);
  if (this._tracker) {
    this._tracker.setTooltipState(this._tooltip.isEnabled());
  }
};

const { _change_TITLE: changeTitle } = BaseGauge.prototype;
BaseGauge.prototype._change_TITLE = function changeTitleWithCache(
  this: BaseGauge,
  ...args: unknown[]
): void {
  this._titleBBoxCache = { ...this._title.getLayoutOptions() };

  changeTitle.apply(this, args);

  /// #DEBUG
  if (this._DEBUG_change_title) {
    this._DEBUG_change_title();
  }
  /// #ENDDEBUG
};
