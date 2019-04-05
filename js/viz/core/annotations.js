import { isDefined } from "../../core/utils/type";
import { Tooltip } from "../core/tooltip";
import { extend } from "../../core/utils/extend";
import { events } from "../components/consts";
import { patchFontOptions } from "./utils";

const MOVE_EVENT = events["mousemove"] + ".annotations";
const ANNOTATION_DATA = "annotation-data";

function coreAnnotation(options, draw) {
    return {
        name: options.name,
        x: options.x,
        y: options.y,
        value: options.value,
        argument: options.argument,
        axis: options.axis,
        series: options.series,
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

function applyClipPath(elem, widget, pane) {
    isDefined(pane) && elem.attr({ "clip-path": widget._getElementsClipRectID(pane) });
}

function labelAnnotation(options) {
    return coreAnnotation(options, function({ x, y }, widget, group) {
        const text = widget._renderer.text(options.label.text, x, y).data({ [ANNOTATION_DATA]: this }).css(patchFontOptions(options.label.font)).append(group);
        applyClipPath(text, widget, this._pane);
    });
}

function imageAnnotation(options) {
    const { width, height, url, location } = options.image;
    return coreAnnotation(options, function({ x, y }, widget, group) {
        const image = widget._renderer.image(x - width * 0.5, y - height * 0.5, width, height, url, location).data({ [ANNOTATION_DATA]: this }).append(group);
        applyClipPath(image, widget, this._pane);
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
            let coords = { x: annotation.x, y: annotation.y };
            const argCoordName = this._options.rotated ? "y" : "x";
            const valCoordName = this._options.rotated ? "x" : "y";
            const argument = annotation.argument;
            const value = annotation.value;
            const argAxis = this.getArgumentAxis();
            let axis = this.getValueAxis(annotation.axis);
            let series;

            annotation._pane = annotation.axis && isDefined(axis) ? axis.pane : undefined;
            if(annotation.series) {
                series = this.series.filter(s => s.name === annotation.series)[0];
                axis = series && series.getValueAxis();
                isDefined(axis) && (annotation._pane = axis.pane);
            }

            if(!isDefined(coords[argCoordName]) && isDefined(argument)) {
                coords[argCoordName] = argAxis.getTranslator().translate(argument);
                !isDefined(annotation._pane) && (annotation._pane = argAxis.pane);
            }

            if(!isDefined(coords[valCoordName]) && isDefined(value)) {
                coords[valCoordName] = axis && axis.getTranslator().translate(value);
                !isDefined(annotation._pane) && isDefined(axis) && (annotation._pane = axis.pane);
            }

            if(isDefined(coords[argCoordName]) && !isDefined(coords[valCoordName]) && !isDefined(value)) {
                if(!isDefined(axis) && !isDefined(series)) {
                    coords[valCoordName] = argAxis.getAxisPosition();
                } else if(isDefined(axis) && !isDefined(series)) {
                    coords[valCoordName] = this._argumentAxes.filter(a => a.pane === axis.pane)[0].getAxisPosition();
                } else if(isDefined(series)) {
                    if(series.checkSeriesViewportCoord(argAxis, coords[argCoordName])) {
                        coords[valCoordName] = series.getSeriesPairCoord(coords[argCoordName], true);
                    }
                    if(!isDefined(coords[valCoordName])) {
                        coords[valCoordName] = this._argumentAxes.filter(a => a.pane === axis.pane)[0].getAxisPosition();
                    }
                }
            }

            if(!isDefined(coords[argCoordName]) && !isDefined(argument) && isDefined(coords[valCoordName])) {
                if(isDefined(axis) && !isDefined(series)) {
                    coords[argCoordName] = axis.getAxisPosition();
                } else if(isDefined(series)) {
                    if(series.checkSeriesViewportCoord(axis, coords[valCoordName])) {
                        coords[argCoordName] = series.getSeriesPairCoord(coords[valCoordName], false);
                    }
                    if(!isDefined(coords[argCoordName])) {
                        coords[argCoordName] = axis.getAxisPosition();
                    }
                }
            }
            return coords;
        },
        _onMouseMove({ target }) {
            const annotation = target[ANNOTATION_DATA];

            if(!annotation || !annotation._options.tooltipEnabled) {
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
            this._annotations.tooltip.show(tooltipFormatObject, coords, { target: annotation }, annotation._options.customizeTooltip);
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
            const tooltipOptions = extend({}, this._themeManager.getOptions("tooltip"));
            tooltipOptions.customizeTooltip = options.customizeTooltip;

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
