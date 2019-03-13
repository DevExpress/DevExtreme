import { isDefined } from "../../core/utils/type";
import { Tooltip } from "../core/tooltip";
import { extend } from "../../core/utils/extend";
import { events } from "../components/consts";
import { patchFontOptions } from "./utils";

const EVENTS_NS = ".annotations";
const MOVE_EVENT = events["mousemove"] + EVENTS_NS;

function coreAnnotation(type, options, draw) {
    return {
        _type: type,
        name: options.name,
        x: options.x,
        y: options.y,
        value: options.value,
        argument: options.argument,
        axis: options.axis,
        _options: options,
        draw: function(widget, group) {
            this.coords = widget._getAnnotationCoords(this);
            const { x, y } = this.coords;
            isDefined(x) && isDefined(y) && draw.call(this, { x, y }, widget, group, this._options.image);
        },
        getTooltipFormatObject() {
            return extend({}, this._options);
        },
        getTooltipParams() {
            const { x, y } = this.coords;
            return { x, y };
        }
    };
}

function simpleAnnotation(options) {
    return coreAnnotation("simple", options, function({ x, y }, widget, group) {
        widget._renderer.circle(x, y, 5).attr({ fill: "red" }).data({ "annotation-data": this }).append(group);
    });
}

function labelAnnotation(options) {
    return coreAnnotation("label", options, function({ x, y }, widget, group) {
        widget._renderer.text(options.label.text, x, y).data({ "annotation-data": this }).css(patchFontOptions(options.label.font)).append(group);
    });
}

function imageAnnotation(options) {
    const { width, height, url, location } = options.image;
    return coreAnnotation("image", options, function({ x, y }, widget, group) {
        widget._renderer.image(x - width * 0.5, y - height * 0.5, width, height, url, location).data({ "annotation-data": this }).append(group);
    });
}

function mergeOptions(itemOptions, commonOptions, key) {
    return extend(true, {}, itemOptions, { [key]: commonOptions }, { [key]: itemOptions[key] });
}

function createAnnotation(itemOptions, commonOptions) {
    // Choose annotation type and merge common and individual options
    if(isDefined(itemOptions.image)) {
        return imageAnnotation(mergeOptions(itemOptions, commonOptions.imageOptions, "image"));
    } else if(isDefined(itemOptions.label)) {
        return labelAnnotation(mergeOptions(itemOptions, commonOptions.labelOptions, "label"));
    } else {
        return simpleAnnotation(itemOptions);
    }
}

export let createAnnotations = function(options) {
    return options.items.map(itemOptions => createAnnotation(itemOptions, options));
};

///#DEBUG
export const __test_utils = {
    stub_createAnnotations(stub) {
        this.old_createAnnotations = createAnnotations;
        createAnnotations = stub;
    },
    restore_createAnnotations() {
        createAnnotations = this.old_createAnnotations;
    }
};
///#ENDDEBUG

const chartPlugin = {
    name: "annotations_chart",
    init() {},
    dispose() {},
    members: {
        _getAnnotationCoords(annotation) {
            // debugger;
            let x = annotation.x;
            let y = annotation.y;
            const argument = annotation.argument;
            const value = annotation.value;

            if(!isDefined(x) && isDefined(argument)) {
                x = this.getArgumentAxis().getTranslator().translate(argument);
            }

            if(!isDefined(y) && isDefined(value)) {
                const axis = this.getValueAxis(annotation.axis);
                y = axis && axis.getTranslator().translate(value);
            }
            return { x, y };
        },
        _onMouseMove({ target }) {
            const annotation = target["annotation-data"];
            if(!annotation) {
                this._annotations.tooltip.hide();
                return;
            }

            this.hideTooltip();
            this.clearHover();

            const tooltipFormatObject = annotation.getTooltipFormatObject(this._annotations.tooltip);
            const coords = annotation.getTooltipParams(this._annotations.tooltip.getLocation()),
                rootOffset = this._renderer.getRootOffset();
            coords.x += rootOffset.left;
            coords.y += rootOffset.top;

            this._annotations.tooltip.show(tooltipFormatObject, coords, { target: annotation });
        }
    }
};
const corePlugin = {
    name: "annotations_core",
    init() {
        this._annotations = { items: [] };
    },
    dispose() {
        this._annotationsGroup.linkRemove().linkOff();
        this._renderer.root.off(MOVE_EVENT);
        this._annotations.tooltip && this._annotations.tooltip.dispose();
    },
    extenders: {
        _createHtmlStructure() {
            this._annotationsGroup = this._renderer.g().attr({ "class": this._rootClassPrefix + "-annotations" }).linkOn(this._renderer.root, "annotations").linkAppend();
        },
        _renderExtraElements() {
            this._annotationsGroup.clear();
            this._annotations.items.forEach(item => item.draw(this, this._annotationsGroup));
        }
    },
    members: {
        _buildAnnotations() {
            this._annotations.items = [];

            // TODO test theme
            const options = this._getOption("annotations");

            if(!options || !options.items) {
                return;
            }

            this._annotations.tooltip = new Tooltip({
                cssClass: "dxc-tooltip",
                eventTrigger: this._eventTrigger,
                widgetRoot: this.element(),
            });

            this._annotations.tooltip.setRendererOptions(this._getRendererOptions());
            const tooltipOptions = extend({}, this._themeManager.getOptions("tooltip"), { enabled: false });
            if(options.customizeTooltip) {
                tooltipOptions.customizeTooltip = options.customizeTooltip;
                tooltipOptions.enabled = true;
            }
            this._annotations.tooltip.update(tooltipOptions);

            this._annotations.items = createAnnotations(options);
            this._renderer.root.on(MOVE_EVENT, this._onMouseMove.bind(this));
        },
        _getAnnotationCoords() { return {}; }
    },
    customize(constructor) {
        constructor.addChange({
            code: "ANNOTATIONS",
            handler() {
                this._buildAnnotations();
                this._change(["FORCE_RENDER"]);
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: "annotations"
        });
    },
    fontFields: ["annotations.labelOptions.font"]
};

export const plugins = {
    core: corePlugin,
    chart: chartPlugin
};
