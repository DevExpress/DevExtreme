import { pieSeriesSpacing as seriesSpacing, states } from './components/consts';
import { normalizeAngle, getVerticallyShiftedAngularCoords as _getVerticallyShiftedAngularCoords } from './core/utils';
import { extend as _extend } from '../core/utils/extend';
import { isNumeric } from '../core/utils/type';
import { each as _each } from '../core/utils/iterator';
import rangeModule from './translators/range';
import registerComponent from '../core/component_registrator';
import { BaseChart, overlapping } from './chart_components/base_chart';
import { noop as _noop } from '../core/utils/common';
import translator1DModule from './translators/translator1d';

const OPTIONS_FOR_REFRESH_SERIES = ['startAngle', 'innerRadius', 'segmentsDirection', 'type'],
    NORMAL_STATE = states.normalMark,
    MAX_RESOLVE_ITERATION_COUNT = 5,
    LEGEND_ACTIONS = [states.resetItem, states.applyHover, states.applySelected, states.applySelected];

function getLegendItemAction(points) {
    var state = NORMAL_STATE;

    points.forEach(function(point) {
        state = state | point.fullState;
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

var dxPieChart = BaseChart.inherit({
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
    },

    _groupSeries: function() {
        var series = this.series;

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
        var translator = (new translator1DModule.Translator1D())
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
            var range = new rangeModule.Range();
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
        var maxPointCount = 0;
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
                var argument = point.argument.valueOf();
                var index = series.getPointsByArg(argument).indexOf(point);
                var key = argument.valueOf().toString() + index;
                itemsByArgument[key] = itemsByArgument[key] || [];
                var argumentCount = itemsByArgument[key].push(point);
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
        var that = this,
            layout,
            canvas = that._canvas,
            drawnLabels = false;

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
        var canvas = this._canvas,
            layout = this.layoutManager.applyEqualPieChartLayout(series, sizeGroupLayout);

        series.forEach(function(s) {
            s.correctPosition(layout, canvas);
            s.drawLabelsWOPoints();
        });

        this.layoutManager.correctPieLabelRadius(series, layout, canvas);

        return layout;
    },

    _updateSeriesDimensions: function(drawOptions) {
        var that = this,
            visibleSeries = that._getVisibleSeries(),
            lengthVisibleSeries = visibleSeries.length,
            innerRad,
            delta,
            layout,
            sizeGroupLayout = drawOptions.sizeGroupLayout;

        if(lengthVisibleSeries) {
            layout = sizeGroupLayout ? that._getLayoutSeriesForEqualPies(visibleSeries, sizeGroupLayout) : that._getLayoutSeries(visibleSeries, drawOptions);

            delta = (layout.radiusOuter - layout.radiusInner - seriesSpacing * (lengthVisibleSeries - 1)) / lengthVisibleSeries;
            innerRad = layout.radiusInner;

            that._setCenter({ x: layout.centerX, y: layout.centerY });

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

        this._renderSeriesElements(drawOptions, isRotated, isLegendInside);
    },

    _getLegendCallBack: function() {
        var that = this,
            legend = this._legend,
            items = this._getLegendTargets().map(function(i) {
                return i.legendData;
            });

        return function(target) {
            items.forEach(function(data) {
                var points = [],
                    callback = legend.getActionCallback({ index: data.id });

                that.series.forEach(function(series) {
                    var seriesPoints = series.getPointsByKeys(data.argument, data.argumentIndex);
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
            labelsWereOverlapped = this._resolveLabelOverlapping(resolveLabelOverlapping);
            wordWrapApplied = this._adjustSeriesLabels(resolveLabelOverlapping === 'shift');
        } while((labelsWereOverlapped || wordWrapApplied) && ++iterationCount < MAX_RESOLVE_ITERATION_COUNT);
    },

    _adjustSeriesLabels: function(moveLabelsFromCenter) {
        return this.series.reduce((r, s) => s.adjustLabels(moveLabelsFromCenter) || r, false);
    },

    _prepareStackPoints: _noop,

    _resetStackPoints: _noop,

    _applyExtraSettings: _noop,

    _resolveLabelOverlappingShift: function() {
        var that = this,
            inverseDirection = that.option('segmentsDirection') === 'anticlockwise',
            seriesByPosition = that.series.reduce(function(r, s) {
                (r[s.getOptions().label.position] || r.outside).push(s);
                return r;
            }, { inside: [], columns: [], outside: [] }),
            labelsOverlapped = false;

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
                var angle = normalizeAngle(point.middleAngle);
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

    _setCenter: function(center) {
        this._center = center;
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
        var that = this;
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

registerComponent('dxPieChart', dxPieChart);

module.exports = dxPieChart;

var pieSizeEqualizer = (function() {
    function equalize(group, allPies) {
        var pies = allPies.filter(p => p._isVisible() && p.getSizeGroup() === group),
            minRadius = Math.min.apply(null, pies.map(p => p.getSizeGroupLayout().radius)),
            minPie = pies.filter(p => p.getSizeGroupLayout().radius === minRadius);

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

    var pies = [],
        timers = {};

    return {
        queue: function(pie) {
            var group = pie.getSizeGroup();
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
