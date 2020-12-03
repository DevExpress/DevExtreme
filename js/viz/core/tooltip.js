import domAdapter from '../../core/dom_adapter';
import { getWindow } from '../../core/utils/window';
import { camelize } from '../../core/utils/inflector';
import $ from '../../core/renderer';
import { Renderer } from './renderers/renderer';
import { isFunction, isPlainObject, isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { patchFontOptions, normalizeEnum } from './utils';
import formatHelper from '../../format_helper';

import { Plaque } from './plaque';

const format = formatHelper.format;

const mathCeil = Math.ceil;
const mathMax = Math.max;
const mathMin = Math.min;
const window = getWindow();
const DEFAULT_HTML_GROUP_WIDTH = 3000;

function hideElement($element) {
    $element.css({ left: '-9999px' }).detach();
}

function getSpecialFormatOptions(options, specialFormat) {
    let result = options;
    switch(specialFormat) {
        case 'argument':
            result = { format: options.argumentFormat };
            break;
        case 'percent':
            result = { format: { type: 'percent', precision: options.format && options.format.percentPrecision } };
            break;
    }
    return result;
}

export let Tooltip = function(params) {
    const that = this;
    let renderer;

    that._eventTrigger = params.eventTrigger;
    that._widgetRoot = params.widgetRoot;
    that._widget = params.widget;

    that._wrapper = $('<div>')
        .css({ position: 'absolute', overflow: 'hidden', 'pointerEvents': 'none' }) // T265557, T447623
        .addClass(params.cssClass);

    that._renderer = renderer = new Renderer({ pathModified: params.pathModified, container: that._wrapper[0] });
    const root = renderer.root;
    root.attr({ 'pointer-events': 'none' });

    // svg text
    that._text = renderer.text(undefined, 0, 0);

    // html text
    that._textGroupHtml = $('<div>').css({ position: 'absolute', padding: 0, margin: 0, border: '0px solid transparent' }).appendTo(that._wrapper);
    that._textHtml = $('<div>').css({ position: 'relative', display: 'inline-block', padding: 0, margin: 0, border: '0px solid transparent' }).appendTo(that._textGroupHtml);
};

Tooltip.prototype = {
    constructor: Tooltip,

    dispose: function() {
        this._wrapper.remove();
        this._renderer.dispose();
        this._options = this._widgetRoot = null;
    },

    _getContainer: function() {
        const options = this._options;
        let container = $(this._widgetRoot).closest(options.container);
        if(container.length === 0) {
            container = $(options.container);
        }
        return (container.length ? container : $('body')).get(0);
    },

    setTemplate(contentTemplate) {
        const that = this;
        that._template = contentTemplate ? that._widget._getTemplate(contentTemplate) : null;
    },

    setOptions: function(options) {
        options = options || {};

        const that = this;

        that._options = options;
        that._textFontStyles = patchFontOptions(options.font);
        that._textFontStyles.color = that._textFontStyles.fill;
        that._wrapper.css({ 'zIndex': options.zIndex });

        that._customizeTooltip = options.customizeTooltip;

        const textGroupHtml = that._textGroupHtml;
        const textHtml = that._textHtml;

        if(this.plaque) {
            this.plaque.clear();
        }

        this.setTemplate(options.contentTemplate);

        const pointerEvents = options.interactive ? 'auto' : 'none';
        if(options.interactive) {
            this._renderer.root.css({ '-ms-user-select': 'auto', '-moz-user-select': 'auto', '-webkit-user-select': 'auto' });
        }

        const drawTooltip = ({ group, onRender, eventData, isMoving, templateCallback = () => {} }) => {
            const state = that._state;
            if(!isMoving) {
                const template = that._template;
                const useTemplate = template && !state.formatObject.skipTemplate;
                if(state.html || useTemplate) {
                    textGroupHtml.css({ color: state.textColor, width: DEFAULT_HTML_GROUP_WIDTH, 'pointerEvents': pointerEvents });
                    if(useTemplate) {
                        template.render({ model: state.formatObject, container: textHtml, onRendered: () => {
                            state.html = textHtml.html();
                            if(textHtml.width() === 0 && textHtml.height() === 0) {
                                this.plaque.clear();
                                templateCallback(false);
                                return;
                            }

                            onRender();
                            that._riseEvents(eventData);
                            that._moveWrapper();
                            that.plaque.customizeCloud({ fill: state.color, stroke: state.borderColor, 'pointer-events': pointerEvents });
                            templateCallback(true);
                        } });
                        return;
                    } else {
                        that._text.attr({ text: '' });
                        textHtml.html(state.html);
                    }
                } else {
                    that._text
                        .css({ fill: state.textColor })
                        .attr({ text: state.text, class: options.cssClass, 'pointer-events': pointerEvents })
                        .append(group.attr({ align: options.textAlignment }));
                }
                that._riseEvents(eventData);
                that.plaque.customizeCloud({ fill: state.color, stroke: state.borderColor, 'pointer-events': pointerEvents });
            }
            onRender();
            that._moveWrapper();
            return true;
        };

        this.plaque = new Plaque({
            opacity: that._options.opacity,
            color: that._options.color,
            border: that._options.border,
            paddingLeftRight: that._options.paddingLeftRight,
            paddingTopBottom: that._options.paddingTopBottom,
            arrowLength: that._options.arrowLength,
            arrowWidth: 20,
            shadow: that._options.shadow,
            cornerRadius: that._options.cornerRadius
        }, that, that._renderer.root, drawTooltip, true, (tooltip, g) => {
            const state = tooltip._state;
            if(state.html) {
                let bBox;
                const getComputedStyle = window.getComputedStyle;
                if(getComputedStyle) { // IE9 compatibility (T298249)
                    bBox = getComputedStyle(textHtml.get(0));
                    bBox = { x: 0, y: 0, width: mathCeil(parseFloat(bBox.width)), height: mathCeil(parseFloat(bBox.height)) };
                } else {
                    bBox = textHtml.get(0).getBoundingClientRect();
                    bBox = { x: 0, y: 0, width: mathCeil(bBox.width ? bBox.width : (bBox.right - bBox.left)), height: mathCeil(bBox.height ? bBox.height : (bBox.bottom - bBox.top)) };
                }
                return bBox;
            }
            return g.getBBox();
        }, (tooltip, g, x, y) => {
            const state = tooltip._state;
            if(state.html) {
                that._textGroupHtml.css({ left: x, top: y });
            } else {
                g.move(x, y);
            }
        });

        return that;
    },

    _riseEvents: function(eventData) {
        // trigger event
        // The *onTooltipHidden* is triggered outside the *hide* method because of the cases when *show* is called to determine if tooltip will be visible or not (when target is changed) -
        // *hide* can neither be called before that *show* - because if tooltip is determined to hide it requires some timeout before actually hiding
        // nor after that *show* - because it is either too early to hide (because of timeout) or wrong (because tooltip has already been shown for new target)
        // It is only inside the *show* where it is known weather *onTooltipHidden* is required or not
        // This functionality can be simplified when we get rid of timeouts for tooltip
        const that = this;
        that._eventData && that._eventTrigger('tooltipHidden', that._eventData);
        that._eventData = eventData;
        that._eventTrigger('tooltipShown', that._eventData);
    },

    setRendererOptions: function(options) {
        this._renderer.setOptions(options);
        this._textGroupHtml.css({ direction: options.rtl ? 'rtl' : 'ltr' });
        return this;
    },

    update: function(options) {
        const that = this;

        that.setOptions(options);

        // The following is because after update (on widget refresh) tooltip must be hidden
        hideElement(that._wrapper);

        // text area
        const normalizedCSS = {};
        for(const name in that._textFontStyles) {
            normalizedCSS[camelize(name)] = that._textFontStyles[name];
        }
        that._textGroupHtml.css(normalizedCSS);
        that._text.css(that._textFontStyles);

        that._eventData = null;
        return that;
    },

    _prepare: function(formatObject, state, customizeTooltip = this._customizeTooltip) {
        const options = this._options;

        let customize = {};

        if(isFunction(customizeTooltip)) {
            customize = customizeTooltip.call(formatObject, formatObject);
            customize = isPlainObject(customize) ? customize : {};
            if('text' in customize) {
                state.text = isDefined(customize.text) ? String(customize.text) : '';
            }
            if('html' in customize) {
                state.html = isDefined(customize.html) ? String(customize.html) : '';
            }
        }
        if(!('text' in state) && !('html' in state)) {
            state.text = formatObject.valueText || formatObject.description || '';
        }
        state.color = customize.color || options.color;
        state.borderColor = customize.borderColor || (options.border || {}).color;
        state.textColor = customize.fontColor || (this._textFontStyles || {}).color;
        return !!state.text || !!state.html || !!this._template;
    },

    show: function(formatObject, params, eventData, customizeTooltip, templateCallback) {
        const that = this;

        if(that._options.forceEvents) { // for Blazor charts
            eventData.x = params.x;
            eventData.y = params.y - params.offset;
            that._riseEvents(eventData);
            return true;
        }
        const state = {
            formatObject,
            eventData,
            templateCallback
        };

        if(!that._prepare(formatObject, state, customizeTooltip)) {
            return false;
        }

        that._state = state;

        that._wrapper.appendTo(that._getContainer());

        that._clear();

        const parameters = extend({}, that._options, {
            canvas: that._getCanvas()
        }, state, {
            x: params.x,
            y: params.y,
            offset: params.offset
        });
        return this.plaque.clear().draw(parameters);
    },

    isCursorOnTooltip: function(x, y) {
        if(this._options.interactive && this.isEnabled()) {
            const box = this.plaque.getBBox();
            return x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height;
        }
        return false;
    },

    hide: function() {
        const that = this;
        hideElement(that._wrapper);
        // trigger event
        if(that._eventData) {
            that._eventTrigger('tooltipHidden', that._eventData);
            that._clear();
            that._eventData = null;
        }
    },

    _clear() {
        this._textHtml.empty();
    },

    move: function(x, y, offset) {
        this.plaque.draw({ x, y, offset, canvas: this._getCanvas(), isMoving: true });
    },

    _moveWrapper: function() {
        const that = this;

        const plaqueBBox = this.plaque.getBBox();
        that._renderer.resize(plaqueBBox.width, plaqueBBox.height);

        // move wrapper
        const offset = that._wrapper.css({ left: 0, top: 0 }).offset();
        const left = plaqueBBox.x;
        const top = plaqueBBox.y;

        that._wrapper.css({
            left: left - offset.left,
            top: top - offset.top
        });

        this.plaque.moveRoot(-left, -top);
        if(this._state.html) {
            that._textHtml.css({
                left: -left, top: -top
            });
            that._textGroupHtml.css({ width: plaqueBBox.width });
        }
    },

    formatValue: function(value, _specialFormat) {
        const options = _specialFormat ? getSpecialFormatOptions(this._options, _specialFormat) : this._options;
        return format(value, options.format);
    },

    getLocation: function() {
        return normalizeEnum(this._options.location);
    },

    isEnabled: function() {
        return !!this._options.enabled ||
         !!this._options.forceEvents; // for Blazor charts
    },

    isShared: function() {
        return !!this._options.shared;
    },

    _getCanvas: function() {
        const container = this._getContainer();
        const containerBox = container.getBoundingClientRect();
        const html = domAdapter.getDocumentElement();
        const document = domAdapter.getDocument();
        let left = window.pageXOffset || html.scrollLeft || 0;
        let top = window.pageYOffset || html.scrollTop || 0;

        const box = {
            left: left,
            top: top,
            width: (html.clientWidth + left) || 0,
            height: mathMax(
                document.body.scrollHeight, html.scrollHeight,
                document.body.offsetHeight, html.offsetHeight,
                document.body.clientHeight, html.clientHeight
            ) || 0,

            right: 0,
            bottom: 0
        };

        if(container !== domAdapter.getBody()) {
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

export const plugin = {
    name: 'tooltip',
    init: function() {
        this._initTooltip();
    },
    dispose: function() {
        this._disposeTooltip();
    },
    members: {
        // The method exists only to be overridden in sparklines.
        _initTooltip: function() {
            // "exports" is used for testing purposes.
            this._tooltip = new Tooltip({
                cssClass: this._rootClassPrefix + '-tooltip',
                eventTrigger: this._eventTrigger,
                pathModified: this.option('pathModified'),
                widgetRoot: this.element(),
                widget: this
            });
        },
        // The method exists only to be overridden in sparklines.
        _disposeTooltip: function() {
            this._tooltip.dispose();
            this._tooltip = null;
        },
        // The method exists only to be overridden in sparklines.
        _setTooltipRendererOptions: function() {
            this._tooltip.setRendererOptions(this._getRendererOptions());
        },
        // The method exists only to be overridden in sparklines and gauges.
        _setTooltipOptions: function() {
            this._tooltip.update(this._getOption('tooltip'));
        }
    },
    extenders: {
        _stopCurrentHandling() {
            this._tooltip && this._tooltip.hide();
        }
    },
    customize: function(constructor) {
        const proto = constructor.prototype;

        proto._eventsMap.onTooltipShown = { name: 'tooltipShown' };
        proto._eventsMap.onTooltipHidden = { name: 'tooltipHidden' };
        constructor.addChange({
            code: 'TOOLTIP_RENDERER',
            handler: function() {
                this._setTooltipRendererOptions();
            },
            isThemeDependent: true,
            isOptionChange: true
        });
        constructor.addChange({
            code: 'TOOLTIP',
            handler: function() {
                this._setTooltipOptions();
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: 'tooltip'
        });
    },
    fontFields: ['tooltip.font']
};

///#DEBUG
export const DEBUG_set_tooltip = function(value) {
    Tooltip = value;
};
///#ENDDEBUG
