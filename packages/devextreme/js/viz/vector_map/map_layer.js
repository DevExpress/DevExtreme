import { noop } from '../../core/utils/common';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { DataHelperMixin } from '../../common/data';
import { isFunction as _isFunction, isDefined as _isDefined } from '../../core/utils/type';
import { Deferred, when } from '../../core/utils/deferred';
import { parseScalar as _parseScalar,
    patchFontOptions as _patchFontOptions,
    normalizeEnum as _normalizeEnum
} from '../core/utils';

const _noop = noop;
const _extend = extend;
const _each = each;
const _concat = Array.prototype.concat;

const TYPE_AREA = 'area';
const TYPE_LINE = 'line';
const TYPE_MARKER = 'marker';

const STATE_DEFAULT = 0;
const STATE_HOVERED = 1;
const STATE_SELECTED = 2;
const STATE_TO_INDEX = [0, 1, 2, 2];

const TOLERANCE = 1;

const SELECTIONS = {
    'none': null,
    'single': -1,
    'multiple': NaN
};

const _isArray = Array.isArray;
const _Number = Number;
const _String = String;
const _abs = Math.abs;
const _round = Math.round;
const _min = Math.min;
const _max = Math.max;
const _sqrt = Math.sqrt;

export function getMaxBound(arr) {
    return arr.reduce((a, c) => {
        return c ? [_min(a[0], c[0]),
            _min(a[1], c[1]),
            _max(a[2], c[2]),
            _max(a[3], c[3])] : a;
    }, arr[0]);
}

function getSelection(selectionMode) {
    let selection = _normalizeEnum(selectionMode);
    selection = selection in SELECTIONS ? SELECTIONS[selection] : SELECTIONS.single;
    if(selection !== null) {
        selection = { state: {}, single: selection };
    }
    return selection;
}

function getName(opt, index) {
    return (opt[index] || {}).name;
}

function EmptySource() { }
EmptySource.prototype.count = function() { return 0; };

function ArraySource(raw) {
    this.raw = raw;
}

ArraySource.prototype = {
    constructor: ArraySource,

    count: function() {
        return this.raw.length;
    },

    item: function(index) {
        return this.raw[index];
    },

    geometry: function(item) {
        return { coordinates: item.coordinates };
    },

    attributes: function(item) {
        return item.attributes;
    },

    getBBox: function(index) {
        return arguments.length === 0 ? undefined : this.raw[index]['bbox'];
    }
};

function GeoJsonSource(raw) {
    this.raw = raw;
}

GeoJsonSource.prototype = {
    constructor: GeoJsonSource,

    count: function() {
        return this.raw.features.length;
    },

    item: function(index) {
        return this.raw.features[index];
    },

    geometry: function(item) {
        return item.geometry;
    },

    attributes: function(item) {
        return item.properties;
    },

    getBBox: function(index) {
        return arguments.length === 0 ? this.raw['bbox'] : this.raw.features[index]['bbox'];
    }
};

function isGeoJsonObject(obj) {
    return _isArray(obj.features);
}

// The problem is that when remote source returns an object (not an array) the data.DataSource internally wraps it into array (of one element)
// So specific `if` clause is required to recognize GeoJson object in the returned `items`
function unwrapFromDataSource(source) {
    let sourceType;
    if(source) {
        if(isGeoJsonObject(source)) {
            sourceType = GeoJsonSource;
        } else if(source.length === 1 && source[0] && isGeoJsonObject(source[0])) {
            sourceType = GeoJsonSource;
            source = source[0];
        } else if(_isArray(source)) {
            sourceType = ArraySource;
        }
    }
    sourceType = sourceType || EmptySource;
    return new sourceType(source);
}

// The first problem is that when our DataSource is updated with an object (not an array) it considers such object a bunch of options.
// So single object has to be wrapped into array in order to be passed to the data.DataSource as is.
// The second problem is that when our DataSource is updated with `null` or `undefined` it does nothing - callback is not triggered (it is because of charts).
// So `null` or `undefined` is changed to empty array.
function wrapToDataSource(option) {
    return option ? (isGeoJsonObject(option) ? [option] : option) : [];
}

function customizeHandles(proxies, callback, widget) {
    callback.call(widget, proxies);
}

// TODO: Consider moving it inside a strategy
function setAreaLabelVisibility(label) {
    label.text.attr({ visibility: label.size[0] / label.spaceSize[0] < TOLERANCE && label.size[1] / label.spaceSize[1] < TOLERANCE ? null : 'hidden' });
}

// TODO: Consider moving it inside a strategy
function setLineLabelVisibility(label) {
    label.text.attr({ visibility: label.size[0] / label.spaceSize[0] < TOLERANCE || label.size[1] / label.spaceSize[1] < TOLERANCE ? null : 'hidden' });
}

function getDataValue(proxy, dataField) {
    return proxy.attribute(dataField);
}

const TYPE_TO_TYPE_MAP = {
    Point: TYPE_MARKER,
    MultiPoint: TYPE_LINE,
    LineString: TYPE_LINE,
    MultiLineString: TYPE_LINE,
    Polygon: TYPE_AREA,
    MultiPolygon: TYPE_AREA
};

function pick(a, b) {
    return a !== undefined ? a : b;
}

function guessTypeByData(sample) {
    let type = TYPE_TO_TYPE_MAP[sample.type];
    const coordinates = sample.coordinates;
    if(!type) {
        if(typeof coordinates[0] === 'number') {
            type = TYPE_MARKER;
        } else if(typeof coordinates[0][0] === 'number') {
            type = TYPE_LINE;
        } else {
            type = TYPE_AREA;
        }
    }
    return type;
}

const emptyStrategy = {
    setup: _noop,

    reset: _noop,

    arrange: _noop,

    updateGrouping: _noop,

    getDefaultColor: _noop
};

const strategiesByType = {};
const strategiesByGeometry = {};
const strategiesByElementType = {};
let groupByColor;
let groupBySize;

let selectStrategy = function(options, data) {
    let type = _normalizeEnum(options.type);
    let elementType = _normalizeEnum(options.elementType);
    let sample;
    const strategy = _extend({}, emptyStrategy);
    if(data.count() > 0) {
        sample = data.geometry(data.item(0));
        type = strategiesByType[type] ? type : guessTypeByData(sample);
        _extend(strategy, strategiesByType[type]);
        strategy.fullType = strategy.type = type;
        if(strategiesByGeometry[type]) {
            _extend(strategy, strategiesByGeometry[type](sample));
        }
        if(strategiesByElementType[type]) {
            elementType = strategiesByElementType[type][elementType] ? elementType : strategiesByElementType[type]._default;
            _extend(strategy, strategiesByElementType[type][elementType]);
            strategy.elementType = elementType;
            strategy.fullType += ':' + elementType;
        }
    }
    return strategy;
};

function applyElementState(figure, styles, state, field) {
    figure[field].attr(styles[field][state]);
}

strategiesByType[TYPE_AREA] = {
    projectLabel: projectAreaLabel,

    transform: transformPointList,

    transformLabel: transformAreaLabel,

    draw: function(context, figure, data) {
        figure.root = context.renderer.path([], 'area').data(context.dataKey, data);
    },

    refresh: _noop,

    getLabelOffset: function(label) {
        setAreaLabelVisibility(label);
        return [0, 0];
    },

    getStyles: function(settings) {
        const color = settings.color || null;
        const borderColor = settings.borderColor || null;
        const borderWidth = pick(settings.borderWidth, null);
        const opacity = pick(settings.opacity, null);
        return {
            root: [
                { 'class': 'dxm-area', stroke: borderColor, 'stroke-width': borderWidth, fill: color, opacity: opacity },
                { 'class': 'dxm-area dxm-area-hovered', stroke: settings.hoveredBorderColor || borderColor, 'stroke-width': pick(settings.hoveredBorderWidth, borderWidth), fill: settings.hoveredColor || color, opacity: pick(settings.hoveredOpacity, opacity) },
                { 'class': 'dxm-area dxm-area-selected', stroke: settings.selectedBorderColor || borderColor, 'stroke-width': pick(settings.selectedBorderWidth, borderWidth), fill: settings.selectedColor || color, opacity: pick(settings.selectedOpacity, opacity) }
            ]
        };
    },

    setState: function(figure, styles, state) {
        applyElementState(figure, styles, state, 'root');
    },

    hasLabelsGroup: true,

    updateGrouping: function(context) {
        groupByColor(context);
    },

    getDefaultColor: _noop
};

strategiesByType[TYPE_LINE] = {
    projectLabel: projectLineLabel,

    transform: transformPointList,

    transformLabel: transformLineLabel,

    draw: function(context, figure, data) {
        figure.root = context.renderer.path([], 'line').data(context.dataKey, data);
    },

    refresh: _noop,

    getLabelOffset: function(label) {
        setLineLabelVisibility(label);
        return [0, 0];
    },

    getStyles: function(settings) {
        const color = settings.color || settings.borderColor || null;
        const width = pick(settings.borderWidth, null);
        const opacity = pick(settings.opacity, null);
        return {
            root: [
                { 'class': 'dxm-line', stroke: color, 'stroke-width': width, opacity: opacity },
                { 'class': 'dxm-line dxm-line-hovered', stroke: settings.hoveredColor || settings.hoveredBorderColor || color, 'stroke-width': pick(settings.hoveredBorderWidth, width), opacity: pick(settings.hoveredOpacity, opacity) },
                { 'class': 'dxm-line dxm-line-selected', stroke: settings.selectedColor || settings.selectedBorderColor || color, 'stroke-width': pick(settings.selectedBorderWidth, width), opacity: pick(settings.selectedOpacity, opacity) }
            ]
        };
    },

    setState: function(figure, styles, state) {
        applyElementState(figure, styles, state, 'root');
    },

    hasLabelsGroup: true,

    updateGrouping: function(context) {
        groupByColor(context);
    },

    getDefaultColor: _noop
};

strategiesByType[TYPE_MARKER] = {
    project: projectPoint,

    transform: transformPoint,

    draw: function(context, figure, data) {
        figure.root = context.renderer.g();
        this._draw(context, figure, data);
    },

    refresh: _noop,

    hasLabelsGroup: false,

    getLabelOffset: function(label, settings) {
        return [_round((label.size[0] + _max(settings.size || 0, 0)) / 2) + 2, 0];
    },

    getStyles: function(settings) {
        const styles = {
            root: [
                { 'class': 'dxm-marker' },
                { 'class': 'dxm-marker dxm-marker-hovered' },
                { 'class': 'dxm-marker dxm-marker-selected' }
            ]
        };
        this._getStyles(styles, settings);
        return styles;
    },

    setState: function(figure, styles, state) {
        applyElementState(figure, styles, state, 'root');
        this._setState(figure, styles, state);
    },

    updateGrouping: function(context) {
        groupByColor(context);
        groupBySize(context);
    },

    getDefaultColor: function(ctx, palette) {
        return ctx.params.themeManager.getAccentColor(palette);
    }
};

strategiesByGeometry[TYPE_AREA] = function(sample) {
    return {
        project(projection, coordinates) {
            return coordinates[0]
            && coordinates[0][0]
            && coordinates[0][0][0]
            && typeof coordinates[0][0][0][0] === 'number' ? projectMultiPolygon(projection, coordinates) : projectPolygon(projection, coordinates);

        }
    };
};

strategiesByGeometry[TYPE_LINE] = function(sample) {
    const coordinates = sample.coordinates;
    return { project: coordinates[0] && coordinates[0][0] && typeof coordinates[0][0][0] === 'number' ? projectPolygon : projectLineString };
};

strategiesByElementType[TYPE_MARKER] = {
    _default: 'dot',

    dot: {
        setup: function(context) {
            context.filter = context.renderer.shadowFilter('-40%', '-40%', '180%', '200%', 0, 1, 1, '#000000', 0.2);
        },

        reset: function(context) {
            context.filter.dispose();
            context.filter = null;
        },

        _draw: function(ctx, figure, data) {
            figure.back = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
            figure.dot = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
        },

        refresh: function(ctx, figure, data, proxy, settings) {
            figure.dot.attr({ filter: settings.shadow ? ctx.filter.id : null });
        },

        _getStyles: function(styles, style) {
            const size = style.size > 0 ? _Number(style.size) : 0;
            const hoveredSize = size;
            const selectedSize = size + (style.selectedStep > 0 ? _Number(style.selectedStep) : 0);
            const hoveredBackSize = hoveredSize + (style.backStep > 0 ? _Number(style.backStep) : 0);
            const selectedBackSize = selectedSize + (style.backStep > 0 ? _Number(style.backStep) : 0);
            const color = style.color || null;
            const borderColor = style.borderColor || null;
            const borderWidth = pick(style.borderWidth, null);
            const opacity = pick(style.opacity, null);
            const backColor = style.backColor || null;
            const backOpacity = pick(style.backOpacity, null);
            styles.dot = [
                { r: size / 2, stroke: borderColor, 'stroke-width': borderWidth, fill: color, opacity: opacity },
                { r: hoveredSize / 2, stroke: style.hoveredBorderColor || borderColor, 'stroke-width': pick(style.hoveredBorderWidth, borderWidth), fill: style.hoveredColor || color, opacity: pick(style.hoveredOpacity, opacity) },
                { r: selectedSize / 2, stroke: style.selectedBorderColor || borderColor, 'stroke-width': pick(style.selectedBorderWidth, borderWidth), fill: style.selectedColor || color, opacity: pick(style.selectedOpacity, opacity) }
            ];
            styles.back = [
                { r: size / 2, stroke: 'none', 'stroke-width': 0, fill: backColor, opacity: backOpacity },
                { r: hoveredBackSize / 2, stroke: 'none', 'stroke-width': 0, fill: backColor, opacity: backOpacity },
                { r: selectedBackSize / 2, stroke: 'none', 'stroke-width': 0, fill: backColor, opacity: backOpacity }
            ];
        },

        _setState: function(figure, styles, state) {
            applyElementState(figure, styles, state, 'dot');
            applyElementState(figure, styles, state, 'back');
        }
    },

    bubble: {
        _draw: function(ctx, figure, data) {
            figure.bubble = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
        },

        refresh: function(ctx, figure, data, proxy, settings) {
            figure.bubble.attr({ r: settings.size / 2 });
        },

        _getStyles: function(styles, style) {
            const color = style.color || null;
            const borderColor = style.borderColor || null;
            const borderWidth = pick(style.borderWidth, null);
            const opacity = pick(style.opacity, null);
            styles.bubble = [
                { stroke: borderColor, 'stroke-width': borderWidth, fill: color, opacity: opacity },
                { stroke: style.hoveredBorderColor || borderColor, 'stroke-width': pick(style.hoveredBorderWidth, borderWidth), fill: style.hoveredColor || style.color, opacity: pick(style.hoveredOpacity, opacity) },
                { stroke: style.selectedBorderColor || borderColor, 'stroke-width': pick(style.selectedBorderWidth, borderWidth), fill: style.selectedColor || style.color, opacity: pick(style.selectedOpacity, opacity) }
            ];
        },

        _setState: function(figure, styles, state) {
            applyElementState(figure, styles, state, 'bubble');
        },

        arrange: function(context, handles) {
            const values = [];
            let i;
            const ii = values.length = handles.length;
            const settings = context.settings;
            const dataField = settings.dataField;
            const minSize = settings.minSize > 0 ? _Number(settings.minSize) : 0;
            const maxSize = settings.maxSize > minSize ? _Number(settings.maxSize) : minSize;

            if(settings.sizeGroups) {
                return;
            }

            for(i = 0; i < ii; ++i) {
                values[i] = _max(getDataValue(handles[i].proxy, dataField) || 0, 0);
            }
            const minValue = _min.apply(null, values);
            const maxValue = _max.apply(null, values);
            const deltaValue = (maxValue - minValue) || 1;
            const deltaSize = maxSize - minSize;
            for(i = 0; i < ii; ++i) {
                handles[i]._settings.size = minSize + deltaSize * (values[i] - minValue) / deltaValue;
            }
        },

        updateGrouping: function(context) {
            const dataField = context.settings.dataField;
            strategiesByType[TYPE_MARKER].updateGrouping(context);
            groupBySize(context, function(proxy) {
                return getDataValue(proxy, dataField);
            });
        }
    },

    pie: {
        _draw: function(ctx, figure, data) {
            figure.pie = ctx.renderer.g().append(figure.root);
            figure.border = ctx.renderer.circle().sharp().data(ctx.dataKey, data).append(figure.root);
        },

        refresh: function(ctx, figure, data, proxy, settings) {
            const values = getDataValue(proxy, ctx.settings.dataField) || [];
            const colors = settings._colors;
            let sum = 0;
            const pie = figure.pie;
            const renderer = ctx.renderer;
            const dataKey = ctx.dataKey;
            const r = (settings.size > 0 ? _Number(settings.size) : 0) / 2;
            let start = 90;
            let end = start;
            let zeroSum = false;

            sum = values.reduce(function(total, item) {
                return total + (item || 0);
            }, 0);

            if(sum === 0) {
                zeroSum = true;
                sum = 360 / values.length;
            }

            values.forEach(function(item, i) {
                start = end;
                end += zeroSum ? sum : (item || 0) / sum * 360;
                renderer.arc(0, 0, 0, r, start, end).attr({ 'stroke-linejoin': 'round', fill: colors[i] }).data(dataKey, data).append(pie);
            });
            figure.border.attr({ r: r });
        },

        _getStyles: function(styles, style) {
            const opacity = pick(style.opacity, null);
            const borderColor = style.borderColor || null;
            const borderWidth = pick(style.borderWidth, null);
            styles.pie = [
                { opacity: opacity },
                { opacity: pick(style.hoveredOpacity, opacity) },
                { opacity: pick(style.selectedOpacity, opacity) }
            ];
            styles.border = [
                { stroke: borderColor, 'stroke-width': borderWidth },
                { stroke: style.hoveredBorderColor || borderColor, 'stroke-width': pick(style.hoveredBorderWidth, borderWidth) },
                { stroke: style.selectedBorderColor || borderColor, 'stroke-width': pick(style.selectedBorderWidth, borderWidth) }
            ];
        },

        _setState: function(figure, styles, state) {
            applyElementState(figure, styles, state, 'pie');
            applyElementState(figure, styles, state, 'border');
        },

        arrange: function(context, handles) {
            let i;
            const ii = handles.length;
            const dataField = context.settings.dataField;
            let values;
            let count = 0;
            let palette;
            for(i = 0; i < ii; ++i) {
                values = getDataValue(handles[i].proxy, dataField);
                if(values && values.length > count) {
                    count = values.length;
                }
            }
            if(count > 0) {
                palette = context.params.themeManager.createPalette(context.settings.palette, { useHighlight: true, extensionMode: 'alternate' });
                values = palette.generateColors(count);

                context.settings._colors = values;
                context.grouping.color = { callback: _noop, field: '', partition: [], values: [] };
                context.params.dataExchanger.set(context.name, 'color', { partition: [], values: values });
            }
        }
    },

    image: {
        _draw: function(ctx, figure, data) {
            figure.image = ctx.renderer.image(null, null, null, null, null, 'center')
                .attr({ 'pointer-events': 'visible' })// T567545
                .data(ctx.dataKey, data)
                .append(figure.root);
        },

        refresh: function(ctx, figure, data, proxy) {
            figure.image.attr({ href: getDataValue(proxy, ctx.settings.dataField) });
        },

        _getStyles: function(styles, style) {
            const size = style.size > 0 ? _Number(style.size) : 0;
            const hoveredSize = size + (style.hoveredStep > 0 ? _Number(style.hoveredStep) : 0);
            const selectedSize = size + (style.selectedStep > 0 ? _Number(style.selectedStep) : 0);
            const opacity = pick(style.opacity, null);
            styles.image = [
                { x: -size / 2, y: -size / 2, width: size, height: size, opacity: opacity },
                { x: -hoveredSize / 2, y: -hoveredSize / 2, width: hoveredSize, height: hoveredSize, opacity: pick(style.hoveredOpacity, opacity) },
                { x: -selectedSize / 2, y: -selectedSize / 2, width: selectedSize, height: selectedSize, opacity: pick(style.selectedOpacity, opacity) }
            ];
        },

        _setState: function(figure, styles, state) {
            applyElementState(figure, styles, state, 'image');
        }
    }
};

function projectPoint(projection, coordinates) {
    return projection.project(coordinates);
}

function projectPointList(projection, coordinates) {
    const output = [];
    let i;
    const ii = output.length = coordinates.length;
    for(i = 0; i < ii; ++i) {
        output[i] = projection.project(coordinates[i]);
    }
    return output;
}

function projectLineString(projection, coordinates) {
    return [projectPointList(projection, coordinates)];
}

function projectPolygon(projection, coordinates) {
    const output = [];
    let i;
    const ii = output.length = coordinates.length;
    for(i = 0; i < ii; ++i) {
        output[i] = projectPointList(projection, coordinates[i]);
    }
    return output;
}

function projectMultiPolygon(projection, coordinates) {
    const output = [];
    let i;
    const ii = output.length = coordinates.length;
    for(i = 0; i < ii; ++i) {
        output[i] = projectPolygon(projection, coordinates[i]);
    }
    return _concat.apply([], output);
}

function transformPoint(content, projection, coordinates) {
    const data = projection.transform(coordinates);
    content.root.attr({ translateX: data[0], translateY: data[1] });
}

function transformList(projection, coordinates) {
    const output = [];
    let i;
    const ii = coordinates.length;
    let item;
    let k = 0;
    output.length = 2 * ii;
    for(i = 0; i < ii; ++i) {
        item = projection.transform(coordinates[i]);
        output[k++] = item[0];
        output[k++] = item[1];
    }
    return output;
}

function transformPointList(content, projection, coordinates) {
    const output = [];
    let i;
    const ii = output.length = coordinates.length;
    for(i = 0; i < ii; ++i) {
        output[i] = transformList(projection, coordinates[i]);
    }
    content.root.attr({ points: output });
}

function transformAreaLabel(label, projection, coordinates) {
    const data = projection.transform(coordinates[0]);
    label.spaceSize = projection.getSquareSize(coordinates[1]);
    label.text.attr({ translateX: data[0], translateY: data[1] });
    setAreaLabelVisibility(label);
}

function transformLineLabel(label, projection, coordinates) {
    const data = projection.transform(coordinates[0]);
    label.spaceSize = projection.getSquareSize(coordinates[1]);
    label.text.attr({ translateX: data[0], translateY: data[1] });
    setLineLabelVisibility(label);
}

function getItemSettings(context, proxy, settings) {
    const result = combineSettings(context.settings, settings);
    applyGrouping(context.grouping, proxy, result);
    if(settings.color === undefined && settings.paletteIndex >= 0) {
        result.color = result._colors[settings.paletteIndex];
    }
    return result;
}

function applyGrouping(grouping, proxy, settings) {
    _each(grouping, function(name, data) {
        const index = findGroupingIndex(data.callback(proxy, data.field), data.partition);
        if(index >= 0) {
            settings[name] = data.values[index];
        }
    });
}

function findGroupingIndex(value, partition) {
    let start = 0;
    let end = partition.length - 1;
    let index = -1;
    let middle;
    if(partition[start] <= value && value <= partition[end]) {
        if(value === partition[end]) {
            index = end - 1;
        } else {
            while(end - start > 1) {
                middle = (start + end) >> 1;
                if(value < partition[middle]) {
                    end = middle;
                } else {
                    start = middle;
                }
            }
            index = start;
        }
    }
    return index;
}

function raiseChanged(context, handle, state, name) {
    context.params.eventTrigger(name, { target: handle.proxy, state: state });
}

// This is required because `$.extend` cannot be used - because of the `options.data` which is commonly a very large array
// TODO: Try to use our simple `extend` instead of `$.extend`
function combineSettings(common, partial) {
    const obj = _extend({}, common, partial);
    obj.label = _extend({}, common.label, obj.label);
    obj.label.font = _extend({}, common.label.font, obj.label.font);
    return obj;
}

function processCommonSettings(context, options) {
    const themeManager = context.params.themeManager;
    const strategy = context.str;
    const settings = combineSettings(_extend({ label: {}, color: strategy.getDefaultColor(context, options.palette) }, themeManager.theme('layer:' + strategy.fullType)), options);
    let colors;
    let i;
    let palette;
    if(settings.paletteSize > 0) {
        palette = themeManager.createDiscretePalette(settings.palette, settings.paletteSize);
        for(i = 0, colors = []; i < settings.paletteSize; ++i) {
            colors.push(palette.getColor(i));
        }
        settings._colors = colors;
    }
    return settings;
}

function valueCallback(proxy, dataField) {
    return proxy.attribute(dataField);
}

let performGrouping = function(context, partition, settingField, dataField, valuesCallback) {
    let values;
    if(dataField && partition && partition.length > 1) {
        values = valuesCallback(partition.length - 1);
        context.grouping[settingField] = {
            callback: _isFunction(dataField) ? dataField : valueCallback,
            field: dataField,
            partition: partition,
            values: values
        };
        context.params.dataExchanger.set(context.name, settingField, { partition: partition, values: values, defaultColor: context.settings.color });
    }
};

function dropGrouping(context) {
    const name = context.name;
    const dataExchanger = context.params.dataExchanger;
    _each(context.grouping, function(field) {
        dataExchanger.set(name, field, null);
    });
    context.grouping = {};
}

groupByColor = function(context) {
    performGrouping(context, context.settings.colorGroups, 'color', context.settings.colorGroupingField, function(count) {
        const _palette = context.params.themeManager.createDiscretePalette(context.settings.palette, count);
        let i;
        const list = [];
        for(i = 0; i < count; ++i) {
            list.push(_palette.getColor(i));
        }
        return list;
    });
};

groupBySize = function(context, valueCallback) {
    const settings = context.settings;
    performGrouping(context, settings.sizeGroups, 'size', valueCallback || settings.sizeGroupingField, function(count) {
        const minSize = settings.minSize > 0 ? _Number(settings.minSize) : 0;
        const maxSize = settings.maxSize >= minSize ? _Number(settings.maxSize) : 0;
        let i = 0;
        const sizes = [];
        if(count > 1) {
            for(i = 0; i < count; ++i) {
                sizes.push((minSize * (count - i - 1) + maxSize * i) / (count - 1));
            }
        } else if(count === 1) {
            sizes.push((minSize + maxSize) / 2);
        }
        return sizes;
    });
};

function setFlag(flags, flag, state) {
    if(state) {
        flags |= flag;
    } else {
        flags &= ~flag;
    }
    return flags;
}

function hasFlag(flags, flag) {
    return !!(flags & flag);
}

function createLayerProxy(layer, name, index) {
    const proxy = {
        index: index,

        name: name,

        getElements: function() {
            return layer.getProxies();
        },

        clearSelection: function(_noEvent) {
            layer.clearSelection(_noEvent);
            return proxy;
        },

        getDataSource: function() {
            return layer.getDataSource();
        },

        getBounds() {
            return layer.getBounds();
        }
    };
    return proxy;
}

let MapLayerElement;

let MapLayer = function(params, container, name, index) {
    const that = this;
    that._params = params;
    that._onProjection();
    that.proxy = createLayerProxy(that, name, index);
    that._context = {
        name: name,
        layer: that.proxy,
        renderer: params.renderer,
        projection: params.projection,
        params: params,
        dataKey: params.dataKey,
        str: emptyStrategy,
        hover: false,
        selection: null,
        grouping: {},
        // TODO: Link name should be built upon layer index rather than name
        root: params.renderer.g().attr({ 'class': 'dxm-layer' }).linkOn(container, name).linkAppend()
    };
    that._container = container;
    that._options = {};
    // Though the `_handles` field is set in the `_createHandles` it is required here because projection events are fired before data is set
    that._handles = [];
    // The `_data` field may be accessed in the `setOptions` when data is not set
    that._data = new EmptySource();
    that._dataSourceLoaded = null;
};

MapLayer.prototype = _extend({
    constructor: MapLayer,

    getDataReadyCallback() {
        return this._dataSourceLoaded;
    },

    _onProjection: function() {
        const that = this;
        that._removeHandlers = that._params.projection.on({
            'engine': function() {
                that._project();
            },
            'screen': function() {
                that._transform();
            },
            'center': function() {
                that._transformCore();
            },
            'zoom': function() {
                that._transform();
            }
        });
    },

    getData() {
        return this._data;
    },

    _dataSourceLoadErrorHandler: function() {
        this._dataSourceChangedHandler();
    },

    _dataSourceChangedHandler: function() {
        const that = this;
        that._data = unwrapFromDataSource(that._dataSource && that._dataSource.items());
        that._update(true);
    },

    _dataSourceOptions: function() {
        return { paginate: false };
    },

    _getSpecificDataSourceOption: function() {
        return this._specificDataSourceOption;
    },

    _normalizeDataSource: function(dataSource) {
        const store = dataSource.store();
        if(store._loadMode === 'raw') {
            store._loadMode = undefined;
        }
        return dataSource;
    },

    _offProjection: function() {
        this._removeHandlers();
        this._removeHandlers = null;
    },

    dispose: function() {
        const that = this;
        that._disposeDataSource();
        that._destroyHandles();
        dropGrouping(that._context);
        that._context.root.linkRemove().linkOff();
        that._context.labelRoot && that._context.labelRoot.linkRemove().linkOff();
        that._context.str.reset(that._context);
        that._offProjection();
        that._params = that._container = that._context = that.proxy = null;
        return that;
    },

    ///#DEBUG
    TESTS_getContext: function() {
        return this._context;
    },
    ///#ENDDEBUG

    setOptions: function(options) {
        const that = this;
        options = that._options = options || {};
        that._dataSourceLoaded = new Deferred();
        if('dataSource' in options && options.dataSource !== that._options_dataSource) {
            that._options_dataSource = options.dataSource;
            that._params.notifyDirty();
            that._specificDataSourceOption = wrapToDataSource(options.dataSource);
            that._refreshDataSource();
        } else if(that._data.count() > 0) {
            that._params.notifyDirty();
            that._update((options.type !== undefined && options.type !== that._context.str.type) ||
                (options.elementType !== undefined && options.elementType !== that._context.str.elementType));
        }
        that._transformCore();
    },

    _update: function(isContextChanged) {
        const that = this;
        const context = that._context;
        if(isContextChanged) {
            context.str.reset(context);
            context.root.clear();
            context.labelRoot && context.labelRoot.clear();
            that._params.tracker.reset(); // T173037; TODO: There is no need to reset the entire tracker - only its memory about items
            that._destroyHandles();
            context.str = selectStrategy(that._options, that._data);
            context.str.setup(context);
            that.proxy.type = context.str.type;
            that.proxy.elementType = context.str.elementType;
        }
        context.settings = processCommonSettings(context, that._options);
        context.hasSeparateLabel = !!(context.settings.label.enabled && context.str.hasLabelsGroup);
        context.hover = !!_parseScalar(context.settings.hoverEnabled, true);
        // There is intentionally no attempt to preserve previous selection (or part of it)
        // Otherwise it would require some stack-like structure to keep selected items
        // Let's not complicate
        if(context.selection) {
            _each(context.selection.state, function(_, handle) {
                handle && handle.resetSelected();
            });
        }
        context.selection = getSelection(context.settings.selectionMode);
        if(context.hasSeparateLabel) {
            if(!context.labelRoot) {
                // TODO: Link name should be built upon layer index rather than name
                context.labelRoot = context.renderer.g().attr({ 'class': 'dxm-layer-labels' }).linkOn(that._container, { name: context.name + '-labels', after: context.name }).linkAppend();
                that._transformCore();
            }
        } else {
            if(context.labelRoot) {
                context.labelRoot.linkRemove().linkOff();
                context.labelRoot = null;
            }
        }
        if(isContextChanged) {
            that._createHandles();
        }
        dropGrouping(context);
        context.str.arrange(context, that._handles);
        context.str.updateGrouping(context);
        that._updateHandles();
        that._params.notifyReady();
        if(that._dataSourceLoaded) { // T890687
            that._dataSourceLoaded.resolve();
            that._dataSourceLoaded = null;
        } else {
            that._params.dataReady();
        }
    },

    getBounds() {
        return getMaxBound(this._handles.map(({ proxy }) =>
            proxy.coordinates().map(coords => {
                if(!_isArray(coords)) {
                    return;
                }

                const coordsToBoundsSearch = (_isArray(coords[0][0]) ?
                    coords.reduce((ac, val) => ac.concat(val), [])
                    : coords);

                const initValue = coordsToBoundsSearch[0];

                return coordsToBoundsSearch.reduce((min, c) => {
                    return [_min(min[0], c[0]), _min(min[1], c[1]), _max(min[2], c[0]), _max(min[3], c[1])];
                }, [initValue[0], initValue[1], initValue[0], initValue[1]]);
            })
        ).map(getMaxBound));
    },

    _destroyHandles() {
        this._handles.forEach(h => h.dispose());

        if(this._context.selection) {
            this._context.selection.state = {};
        }
        this._handles = [];
    },

    _createHandles: function() {
        const that = this;
        const handles = that._handles = [];
        const data = that._data;
        let i;
        const ii = handles.length = data.count();
        const context = that._context;
        const geometry = data.geometry;
        const attributes = data.attributes;
        let handle;
        let dataItem;
        for(i = 0; i < ii; ++i) {
            dataItem = data.item(i);
            handles[i] = new MapLayerElement(context, i, geometry(dataItem), attributes(dataItem));
        }
        // Customization must be performed before anything else happens to element (that is the idea of customization)
        _isFunction(that._options.customize) && customizeHandles(that.getProxies(), that._options.customize, that._params.widget);

        for(i = 0; i < ii; ++i) {
            handle = handles[i];
            handle.project();
            handle.draw();
            handle.transform();
        }
        if(context.selection) {
            _each(context.selection.state, function(_, handle) {
                handle && handle.restoreSelected();
            });
        }
    },

    _updateHandles: function() {
        const handles = this._handles;
        let i;
        const ii = handles.length;
        for(i = 0; i < ii; ++i) {
            handles[i].refresh();
        }
        if(this._context.settings.label.enabled) {
            for(i = 0; i < ii; ++i) {
                handles[i].measureLabel();
            }
            for(i = 0; i < ii; ++i) {
                handles[i].adjustLabel();
            }
        }
    },

    _transformCore: function() {
        const transform = this._params.projection.getTransform();
        this._context.root.attr(transform);
        this._context.labelRoot && this._context.labelRoot.attr(transform);
    },

    _project: function() {
        const handles = this._handles;
        let i;
        const ii = handles.length;
        for(i = 0; i < ii; ++i) {
            handles[i].project();
        }
    },

    _transform: function() {
        const handles = this._handles;
        let i;
        const ii = handles.length;
        this._transformCore();
        for(i = 0; i < ii; ++i) {
            handles[i].transform();
        }
    },

    getProxies() {
        return this._handles.map(p => p.proxy);
    },

    getProxy: function(index) {
        return this._handles[index].proxy;
    },

    raiseClick: function(i, dxEvent) {
        this._params.eventTrigger('click', {
            target: this._handles[i].proxy,
            event: dxEvent
        });
    },

    hoverItem: function(i, state) {
        this._handles[i].setHovered(state);
    },

    selectItem: function(i, state, _noEvent) {
        this._handles[i].setSelected(state, _noEvent);
    },

    clearSelection: function() {
        const selection = this._context.selection;
        if(selection) {
            _each(selection.state, function(_, handle) {
                handle && handle.setSelected(false);
            });
            selection.state = {};
        }
    }
}, DataHelperMixin);

function createProxy(handle, coords, attrs) {
    const proxy = {
        coordinates: function() {
            return coords;
        },

        attribute: function(name, value) {
            if(arguments.length > 1) {
                attrs[name] = value;
                return proxy;
            } else {
                return arguments.length > 0 ? attrs[name] : attrs;
            }
        },

        selected: function(state, _noEvent) {
            if(arguments.length > 0) {
                handle.setSelected(state, _noEvent);
                return proxy;
            } else {
                return handle.isSelected();
            }
        },

        applySettings: function(settings) {
            handle.update(settings);
            return proxy;
        }
    };
    return proxy;
}

MapLayerElement = function(context, index, geometry, attributes) {
    const that = this;
    const proxy = that.proxy = createProxy(that, geometry.coordinates, _extend({}, attributes));
    that._ctx = context;
    that._index = index;
    that._fig = that._label = null;
    that._state = STATE_DEFAULT;
    that._coordinates = geometry.coordinates;
    that._settings = { label: {} };
    proxy.index = index;
    proxy.layer = context.layer;
    // TODO: Replace "name" field with one referencing layer index and use layer index (instead of name) as layer id
    // as it is more suitable, simple and consistent
    that._data = { name: context.name, index: index };
};

MapLayerElement.prototype = {
    constructor: MapLayerElement,

    dispose: function() {
        const that = this;
        that._ctx = that.proxy = that._settings = that._fig = that._label = that.data = null;
        return that;
    },

    project: function() {
        const context = this._ctx;
        this._projection = context.str.project(context.projection, this._coordinates);
        if(context.hasSeparateLabel && this._label) {
            this._projectLabel();
        }
    },

    _projectLabel: function() {
        this._labelProjection = this._ctx.str.projectLabel(this._projection);
    },

    draw: function() {
        const that = this;
        const context = this._ctx;
        context.str.draw(context, that._fig = {}, that._data);
        that._fig.root.append(context.root);
    },

    transform: function() {
        const that = this;
        const context = that._ctx;
        context.str.transform(that._fig, context.projection, that._projection);
        if(context.hasSeparateLabel && that._label) {
            that._transformLabel();
        }
    },

    _transformLabel: function() {
        this._ctx.str.transformLabel(this._label, this._ctx.projection, this._labelProjection);
    },

    refresh: function() {
        const that = this;
        const strategy = that._ctx.str;
        const settings = getItemSettings(that._ctx, that.proxy, that._settings);
        that._styles = strategy.getStyles(settings);
        strategy.refresh(that._ctx, that._fig, that._data, that.proxy, settings);
        that._refreshLabel(settings);
        that._setState();
    },

    _refreshLabel: function(settings) {
        const that = this;
        const context = that._ctx;
        const labelSettings = settings.label;
        let label = that._label;
        if(context.settings.label.enabled) {
            if(!label) {
                label = that._label = {
                    root: context.labelRoot || that._fig.root,
                    text: context.renderer.text().attr({ 'class': 'dxm-label' }),
                    size: [0, 0]
                };
                if(context.hasSeparateLabel) {
                    that._projectLabel();
                    that._transformLabel();
                }
            }
            label.value = _String(that.proxy.text || that.proxy.attribute(labelSettings.dataField) || '');
            if(label.value) {
                // The data should be set when the element is created but it requires changes in the Renderer
                label.text.attr({ text: label.value, x: 0, y: 0 }).css(_patchFontOptions(labelSettings.font)).attr({
                    align: 'center',
                    stroke: labelSettings.stroke,
                    'stroke-width': labelSettings['stroke-width'],
                    'stroke-opacity': labelSettings['stroke-opacity']
                }).data(context.dataKey, that._data).append(label.root);
                label.settings = settings;
            }
        } else {
            if(label) {
                label.text.remove();
                that._label = null;
            }
        }
    },

    measureLabel: function() {
        const label = this._label;
        let bBox;
        if(label.value) {
            bBox = label.text.getBBox();
            label.size = [bBox.width, bBox.height, -bBox.y - bBox.height / 2];
        }
    },

    adjustLabel: function() {
        const label = this._label;
        let offset;
        if(label.value) {
            offset = this._ctx.str.getLabelOffset(label, label.settings);
            label.settings = null;
            label.text.attr({ x: offset[0], y: offset[1] + label.size[2] });
        }
    },

    update: function(settings) {
        const that = this;
        that._settings = combineSettings(that._settings, settings);
        // This check is required because the method can be called during the customization stage when DOM content neither is created nor should be changed
        if(that._fig) {
            that.refresh();
            if(that._label && that._label.value) {
                that.measureLabel();
                that.adjustLabel();
            }
        }
    },

    _setState: function() {
        this._ctx.str.setState(this._fig, this._styles, STATE_TO_INDEX[this._state]);
    },

    _setForeground: function() {
        const root = this._fig.root;

        this._state ? root.toForeground() : root.toBackground();
    },

    setHovered: function(state) {
        const that = this;
        const currentState = hasFlag(that._state, STATE_HOVERED);
        const newState = !!state;
        if(that._ctx.hover && currentState !== newState) {
            that._state = setFlag(that._state, STATE_HOVERED, newState);
            that._setState();
            that._setForeground();
            raiseChanged(that._ctx, that, newState, 'hoverChanged');
        }
        return that;
    },

    setSelected: function(state, _noEvent) {
        const that = this;
        const currentState = hasFlag(that._state, STATE_SELECTED);
        const newState = !!state;
        const selection = that._ctx.selection;
        let tmp;
        if(selection && currentState !== newState) {
            that._state = setFlag(that._state, STATE_SELECTED, newState);
            tmp = selection.state[selection.single];
            selection.state[selection.single] = null; // This is to prevent stack overflow
            if(tmp) {
                tmp.setSelected(false);
            }
            selection.state[selection.single || that._index] = state ? that : null;
            // This check is required because the method can be called during the customization stage when DOM content neither is created nor should be changed
            if(that._fig) {
                that._setState();
                that._setForeground();
                if(!_noEvent) {
                    raiseChanged(that._ctx, that, newState, 'selectionChanged');
                }
            }
        }
    },

    isSelected: function() {
        return hasFlag(this._state, STATE_SELECTED);
    },

    resetSelected: function() {
        this._state = setFlag(this._state, STATE_SELECTED, false);
    },

    restoreSelected: function() {
        this._fig.root.toForeground();
    }
};

// http://en.wikipedia.org/wiki/Centroid
function calculatePolygonCentroid(coordinates) {
    let i;
    const length = coordinates.length;
    let v1;
    let v2 = coordinates[length - 1];
    let cross;
    let cx = 0;
    let cy = 0;
    let area = 0;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for(i = 0; i < length; ++i) {
        v1 = v2;
        v2 = coordinates[i];
        cross = v1[0] * v2[1] - v2[0] * v1[1];
        area += cross;
        cx += (v1[0] + v2[0]) * cross;
        cy += (v1[1] + v2[1]) * cross;

        minX = _min(minX, v2[0]);
        maxX = _max(maxX, v2[0]);
        minY = _min(minY, v2[1]);
        maxY = _max(maxY, v2[1]);
    }
    // from centroid coords we need subtract the center of bbox coords to get a good geometrical center (T312029)
    return {
        area: _abs(area) / 2,
        center: [
            2 * cx / 3 / area - (minX + maxX) / 2,
            2 * cy / 3 / area - (minY + maxY) / 2
        ]
    };
}

function calculateLineStringData(coordinates) {
    let i;
    const ii = coordinates.length;
    let v1;
    let v2 = coordinates[0] || [];
    let totalLength = 0;
    const items = [0];
    let min0 = v2[0];
    let max0 = v2[0];
    let min1 = v2[1];
    let max1 = v2[1];

    for(i = 1; i < ii; ++i) {
        v1 = v2;
        v2 = coordinates[i];
        totalLength += _sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]));
        items[i] = totalLength;
        min0 = _min(min0, v2[0]);
        max0 = _max(max0, v2[0]);
        min1 = _min(min1, v2[1]);
        max1 = _max(max1, v2[1]);
    }
    i = findGroupingIndex(totalLength / 2, items);
    v1 = coordinates[i];
    v2 = coordinates[i + 1];
    const t = (totalLength / 2 - items[i]) / (items[i + 1] - items[i]);
    return ii ? [
        [
            v1[0] * (1 - t) + v2[0] * t,
            v1[1] * (1 - t) + v2[1] * t
        ], [
            max0 - min0,
            max1 - min1
        ],
        totalLength
    ] : [];
}

// TODO: Optimize!
// There are redundant iterations in the following cycle - interior holes of a polygon should not be taken into account
// So there is only centroid to be calculated for each "Polygon"
function projectAreaLabel(coordinates) {
    let i;
    const ii = coordinates.length;
    let centroid;
    let resultCentroid;
    let maxArea = 0;

    for(i = 0; i < ii; ++i) {
        centroid = calculatePolygonCentroid(coordinates[i]);
        if(centroid.area > maxArea) {
            maxArea = centroid.area;
            resultCentroid = centroid;
        }
    }
    // TODO: Move "_sqrt" to the "calculatePolygonCentroid"
    return resultCentroid ? [resultCentroid.center, [_sqrt(resultCentroid.area), _sqrt(resultCentroid.area)]] : [[], []];
}

function projectLineLabel(coordinates) {
    let i;
    const ii = coordinates.length;
    let maxLength = 0;
    let data;
    let resultData;

    for(i = 0; i < ii; ++i) {
        data = calculateLineStringData(coordinates[i]);
        if(data[2] > maxLength) {
            maxLength = data[2];
            resultData = data;
        }
    }
    return resultData || [[], []];
}

export function MapLayerCollection(params) {
    const that = this;
    const renderer = params.renderer;
    that._params = params;
    that._layers = [];
    // TODO: Use Set instance instead of plain object
    that._layerByName = {};
    that._rect = [0, 0, 0, 0];
    that._clip = renderer.clipRect();
    that._background = renderer.rect().attr({ 'class': 'dxm-background' }).data(params.dataKey, { name: 'background' }).append(renderer.root);
    that._container = renderer.g().attr({ 'class': 'dxm-layers', 'clip-path': that._clip.id }).append(renderer.root).enableLinks();
    that._subscribeToTracker(params.tracker, renderer, params.eventTrigger);
    that._dataReady = params.dataReady;
}

MapLayerCollection.prototype = {
    constructor: MapLayerCollection,

    dispose: function() {
        const that = this;
        that._clip.dispose();
        that._layers.forEach(l => l.dispose());
        that._offTracker();
        that._params = that._offTracker = that._layers = that._layerByName = that._clip = that._background = that._container = null;
    },

    _subscribeToTracker: function(tracker, renderer, eventTrigger) {
        const that = this;
        that._offTracker = tracker.on({
            'click': function(arg) {
                // TODO: Adjust `x` and `y` inside the Tracker
                const offset = renderer.getRootOffset();
                const layer = that.byName(arg.data.name);
                arg.$event.x = arg.x - offset.left;
                arg.$event.y = arg.y - offset.top;
                // TODO: Remove the "raiseClick" method
                if(layer) {
                    layer.raiseClick(arg.data.index, arg.$event);
                } else if(arg.data.name === 'background') {
                    eventTrigger('click', { event: arg.$event });
                }
            },
            'hover-on': function(arg) {
                const layer = that.byName(arg.data.name);
                if(layer) {
                    layer.hoverItem(arg.data.index, true);
                }
            },
            'hover-off': function(arg) {
                const layer = that.byName(arg.data.name);
                if(layer) {
                    layer.hoverItem(arg.data.index, false);
                }
            }
        });
    },

    setOptions(options) {
        const that = this;
        const optionList = options ? (_isArray(options) ? options : [options]) : [];
        let layers = that._layers;
        let readyCallbacks = [];
        const needToCreateLayers = optionList.length !== layers.length || layers.some((l, i) => {
            const name = getName(optionList, i);
            return _isDefined(name) && name !== l.proxy.name;
        });

        if(needToCreateLayers) {
            that._params.tracker.reset();
            that._layers.forEach(l => l.dispose());
            const layerByName = that._layerByName = {};
            that._layers = layers = [];
            for(let i = 0, ii = optionList.length; i < ii; ++i) {
                const name = getName(optionList, i) || ('map-layer-' + i);
                const layer = layers[i] = new MapLayer(that._params, that._container, name, i);
                layerByName[name] = layer;
            }
        }

        layers.forEach((l, i) => {
            l.setOptions(optionList[i]);
        });
        readyCallbacks = layers.map(l => {
            return l.getDataReadyCallback();
        });
        readyCallbacks.length && when.apply(undefined, readyCallbacks).done(that._dataReady);
    },

    _updateClip: function() {
        const rect = this._rect;
        const bw = this._borderWidth;
        this._clip.attr({ x: rect[0] + bw, y: rect[1] + bw, width: _max(rect[2] - bw * 2, 0), height: _max(rect[3] - bw * 2, 0) });
    },

    setBackgroundOptions: function(options) {
        this._background.attr({ stroke: options.borderColor, 'stroke-width': options.borderWidth, fill: options.color });
        this._borderWidth = _max(options.borderWidth, 0);
        this._updateClip();
    },

    setRect: function(rect) {
        this._rect = rect;
        this._background.attr({ x: rect[0], y: rect[1], width: rect[2], height: rect[3] });
        this._updateClip();
    },

    byIndex: function(index) {
        return this._layers[index];
    },

    byName: function(name) {
        return this._layerByName[name];
    },

    items: function() {
        return this._layers;
    }
};

///#DEBUG
export const _TESTS_MapLayer = MapLayer;
export const _TESTS_stub_MapLayer = function(stub) {
    MapLayer = stub;
};
export const _TESTS_selectStrategy = selectStrategy;
export const _TESTS_stub_selectStrategy = function(stub) {
    selectStrategy = stub;
};
export const _TESTS_MapLayerElement = MapLayerElement;
export const _TESTS_stub_MapLayerElement = function(stub) {
    MapLayerElement = stub;
};
export const _TESTS_createProxy = createProxy;
export const _TESTS_stub_performGrouping = function(stub) {
    performGrouping = stub;
};
export const _TESTS_performGrouping = performGrouping;
export const _TESTS_stub_groupByColor = function(stub) {
    groupByColor = stub;
};
export const _TESTS_groupByColor = groupByColor;
export const _TESTS_stub_groupBySize = function(stub) {
    groupBySize = stub;
};
export const _TESTS_groupBySize = groupBySize;
export const _TESTS_findGroupingIndex = findGroupingIndex;
///#ENDDEBUG
