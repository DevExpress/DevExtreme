import { isDefined } from "../../core/utils/type";
import { Tooltip } from "../core/tooltip";
import { extend } from "../../core/utils/extend";
import { events } from "../components/consts";

const EVENTS_NS = ".annotations";
const MOVE_EVENT = events["mousemove"] + EVENTS_NS;

function coreAnnotation(type, options, draw, tooltip) {
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
        getOptions() {
            return this._options;
        },
        getTooltipFormatObject() {
            return extend({}, this._options);
        },
        isVisible() {
            return true;
        },
        getTooltipParams() {
            const { x, y } = this.coords;
            return {
                x,
                y,
                offset: 0
            };
        },
        clearHover() {},
        getMarkerVisibility() {
            return true;
        },
        tooltip() {
            return tooltip;
        },
        hover() {}
    };
}

function drawSimpleAnnotation({ x, y }, widget, group) {
    widget._renderer.circle(x, y, 5).attr({ fill: "red" }).data({ "annotation-data": this }).append(group);
}

function drawImageAnnotation({ x, y }, widget, group, { width, height, url }) {
    widget._renderer.image(x - width * 0.5, y - height * 0.5, width, height, url, "center").data({ "annotation-data": this }).append(group);
}

function createAnnotation(itemOptions, tooltip) {
    // Choose annotation type and merge common and individual options
    let draw = drawSimpleAnnotation;
    let type = "simple";

    if(isDefined(itemOptions.image)) {
        draw = drawImageAnnotation;
        type = "image";
    }

    return coreAnnotation(type, itemOptions, draw, tooltip);
}

export let createAnnotations = function(options, tooltip) {
    return options.items.map(itemOptions => createAnnotation(itemOptions, tooltip));
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
            const options = this._themeManager.getOptions("annotations");

            if(!options || !options.items) {
                return;
            }

            const tooltip = new Tooltip({
                cssClass: "dxc-tooltip",
                eventTrigger: this._eventTrigger,
                widgetRoot: this.element(),
            });

            tooltip.setRendererOptions(this._getRendererOptions());
            const tooltipOptions = extend({}, this._themeManager.getOptions("tooltip"), { enabled: false });
            if(options.customizeTooltip) {
                tooltipOptions.customizeTooltip = options.customizeTooltip;
                tooltipOptions.enabled = true;
            }
            tooltip.update(tooltipOptions);
            this._annotations.items = createAnnotations(options, tooltip);

            this._renderer.root.on(MOVE_EVENT, ({ target }) => {
                const point = target["annotation-data"];
                if(!point) {
                    tooltip.hide();

                    return;
                }

                this.hideTooltip();
                this.clearHover();

                const tooltipFormatObject = point.getTooltipFormatObject(tooltip);
                const coords = point.getTooltipParams(tooltip.getLocation()),
                    rootOffset = this._renderer.getRootOffset();
                coords.x += rootOffset.left;
                coords.y += rootOffset.top;

                tooltip.show(tooltipFormatObject, coords, { target: point });
            });
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
        // constructor.addPlugin(require("./tooltip").plugin);
    }
};

export const plugins = {
    core: corePlugin,
    chart: chartPlugin
};
