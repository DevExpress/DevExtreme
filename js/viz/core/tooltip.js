import domAdapter from "../../core/dom_adapter";
import windowUtils from "../../core/utils/window";
import inflector from "../../core/utils/inflector";

import $ from "../../core/renderer";
import rendererModule from "./renderers/renderer";
import typeUtils from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import vizUtils from "./utils";
import { format } from "../../format_helper";

import { Plaque } from "./plaque";

const mathCeil = Math.ceil;
const mathMax = Math.max;
const mathMin = Math.min;
const window = windowUtils.getWindow();

function hideElement($element) {
    $element.css({ left: "-9999px" }).detach();
}

function getSpecialFormatOptions(options, specialFormat) {
    var result = options;
    switch(specialFormat) {
        case "argument":
            result = { format: options.argumentFormat };
            break;
        case "percent":
            result = { format: { type: "percent", precision: options.format && options.format.percentPrecision } };
            break;
    }
    return result;
}

function Tooltip(params) {
    var that = this,
        renderer,
        root;

    that._eventTrigger = params.eventTrigger;
    that._widgetRoot = params.widgetRoot;

    that._wrapper = $("<div>")
        .css({ position: "absolute", overflow: "hidden", "pointerEvents": "none" }) // T265557, T447623
        .addClass(params.cssClass);

    that._renderer = renderer = new rendererModule.Renderer({ pathModified: params.pathModified, container: that._wrapper[0] });
    root = renderer.root;
    root.attr({ "pointer-events": "none" });

    // svg text
    that._text = renderer.text(undefined, 0, 0);

    // html text
    that._textGroupHtml = $("<div>").css({ position: "absolute", padding: 0, margin: 0, border: "0px solid transparent" }).appendTo(that._wrapper);
    that._textHtml = $("<div>").css({ position: "relative", display: "inline-block", padding: 0, margin: 0, border: "0px solid transparent" }).appendTo(that._textGroupHtml);
}

Tooltip.prototype = {
    constructor: Tooltip,

    dispose: function() {
        this._wrapper.remove();
        this._renderer.dispose();
        this._options = this._widgetRoot = null;
    },

    _getContainer: function() {
        var options = this._options,
            container = $(this._widgetRoot).closest(options.container);
        if(container.length === 0) {
            container = $(options.container);
        }
        return (container.length ? container : $("body")).get(0);
    },

    setOptions: function(options) {
        options = options || {};

        var that = this;

        that._options = options;
        that._textFontStyles = vizUtils.patchFontOptions(options.font);
        that._textFontStyles.color = options.font.color;
        that._wrapper.css({ "zIndex": options.zIndex });

        that._customizeTooltip = options.customizeTooltip;

        const textGroupHtml = that._textGroupHtml;
        const textHtml = that._textHtml;

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
        }, that, that._renderer.root, (tooltip, group) => {
            const state = tooltip._state;
            if(state.html) {
                that._text.attr({ text: "" });
                textGroupHtml.css({ color: state.textColor, width: null });
                textHtml.html(state.html);
            } else {
                textHtml.html("");
                that._text.css({ fill: state.textColor }).attr({ text: state.text }).append(group.attr({ align: options.textAlignment }));
            }
            this.plaque.customizeCloud({ fill: state.color, stroke: state.borderColor });
        }, true, (tooltip, g) => {
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

    setRendererOptions: function(options) {
        this._renderer.setOptions(options);
        this._textGroupHtml.css({ direction: options.rtl ? "rtl" : "ltr" });
        return this;
    },

    render: function() {
        var that = this;

        // The following is because after update (on widget refresh) tooltip must be hidden
        hideElement(that._wrapper);

        // text area
        var normalizedCSS = {};
        for(var name in that._textFontStyles) {
            normalizedCSS[inflector.camelize(name)] = that._textFontStyles[name];
        }
        that._textGroupHtml.css(normalizedCSS);
        that._text.css(that._textFontStyles);

        that._eventData = null;
        return that;
    },

    update: function(options) {
        return this.setOptions(options).render();
    },

    _prepare: function(formatObject, state, customizeTooltip = this._customizeTooltip) {
        const options = this._options;

        let customize = {};

        if(typeUtils.isFunction(customizeTooltip)) {
            customize = customizeTooltip.call(formatObject, formatObject);
            customize = typeUtils.isPlainObject(customize) ? customize : {};
            if("text" in customize) {
                state.text = typeUtils.isDefined(customize.text) ? String(customize.text) : "";
            }
            if("html" in customize) {
                state.html = typeUtils.isDefined(customize.html) ? String(customize.html) : "";
            }
        }
        if(!("text" in state) && !("html" in state)) {
            state.text = formatObject.valueText || formatObject.description || "";
        }
        state.color = customize.color || options.color;
        state.borderColor = customize.borderColor || (options.border || {}).color;
        state.textColor = customize.fontColor || (options.font || {}).color;
        return !!state.text || !!state.html;
    },

    show: function(formatObject, params, eventData, customizeTooltip) {
        var that = this,
            state = {};

        if(!that._prepare(formatObject, state, customizeTooltip)) {
            return false;
        }

        that._state = state;

        that._wrapper.appendTo(that._getContainer());

        this.plaque.clear().draw(extend({}, that._options, {
            canvas: that._getCanvas()
        }, state, {
            x: params.x,
            y: params.y,
            offset: params.offset
        }));

        that.moveWrapper();

        // trigger event
        // The *onTooltipHidden* is triggered outside the *hide* method because of the cases when *show* is called to determine if tooltip will be visible or not (when target is changed) -
        // *hide* can neither be called before that *show* - because if tooltip is determined to hide it requires some timeout before actually hiding
        // nor after that *show* - because it is either too early to hide (because of timeout) or wrong (because tooltip has already been shown for new target)
        // It is only inside the *show* where it is known weather *onTooltipHidden* is required or not
        // This functionality can be simplified when we get rid of timeouts for tooltip
        that._eventData && that._eventTrigger("tooltipHidden", that._eventData);
        that._eventData = eventData;
        that._eventTrigger("tooltipShown", that._eventData);
        return true;
    },

    hide: function() {
        var that = this;
        hideElement(that._wrapper);
        // trigger event
        that._eventData && that._eventTrigger("tooltipHidden", that._eventData);
        that._eventData = null;
    },


    move: function(x, y, offset) {
        this.plaque.draw({ x, y, offset, canvas: this._getCanvas() });
        this.moveWrapper();
    },

    moveWrapper: function() {
        var that = this;

        const plaqueBBox = this.plaque.getBBox();
        that._renderer.resize(plaqueBBox.width, plaqueBBox.height);

        // move wrapper
        const left = plaqueBBox.x;
        const top = plaqueBBox.y;

        that._wrapper.css({
            left,
            top
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
        var options = _specialFormat ? getSpecialFormatOptions(this._options, _specialFormat) : this._options;
        return format(value, options.format);
    },

    getLocation: function() {
        return vizUtils.normalizeEnum(this._options.location);
    },

    isEnabled: function() {
        return !!this._options.enabled;
    },

    isShared: function() {
        return !!this._options.shared;
    },

    _getCanvas: function() {
        var container = this._getContainer(),
            containerBox = container.getBoundingClientRect(),
            html = domAdapter.getDocumentElement(),
            body = domAdapter.getBody(),
            left = window.pageXOffset || html.scrollLeft || 0,
            top = window.pageYOffset || html.scrollTop || 0;

        var box = {
            left: left,
            top: top,
            width: html.clientWidth || 0,
            height: html.clientHeight || 0,
            right: 0,
            bottom: 0,

            /* scrollWidth */
            fullWidth: mathMax(
                body.scrollWidth, html.scrollWidth,
                body.offsetWidth, html.offsetWidth,
                body.clientWidth, html.clientWidth
            ) - left,
            /* scrollHeight */
            fullHeight: mathMax(
                body.scrollHeight, html.scrollHeight,
                body.offsetHeight, html.offsetHeight,
                body.clientHeight, html.clientHeight
            ) - top
        };

        if(container !== body) {
            left = mathMax(box.left, box.left + containerBox.left);
            top = mathMax(box.top, box.top + containerBox.top);

            box.width = mathMin(box.width + box.left - left, containerBox.width + (containerBox.left > 0 ? 0 : containerBox.left));
            box.height = mathMin(box.height + box.top - top, containerBox.height + (containerBox.top > 0 ? 0 : containerBox.top));

            box.fullWidth = box.width;
            box.fullHeight = box.height;

            box.left = left;
            box.top = top;
        }

        return box;
    }
};

exports.Tooltip = Tooltip;

exports.plugin = {
    name: "tooltip",
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
            this._tooltip = new exports.Tooltip({
                cssClass: this._rootClassPrefix + "-tooltip",
                eventTrigger: this._eventTrigger,
                pathModified: this.option("pathModified"),
                widgetRoot: this.element()
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
            this._tooltip.update(this._getOption("tooltip"));
        }
    },
    extenders: {
        _stopCurrentHandling() {
            this._tooltip && this._tooltip.hide();
        }
    },
    customize: function(constructor) {
        var proto = constructor.prototype;

        proto._eventsMap.onTooltipShown = { name: "tooltipShown" };
        proto._eventsMap.onTooltipHidden = { name: "tooltipHidden" };
        constructor.addChange({
            code: "TOOLTIP_RENDERER",
            handler: function() {
                this._setTooltipRendererOptions();
            },
            isThemeDependent: true,
            isOptionChange: true
        });
        constructor.addChange({
            code: "TOOLTIP",
            handler: function() {
                this._setTooltipOptions();
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: "tooltip"
        });
    },
    fontFields: ["tooltip.font"]
};
