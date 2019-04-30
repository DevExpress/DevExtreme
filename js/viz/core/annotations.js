import $ from "../../core/renderer";
import devices from "../../core/devices";
import { getDocument } from "../../core/dom_adapter";
import { getWindow } from "../../core/utils/window";
import { isDefined } from "../../core/utils/type";
import { Tooltip } from "../core/tooltip";
import { extend } from "../../core/utils/extend";
import { patchFontOptions } from "./utils";
import { Plaque } from "./plaque";
import pointerEvents from "../../events/pointer";
import dragEvents from "../../events/drag";
import { addNamespace } from "../../events/utils";
import eventsEngine from "../../events/core/events_engine";

const EVENT_NS = "annotations";
const DOT_EVENT_NS = "." + EVENT_NS;
const POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS);

const DRAG_START_EVENT_NAME = dragEvents.start + DOT_EVENT_NS;
const DRAG_EVENT_NAME = dragEvents.move + DOT_EVENT_NS;

function coreAnnotation(options, draw) {
    return {
        type: options.type,
        name: options.name,
        x: options.x,
        y: options.y,
        value: options.value,
        argument: options.argument,
        axis: options.axis,
        series: options.series,
        options: options,
        draw: function(widget, group) {
            const annotationGroup = widget._renderer.g().append(group);
            this.plaque = new Plaque(options, widget, annotationGroup, draw.bind(this));
            this.plaque.draw(widget._getAnnotationCoords(this));

            if(options.draggable) {
                annotationGroup
                    .on(DRAG_START_EVENT_NAME, { immediate: true }, e => {
                        this._dragOffsetX = this.plaque.x - e.pageX;
                        this._dragOffsetY = this.plaque.y - e.pageY;
                    })
                    .on(DRAG_EVENT_NAME, e => {
                        this.plaque.move(e.pageX + this._dragOffsetX, e.pageY + this._dragOffsetY);
                    });
            }
        },
        hitTest(x, y) {
            return this.plaque.hitTest(x, y);
        },
        showTooltip(tooltip, { x, y }) {
            if(tooltip.annotation !== this) {
                if(tooltip.show(this.options, { x, y }, { target: this.options }, this.options.customizeTooltip)) {
                    tooltip.annotation = this;
                }
            } else {
                tooltip.move(x, y);
            }
        }
    };
}

function labelAnnotation(options) {
    return coreAnnotation(options, function(widget, group, { width, height }) {
        const text = widget._renderer
            .text(options.text)
            .css(patchFontOptions(options.font))
            .append(group);

        if(isDefined(width) || isDefined(height)) {
            text.setMaxSize(width, height, {
                wordWrap: options.wordWrap,
                textOverflow: options.textOverflow
            });
        }
    });
}

function imageAnnotation(options) {
    const { width, height, url, location } = options.image || {};
    return coreAnnotation(options, function(widget, group, { width: outerWidth, height: outerHeight }) {
        const imageWidth = outerWidth > 0 ? Math.min(width, outerWidth) : width;
        const imageHeight = outerHeight > 0 ? Math.min(height, outerHeight) : height;

        widget._renderer
            .image(0, 0, imageWidth, imageHeight, url, location || "center")
            .append(group);
    });
}

function createAnnotation(item, commonOptions, customizeAnnotation) {
    let options = extend(true, {}, commonOptions, item);
    if(customizeAnnotation && customizeAnnotation.call) {
        options = extend(true, options, customizeAnnotation(item));
    }

    if(options.type === "image") {
        return imageAnnotation(options);
    } else if(options.type === "text") {
        return labelAnnotation(options);
    }
}

export let createAnnotations = function(items, options = {}, customizeAnnotation) {
    return items.reduce((arr, item) => {
        const annotation = createAnnotation(item, options, customizeAnnotation);
        annotation && arr.push(annotation);
        return arr;
    }, []);
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
            const coords = { };
            const argCoordName = this._options.rotated ? "y" : "x";
            const valCoordName = this._options.rotated ? "x" : "y";
            const argument = annotation.argument;
            const value = annotation.value;
            const argAxis = this.getArgumentAxis();
            let axis = this.getValueAxis(annotation.axis);
            let series;
            let pane = isDefined(axis) ? axis.pane : undefined;

            if(annotation.series) {
                series = this.series.filter(s => s.name === annotation.series)[0];
                axis = series && series.getValueAxis();
                isDefined(axis) && (pane = axis.pane);
            }

            if(isDefined(argument)) {
                coords[argCoordName] = argAxis.getTranslator().translate(argument);
                !isDefined(pane) && (pane = argAxis.pane);
            }

            if(isDefined(value)) {
                coords[valCoordName] = axis && axis.getTranslator().translate(value);
                !isDefined(pane) && isDefined(axis) && (pane = axis.pane);
            }

            coords.canvas = this._getCanvasForPane(pane);

            if(isDefined(coords[argCoordName]) && !isDefined(value)) {
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

            if(!isDefined(argument) && isDefined(coords[valCoordName])) {
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
        _annotationsPointerEventHandler(event) {
            const originalEvent = event.originalEvent;
            const touch = (originalEvent.touches && originalEvent.touches[0]) || {};
            const rootOffset = this._renderer.getRootOffset();
            const coords = {
                x: touch.pageX || originalEvent.pageX || event.pageX,
                y: touch.pageY || originalEvent.pageY || event.pageY
            };

            const annotation = this._annotations.items.filter(a => a.hitTest(coords.x - rootOffset.left, coords.y - rootOffset.top))[0];

            if(!annotation || !annotation.options.tooltipEnabled) {
                this._annotations.hideTooltip();
                return;
            }

            this.hideTooltip();
            this.clearHover();

            annotation.showTooltip(this._annotations.tooltip, coords);

            event.stopPropagation();
        }
    }
};
const corePlugin = {
    name: "annotations_core",
    init() {
        this._annotations = {
            items: [],
            hideTooltip() {
                this.tooltip.annotation = null;
                this.tooltip.hide();
            }
        };
    },
    dispose() {
        this._annotationsGroup.linkRemove().linkOff();
        this._toggleParentsScrollSubscription();
        eventsEngine.off(getDocument(), DOT_EVENT_NS);
        this._annotationsGroup.off(DOT_EVENT_NS);
        this._annotations.tooltip && this._annotations.tooltip.dispose();
    },
    extenders: {
        _createHtmlStructure() {
            this._annotationsGroup = this._renderer.g().attr({ "class": `${this._rootClassPrefix}-annotations` }).linkOn(this._renderer.root, "annotations").linkAppend();
        },
        _renderExtraElements() {
            this._annotationsGroup.clear();
            this._annotations.items.forEach(item => item.draw(this, this._annotationsGroup));
        }
    },
    members: {
        _buildAnnotations() {
            this._annotations.items = [];

            const items = this._getOption("annotations");
            if(!items || !items.length) {
                return;
            }

            this._annotations.tooltip = new Tooltip({
                cssClass: `${this._rootClassPrefix}-annotation-tooltip`,
                eventTrigger: this._eventTrigger,
                widgetRoot: this.element()
            });

            this._annotations.tooltip.setRendererOptions(this._getRendererOptions());
            const tooltipOptions = extend({}, this._themeManager.getOptions("tooltip"));

            tooltipOptions.customizeTooltip = undefined;
            this._annotations.tooltip.update(tooltipOptions);

            this._annotations.items = createAnnotations(items, this._getOption("commonAnnotationSettings"), this._getOption("customizeAnnotation"));
            this._annotationsGroup.on(POINTER_ACTION, this._annotationsPointerEventHandler.bind(this));
            eventsEngine.on(getDocument(), POINTER_ACTION, () => this._annotations.hideTooltip());
            this._toggleParentsScrollSubscription(true);
        },
        _toggleParentsScrollSubscription: function(subscribe) {
            var $parents = $(this._renderer.root.element).parents(),
                scrollEvents = addNamespace("scroll", EVENT_NS);

            if(devices.real().platform === "generic") {
                $parents = $parents.add(getWindow());
            }

            eventsEngine.off($().add(this._$prevRootParents), scrollEvents);

            if(subscribe) {
                eventsEngine.on($parents, scrollEvents, () => this._annotations.hideTooltip());
                this._$prevRootParents = $parents;
            }
        },
        _getAnnotationCoords() { return {}; }
    },
    customize(constructor) {
        constructor.addChange({
            code: "ANNOTATIONITEMS",
            handler() {
                this._requestChange(["ANNOTATIONS"]);
            },
            isOptionChange: true,
            option: "annotations"
        });

        constructor.addChange({
            code: "ANNOTATIONSSETTINGS",
            handler() {
                this._requestChange(["ANNOTATIONS"]);
            },
            isOptionChange: true,
            option: "commonAnnotationSettings"
        });

        constructor.addChange({
            code: "ANNOTATIONS",
            handler() {
                this._buildAnnotations();
                this._change(["FORCE_RENDER"]);
            },
            isThemeDependent: true,
            isOptionChange: true
        });
    },
    fontFields: ["commonAnnotationSettings.font"]
};

export const plugins = {
    core: corePlugin,
    chart: chartPlugin
};
