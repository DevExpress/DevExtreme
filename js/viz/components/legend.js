var vizUtils = require("../core/utils"),
    extend = require("../../core/utils/extend").extend,
    _each = require("../../core/utils/iterator").each,
    layoutElementModule = require("../core/layout_element"),
    typeUtils = require("../../core/utils/type"),

    _Number = Number,

    _math = Math,
    _round = _math.round,
    _max = _math.max,
    _min = _math.min,
    _ceil = _math.ceil,

    objectUtils = require("../../core/utils/object"),
    noop = require("../../core/utils/common").noop,
    _isDefined = typeUtils.isDefined,
    _isFunction = typeUtils.isFunction,
    _enumParser = vizUtils.enumParser,
    _normalizeEnum = vizUtils.normalizeEnum,

    _extend = extend,

    DEFAULT_MARGIN = 10,
    DEFAULT_MARKER_HATCHING_WIDTH = 2,
    DEFAULT_MARKER_HATCHING_STEP = 5,
    CENTER = "center",
    RIGHT = "right",
    LEFT = "left",
    TOP = "top",
    BOTTOM = "bottom",
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
    INSIDE = "inside",
    OUTSIDE = "outside",
    NONE = "none",
    HEIGHT = "height",
    WIDTH = "width",

    parseHorizontalAlignment = _enumParser([LEFT, CENTER, RIGHT]),
    parseVerticalAlignment = _enumParser([TOP, BOTTOM]),
    parseOrientation = _enumParser([VERTICAL, HORIZONTAL]),
    parseItemTextPosition = _enumParser([LEFT, RIGHT, TOP, BOTTOM]),
    parsePosition = _enumParser([OUTSIDE, INSIDE]),
    parseItemsAlignment = _enumParser([LEFT, CENTER, RIGHT]);

function getState(state, color) {
    if(!state) {
        return;
    }
    var colorFromAction = state.fill;

    return {
        fill: colorFromAction === NONE ? color : colorFromAction,
        hatching: _extend({}, state.hatching, {
            step: DEFAULT_MARKER_HATCHING_STEP,
            width: DEFAULT_MARKER_HATCHING_WIDTH
        })
    };
}

function parseMargins(options) {
    var margin = options.margin;
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

function getSizeItem(options, markerSize, labelBBox) {
    var defaultXMargin = 7,
        defaultTopMargin = 4,
        width,
        height;

    switch(options.itemTextPosition) {
        case LEFT:
        case RIGHT:
            width = markerSize + defaultXMargin + labelBBox.width;
            height = _max(markerSize, labelBBox.height);
            break;
        case TOP:
        case BOTTOM:
            width = _max(markerSize, labelBBox.width);
            height = markerSize + defaultTopMargin + labelBBox.height;
            break;
    }

    return { width: width, height: height };
}

function calculateBBoxLabelAndMarker(markerBBox, labelBBox) {
    var bBox = {};

    bBox.left = _min(markerBBox.x, labelBBox.x);
    bBox.top = _min(markerBBox.y, labelBBox.y);
    bBox.right = _max(markerBBox.x + markerBBox.width, labelBBox.x + labelBBox.width);
    bBox.bottom = _max(markerBBox.y + markerBBox.height, labelBBox.y + labelBBox.height);

    return bBox;
}

function applyMarkerState(id, idToIndexMap, items, stateName) {
    var item = idToIndexMap && items[idToIndexMap[id]];
    if(item) {
        item.marker.smartAttr(item.states[stateName]);
    }
}

function parseOptions(options, textField) {
    if(!options) return null;

    ///#DEBUG
    var debug = require("../../core/utils/console").debug;
    debug.assertParam(options.visible, "Visibility was not passed");
    debug.assertParam(options.markerSize, "markerSize was not passed");
    debug.assertParam(options.font.color, "fontColor was not passed");
    debug.assertParam(options.font.family, "fontFamily was not passed");
    debug.assertParam(options.font.size, "fontSize was not passed");
    debug.assertParam(options.paddingLeftRight, "paddingLeftRight was not passed");
    debug.assertParam(options.paddingTopBottom, "paddingTopBottom was not passed");
    debug.assertParam(options.columnItemSpacing, "columnItemSpacing was not passed");
    debug.assertParam(options.rowItemSpacing, "rowItemSpacing was not passed");
    ///#ENDDEBUG

    parseMargins(options);
    options.horizontalAlignment = parseHorizontalAlignment(options.horizontalAlignment, RIGHT);
    options.verticalAlignment = parseVerticalAlignment(options.verticalAlignment, options.horizontalAlignment === CENTER ? BOTTOM : TOP);
    options.orientation = parseOrientation(options.orientation, options.horizontalAlignment === CENTER ? HORIZONTAL : VERTICAL);
    options.itemTextPosition = parseItemTextPosition(options.itemTextPosition, options.orientation === HORIZONTAL ? BOTTOM : RIGHT);
    options.position = parsePosition(options.position, OUTSIDE);
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
    return _normalizeEnum(type) === "circle";
}

function inRect(rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function checkLinesSize(lines, layoutOptions, countItems, margins) {
    var position = { x: 0, y: 0 },
        maxMeasureLength = 0,
        maxAltMeasureLength = 0,
        margin = 0;

    if(layoutOptions.direction === "y") {
        margin = margins.top + margins.bottom;
    } else {
        margin = margins.left + margins.right;
    }

    lines.forEach(function(line, i) {
        var firstItem = line[0],
            lineLength = line.length;

        line.forEach(function(item, index) {
            var offset = item.offset || layoutOptions.spacing;
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
    var lineLength = 0;
    _each(line, function(_, item) {
        var offset = item.offset || layoutOptions.spacing;
        lineLength += item[layoutOptions.measure] + offset;
    });
    return lineLength;
}

function getMaxLineLength(lines, layoutOptions) {
    var maxLineLength = 0;
    _each(lines, function(_, line) {
        maxLineLength = _max(maxLineLength, getLineLength(line, layoutOptions));
    });
    return maxLineLength;
}

function getInitPositionForDirection(line, layoutOptions, maxLineLength) {
    var lineLength = getLineLength(line, layoutOptions),
        initPosition;

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
    var tableLine = {};

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
    var maxLineSize = 0;

    _each(line, function(_, item) {
        if(!item) return;
        maxLineSize = _max(maxLineSize, item[measure]);
    });
    _each(line, function(_, item) {
        if(!item) return;
        item[measure] = maxLineSize;
    });
}

function transpose(array) {
    var width = array.length,
        height = array[0].length,
        i,
        j,
        transposeArray = [];

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

var getMarkerCreator = function(type) {
    return isCircle(type) ? createCircleMarker : createSquareMarker;
};

var _Legend = exports.Legend = function(settings) {
    var that = this;
    that._renderer = settings.renderer;
    that._legendGroup = settings.group;
    that._backgroundClass = settings.backgroundClass;
    that._itemGroupClass = settings.itemGroupClass;
    that._textField = settings.textField;
    that._getCustomizeObject = settings.getFormatObject;
};

var legendPrototype = _Legend.prototype = objectUtils.clone(layoutElementModule.LayoutElement.prototype);

extend(legendPrototype, {
    constructor: _Legend,

    getOptions: function() {
        return this._options;
    },

    update: function(data, options) {
        var that = this;

        that._data = data;
        that._boundingRect = {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };
        that._options = parseOptions(options, that._textField);

        return that;
    },

    draw: function(width, height) {
        // TODO check multiple groups creation
        var that = this,
            options = that._options,
            renderer = that._renderer,
            items = that._data;

        this._size = { width: width, height: height };
        that.erase();

        if(!(options && options.visible && items && items.length)) {
            return that;
        }

        that._insideLegendGroup = renderer.g().append(that._legendGroup);
        that._createBackground();
        // TODO review pass or process states in legend
        that._createItems(that._getItemData());

        that._locateElements(options);
        that._finalUpdate(options);

        if(that.getLayoutOptions().width > width || that.getLayoutOptions().height > height) {
            this.freeSpace();
        }

        return that;
    },

    probeDraw: function(width, height) {
        return this.draw(width, height);
    },

    _createItems: function(items) {
        var that = this,
            options = that._options,
            initMarkerSize = options.markerSize,
            renderer = that._renderer,
            bBox,
            maxBBoxHeight = 0,
            createMarker = getMarkerCreator(options.markerShape);

        that._markersId = {};

        that._items = vizUtils.map(items, function(dataItem, i) {
            var group = that._insideLegendGroup,
                markerSize = _Number(dataItem.size > 0 ? dataItem.size : initMarkerSize),
                stateOfDataItem = dataItem.states,
                normalState = stateOfDataItem.normal,
                normalStateFill = normalState.fill,
                marker = createMarker(renderer, markerSize)
                    .attr({ fill: normalStateFill || options.markerColor || options.defaultColor, opacity: normalState.opacity })
                    .append(group),
                label = that._createLabel(dataItem, group),
                states = {
                    normal: { fill: normalStateFill },
                    hovered: getState(stateOfDataItem.hover, normalStateFill),
                    selected: getState(stateOfDataItem.selection, normalStateFill)
                },
                labelBBox = label.getBBox();

            if(dataItem.id !== undefined) {
                that._markersId[dataItem.id] = i;
            }

            bBox = getSizeItem(options, markerSize, labelBBox);
            maxBBoxHeight = _max(maxBBoxHeight, bBox.height);
            that._createHint(dataItem, label, marker);

            return {
                label: label,
                labelBBox: labelBBox,
                group: group,
                bBox: bBox,
                marker: marker,
                markerSize: markerSize,
                tracker: { id: dataItem.id, argument: dataItem.argument, argumentIndex: dataItem.argumentIndex },
                states: states,
                itemTextPosition: options.itemTextPosition,
                markerOffset: 0,
                bBoxes: []
            };
        });
        if(options.equalRowHeight) {
            _each(that._items, function(_, item) {
                item.bBox.height = maxBBoxHeight;
            });
        }
    },

    _getItemData: function() {
        var items = this._data;
        // For maps in dashboards
        if(this._options.inverted) {
            items = items.slice().reverse();
        }
        return items;
    },

    _finalUpdate: function(options) {
        this._adjustBackgroundSettings(options);
        this._setBoundingRect(options.margin);
    },

    // The name is chosen to be opposite for `draw`
    erase: function() {
        var that = this,
            insideLegendGroup = that._insideLegendGroup;

        insideLegendGroup && insideLegendGroup.dispose();
        that._insideLegendGroup = that._x1 = that._x2 = that._y2 = that._y2 = null;
        return that;
    },

    _locateElements: function(locationOptions) {
        this._moveInInitialValues();
        this._locateRowsColumns(locationOptions);
    },

    _moveInInitialValues: function() {
        var that = this;
        that._legendGroup && that._legendGroup.move(0, 0);
        that._background && that._background.attr({ x: 0, y: 0, width: 0, height: 0 });
    },

    applySelected: function(id) {
        applyMarkerState(id, this._markersId, this._items, "selected");
        return this;
    },

    applyHover: function(id) {
        applyMarkerState(id, this._markersId, this._items, "hovered");
        return this;
    },

    resetItem: function(id) {
        applyMarkerState(id, this._markersId, this._items, "normal");
        return this;
    },

    _createLabel: function(data, group) {
        var labelFormatObject = this._getCustomizeObject(data),
            align = getAlign(this._options.itemTextPosition),
            text = this._options.customizeText.call(labelFormatObject, labelFormatObject),
            fontStyle = _isDefined(data.textOpacity) ? _extend({}, this._options.font, { opacity: data.textOpacity }) : this._options.font;
        return this._renderer.text(text, 0, 0)
            .css(vizUtils.patchFontOptions(fontStyle))
            .attr({ align: align })
            .append(group);
    },

    _createHint: function(data, label, marker) {
        var labelFormatObject = this._getCustomizeObject(data),
            text = this._options.customizeHint.call(labelFormatObject, labelFormatObject);
        if(_isDefined(text) && text !== "") {
            label.setTitle(text);
            marker.setTitle(text);
        }
    },

    _createBackground: function() {
        var that = this,
            isInside = that._options.position === INSIDE,
            color = that._options.backgroundColor,
            fill = color || (isInside ? that._options.containerBackgroundColor : NONE);

        if(that._options.border.visible || ((isInside || color) && color !== NONE)) {
            that._background = that._renderer.rect(0, 0, 0, 0)
                .attr({ fill: fill, "class": that._backgroundClass })
                .append(that._insideLegendGroup);
        }
    },

    _locateRowsColumns: function(options) {
        var that = this,
            iteration = 0,
            layoutOptions = that._getItemsLayoutOptions(),
            countItems = that._items.length,
            lines;

        do {
            lines = [];
            that._createLines(lines, layoutOptions);
            that._alignLines(lines, layoutOptions);
            iteration++;
        } while(checkLinesSize(lines, layoutOptions, countItems, options.margin) && iteration < countItems);

        that._applyItemPosition(lines, layoutOptions);
    },

    _createLines: function(lines, layoutOptions) {
        _each(this._items, function(i, item) {
            var tableLine = getLines(lines, layoutOptions, i),
                labelBox = {
                    width: item.labelBBox.width,
                    height: item.labelBBox.height,
                    element: item.label,
                    bBox: item.labelBBox,
                    pos: getPos(layoutOptions),
                    itemIndex: i
                },
                markerBox = {
                    width: item.markerSize,
                    height: item.markerSize,
                    element: item.marker,
                    pos: {
                        horizontal: CENTER,
                        vertical: CENTER
                    },
                    bBox: { width: item.markerSize, height: item.markerSize, x: 0, y: 0 },
                    itemIndex: i
                },
                firstItem,
                secondItem,
                offsetDirection = layoutOptions.markerOffset ? "altOffset" : "offset";

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
        var i,
            measure = layoutOptions.altMeasure;
        _each(lines, processLine);
        measure = layoutOptions.measure;
        if(layoutOptions.itemsAlignment) {
            if(layoutOptions.markerOffset) {
                for(i = 0; i < lines.length;) {
                    _each(transpose([lines[i++], lines[i++]]), processLine);
                }
            }
        } else {
            _each(transpose(lines), processLine);
        }

        function processLine(_, line) {
            setMaxInLine(line, measure);
        }
    },

    _applyItemPosition: function(lines, layoutOptions) {
        var that = this,
            position = { x: 0, y: 0 },
            maxLineLength = getMaxLineLength(lines, layoutOptions);

        _each(lines, function(i, line) {
            var firstItem = line[0],
                altOffset = firstItem.altOffset || layoutOptions.altSpacing;
            position[layoutOptions.direction] = getInitPositionForDirection(line, layoutOptions, maxLineLength);
            _each(line, function(_, item) {
                var offset = item.offset || layoutOptions.spacing,
                    wrap = new layoutElementModule.WrapperLayoutElement(item.element, item.bBox),
                    itemBBox = new layoutElementModule.WrapperLayoutElement(null, { x: position.x, y: position.y, width: item.width, height: item.height }),
                    itemLegend = that._items[item.itemIndex];

                wrap.position({
                    of: itemBBox,
                    my: item.pos, at: item.pos
                });
                itemLegend.bBoxes.push(itemBBox);
                position[layoutOptions.direction] += item[layoutOptions.measure] + offset;
            });
            position[layoutOptions.altDirection] += firstItem[layoutOptions.altMeasure] + altOffset;
        });

        _each(this._items, function(_, item) {
            var itemBBox = calculateBBoxLabelAndMarker(item.bBoxes[0].getLayoutOptions(), item.bBoxes[1].getLayoutOptions()),
                horizontal = that._options.columnItemSpacing / 2,
                vertical = that._options.rowItemSpacing / 2;

            item.tracker.left = itemBBox.left - horizontal;
            item.tracker.right = itemBBox.right + horizontal;
            item.tracker.top = itemBBox.top - vertical;
            item.tracker.bottom = itemBBox.bottom + vertical;
        });
    },

    _getItemsLayoutOptions: function() {
        var that = this,
            options = that._options,
            orientation = options.orientation,
            layoutOptions = {
                itemsAlignment: options.itemsAlignment,
                orientation: options.orientation
            },
            width = that._size.width - (that._background ? 2 * options.paddingLeftRight : 0),
            height = that._size.height - (that._background ? 2 * options.paddingTopBottom : 0);

        if(orientation === HORIZONTAL) {
            layoutOptions.length = width;
            layoutOptions.spacing = options.columnItemSpacing;
            layoutOptions.direction = "x";
            layoutOptions.measure = WIDTH;
            layoutOptions.altMeasure = HEIGHT;
            layoutOptions.altDirection = "y";
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
            layoutOptions.direction = "y";
            layoutOptions.measure = HEIGHT;
            layoutOptions.altMeasure = WIDTH;
            layoutOptions.altDirection = "x";
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
        var border = locationOptions.border,
            legendBox = this._insideLegendGroup.getBBox(),
            backgroundSettings = {
                x: _round(legendBox.x - locationOptions.paddingLeftRight),
                y: _round(legendBox.y - locationOptions.paddingTopBottom),
                width: _round(legendBox.width) + 2 * locationOptions.paddingLeftRight,
                height: _round(legendBox.height) + 2 * locationOptions.paddingTopBottom,
                opacity: locationOptions.backgroundOpacity
            };

        if(border.visible && border.width && border.color && border.color !== NONE) {
            backgroundSettings["stroke-width"] = border.width;
            backgroundSettings.stroke = border.color;
            backgroundSettings["stroke-opacity"] = border.opacity;
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
        var box = this._insideLegendGroup.getBBox();

        box.height += margin.top + margin.bottom;
        box.width += margin.left + margin.right;
        box.x -= margin.left;
        box.y -= margin.top;

        this._boundingRect = box;
    },

    getActionCallback: function(point) {
        var that = this;
        if(that._options.visible) {
            return function(act) {
                that[act](point.index);
            };
        } else {
            return noop;
        }
    },

    getLayoutOptions: function() {
        var options = this._options,
            boundingRect = this._insideLegendGroup ? this._boundingRect : {
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
                boundingRect.cutSide = "vertical";
            } else {
                if(options.horizontalAlignment === CENTER) {
                    boundingRect.cutLayoutSide = options.verticalAlignment;
                    boundingRect.cutSide = "vertical";

                } else {
                    boundingRect.cutLayoutSide = options.horizontalAlignment;
                    boundingRect.cutSide = "horizontal";
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
        var that = this,
            box = {};
        if(that._insideLegendGroup) {
            that._insideLegendGroup.attr({ translateX: x - that._boundingRect.x, translateY: y - that._boundingRect.y });
            box = that._legendGroup.getBBox();
        }

        that._x1 = box.x;
        that._y1 = box.y;
        that._x2 = box.x + box.width;
        that._y2 = box.y + box.height;
        return that;
    },

    getPosition: function() {
        return this._options.position;
    },

    coordsIn: function(x, y) {
        return (x >= this._x1 && x <= this._x2 && y >= this._y1 && y <= this._y2);
    },

    getItemByCoord: function(x, y) {
        var items = this._items,
            legendGroup = this._insideLegendGroup;
        x = x - legendGroup.attr("translateX");
        y = y - legendGroup.attr("translateY");

        for(var i = 0; i < items.length; i++) {
            if(inRect(items[i].tracker, x, y)) {
                return items[i].tracker;
            }
        }
        return null;
    },

    dispose: function() {
        var that = this;
        that._legendGroup = that._insideLegendGroup = that._renderer = that._options = that._data = that._items = null;
        return that;
    },

    // BaseWidget_layout_implementation
    layoutOptions: function() {
        var pos = this.getLayoutOptions();
        return {
            horizontalAlignment: this._options.horizontalAlignment,
            verticalAlignment: this._options.verticalAlignment,
            side: pos.cutSide,
            priority: 1
        };
    },

    measure: function(size) {
        this.draw(size[0], size[1]);
        var rect = this.getLayoutOptions();
        return [rect.width, rect.height];
    },

    move: function(rect) {
        this.shift(rect[0], rect[1]);
    },

    freeSpace: function() {
        this._options._incidentOccurred("W2104");
        this.erase();
    }
    // BaseWidget_layout_implementation
});


exports.plugin = {
    name: "legend",
    init: function() {
        var that = this,
            group = this._renderer.g()
                .attr({
                    class: this._rootClassPrefix + "-legend"
                })
                .append(that._renderer.root);

        that._legend = new exports.Legend({
            renderer: that._renderer,
            group: group,
            textField: "text",
            getFormatObject: function(item) {
                return {
                    item: item,
                    text: item.argument
                };
            },
        });

        that._layout.add(that._legend);
    },
    extenders: {
        _applyTilesAppearance: function() {
            var that = this;
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
            var legend = this._legend;
            switch(state) {
                case "hover":
                    legend.applyHover(id);
                    break;
                case "selection":
                    legend.applySelected(id);
                    break;
                default:
                    legend.resetItem(id);
                    break;
            }
        },

        _createLegendItems: function() {
            if(this._legend.update(this.getAllItems(), this._getOption("legend"))) {
                this._requestChange(["LAYOUT"]);
            }
        }
    },
    dispose: function() {
        this._legend.dispose();
    },
    customize: function(constructor) {
        constructor.prototype._proxyData.push(function(x, y) {
            if(this._legend.coordsIn(x, y)) {
                var item = this._legend.getItemByCoord(x, y);
                if(item) {
                    return {
                        id: item.id,
                        type: "legend"
                    };
                }
            }
        });

        constructor.addChange({
            code: "LEGEND",
            handler: function() {
                this._createLegendItems();
            },
            isThemeDependent: true,
            option: "legend",
            isOptionChange: true
        });
    }
};

///#DEBUG
var __getMarkerCreator = getMarkerCreator;
exports._DEBUG_stubMarkerCreator = function(callback) {
    getMarkerCreator = function() {
        return callback;
    };
};
exports._DEBUG_restoreMarkerCreator = function() {
    getMarkerCreator = __getMarkerCreator;
};
///#ENDDEBUG
