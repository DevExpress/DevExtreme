import { addAlgorithm, getAlgorithm } from './tiling';
import dynamicSlope from './tiling.funnel';
import dynamicHeight from './tiling.pyramid';
import { noop } from '../../core/utils/common';
import baseWidget from '../../__internal/viz/core/m_base_widget';
import componentRegistrator from '../../core/component_registrator';
import Item from './item';
const NODES_CREATE_CHANGE = 'NODES_CREATE';

addAlgorithm('dynamicslope', dynamicSlope, true);
addAlgorithm('dynamicheight', dynamicHeight);

function invertFigure(figure) {
    return figure.map(function(coord, index) {
        return index % 2 ? 1 - coord : coord;
    });
}

function getLegendItemState(itemState) {
    return {
        fill: itemState.fill,
        hatching: itemState.hatching
    };
}

const dxFunnel = baseWidget.inherit({
    _rootClass: 'dxf-funnel',

    _rootClassPrefix: 'dxf',

    _proxyData: [],

    _optionChangesMap: {
        dataSource: 'DATA_SOURCE',
        neckWidth: NODES_CREATE_CHANGE,
        neckHeight: NODES_CREATE_CHANGE,
        inverted: NODES_CREATE_CHANGE,
        algorithm: NODES_CREATE_CHANGE,
        item: NODES_CREATE_CHANGE,
        valueField: NODES_CREATE_CHANGE,
        argumentField: NODES_CREATE_CHANGE,
        colorField: NODES_CREATE_CHANGE,
        palette: NODES_CREATE_CHANGE,
        paletteExtensionMode: NODES_CREATE_CHANGE,
        sortData: NODES_CREATE_CHANGE
    },

    _themeDependentChanges: [NODES_CREATE_CHANGE],

    _getDefaultSize: function() {
        return { width: 400, height: 400 };
    },

    _themeSection: 'funnel',

    _fontFields: ['legend.title.font', 'legend.title.subtitle.font', 'legend.font'],

    _optionChangesOrder: ['DATA_SOURCE'],

    _initialChanges: ['DATA_SOURCE'],

    _initCore: function() {
        this._group = this._renderer.g().append(this._renderer.root);
        this._items = [];
    },

    _eventsMap: {
        onHoverChanged: { name: 'hoverChanged' },
        onSelectionChanged: { name: 'selectionChanged' }
    },

    _disposeCore: noop,

    _applySize: function(rect) {
        this._rect = rect.slice();
        this._change(['TILING']);
        return this._rect;
    },


    _getAlignmentRect: function() {
        return this._rect;
    },

    _change_TILING: function() {
        const that = this;
        const items = that._items;
        const rect = that._rect;
        const convertCoord = function(coord, index) {
            const offset = index % 2;
            return rect[0 + offset] + (rect[2 + offset] - rect[0 + offset]) * coord;
        };

        this._group.clear();

        items.forEach(function(item, index) {
            const coords = item.figure.map(convertCoord);
            const element = that._renderer.path([], 'area')
                .attr({
                    points: coords
                })
                .append(that._group);

            item.coords = coords;
            item.element = element;
        });

        this._requestChange(['TILES']);
    },

    _customChangesOrder: [NODES_CREATE_CHANGE, 'LAYOUT', 'TILING', 'TILES', 'DRAWN'],

    _dataSourceChangedHandler: function() {
        this._requestChange([NODES_CREATE_CHANGE]);
    },

    _change_DRAWN: function() {
        this._drawn();
    },

    _change_DATA_SOURCE: function() {
        this._change(['DRAWN']);
        this._updateDataSource();
    },

    _change_NODES_CREATE: function() {
        this._buildNodes();
    },

    _change_TILES: function() {
        this._applyTilesAppearance();
    },

    _suspend: function() {
        if(!this._applyingChanges) {
            this._suspendChanges();
        }
    },
    _resume: function() {
        if(!this._applyingChanges) {
            this._resumeChanges();
        }
    },

    _applyTilesAppearance: function() {
        this._items.forEach(function(item) {
            const state = item.getState();
            item.element.smartAttr(item.states[state]);
        });
    },

    _hitTestTargets: function(x, y) {
        const that = this;
        let data;

        this._proxyData.some(function(callback) {
            data = callback.call(that, x, y);
            if(data) {
                return true;
            }
        });

        return data;
    },

    clearHover: function() {
        this._suspend();
        this._items.forEach(function(item) {
            item.isHovered() && item.hover(false);
        });
        this._resume();
    },

    clearSelection: function() {
        this._suspend();
        this._items.forEach(function(item) {
            item.isSelected() && item.select(false);
        });
        this._resume();
    },

    _getData: function() {
        const that = this;
        const data = that._dataSourceItems() || [];
        const valueField = that._getOption('valueField', true);
        const argumentField = that._getOption('argumentField', true);
        const colorField = that._getOption('colorField', true);
        const processedData = data.reduce(function(d, item) {
            const value = Number(item[valueField]);
            if(value >= 0) {
                d[0].push({
                    value: value,
                    color: item[colorField],
                    argument: item[argumentField],
                    dataItem: item
                });
                d[1] += value;
            }
            return d;
        }, [[], 0]);
        const items = processedData[0];

        if(data.length > 0 && items.length === 0) {
            that._incidentOccurred('E2005', valueField);
        }

        if(!processedData[1]) {
            return [];
        }

        if(that._getOption('sortData', true)) {
            items.sort(function(a, b) {
                return b.value - a.value;
            });
        }

        return items;
    },

    _buildNodes: function() {
        const that = this;
        const data = that._getData();
        const algorithm = getAlgorithm(that._getOption('algorithm', true));
        const percents = algorithm.normalizeValues(data);
        const itemOptions = that._getOption('item');
        const figures = algorithm.getFigures(percents, that._getOption('neckWidth', true), that._getOption('neckHeight', true));
        const palette = that._themeManager.createPalette(that._getOption('palette', true), {
            useHighlight: true,
            extensionMode: that._getOption('paletteExtensionMode', true),
            count: figures.length
        });

        that._items = figures.map(function(figure, index) {
            const curData = data[index];
            const node = new Item(that, {
                figure: figure,
                data: curData,
                percent: percents[index],
                id: index,
                color: curData.color || palette.getNextColor(),
                itemOptions: itemOptions
            });

            return node;
        });

        if(that._getOption('inverted', true)) {
            that._items.forEach(function(item) {
                item.figure = invertFigure(item.figure);
            });
        }

        that._renderer.initDefsElements();
        that._change(['TILING', 'DRAWN']);
    },

    _showTooltip: noop,

    hideTooltip: noop,

    getAllItems: function() {
        return this._items.slice();
    },

    _getLegendData() {
        return this._items.map(item => {
            const states = item.states;
            return {
                id: item.id,
                visible: true,
                text: item.argument,
                item: item,
                states: {
                    normal: getLegendItemState(states.normal),
                    hover: getLegendItemState(states.hover),
                    selection: getLegendItemState(states.selection)
                }
            };
        });
    },

    _getMinSize: function() {
        const adaptiveLayout = this._getOption('adaptiveLayout');

        return [adaptiveLayout.width, adaptiveLayout.height];
    }
});


componentRegistrator('dxFunnel', dxFunnel);
export default dxFunnel;

// PLUGINS_SECTION
import { plugin } from '../core/data_source';
dxFunnel.addPlugin(plugin);
