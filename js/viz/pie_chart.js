import consts from './components/consts';
import { normalizeAngle, getVerticallyShiftedAngularCoords as _getVerticallyShiftedAngularCoords, patchFontOptions } from './core/utils';
import { extend as _extend } from '../core/utils/extend';
import { isNumeric } from '../core/utils/type';
import { each as _each } from '../core/utils/iterator';
import { Range } from './translators/range';
import registerComponent from '../core/component_registrator';
import { BaseChart, overlapping } from './chart_components/base_chart';
import { noop as _noop } from '../core/utils/common';
import { Translator1D } from './translators/translator1d';

const { states } = consts;
const seriesSpacing = consts.pieSeriesSpacing;

const OPTIONS_FOR_REFRESH_SERIES = ['startAngle', 'innerRadius', 'segmentsDirection', 'type'];
const NORMAL_STATE = states.normalMark;
const HOVER_STATE = states.hoverMark;
const SELECTED_STATE = states.selectedMark;
const MAX_RESOLVE_ITERATION_COUNT = 5;
const LEGEND_ACTIONS = [states.resetItem, states.applyHover, states.applySelected, states.applySelected];

function getLegendItemAction(points) {
    let state = NORMAL_STATE;

    points.forEach(point => {
        const seriesOptions = point.series?.getOptions();
        let pointState = point.fullState;

        if(seriesOptions?.hoverMode === 'none') {
            pointState &= ~HOVER_STATE;
        }
        if(seriesOptions?.selectionMode === 'none') {
            pointState &= ~SELECTED_STATE;
        }

        state = state | pointState;
    });

    return LEGEND_ACTIONS[state];
}

function correctPercentValue(value) {
    if(isNumeric(value)) {
        if(value > 1) {
            value = 1;
        } else if(value < 0) {
            value = 0;
        }
    } else {
        value = undefined;
    }
    return value;
}

const pieSizeEqualizer = (function() {
    function equalize(group, allPies) {
        const pies = allPies.filter(p => p._isVisible() && p.getSizeGroup() === group);
        const minRadius = Math.min.apply(null, pies.map(p => p.getSizeGroupLayout().radius));
        const minPie = pies.filter(p => p.getSizeGroupLayout().radius === minRadius);

        pies.forEach(p => p.render({
            force: true,
            sizeGroupLayout: minPie.length ? minPie[0].getSizeGroupLayout() : {}
        }));
    }

    function removeFromList(list, item) {
        return list.filter(function(li) { return li !== item; });
    }

    function addToList(list, item) {
        return removeFromList(list, item).concat(item);
    }

    let pies = [];
    let timers = {};

    return {
        queue: function(pie) {
            const group = pie.getSizeGroup();
            pies = addToList(pies, pie);

            clearTimeout(timers[group]);
            timers[group] = setTimeout(function() {
                equalize(group, pies);
            });
        },
        remove: function(pie) {
            pies = removeFromList(pies, pie);

            if(!pies.length) {
                timers = {};
            }
        }
    };
})();

const dxPieChart = BaseChart.inherit({
    _themeSection: 'pie',

    _layoutManagerOptions: function() {
        return _extend(true, {}, this.callBase(), {
            piePercentage: correctPercentValue(this._themeManager.getOptions('diameter')),
            minPiePercentage: correctPercentValue(this._themeManager.getOptions('minDiameter'))
        });
    },

    _optionChangesMap: {
        diameter: 'REINIT',
        minDiameter: 'REINIT',
        sizeGroup: 'REINIT'
    },

    _disposeCore: function() {
        pieSizeEqualizer.remove(this);
        this.callBase();
        this._centerTemplateGroup && this._centerTemplateGroup.linkOff().dispose();
    },

    _groupSeries: function() {
        const series = this.series;

        this._groupsData = {
            groups: [{
                series: series,
                valueOptions: { valueType: 'numeric' }
            }],
            argumentOptions: series[0] && series[0].getOptions()
        };
    },

    getArgumentAxis: function() {
        return null;
    },

    _getValueAxis: function() {
        const translator = (new Translator1D())
            .setCodomain(360, 0);

        return {
            getTranslator: function() {
                return translator;
            },
            setBusinessRange: function(range) {
                translator.setDomain(range.min, range.max);
            }
        };
    },

    _populateBusinessRange: function() {
        this.series.map(function(series) {
            const range = new Range();
            range.addRange(series.getRangeData().val);
            series.getValueAxis().setBusinessRange(range);
            return range;
        });
    },

    _specialProcessSeries: function() {
        _each(this.series, function(_, singleSeries) {
            singleSeries.arrangePoints();
        });
    },

    _checkPaneName: function() {
        return true;
    },

    _processSingleSeries: function(singleSeries) {
        this.callBase(singleSeries);
        singleSeries.arrangePoints();
    },

    _handleSeriesDataUpdated: function() {
        let maxPointCount = 0;
        this.series.forEach(function(s) {
            maxPointCount = Math.max(s.getPointsCount(), maxPointCount);
        });
        this.series.forEach(function(s) {
            s.setMaxPointsCount(maxPointCount);
        });
        this.callBase();
    },

    _getLegendOptions: function(item) {
        const legendItem = this.callBase(item);
        const legendData = legendItem.legendData;

        legendData.argument = item.argument;
        legendData.argumentIndex = item.argumentIndex;

        legendData.points = [item];

        return legendItem;
    },

    _getLegendTargets: function() {
        const that = this;
        const itemsByArgument = {};

        (that.series || []).forEach(function(series) {
            series.getPoints().forEach(function(point) {
                const argument = point.argument.valueOf();
                const index = series.getPointsByArg(argument).indexOf(point);
                const key = argument.valueOf().toString() + index;
                itemsByArgument[key] = itemsByArgument[key] || [];
                const argumentCount = itemsByArgument[key].push(point);
                point.index = itemsByArgument[key][argumentCount - 2] ? itemsByArgument[key][argumentCount - 2].index : Object.keys(itemsByArgument).length - 1;
                point.argumentIndex = index;
            });
        });

        const items = [];
        _each(itemsByArgument, function(_, points) {
            points.forEach(function(point, index) {
                if(index === 0) {
                    items.push(that._getLegendOptions(point));
                    return;
                }
                const item = items[items.length - 1];
                item.legendData.points.push(point);
                if(!item.visible) {
                    item.visible = point.isVisible();
                }
            });
        });

        return items;
    },

    _getLayoutTargets: function() {
        return [{ canvas: this._canvas }];
    },

    _getLayoutSeries: function(series, drawOptions) {
        const that = this;
        let layout;
        const canvas = that._canvas;
        let drawnLabels = false;

        layout = that.layoutManager.applyPieChartSeriesLayout(canvas, series, true);
        series.forEach(function(singleSeries) {
            singleSeries.correctPosition(layout, canvas);
            drawnLabels = singleSeries.drawLabelsWOPoints() || drawnLabels;
        });

        if(drawnLabels) {
            layout = that.layoutManager.applyPieChartSeriesLayout(canvas, series, drawOptions.hideLayoutLabels);
        }

        series.forEach(function(singleSeries) {
            singleSeries.hideLabels();
        });

        that._sizeGroupLayout = {
            x: layout.centerX,
            y: layout.centerY,
            radius: layout.radiusOuter,
            drawOptions: drawOptions
        };

        return layout;
    },

    _getLayoutSeriesForEqualPies: function(series, sizeGroupLayout) {
        const canvas = this._canvas;
        const layout = this.layoutManager.applyEqualPieChartLayout(series, sizeGroupLayout);

        series.forEach(function(s) {
            s.correctPosition(layout, canvas);
            s.drawLabelsWOPoints();
        });

        this.layoutManager.correctPieLabelRadius(series, layout, canvas);

        return layout;
    },

    _updateSeriesDimensions: function(drawOptions) {
        const that = this;
        const visibleSeries = that._getVisibleSeries();
        const lengthVisibleSeries = visibleSeries.length;
        let innerRad;
        let delta;
        let layout;
        const sizeGroupLayout = drawOptions.sizeGroupLayout;

        if(lengthVisibleSeries) {
            layout = sizeGroupLayout ? that._getLayoutSeriesForEqualPies(visibleSeries, sizeGroupLayout) : that._getLayoutSeries(visibleSeries, drawOptions);

            delta = (layout.radiusOuter - layout.radiusInner - seriesSpacing * (lengthVisibleSeries - 1)) / lengthVisibleSeries;
            innerRad = layout.radiusInner;

            that._setGeometry(layout);

            visibleSeries.forEach(function(singleSeries) {
                singleSeries.correctRadius({
                    radiusInner: innerRad,
                    radiusOuter: innerRad + delta
                });
                innerRad += delta + seriesSpacing;
            });
        }
    },

    _renderSeries: function(drawOptions, isRotated, isLegendInside) {
        this._calculateSeriesLayout(drawOptions, isRotated);

        if(!drawOptions.sizeGroupLayout && this.getSizeGroup()) {
            pieSizeEqualizer.queue(this);
            this._clearCanvas();
            return;
        }

        this._renderSeriesElements(drawOptions, isLegendInside);
    },

    _createHtmlStructure() {
        this.callBase();

        if(this.option('centerTemplate')) {
            this._centerTemplateGroup = this._renderer.g()
                .attr({ class: 'dxc-hole-template' })
                .linkOn(this._renderer.root, 'center-template')
                .css(patchFontOptions(this._themeManager._font))
                .linkAppend();
        }
    },

    _renderExtraElements() {
        let template = this.option('centerTemplate');
        const centerTemplateGroup = this._centerTemplateGroup;

        if(!centerTemplateGroup) {
            return;
        }
        centerTemplateGroup.clear().attr({ visibility: 'hidden' });

        template = this._getTemplate(template);

        template.render({
            model: this,
            container: centerTemplateGroup.element,
            onRendered: ()=>{
                const group = centerTemplateGroup;
                const bBox = group.getBBox();
                group.move(this._center.x - (bBox.x + bBox.width / 2), this._center.y - (bBox.y + bBox.height / 2));
                group.attr({ visibility: 'visible' });
            }
        });
    },

    getInnerRadius() {
        return this._innerRadius;
    },

    _getLegendCallBack: function() {
        const that = this;
        const legend = this._legend;
        const items = this._getLegendTargets().map(function(i) {
            return i.legendData;
        });

        return function(target) {
            items.forEach(function(data) {
                const points = [];
                const callback = legend.getActionCallback({ index: data.id });

                that.series.forEach(function(series) {
                    const seriesPoints = series.getPointsByKeys(data.argument, data.argumentIndex);
                    points.push.apply(points, seriesPoints);
                });

                if(target && target.argument === data.argument && target.argumentIndex === data.argumentIndex) {
                    points.push(target);
                }

                callback(getLegendItemAction(points));
            });
        };
    },

    _locateLabels(resolveLabelOverlapping) {
        let iterationCount = 0;
        let labelsWereOverlapped;
        let wordWrapApplied;
        do {
            wordWrapApplied = this._adjustSeriesLabels(resolveLabelOverlapping === 'shift');
            labelsWereOverlapped = this._resolveLabelOverlapping(resolveLabelOverlapping);
        } while((labelsWereOverlapped || wordWrapApplied) && ++iterationCount < MAX_RESOLVE_ITERATION_COUNT);
    },

    _adjustSeriesLabels: function(moveLabelsFromCenter) {
        return this.series.reduce((r, s) => s.adjustLabels(moveLabelsFromCenter) || r, false);
    },

    _applyExtraSettings: _noop,

    _resolveLabelOverlappingShift: function() {
        const that = this;
        const inverseDirection = that.option('segmentsDirection') === 'anticlockwise';
        const seriesByPosition = that.series.reduce(function(r, s) {
            (r[s.getOptions().label.position] || r.outside).push(s);
            return r;
        }, { inside: [], columns: [], outside: [] });
        let labelsOverlapped = false;

        if(seriesByPosition.inside.length > 0) {
            labelsOverlapped = resolve(seriesByPosition.inside.reduce(function(r, singleSeries) {
                return singleSeries.getVisiblePoints().reduce(function(r, point) {
                    r.left.push(point);
                    return r;
                }, r);
            }, { left: [], right: [] }), shiftInColumnFunction) || labelsOverlapped;
        }

        labelsOverlapped = seriesByPosition.columns.reduce((r, singleSeries) => {
            return resolve(dividePoints(singleSeries), shiftInColumnFunction) || r;
        }, labelsOverlapped);

        if(seriesByPosition.outside.length > 0) {
            labelsOverlapped = resolve(seriesByPosition.outside.reduce(function(r, singleSeries) {
                return dividePoints(singleSeries, r);
            }, null), shiftFunction) || labelsOverlapped;
        }
        return labelsOverlapped;

        function dividePoints(series, points) {
            return series.getVisiblePoints().reduce(function(r, point) {
                const angle = normalizeAngle(point.middleAngle);
                (angle <= 90 || angle >= 270 ? r.right : r.left).push(point);
                return r;
            }, points || { left: [], right: [] });
        }

        function resolve(points, shiftCallback) {
            let overlapped = false;
            if(inverseDirection) {
                points.left.reverse();
                points.right.reverse();
            }

            overlapped = overlapping.resolveLabelOverlappingInOneDirection(points.left, that._canvas, false, shiftCallback);
            return overlapping.resolveLabelOverlappingInOneDirection(points.right, that._canvas, false, shiftCallback) || overlapped;
        }

        function shiftFunction(box, length) {
            return _getVerticallyShiftedAngularCoords(box, -length, that._center);
        }

        function shiftInColumnFunction(box, length) {
            return { x: box.x, y: box.y - length };
        }
    },

    _setGeometry: function({ centerX: x, centerY: y, radiusInner }) {
        this._center = { x, y };
        this._innerRadius = radiusInner;
    },

    _disposeSeries(seriesIndex) {
        this.callBase.apply(this, arguments);
        this._abstractSeries = null;
    },

    _legendDataField: 'point',

    _legendItemTextField: 'argument',

    _applyPointMarkersAutoHiding: _noop,

    _renderTrackers: _noop,

    _trackerType: 'PieTracker',

    _createScrollBar: _noop,

    _updateAxesLayout: _noop,

    _applyClipRects: _noop,

    _appendAdditionalSeriesGroups: _noop,

    _prepareToRender: _noop,

    _isLegendInside: _noop,

    _renderAxes: _noop,

    _shrinkAxes: _noop,

    _isRotated: _noop,

    _seriesPopulatedHandlerCore: _noop,

    _reinitAxes: _noop,

    _correctAxes: _noop,

    _getExtraOptions: function() {
        const that = this;
        return {
            startAngle: that.option('startAngle'),
            innerRadius: that.option('innerRadius'),
            segmentsDirection: that.option('segmentsDirection'),
            type: that.option('type')
        };
    },

    getSizeGroup: function() {
        return this._themeManager.getOptions('sizeGroup');
    },

    getSizeGroupLayout: function() {
        return this._sizeGroupLayout || {};
    }
});

_each(OPTIONS_FOR_REFRESH_SERIES, function(_, name) {
    dxPieChart.prototype._optionChangesMap[name] = 'REFRESH_SERIES_DATA_INIT';
});

import { plugins } from './core/annotations';

dxPieChart.addPlugin(plugins.core);
dxPieChart.addPlugin(plugins.pieChart);

registerComponent('dxPieChart', dxPieChart);

export default dxPieChart;
