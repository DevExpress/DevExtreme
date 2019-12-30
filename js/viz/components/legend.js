import { enumParser, normalizeEnum, patchFontOptions } from '../core/utils';
import { extend } from '../../core/utils/extend';
import { LayoutElement, WrapperLayoutElement } from '../core/layout_element';
import { isDefined, isFunction } from '../../core/utils/type';
import title from '../core/title';
import { clone } from '../../core/utils/object';
import { noop } from '../../core/utils/common';
import { processHatchingAttrs, getFuncIri } from '../core/renderers/renderer';

const _Number = Number;

const _math = Math;
const _round = _math.round;
const _max = _math.max;
const _min = _math.min;
const _ceil = _math.ceil;

const _isDefined = isDefined;
const _isFunction = isFunction;
const _enumParser = enumParser;
const _normalizeEnum = normalizeEnum;

const _extend = extend;

const DEFAULT_MARGIN = 10;
const DEFAULT_MARKER_HATCHING_WIDTH = 2;
const DEFAULT_MARKER_HATCHING_STEP = 5;
const CENTER = 'center';
const RIGHT = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const INSIDE = 'inside';
const OUTSIDE = 'outside';
const NONE = 'none';
const HEIGHT = 'height';
const WIDTH = 'width';

const parseHorizontalAlignment = _enumParser([LEFT, CENTER, RIGHT]);
const parseVerticalAlignment = _enumParser([TOP, BOTTOM]);
const parseOrientation = _enumParser([VERTICAL, HORIZONTAL]);
const parseItemTextPosition = _enumParser([LEFT, RIGHT, TOP, BOTTOM]);
const parsePosition = _enumParser([OUTSIDE, INSIDE]);
const parseItemsAlignment = _enumParser([LEFT, CENTER, RIGHT]);

function getState(state, color, stateName) {
    if(!state) {
        return;
    }
    const colorFromAction = state.fill;

    return extend({}, {
        state: stateName,
        fill: colorFromAction === NONE ? color : colorFromAction,
        opacity: state.opacity,
        hatching: _extend({}, state.hatching, {
            step: DEFAULT_MARKER_HATCHING_STEP,
            width: DEFAULT_MARKER_HATCHING_WIDTH
        })
    });
}

function getAttributes(item, state, size) {
    const attrs = processHatchingAttrs(item, state);

    if(attrs.fill && attrs.fill.indexOf('DevExpress') === 0) {
        attrs.fill = getFuncIri(attrs.fill);
    }

    attrs.opacity = attrs.opacity >= 0 ? attrs.opacity : 1;

    return extend({}, attrs, { size });
}

function parseMargins(options) {
    let margin = options.margin;
    if(margin >= 0) {
        margin = _Number(options.margin);
        margin = { top: margin, bottom: margin, left: margin, right: margin };
    } else {
        margin = {
            top: margin.top >= 0 ? _Number(margin.top) : DEFAULT_MARGIN,
            bottom: margin.bottom >= 0 ? _Number(margin.bottom) : DEFAULT_MARGIN,
            left: margin.left >= 0 ? _Number(margin.left) : DEFAULT_MARGIN,
            right: margin.right >= 0 ? _Number(margin.right) : DEFAULT_MARGIN
        };
    }
    options.margin = margin;
}

function getSizeItem(options, markerBBox, labelBBox) {
    const defaultXMargin = 7;
    const defaultTopMargin = 4;
    let width;
    let height;

    switch(options.itemTextPosition) {
        case LEFT:
        case RIGHT:
            width = markerBBox.width + defaultXMargin + labelBBox.width;
            height = _max(markerBBox.height, labelBBox.height);
            break;
        case TOP:
        case BOTTOM:
            width = _max(markerBBox.width, labelBBox.width);
            height = markerBBox.height + defaultTopMargin + labelBBox.height;
            break;
    }

    return { width: width, height: height };
}

function calculateBBoxLabelAndMarker(markerBBox, labelBBox) {
    const bBox = {};

    bBox.left = _min(markerBBox.x, labelBBox.x);
    bBox.top = _min(markerBBox.y, labelBBox.y);
    bBox.right = _max(markerBBox.x + markerBBox.width, labelBBox.x + labelBBox.width);
    bBox.bottom = _max(markerBBox.y + markerBBox.height, labelBBox.y + labelBBox.height);

    return bBox;
}

function applyMarkerState(id, idToIndexMap, items, stateName) {
    const item = idToIndexMap && items[idToIndexMap[id]];
    if(item) {
        item.renderMarker(item.states[stateName]);
    }
}

function parseOptions(options, textField, allowInsidePosition) {
    if(!options) return null;

    ///#DEBUG
    const debug = require('../../core/utils/console').debug;
    debug.assertParam(options.visible, 'Visibility was not passed');
    debug.assertParam(options.markerSize, 'markerSize was not passed');
    debug.assertParam(options.font.color, 'fontColor was not passed');
    debug.assertParam(options.font.family, 'fontFamily was not passed');
    debug.assertParam(options.font.size, 'fontSize was not passed');
    debug.assertParam(options.paddingLeftRight, 'paddingLeftRight was not passed');
    debug.assertParam(options.paddingTopBottom, 'paddingTopBottom was not passed');
    debug.assertParam(options.columnItemSpacing, 'columnItemSpacing was not passed');
    debug.assertParam(options.rowItemSpacing, 'rowItemSpacing was not passed');
    ///#ENDDEBUG

    parseMargins(options);
    options.horizontalAlignment = parseHorizontalAlignment(options.horizontalAlignment, RIGHT);
    options.verticalAlignment = parseVerticalAlignment(options.verticalAlignment, options.horizontalAlignment === CENTER ? BOTTOM : TOP);
    options.orientation = parseOrientation(options.orientation, options.horizontalAlignment === CENTER ? HORIZONTAL : VERTICAL);
    options.itemTextPosition = parseItemTextPosition(options.itemTextPosition, options.orientation === HORIZONTAL ? BOTTOM : RIGHT);
    options.position = allowInsidePosition ? parsePosition(options.position, OUTSIDE) : OUTSIDE;
    options.itemsAlignment = parseItemsAlignment(options.itemsAlignment, null);
    options.hoverMode = _normalizeEnum(options.hoverMode);
    options.customizeText = _isFunction(options.customizeText) ? options.customizeText : function() { return this[textField]; };
    options.customizeHint = _isFunction(options.customizeHint) ? options.customizeHint : noop;
    options._incidentOccurred = options._incidentOccurred || noop;
    return options;
}

function createSquareMarker(renderer, size) {
    return renderer.rect(0, 0, size, size);
}

function createCircleMarker(renderer, size) {
    return renderer.circle(size / 2, size / 2, size / 2);
}

function isCircle(type) {
    return _normalizeEnum(type) === 'circle';
}

function inRect(rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function checkLinesSize(lines, layoutOptions, countItems, margins) {
    const position = { x: 0, y: 0 };
    let maxMeasureLength = 0;
    let maxAltMeasureLength = 0;
    let margin = 0;

    if(layoutOptions.direction === 'y') {
        margin = margins.top + margins.bottom;
    } else {
        margin = margins.left + margins.right;
    }

    lines.forEach(function(line, i) {
        const firstItem = line[0];
        const lineLength = line.length;

        line.forEach(function(item, index) {
            const offset = item.offset || layoutOptions.spacing;
            position[layoutOptions.direction] += item[layoutOptions.measure] + (index !== lineLength - 1 ? offset : 0);
            maxMeasureLength = _max(maxMeasureLength, position[layoutOptions.direction]);
        });

        position[layoutOptions.direction] = 0;
        position[layoutOptions.altDirection] += firstItem[layoutOptions.altMeasure] +
        firstItem.altOffset || layoutOptions.altSpacing;
        maxAltMeasureLength = _max(maxAltMeasureLength, position[layoutOptions.altDirection]);
    });

    if(maxMeasureLength + margin > layoutOptions.length) {
        layoutOptions.countItem = decreaseItemCount(layoutOptions, countItems);
        return true;
    }
}

function decreaseItemCount(layoutOptions, countItems) {
    layoutOptions.altCountItem++;
    return _ceil(countItems / layoutOptions.altCountItem);
}

function getLineLength(line, layoutOptions) {
    return line.reduce((lineLength, item) => {
        const offset = item.offset || layoutOptions.spacing;
        return lineLength + item[layoutOptions.measure] + offset;
    }, 0);
}

function getMaxLineLength(lines, layoutOptions) {
    return lines.reduce((maxLineLength, line) => {
        return _max(maxLineLength, getLineLength(line, layoutOptions));
    }, 0);
}

function getInitPositionForDirection(line, layoutOptions, maxLineLength) {
    const lineLength = getLineLength(line, layoutOptions);
    let initPosition;

    switch(layoutOptions.itemsAlignment) {
        case RIGHT:
            initPosition = maxLineLength - lineLength;
            break;
        case CENTER:
            initPosition = (maxLineLength - lineLength) / 2;
            break;
        default:
            initPosition = 0;
    }

    return initPosition;
}

function getPos(layoutOptions) {
    switch(layoutOptions.itemTextPosition) {
        case BOTTOM:
            return {
                horizontal: CENTER,
                vertical: TOP
            };
        case TOP:
            return {
                horizontal: CENTER,
                vertical: BOTTOM
            };
        case LEFT:
            return {
                horizontal: RIGHT,
                vertical: CENTER
            };
        case RIGHT:
            return {
                horizontal: LEFT,
                vertical: CENTER
            };
    }
}

function getLines(lines, layoutOptions, itemIndex) {
    const tableLine = {};

    if(itemIndex % layoutOptions.countItem === 0) {
        if(layoutOptions.markerOffset) {
            lines.push([], []);
        } else {
            lines.push([]);
        }
    }

    if(layoutOptions.markerOffset) {
        tableLine.firstLine = lines[lines.length - 1];
        tableLine.secondLine = lines[lines.length - 2];
    } else {
        tableLine.firstLine = tableLine.secondLine = lines[lines.length - 1];
    }

    return tableLine;
}

function setMaxInLine(line, measure) {
    const maxLineSize = line.reduce((maxLineSize, item) => {
        const itemMeasure = item ? item[measure] : maxLineSize;
        return _max(maxLineSize, itemMeasure);
    }, 0);

    line.forEach(item => {
        if(item) {
            item[measure] = maxLineSize;
        }
    });
}

function transpose(array) {
    const width = array.length;
    const height = array[0].length;
    let i;
    let j;
    const transposeArray = [];

    for(i = 0; i < height; i++) {
        transposeArray[i] = [];
        for(j = 0; j < width; j++) {
            transposeArray[i][j] = array[j][i];
        }
    }

    return transposeArray;
}

function getAlign(position) {
    switch(position) {
        case TOP:
        case BOTTOM:
            return CENTER;
        case LEFT:
            return RIGHT;
        case RIGHT:
            return LEFT;
    }
}

let getMarkerCreator = function(type) {
    return isCircle(type) ? createCircleMarker : createSquareMarker;
};

function getTitleHorizontalAlignment(options) {
    if(options.horizontalAlignment === CENTER) {
        return CENTER;
    } else {
        if(options.itemTextPosition === RIGHT) {
            return LEFT;
        } else if(options.itemTextPosition === LEFT) {
            return RIGHT;
        } else {
            return CENTER;
        }
    }
}

const _Legend = exports.Legend = function(settings) {
    const that = this;
    that._renderer = settings.renderer;
    that._legendGroup = settings.group;
    that._backgroundClass = settings.backgroundClass;
    that._itemGroupClass = settings.itemGroupClass;
    that._textField = settings.textField;
    that._getCustomizeObject = settings.getFormatObject;
    that._titleGroupClass = settings.titleGroupClass;
    that._allowInsidePosition = settings.allowInsidePosition;
    that._widget = settings.widget;
};

const legendPrototype = _Legend.prototype = clone(LayoutElement.prototype);

extend(legendPrototype, {
    constructor: _Legend,

    getOptions: function() {
        return this._options;
    },

    update: function(data = [], options, themeManagerTitleOptions = {}) {
        const that = this;
        options = that._options = parseOptions(options, that._textField, that._allowInsidePosition) || {};
        const initMarkerSize = options.markerSize;
        this._data = data.map((dataItem) => {
            dataItem.size = _Number(dataItem.size > 0 ? dataItem.size : initMarkerSize);
            dataItem.marker = getAttributes(dataItem, dataItem.states.normal);
            Object.defineProperty(dataItem.marker, 'size', {
                get() {
                    return dataItem.size;
                },
                set(value) {
                    dataItem.size = value;
                }
            });
            Object.defineProperty(dataItem.marker, 'opacity', {
                get() {
                    return dataItem.states.normal.opacity;
                },
                set(value) {
                    dataItem.states.normal.opacity =
                    dataItem.states.hover.opacity =
                    dataItem.states.selection.opacity = value;
                }
            });

            return dataItem;
        });

        if(options.customizeItems) {
            that._data = options.customizeItems(data.slice()) || data;
        }

        that._boundingRect = {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };

        if(that.isVisible() && !that._title) {
            that._title = new title.Title({ renderer: that._renderer, cssClass: that._titleGroupClass, root: that._legendGroup });
        }

        if(that._title) {
            const titleOptions = options.title;

            themeManagerTitleOptions.horizontalAlignment = getTitleHorizontalAlignment(options);
            that._title.update(themeManagerTitleOptions, titleOptions);
        }

        this.erase();

        return that;
    },

    isVisible: function() {
        return this._options && this._options.visible;
    },

    draw: function(width, height) {
        // TODO check multiple groups creation
        const that = this;
        const options = that._options;
        const items = that._getItemData();

        that._size = { width: width, height: height };
        that.erase();

        if(!(that.isVisible() && items && items.length)) {
            return that;
        }

        that._insideLegendGroup = that._renderer.g().enableLinks().append(that._legendGroup);
        that._title.changeLink(that._insideLegendGroup);

        that._createBackground();

        if(that._title.hasText()) {
            const horizontalPadding = that._background ? 2 * that._options.paddingLeftRight : 0;
            that._title.draw(width - horizontalPadding, height);
        }

        // TODO review pass or process states in legend
        that._markersGroup = that._renderer.g().attr({ class: that._itemGroupClass }).append(that._insideLegendGroup);
        that._createItems(items);

        that._locateElements(options);
        that._finalUpdate(options);

        const size = that.getLayoutOptions();
        if(size.width > width || size.height > height) {
            that.freeSpace();
        }

        return that;
    },

    probeDraw: function(width, height) {
        return this.draw(width, height);
    },

    _createItems: function(items) {
        const that = this;
        const options = that._options;
        const renderer = that._renderer;
        let maxBBoxHeight = 0;
        const createMarker = getMarkerCreator(options.markerShape);

        that._markersId = {};

        const templateFunction = !options.markerTemplate ? (dataItem, group) => {
            const attrs = dataItem.marker;
            createMarker(renderer, attrs.size)
                .attr({
                    fill: attrs.fill,
                    opacity: attrs.opacity
                })
                .append({ element: group });
        } : options.markerTemplate;

        const template = that._widget._getTemplate(templateFunction);

        const markersGroup = that._markersGroup;

        markersGroup.css(patchFontOptions(options.font));

        that._items = (items || []).map((dataItem, i) => {
            const stateOfDataItem = dataItem.states;
            const normalState = stateOfDataItem.normal;
            const normalStateFill = normalState.fill;
            dataItem.size = dataItem.marker.size;

            const states = {
                normal: extend(normalState, { fill: normalStateFill || options.markerColor || options.defaultColor, state: 'normal' }),
                hover: getState(stateOfDataItem.hover, normalStateFill, 'hovered'),
                selection: getState(stateOfDataItem.selection, normalStateFill, 'selected')
            };
            dataItem.states = states;

            const itemGroup = renderer.g().append(markersGroup);

            const markerGroup = renderer.g().attr({ class: 'dxl-marker' }).append(itemGroup);

            const item = {
                label: that._createLabel(dataItem, itemGroup),
                marker: markerGroup,
                renderer,
                group: itemGroup,
                tracker: { id: dataItem.id, argument: dataItem.argument, argumentIndex: dataItem.argumentIndex },
                states: states,
                itemTextPosition: options.itemTextPosition,
                markerOffset: 0,
                bBoxes: [],
                renderMarker(state) {
                    dataItem.marker = getAttributes(item, state, dataItem.size);
                    markerGroup.clear();
                    let isRendered = false;
                    template.render({
                        model: dataItem, container: markerGroup.element, onRendered: () => {
                            isRendered = true;
                            if(isAsyncRendering) {
                                that._widget._requestChange(['LAYOUT']);
                            }
                        }
                    });
                    const isAsyncRendering = !isRendered && markerGroup.element.childNodes.length === 0;
                }
            };

            item.renderMarker(states.normal);

            that._createHint(dataItem, itemGroup);

            if(dataItem.id !== undefined) {
                that._markersId[dataItem.id] = i;
            }

            return item;
        }).map(item => {
            const labelBBox = item.label.getBBox();
            const markerBBox = item.marker.getBBox();
            item.markerBBox = markerBBox;
            item.markerSize = Math.max(markerBBox.width, markerBBox.height);
            const bBox = getSizeItem(options, markerBBox, labelBBox);
            item.labelBBox = labelBBox;
            item.bBox = bBox;
            maxBBoxHeight = _max(maxBBoxHeight, bBox.height);

            return item;
        });
        if(options.equalRowHeight) {
            that._items.forEach(item => item.bBox.height = maxBBoxHeight);
        }
    },

    _getItemData: function() {
        let items = this._data || [];
        const options = this._options || {};
        // For maps in dashboards
        if(options.inverted) {
            items = items.slice().reverse();
        }

        return items.filter(i => i.visible);
    },

    _finalUpdate: function(options) {
        this._adjustBackgroundSettings(options);
        this._setBoundingRect(options.margin);
    },

    // The name is chosen to be opposite for `draw`
    erase: function() {
        const that = this;
        const insideLegendGroup = that._insideLegendGroup;

        insideLegendGroup && insideLegendGroup.dispose();
        that._insideLegendGroup = that._markersGroup = that._x1 = that._x2 = that._y2 = that._y2 = null;
        return that;
    },

    _locateElements: function(locationOptions) {
        this._moveInInitialValues();
        this._locateRowsColumns(locationOptions);
    },

    _moveInInitialValues: function() {
        const that = this;

        that._title.hasText() && that._title.move([0, 0]);
        that._legendGroup && that._legendGroup.move(0, 0);
        that._background && that._background.attr({ x: 0, y: 0, width: 0, height: 0 });
    },

    applySelected: function(id) {
        applyMarkerState(id, this._markersId, this._items, 'selection');
        return this;
    },

    applyHover: function(id) {
        applyMarkerState(id, this._markersId, this._items, 'hover');
        return this;
    },

    resetItem: function(id) {
        applyMarkerState(id, this._markersId, this._items, 'normal');
        return this;
    },

    _createLabel: function(data, group) {
        const labelFormatObject = this._getCustomizeObject(data);
        const options = this._options;
        const align = getAlign(options.itemTextPosition);
        const text = options.customizeText.call(labelFormatObject, labelFormatObject);
        const fontStyle = _isDefined(data.textOpacity) ? { color: options.font.color, opacity: data.textOpacity } : {};

        return this._renderer.text(text, 0, 0)
            .css(patchFontOptions(fontStyle))
            .attr({ align: align, class: options.cssClass })
            .append(group);
    },

    _createHint: function(data, group) {
        const labelFormatObject = this._getCustomizeObject(data);
        const text = this._options.customizeHint.call(labelFormatObject, labelFormatObject);
        if(_isDefined(text) && text !== '') {
            group.setTitle(text);
        }
    },

    _createBackground: function() {
        const that = this;
        const isInside = that._options.position === INSIDE;
        const color = that._options.backgroundColor;
        const fill = color || (isInside ? that._options.containerBackgroundColor : NONE);

        if(that._options.border.visible || ((isInside || color) && color !== NONE)) {
            that._background = that._renderer.rect(0, 0, 0, 0)
                .attr({ fill: fill, class: that._backgroundClass })
                .append(that._insideLegendGroup);
        }
    },

    _locateRowsColumns: function(options) {
        const that = this;
        let iteration = 0;
        const layoutOptions = that._getItemsLayoutOptions();
        const countItems = that._items.length;
        let lines;

        do {
            lines = [];
            that._createLines(lines, layoutOptions);
            that._alignLines(lines, layoutOptions);
            iteration++;
        } while(checkLinesSize(lines, layoutOptions, countItems, options.margin) && iteration < countItems);

        that._applyItemPosition(lines, layoutOptions);
    },

    _createLines: function(lines, layoutOptions) {

        this._items.forEach((item, i) => {
            const tableLine = getLines(lines, layoutOptions, i);
            const labelBox = {
                width: item.labelBBox.width,
                height: item.labelBBox.height,
                element: item.label,
                bBox: item.labelBBox,
                pos: getPos(layoutOptions),
                itemIndex: i
            };
            const markerBox = {
                width: item.markerBBox.width,
                height: item.markerBBox.height,
                element: item.marker,
                pos: {
                    horizontal: CENTER,
                    vertical: CENTER
                },
                bBox: { width: item.markerBBox.width, height: item.markerBBox.height, x: item.markerBBox.x, y: item.markerBBox.y },
                itemIndex: i
            };
            let firstItem;
            let secondItem;
            const offsetDirection = layoutOptions.markerOffset ? 'altOffset' : 'offset';

            if(layoutOptions.inverseLabelPosition) {
                firstItem = labelBox;
                secondItem = markerBox;
            } else {
                firstItem = markerBox;
                secondItem = labelBox;
            }

            firstItem[offsetDirection] = layoutOptions.labelOffset;
            tableLine.secondLine.push(firstItem);
            tableLine.firstLine.push(secondItem);
        });
    },

    _alignLines: function(lines, layoutOptions) {
        let i;
        let measure = layoutOptions.altMeasure;
        lines.forEach(line => setMaxInLine(line, measure));
        measure = layoutOptions.measure;
        if(layoutOptions.itemsAlignment) {
            if(layoutOptions.markerOffset) {
                for(i = 0; i < lines.length;) {
                    transpose([lines[i++], lines[i++]]).forEach(processLine);
                }
            }
        } else {
            transpose(lines).forEach(processLine);
        }

        function processLine(line) {
            setMaxInLine(line, measure);
        }
    },


    _applyItemPosition: function(lines, layoutOptions) {
        const that = this;
        const position = { x: 0, y: 0 };
        const maxLineLength = getMaxLineLength(lines, layoutOptions);

        lines.forEach(line => {
            const firstItem = line[0];
            const altOffset = firstItem.altOffset || layoutOptions.altSpacing;
            position[layoutOptions.direction] = getInitPositionForDirection(line, layoutOptions, maxLineLength);

            line.forEach(item => {
                const offset = item.offset || layoutOptions.spacing;
                const wrap = new WrapperLayoutElement(item.element, item.bBox);
                const itemBBoxOptions = {
                    x: position.x,
                    y: position.y,
                    width: item.width,
                    height: item.height
                };
                const itemBBox = new WrapperLayoutElement(null, itemBBoxOptions);
                const itemLegend = that._items[item.itemIndex];

                wrap.position({
                    of: itemBBox,
                    my: item.pos,
                    at: item.pos
                });
                itemLegend.bBoxes.push(itemBBox);
                position[layoutOptions.direction] += item[layoutOptions.measure] + offset;
            });
            position[layoutOptions.altDirection] += firstItem[layoutOptions.altMeasure] + altOffset;
        });

        this._items.forEach(item => {
            const itemBBox = calculateBBoxLabelAndMarker(item.bBoxes[0].getLayoutOptions(), item.bBoxes[1].getLayoutOptions());
            const horizontal = that._options.columnItemSpacing / 2;
            const vertical = that._options.rowItemSpacing / 2;

            item.tracker.left = itemBBox.left - horizontal;
            item.tracker.right = itemBBox.right + horizontal;
            item.tracker.top = itemBBox.top - vertical;
            item.tracker.bottom = itemBBox.bottom + vertical;
        });
    },

    _getItemsLayoutOptions: function() {
        const that = this;
        const options = that._options;
        const orientation = options.orientation;
        const layoutOptions = {
            itemsAlignment: options.itemsAlignment,
            orientation: options.orientation
        };
        const width = that._size.width - (that._background ? 2 * options.paddingLeftRight : 0);
        const height = that._size.height - (that._background ? 2 * options.paddingTopBottom : 0);

        if(orientation === HORIZONTAL) {
            layoutOptions.length = width;
            layoutOptions.spacing = options.columnItemSpacing;
            layoutOptions.direction = 'x';
            layoutOptions.measure = WIDTH;
            layoutOptions.altMeasure = HEIGHT;
            layoutOptions.altDirection = 'y';
            layoutOptions.altSpacing = options.rowItemSpacing;
            layoutOptions.countItem = options.columnCount;
            layoutOptions.altCountItem = options.rowCount;
            layoutOptions.marginTextLabel = 4;
            layoutOptions.labelOffset = 7;
            if(options.itemTextPosition === BOTTOM || options.itemTextPosition === TOP) {
                layoutOptions.labelOffset = 4;
                layoutOptions.markerOffset = true;
            }

        } else {
            layoutOptions.length = height;
            layoutOptions.spacing = options.rowItemSpacing;
            layoutOptions.direction = 'y';
            layoutOptions.measure = HEIGHT;
            layoutOptions.altMeasure = WIDTH;
            layoutOptions.altDirection = 'x';
            layoutOptions.altSpacing = options.columnItemSpacing;
            layoutOptions.countItem = options.rowCount;
            layoutOptions.altCountItem = options.columnCount;
            layoutOptions.marginTextLabel = 7;
            layoutOptions.labelOffset = 4;
            if(options.itemTextPosition === RIGHT || options.itemTextPosition === LEFT) {
                layoutOptions.labelOffset = 7;
                layoutOptions.markerOffset = true;
            }

        }
        if(!layoutOptions.countItem) {
            if(layoutOptions.altCountItem) {
                layoutOptions.countItem = _ceil(that._items.length / layoutOptions.altCountItem);
            } else {
                layoutOptions.countItem = that._items.length;
            }
        }

        if(options.itemTextPosition === TOP || options.itemTextPosition === LEFT) {
            layoutOptions.inverseLabelPosition = true;
        }

        layoutOptions.itemTextPosition = options.itemTextPosition;
        layoutOptions.altCountItem = layoutOptions.altCountItem || _ceil(that._items.length / layoutOptions.countItem);

        return layoutOptions;
    },

    _adjustBackgroundSettings: function(locationOptions) {
        if(!this._background) return;
        const border = locationOptions.border;
        const legendBox = this._calculateTotalBox();
        const backgroundSettings = {
            x: _round(legendBox.x - locationOptions.paddingLeftRight),
            y: _round(legendBox.y - locationOptions.paddingTopBottom),
            width: _round(legendBox.width) + 2 * locationOptions.paddingLeftRight,
            height: _round(legendBox.height),
            opacity: locationOptions.backgroundOpacity
        };

        if(border.visible && border.width && border.color && border.color !== NONE) {
            backgroundSettings['stroke-width'] = border.width;
            backgroundSettings.stroke = border.color;
            backgroundSettings['stroke-opacity'] = border.opacity;
            backgroundSettings.dashStyle = border.dashStyle;
            backgroundSettings.rx = border.cornerRadius || 0;
            backgroundSettings.ry = border.cornerRadius || 0;
        }

        this._background.attr(backgroundSettings);
    },

    _setBoundingRect: function(margin) {
        if(!this._insideLegendGroup) {
            return;
        }

        const box = this._calculateTotalBox();

        box.height += margin.top + margin.bottom;
        box.widthWithoutMargins = box.width;
        box.width += margin.left + margin.right;
        box.x -= margin.left;
        box.y -= margin.top;

        this._boundingRect = box;
    },

    _calculateTotalBox: function() {
        const markerBox = this._markersGroup.getBBox();
        const titleBox = this._title.getCorrectedLayoutOptions();
        const box = this._insideLegendGroup.getBBox();

        const verticalPadding = this._background ? 2 * this._options.paddingTopBottom : 0;

        box.height = markerBox.height + titleBox.height + verticalPadding;
        titleBox.width > box.width && (box.width = titleBox.width);

        return box;
    },

    getActionCallback: function(point) {
        const that = this;
        if(that._options.visible) {
            return function(act) {
                that[act](point.index);
            };
        } else {
            return noop;
        }
    },

    getLayoutOptions: function() {
        const options = this._options;
        const boundingRect = this._insideLegendGroup ? this._boundingRect : {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };

        if(options) {
            boundingRect.verticalAlignment = options.verticalAlignment;
            boundingRect.horizontalAlignment = options.horizontalAlignment;
            if(options.orientation === HORIZONTAL) {
                boundingRect.cutLayoutSide = options.verticalAlignment;
                boundingRect.cutSide = 'vertical';
            } else {
                if(options.horizontalAlignment === CENTER) {
                    boundingRect.cutLayoutSide = options.verticalAlignment;
                    boundingRect.cutSide = 'vertical';

                } else {
                    boundingRect.cutLayoutSide = options.horizontalAlignment;
                    boundingRect.cutSide = 'horizontal';
                }
            }
            boundingRect.position = {
                horizontal: options.horizontalAlignment,
                vertical: options.verticalAlignment
            };
            return boundingRect;
        }
        return null;
    },

    shift: function(x, y) {
        const that = this;
        let box = {};

        if(that._insideLegendGroup) {
            that._insideLegendGroup.attr({ translateX: x - that._boundingRect.x, translateY: y - that._boundingRect.y });
        }

        that._title && that._shiftTitle(that._boundingRect.widthWithoutMargins);
        that._markersGroup && that._shiftMarkers();

        if(that._insideLegendGroup) box = that._legendGroup.getBBox();

        that._x1 = box.x;
        that._y1 = box.y;
        that._x2 = box.x + box.width;
        that._y2 = box.y + box.height;
        return that;
    },

    _shiftTitle: function(boxWidth) {
        const that = this;
        const title = that._title;
        const titleBox = title.getCorrectedLayoutOptions();
        if(!titleBox || !title.hasText()) {
            return;
        }

        const width = boxWidth - (that._background ? 2 * that._options.paddingLeftRight : 0);
        const titleOptions = title.getOptions();
        let titleY = titleBox.y + titleOptions.margin.top;
        let titleX = 0;

        if(titleOptions.verticalAlignment === BOTTOM) {
            titleY += that._markersGroup.getBBox().height;
        }

        if(titleOptions.horizontalAlignment === RIGHT) {
            titleX = width - titleBox.width;
        } else if(titleOptions.horizontalAlignment === CENTER) {
            titleX = (width - titleBox.width) / 2;
        }
        title.shift(titleX, titleY);
    },

    _shiftMarkers: function() {
        const titleBox = this._title.getLayoutOptions();
        const markerBox = this._markersGroup.getBBox();
        const titleOptions = this._title.getOptions() || {};
        let center = 0;
        let y = 0;

        if(titleBox.width > markerBox.width && this._options.horizontalAlignment === CENTER) {
            center = titleBox.width / 2 - markerBox.width / 2;
        }

        if(titleOptions.verticalAlignment === TOP) {
            y = titleBox.height;
        }

        if(center !== 0 || y !== 0) {
            this._markersGroup.attr({ translateX: center, translateY: y });

            this._items.forEach(item => {
                item.tracker.left += center;
                item.tracker.right += center;
                item.tracker.top += y;
                item.tracker.bottom += y;
            });
        }
    },

    getPosition: function() {
        return this._options.position;
    },

    coordsIn: function(x, y) {
        return (x >= this._x1 && x <= this._x2 && y >= this._y1 && y <= this._y2);
    },

    getItemByCoord: function(x, y) {
        const items = this._items;
        const legendGroup = this._insideLegendGroup;
        x = x - legendGroup.attr('translateX');
        y = y - legendGroup.attr('translateY');

        for(let i = 0; i < items.length; i++) {
            if(inRect(items[i].tracker, x, y)) {
                return items[i].tracker;
            }
        }
        return null;
    },

    dispose: function() {
        const that = this;
        that._title && that._title.dispose();
        that._legendGroup = that._insideLegendGroup = that._title = that._renderer = that._options = that._data = that._items = null;

        return that;
    },

    // BaseWidget_layout_implementation
    layoutOptions: function() {
        if(!this.isVisible()) {
            return null;
        }
        const pos = this.getLayoutOptions();
        return {
            horizontalAlignment: this._options.horizontalAlignment,
            verticalAlignment: this._options.verticalAlignment,
            side: pos.cutSide,
            priority: 1,
            position: this.getPosition()
        };
    },

    measure: function(size) {
        this.draw(size[0], size[1]);
        const rect = this.getLayoutOptions();
        return [rect.width, rect.height];
    },

    move: function(rect) {
        this.shift(rect[0], rect[1]);
    },

    freeSpace: function() {
        this._options._incidentOccurred('W2104');
        this.erase();
    }
    // BaseWidget_layout_implementation
});


exports.plugin = {
    name: 'legend',
    init: function() {
        const that = this;
        const group = this._renderer.g()
            .attr({
                class: this._rootClassPrefix + '-legend'
            })
            .enableLinks()
            .append(that._renderer.root);

        that._legend = new exports.Legend({
            renderer: that._renderer,
            group: group,
            widget: this,
            itemGroupClass: this._rootClassPrefix + '-item',
            titleGroupClass: this._rootClassPrefix + '-title',
            textField: 'text',
            getFormatObject: function(data) {
                return {
                    item: data.item,
                    text: data.text
                };
            },
        });

        that._layout.add(that._legend);
    },
    extenders: {
        _applyTilesAppearance: function() {
            const that = this;
            this._items.forEach(function(item) {
                that._applyLegendItemStyle(item.id, item.getState());
            });
        },
        _buildNodes: function() {
            this._createLegendItems();
        }
    },
    members: {
        _applyLegendItemStyle: function(id, state) {
            const legend = this._legend;
            switch(state) {
                case 'hover':
                    legend.applyHover(id);
                    break;
                case 'selection':
                    legend.applySelected(id);
                    break;
                default:
                    legend.resetItem(id);
                    break;
            }
        },

        _createLegendItems: function() {
            if(this._legend.update(this._getLegendData(), this._getOption('legend'), this._themeManager.theme('legend').title)) {
                this._requestChange(['LAYOUT']);
            }
        }
    },
    dispose: function() {
        this._legend.dispose();
    },
    customize: function(constructor) {
        constructor.prototype._proxyData.push(function(x, y) {
            if(this._legend.coordsIn(x, y)) {
                const item = this._legend.getItemByCoord(x, y);
                if(item) {
                    return {
                        id: item.id,
                        type: 'legend'
                    };
                }
            }
        });

        constructor.addChange({
            code: 'LEGEND',
            handler: function() {
                this._createLegendItems();
            },
            isThemeDependent: true,
            option: 'legend',
            isOptionChange: true
        });
    }
};

///#DEBUG
const __getMarkerCreator = getMarkerCreator;
exports._DEBUG_stubMarkerCreator = function(callback) {
    getMarkerCreator = function() {
        return callback;
    };
};
exports._DEBUG_restoreMarkerCreator = function() {
    getMarkerCreator = __getMarkerCreator;
};
///#ENDDEBUG
