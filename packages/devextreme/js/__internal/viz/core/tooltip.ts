/* eslint-disable import/no-import-module-exports */
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { replaceWith } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { camelize } from '@js/core/utils/inflector';
import { getHeight, getWidth } from '@js/core/utils/size';
import { normalizeStyleProp } from '@js/core/utils/style';
import { isDefined, isFunction, isPlainObject } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import formatHelper from '@js/format_helper';

import type { ThemeValue } from './base_theme_manager';
import { Plaque } from './plaque';
import { Renderer } from './renderers/renderer';
import type { BBox, Canvas } from './types';
import { normalizeEnum, patchFontOptions } from './utils';

const format = formatHelper.format;

const mathCeil = Math.ceil;
const mathMax = Math.max;
const mathMin = Math.min;
const window = getWindow();
const DEFAULT_HTML_GROUP_WIDTH = 3000;

type TooltipEventTrigger = (name: string, data?: ThemeValue) => void;

interface TooltipWidget {
  _getTemplate: (template: ThemeValue) => ThemeValue;
}

interface TooltipParams {
  eventTrigger: TooltipEventTrigger;
  cssClass: string;
  widgetRoot: ThemeValue;
  widget: TooltipWidget;
  pathModified?: boolean;
}

interface TooltipCustomization {
  text?: ThemeValue;
  html?: ThemeValue;
  color?: string;
  borderColor?: string;
  fontColor?: string;
}

interface TooltipState {
  formatObject: ThemeValue;
  eventData: ThemeValue;
  templateCallback?: (isRendered: boolean) => void;
  text?: string;
  html?: string;
  color?: string;
  borderColor?: string;
  textColor?: string;
}

interface TooltipDrawParams {
  group: ThemeValue;
  onRender: () => void;
  eventData: ThemeValue;
  isMoving?: boolean;
  templateCallback?: (isRendered: boolean) => void;
}

function hideElement($element: ThemeValue): void {
  $element.css({ left: '-9999px' }).detach();
}

function getSpecialFormatOptions(options: ThemeValue, specialFormat: string): ThemeValue {
  let result = options;
  switch (specialFormat) {
    case 'argument':
      result = { format: options.argumentFormat };
      break;
    case 'percent':
      result = { format: { type: 'percent', precision: options.format && options.format.percentPrecision } };
      break;
  }
  return result;
}

function createTextHtml(): dxElementWrapper {
  return $('<div>').css({
    position: 'relative', display: 'inline-block', padding: 0, margin: 0, border: '0px solid transparent',
  });
}

function removeElements(elements: ThemeValue[]): void {
  elements.forEach((el) => el.remove());
}

export let Tooltip = class Tooltip {
  declare _eventTrigger: TooltipEventTrigger;

  declare _widgetRoot: ThemeValue;

  declare _widget: TooltipWidget;

  declare _textHtmlContainers: ThemeValue[];

  declare _wrapper: ThemeValue;

  declare _renderer: ThemeValue;

  declare _text: ThemeValue;

  declare _textGroupHtml: ThemeValue;

  declare _textHtml: ThemeValue;

  declare _options: ThemeValue;

  declare _template: ThemeValue;

  declare _textFontStyles: Record<string, ThemeValue>;

  declare _customizeTooltip: ThemeValue;

  declare _state: TooltipState;

  declare _eventData: ThemeValue;

  declare plaque: ThemeValue;

  constructor(params: TooltipParams) {
    this._eventTrigger = params.eventTrigger;
    this._widgetRoot = params.widgetRoot;
    this._widget = params.widget;
    this._textHtmlContainers = [];// T1015148

    this._wrapper = $('<div>')
      .css({ position: 'absolute', overflow: 'hidden', pointerEvents: 'none' }) // T265557, T447623
      .addClass(params.cssClass);

    const renderer = this._renderer = new Renderer({ pathModified: params.pathModified, container: this._wrapper[0] });
    const root = renderer.root;
    root.attr({ 'pointer-events': 'none' });

    // svg text
    this._text = renderer.text(undefined, 0, 0);

    // html text
    this._textGroupHtml = $('<div>').css({
      position: 'absolute', padding: 0, margin: 0, border: '0px solid transparent',
    }).appendTo(this._wrapper);
    this._textHtml = createTextHtml().appendTo(this._textGroupHtml);
  }

  dispose(): void {
    this._wrapper.remove();
    this._renderer.dispose();
    this._options = this._widgetRoot = null;
  }

  _getContainer(): Element {
    const options = this._options;
    let container = $(this._widgetRoot).closest(options.container);
    if (container.length === 0) {
      container = $(options.container);
    }
    return (container.length ? container : $('body')).get(0);
  }

  setTemplate(contentTemplate: ThemeValue): void {
    this._template = contentTemplate ? this._widget._getTemplate(contentTemplate) : null;
  }

  setOptions(options: ThemeValue): this {
    options = options || {};

    this._options = options;
    this._textFontStyles = patchFontOptions(options.font);
    this._textFontStyles.color = this._textFontStyles.fill;
    this._wrapper.css({ zIndex: options.zIndex });

    this._customizeTooltip = options.customizeTooltip;

    const textGroupHtml = this._textGroupHtml;

    if (this.plaque) {
      this.plaque.clear();
    }

    this.setTemplate(options.contentTemplate);

    const pointerEvents = options.interactive ? 'auto' : 'none';
    if (options.interactive) {
      this._renderer.root.css({ '-moz-user-select': 'auto', '-webkit-user-select': 'auto' });
    }

    const drawTooltip = ({
      group, onRender, eventData, isMoving, templateCallback = () => {},
    }: TooltipDrawParams) => {
      const state = this._state;
      if (!isMoving) {
        const template = this._template;
        const useTemplate = template && !state.formatObject.skipTemplate;
        if (state.html || useTemplate) {
          textGroupHtml.css({ color: state.textColor, width: DEFAULT_HTML_GROUP_WIDTH, pointerEvents });
          if (useTemplate) {
            const htmlContainers = this._textHtmlContainers;
            const containerToTemplateRender = createTextHtml().appendTo(this._textGroupHtml);
            htmlContainers.push(containerToTemplateRender);

            template.render({
              model: state.formatObject,
              container: containerToTemplateRender,
              onRendered: () => {
                removeElements(htmlContainers.splice(0, htmlContainers.length - 1));

                this._textHtml = replaceWith(this._textHtml, containerToTemplateRender);

                state.html = this._textHtml.html();
                if (getWidth(this._textHtml) === 0 && getHeight(this._textHtml) === 0) {
                  this.plaque.clear();
                  templateCallback(false);
                  return;
                }

                onRender();
                this._riseEvents(eventData);
                this._moveWrapper();
                this.plaque.customizeCloud({ fill: state.color, stroke: state.borderColor, 'pointer-events': pointerEvents });
                templateCallback(true);
                this._textHtmlContainers = [];
              },
            });
            return;
          } else {
            this._text.attr({ text: '' });
            this._textHtml.html(state.html);
          }
        } else {
          this._text
            .css({ fill: state.textColor })
            .attr({ text: state.text, class: options.cssClass, 'pointer-events': pointerEvents })
            .append(group.attr({ align: options.textAlignment }));
        }
        this._riseEvents(eventData);
        this.plaque.customizeCloud({ fill: state.color, stroke: state.borderColor, 'pointer-events': pointerEvents });
      }
      onRender();
      this._moveWrapper();
      return true;
    };

    this.plaque = new Plaque({
      opacity: this._options.opacity,
      color: this._options.color,
      border: this._options.border,
      paddingLeftRight: this._options.paddingLeftRight,
      paddingTopBottom: this._options.paddingTopBottom,
      arrowLength: this._options.arrowLength,
      arrowWidth: 20,
      shadow: this._options.shadow,
      cornerRadius: this._options.cornerRadius,
    }, this, this._renderer.root, drawTooltip, true, (tooltip, g) => {
      const state = tooltip._state;
      if (state.html) {
        let bBox: CSSStyleDeclaration | BBox = window.getComputedStyle(this._textHtml.get(0));
        bBox = {
          x: 0, y: 0, width: mathCeil(parseFloat(bBox.width)), height: mathCeil(parseFloat(bBox.height)),
        };
        return bBox;
      }
      return g.getBBox();
    }, (tooltip, g, x, y) => {
      const state = tooltip._state;
      if (state.html) {
        this._textGroupHtml.css({ left: x, top: y });
      } else {
        g.move(x, y);
      }
    });

    return this;
  }

  _riseEvents(eventData: ThemeValue): void {
    // trigger event
    // The *onTooltipHidden* is triggered outside the *hide* method because of the cases when *show* is called to determine if tooltip will be visible or not (when target is changed) -
    // *hide* can neither be called before that *show* - because if tooltip is determined to hide it requires some timeout before actually hiding
    // nor after that *show* - because it is either too early to hide (because of timeout) or wrong (because tooltip has already been shown for new target)
    // It is only inside the *show* where it is known weather *onTooltipHidden* is required or not
    // This functionality can be simplified when we get rid of timeouts for tooltip
    this._eventData && this._eventTrigger('tooltipHidden', this._eventData);
    this._eventData = eventData;
    this._eventTrigger('tooltipShown', this._eventData);
  }

  setRendererOptions(options: ThemeValue): this {
    this._renderer.setOptions(options);
    this._textGroupHtml.css({ direction: options.rtl ? 'rtl' : 'ltr' });
    return this;
  }

  update(options: ThemeValue): this {
    this.setOptions(options);

    // The following is because after update (on widget refresh) tooltip must be hidden
    hideElement(this._wrapper);

    // text area
    const normalizedCSS = {};
    for (const name in this._textFontStyles) {
      const normalizedName = camelize(name);
      normalizedCSS[normalizedName] = normalizeStyleProp(normalizedName, this._textFontStyles[name]);
    }
    this._textGroupHtml.css(normalizedCSS);
    this._text.css(this._textFontStyles);

    this._eventData = null;
    return this;
  }

  _prepare(formatObject: ThemeValue, state: TooltipState, customizeTooltip: ThemeValue = this._customizeTooltip): boolean {
    const options = this._options;

    let customize: TooltipCustomization = {};

    if (isFunction(customizeTooltip)) {
      customize = customizeTooltip.call(formatObject, formatObject);
      customize = isPlainObject(customize) ? customize : {};
      if ('text' in customize) {
        state.text = isDefined(customize.text) ? String(customize.text) : '';
      }
      if ('html' in customize) {
        state.html = isDefined(customize.html) ? String(customize.html) : '';
      }
    }
    if (!('text' in state) && !('html' in state)) {
      state.text = formatObject.valueText || formatObject.description || '';
    }
    state.color = customize.color || options.color;
    state.borderColor = customize.borderColor || (options.border || {}).color;
    state.textColor = customize.fontColor || (this._textFontStyles || {}).color;
    return !!state.text || !!state.html || !!this._template;
  }

  show(formatObject: ThemeValue, params: ThemeValue, eventData: ThemeValue, customizeTooltip?: ThemeValue, templateCallback?: (isRendered: boolean) => void): boolean {
    if (this._options.forceEvents) { // for Blazor charts
      eventData.x = params.x;
      eventData.y = params.y - params.offset;
      this._riseEvents(eventData);
      return true;
    }
    const state = {
      formatObject,
      eventData,
      templateCallback,
    };

    if (!this._prepare(formatObject, state, customizeTooltip)) {
      return false;
    }

    this._state = state;

    this._wrapper.appendTo(this._getContainer());

    this._clear();

    const parameters = extend({}, this._options, {
      canvas: this._getCanvas(),
    }, state, {
      x: params.x,
      y: params.y,
      offset: params.offset,
    });
    return this.plaque.clear().draw(parameters);
  }

  isCursorOnTooltip(x: number, y: number): boolean {
    if (this._options.interactive) {
      const box = this.plaque.getBBox();
      return x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height;
    }
    return false;
  }

  hide(isPointerOut?: boolean): void {
    hideElement(this._wrapper);
    // trigger event
    if (this._eventData) {
      this._eventTrigger('tooltipHidden', this._options.forceEvents ? extend({ isPointerOut }, this._eventData) : this._eventData);
      this._clear();
      this._eventData = null;
    }
  }

  _clear(): void {
    this._textHtml.empty();
  }

  move(x: number, y: number, offset?: number): void {
    this.plaque.draw({
      x, y, offset, canvas: this._getCanvas(), isMoving: true,
    });
  }

  _moveWrapper(): void {
    const plaqueBBox = this.plaque.getBBox();
    this._renderer.resize(plaqueBBox.width, plaqueBBox.height);

    // move wrapper
    const offset = this._wrapper.css({ left: 0, top: 0 }).offset();
    const left = plaqueBBox.x;
    const top = plaqueBBox.y;

    this._wrapper.css({
      left: left - offset.left,
      top: top - offset.top,
    });

    this.plaque.moveRoot(-left, -top);
    if (this._state.html) {
      this._textHtml.css({
        left: -left, top: -top,
      });
      this._textGroupHtml.css({ width: mathCeil(getWidth(this._textHtml)) });
    }
  }

  formatValue(value: ThemeValue, _specialFormat?: string): string {
    const options = _specialFormat ? getSpecialFormatOptions(this._options, _specialFormat) : this._options;
    return format(value, options.format);
  }

  getOptions(): ThemeValue {
    return this._options;
  }

  getLocation(): string {
    return normalizeEnum(this._options.location);
  }

  isEnabled(): boolean {
    return !!this._options.enabled
         || !!this._options.forceEvents; // for Blazor charts
  }

  isShared(): boolean {
    return !!this._options.shared;
  }

  _getCanvas(): Canvas {
    const container = this._getContainer();
    const containerBox = container.getBoundingClientRect();
    const html = domAdapter.getDocumentElement();
    const document = domAdapter.getDocument();
    let left = window.pageXOffset || html.scrollLeft || 0;
    let top = window.pageYOffset || html.scrollTop || 0;

    const box = {
      left,
      top,
      width: mathMax(html.clientWidth, document.body.clientWidth) + left,
      height: mathMax(
        document.body.scrollHeight,
        html.scrollHeight,
        document.body.offsetHeight,
        html.offsetHeight,
        document.body.clientHeight,
        html.clientHeight,
      ),

      right: 0,
      bottom: 0,
    };

    if (container !== domAdapter.getBody()) {
      left = mathMax(box.left, box.left + containerBox.left);
      top = mathMax(box.top, box.top + containerBox.top);

      box.width = mathMin(containerBox.width, box.width) + left + box.left;
      box.height = mathMin(containerBox.height, box.height) + top + box.top;

      box.left = left;
      box.top = top;
    }

    return box;
  }
};

export interface TooltipPluginMembers {
  _tooltip: ThemeValue;
  _disposeTooltip: () => void;
  _initTooltip: () => void;
  _setTooltipOptions: () => void;
  _setTooltipRendererOptions: () => void;
}

export const plugin = {
  name: 'tooltip',
  init() {
    this._initTooltip();
  },
  dispose() {
    this._disposeTooltip();
  },
  members: {
    // The method exists only to be overridden in sparklines.
    _initTooltip() {
      this._tooltip = new Tooltip({
        cssClass: `${this._rootClassPrefix}-tooltip`,
        eventTrigger: this._eventTrigger,
        pathModified: this.option('pathModified'),
        widgetRoot: this.element(),
        widget: this,
      });
    },
    // The method exists only to be overridden in sparklines.
    _disposeTooltip() {
      this._tooltip.dispose();
      this._tooltip = null;
    },
    // The method exists only to be overridden in sparklines.
    _setTooltipRendererOptions() {
      this._tooltip.setRendererOptions(this._getRendererOptions());
    },
    // The method exists only to be overridden in sparklines and gauges.
    _setTooltipOptions() {
      this._tooltip.update(this._getOption('tooltip'));
    },
  },
  extenders: {
    _stopCurrentHandling() {
      this._tooltip && this._tooltip.hide();
    },
  },
  customize(constructor) {
    const proto = constructor.prototype;

    proto._eventsMap.onTooltipShown = { name: 'tooltipShown' };
    proto._eventsMap.onTooltipHidden = { name: 'tooltipHidden' };
    constructor.addChange({
      code: 'TOOLTIP_RENDERER',
      handler() {
        this._setTooltipRendererOptions();
      },
      isThemeDependent: true,
      isOptionChange: true,
    });
    constructor.addChange({
      code: 'TOOLTIP',
      handler() {
        this._setTooltipOptions();
      },
      isThemeDependent: true,
      isOptionChange: true,
      option: 'tooltip',
    });
  },
  fontFields: ['tooltip.font'],
};

/// #DEBUG
exports.DEBUG_set_tooltip = function (value) {
  Tooltip = value;
};
/// #ENDDEBUG
