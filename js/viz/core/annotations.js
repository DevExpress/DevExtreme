import { getDocument } from '../../core/dom_adapter';
import { isDefined } from '../../core/utils/type';
import { Tooltip } from '../core/tooltip';
import { extend } from '../../core/utils/extend';
import { patchFontOptions } from './utils';
import { Plaque } from './plaque';
import pointerEvents from '../../events/pointer';
import dragEvents from '../../events/drag';
import { addNamespace } from '../../events/utils';
import eventsEngine from '../../events/core/events_engine';

const EVENT_NS = 'annotations';
const DOT_EVENT_NS = '.' + EVENT_NS;
const POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS);
const POINTER_UP_EVENT_NAME = addNamespace(pointerEvents.up, EVENT_NS);

const DRAG_START_EVENT_NAME = dragEvents.start + DOT_EVENT_NS;
const DRAG_EVENT_NAME = dragEvents.move + DOT_EVENT_NS;
const DRAG_END_EVENT_NAME = dragEvents.end + DOT_EVENT_NS;

function coreAnnotation(options, contentTemplate) {
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
        offsetX: options.offsetX,
        offsetY: options.offsetY,
        draw: function(widget, group) {
            const annotationGroup = widget._renderer.g().append(group)
                .css(patchFontOptions(options.font));
            this.plaque = new Plaque(options, widget, annotationGroup, contentTemplate, isDefined(options.value) || isDefined(options.argument));
            this.plaque.draw(widget._getAnnotationCoords(this));

            if(options.allowDragging) {
                annotationGroup
                    .on(DRAG_START_EVENT_NAME, { immediate: true }, e => {
                        this._dragOffsetX = this.plaque.x - e.pageX;
                        this._dragOffsetY = this.plaque.y - e.pageY;
                    })
                    .on(DRAG_EVENT_NAME, e => {
                        this.plaque.move(e.pageX + this._dragOffsetX, e.pageY + this._dragOffsetY);
                    }).on(DRAG_END_EVENT_NAME, e => {
                        this.offsetX = (this.offsetX || 0) + e.offset.x;
                        this.offsetY = (this.offsetY || 0) + e.offset.y;
                    });
            }
        },
        hitTest(x, y) {
            return this.plaque.hitTest(x, y);
        },
        showTooltip(tooltip, { x, y }) {
            if(tooltip.annotation !== this) {
                tooltip.setTemplate(this.options.tooltipTemplate);
                if(tooltip.show(this.options, { x, y }, { target: this.options }, this.options.customizeTooltip)) {
                    tooltip.annotation = this;
                }
            } else {
                tooltip.move(x, y);
            }
        }
    };
}

function getTemplateFunction(options, widget) {
    let template;
    if(options.type === 'text') {
        template = function(item, groupElement) {
            const text = widget._renderer
                .text(item.text)
                .attr({ 'class': item.cssClass })
                .append({ element: groupElement });

            if(item.width > 0 || item.height > 0) {
                text.setMaxSize(item.width, item.height, {
                    wordWrap: item.wordWrap,
                    textOverflow: item.textOverflow
                });
            }
        };
    } else if(options.type === 'image') {
        template = function(item, groupElement) {
            const { width, height, url, location } = item.image || {};
            const { width: outerWidth, height: outerHeight } = item;
            const imageWidth = outerWidth > 0 ? Math.min(width, outerWidth) : width;
            const imageHeight = outerHeight > 0 ? Math.min(height, outerHeight) : height;

            widget._renderer
                .image(0, 0, imageWidth, imageHeight, url, location || 'center')
                .append({ element: groupElement });
        };
    } else if(options.type === 'custom') {
        template = options.template;
    }

    return template;
}

export let createAnnotations = function(widget, items, commonAnnotationSettings = {}, customizeAnnotation) {
    return items.reduce((arr, item) => {
        const options = extend(true, {}, commonAnnotationSettings, item, customizeAnnotation && customizeAnnotation.call ? customizeAnnotation(item) : {});
        const templateFunction = getTemplateFunction(options, widget);
        const annotation = templateFunction && coreAnnotation(options, widget._getTemplate(templateFunction));
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
    name: 'annotations_chart',
    init() {},
    dispose() {},
    members: {
        _getAnnotationCoords(annotation) {
            const coords = {
                offsetX: annotation.offsetX,
                offsetY: annotation.offsetY
            };
            const argCoordName = this._options.rotated ? 'y' : 'x';
            const valCoordName = this._options.rotated ? 'x' : 'y';
            const argAxis = this.getArgumentAxis();
            const argument = argAxis.validateUnit(annotation.argument);
            let axis = this.getValueAxis(annotation.axis);
            let series;
            let pane = isDefined(axis) ? axis.pane : undefined;

            if(annotation.series) {
                series = this.series.filter(s => s.name === annotation.series)[0];
                axis = series && series.getValueAxis();
                isDefined(axis) && (pane = axis.pane);
            }

            if(isDefined(argument)) {
                if(series) {
                    const center = series.getPointCenterByArg(argument);
                    center && (coords[argCoordName] = center[argCoordName]);
                } else {
                    coords[argCoordName] = argAxis.getTranslator().translate(argument);
                }
                !isDefined(pane) && (pane = argAxis.pane);
            }

            const value = axis && axis.validateUnit(annotation.value);
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
                } else if(isDefined(series) && series.checkSeriesViewportCoord(argAxis, coords[argCoordName])) {
                    coords[valCoordName] = series.getSeriesPairCoord(coords[argCoordName], true);
                }
            }

            if(!isDefined(argument) && isDefined(coords[valCoordName])) {
                if(isDefined(axis) && !isDefined(series)) {
                    coords[argCoordName] = axis.getAxisPosition();
                } else if(isDefined(series)) {
                    if(series.checkSeriesViewportCoord(axis, coords[valCoordName])) {
                        coords[argCoordName] = series.getSeriesPairCoord(coords[valCoordName], false);
                    }
                }
            }
            return coords;
        },
        _annotationsPointerEventHandler(event) {
            const originalEvent = event.originalEvent || {};
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

            if(annotation.options.allowDragging && event.type === pointerEvents.down) {
                this._annotations._hideToolTipForDrag = true;
            }

            if(!this._annotations._hideToolTipForDrag) {
                annotation.showTooltip(this._annotations.tooltip, coords);
                event.stopPropagation();
            }
        }
    }
};
const corePlugin = {
    name: 'annotations_core',
    init() {
        this._annotations = {
            items: [],
            _hideToolTipForDrag: false,
            tooltip: new Tooltip({
                cssClass: `${this._rootClassPrefix}-annotation-tooltip`,
                eventTrigger: this._eventTrigger,
                widgetRoot: this.element(),
                widget: this
            }),
            hideTooltip() {
                this.tooltip.annotation = null;
                this.tooltip.hide();
            }
        };

        this._annotations.tooltip.setRendererOptions(this._getRendererOptions());
        const tooltipOptions = extend({}, this._themeManager.getOptions('tooltip'));

        tooltipOptions.contentTemplate = tooltipOptions.customizeTooltip = undefined;

        this._annotations.tooltip.update(tooltipOptions);
    },
    dispose() {
        this._annotationsGroup.linkRemove().linkOff();
        eventsEngine.off(getDocument(), DOT_EVENT_NS);
        this._annotationsGroup.off(DOT_EVENT_NS);
        this._annotations.tooltip && this._annotations.tooltip.dispose();
    },
    extenders: {
        _createHtmlStructure() {
            this._annotationsGroup = this._renderer.g().attr({ 'class': `${this._rootClassPrefix}-annotations` }).linkOn(this._renderer.root, 'annotations').linkAppend();
            eventsEngine.on(getDocument(), POINTER_ACTION, () => this._annotations.hideTooltip());
            eventsEngine.on(getDocument(), POINTER_UP_EVENT_NAME, (event) => {
                this._annotations._hideToolTipForDrag = false;
                this._annotationsPointerEventHandler(event);
            });
            this._annotationsGroup.on(POINTER_ACTION, this._annotationsPointerEventHandler.bind(this));
        },
        _renderExtraElements() {
            this._annotationsGroup.clear();
            this._annotations.items.forEach(item => item.draw(this, this._annotationsGroup));
        },
        _stopCurrentHandling() {
            this._annotations.hideTooltip();
        }
    },
    members: {
        _buildAnnotations() {
            this._annotations.items = [];

            const items = this._getOption('annotations');
            if(!items || !items.length) {
                return;
            }
            this._annotations.items = createAnnotations(this, items, this._getOption('commonAnnotationSettings'), this._getOption('customizeAnnotation'));
        },
        _getAnnotationCoords() { return {}; }
    },
    customize(constructor) {
        constructor.addChange({
            code: 'ANNOTATIONITEMS',
            handler() {
                this._requestChange(['ANNOTATIONS']);
            },
            isOptionChange: true,
            option: 'annotations'
        });

        constructor.addChange({
            code: 'ANNOTATIONSSETTINGS',
            handler() {
                this._requestChange(['ANNOTATIONS']);
            },
            isOptionChange: true,
            option: 'commonAnnotationSettings'
        });

        constructor.addChange({
            code: 'ANNOTATIONS',
            handler() {
                this._buildAnnotations();
                this._change(['FORCE_RENDER']);
            },
            isThemeDependent: true,
            isOptionChange: true
        });
    },
    fontFields: ['commonAnnotationSettings.font']
};

export const plugins = {
    core: corePlugin,
    chart: chartPlugin
};
