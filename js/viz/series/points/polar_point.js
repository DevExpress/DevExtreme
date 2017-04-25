"use strict";

var extend = require("../../../core/utils/extend").extend,
    _extend = extend,

    commonUtils = require("../../../core/utils/common"),
    symbolPoint = require("./symbol_point"),
    barPoint = require("./bar_point"),
    piePoint = require("./pie_point"),
    isDefined = commonUtils.isDefined,
    vizUtils = require("../../core/utils"),
    normalizeAngle = vizUtils.normalizeAngle,

    _math = Math,
    _max = _math.max,

    ERROR_BARS_ANGLE_OFFSET = 90,
    CANVAS_POSITION_START = "canvas_position_start",
    CANVAS_POSITION_TOP = "canvas_position_top",
    CANVAS_POSITION_END = "canvas_position_end",
    CANVAS_POSITION_DEFAULT = "canvas_position_default";

exports.polarSymbolPoint = _extend({}, symbolPoint, {

    _getLabelCoords: piePoint._getLabelCoords,

    _moveLabelOnCanvas: barPoint._moveLabelOnCanvas,

    _getLabelPosition: function() {
        return "outside";
    },

    _translate: function(translator) {
        var that = this,
            coord = translator.translate(that.argument, that.value),
            center = translator.translate(CANVAS_POSITION_START, CANVAS_POSITION_TOP);

        that.vx = normalizeAngle(coord.angle);
        that.vy = that.radiusOuter = that.radiusLabels = coord.radius;

        that.radius = coord.radius;
        that.middleAngle = -coord.angle;
        that.angle = -coord.angle;

        that.x = coord.x;
        that.y = coord.y;
        that.defaultX = that.centerX = center.x;
        that.defaultY = that.centerY = center.y;

        that._translateErrorBars(translator);

        that.inVisibleArea = true;
    },

    _translateErrorBars: function(translator) {
        var that = this,
            errorBars = that._options.errorBars;

        if(!errorBars) {
            return;
        }

        isDefined(that.lowError) && (that._lowErrorCoord = that.centerY - translator.translate(that.argument, that.lowError).radius);
        isDefined(that.highError) && (that._highErrorCoord = that.centerY - translator.translate(that.argument, that.highError).radius);
        that._errorBarPos = that.centerX;

        that._baseErrorBarPos = errorBars.type === "stdDeviation" ? that._lowErrorCoord + (that._highErrorCoord - that._lowErrorCoord) / 2 : that.centerY - that.radius;
    },

    _getTranslates: function(animationEnabled) {
        return animationEnabled ? this.getDefaultCoords() : { x: this.x, y: this.y };
    },

    getDefaultCoords: function() {
        var cosSin = vizUtils.getCosAndSin(-this.angle),
            radius = this.translators.translate(CANVAS_POSITION_START, CANVAS_POSITION_DEFAULT).radius,
            x = this.defaultX + radius * cosSin.cos,
            y = this.defaultY + radius * cosSin.sin;

        return { x: x, y: y };
    },

    _addLabelAlignmentAndOffset: function(label, coord) {
        return coord;
    },

    _checkLabelPosition: function(label, coord) {
        var that = this,
            visibleArea = that._getVisibleArea(),
            graphicBBox = that._getGraphicBBox();

        if(that._isPointInVisibleArea(visibleArea, graphicBBox)) {
            coord = that._moveLabelOnCanvas(coord, visibleArea, label.getBoundingRect());
        }

        return coord;
    },

    _getErrorBarSettings: function(errorBarOptions, animationEnabled) {
        var settings = symbolPoint._getErrorBarSettings.call(this, errorBarOptions, animationEnabled);

        settings.rotate = ERROR_BARS_ANGLE_OFFSET - this.angle;
        settings.rotateX = this.centerX;
        settings.rotateY = this.centerY;

        return settings;
    },

    getCoords: function(min) {
        return min ? this.getDefaultCoords() : { x: this.x, y: this.y };
    }
});

exports.polarBarPoint = _extend({}, barPoint, {

    _translateErrorBars: exports.polarSymbolPoint._translateErrorBars,

    _getErrorBarSettings: exports.polarSymbolPoint._getErrorBarSettings,

    _moveLabelOnCanvas: barPoint._moveLabelOnCanvas,

    _getLabelCoords: piePoint._getLabelCoords,

    _getLabelConnector: piePoint._getLabelConnector,

    getTooltipParams: piePoint.getTooltipParams,

    _getLabelPosition: piePoint._getLabelPosition,

    _translate: function(translator) {
        var that = this,
            maxRadius = translator.translate(CANVAS_POSITION_TOP, CANVAS_POSITION_END).radius;

        that.radiusInner = translator.translate(that.argument, that.minValue).radius;
        exports.polarSymbolPoint._translate.call(that, translator);

        if(that.radiusInner === null) {
            that.radiusInner = that.radius = maxRadius;
        } else if(that.radius === null) {
            this.radius = this.value >= 0 ? maxRadius : 0;
        }

        that.radiusOuter = that.radiusLabels = _max(that.radiusInner, that.radius);
        that.radiusInner = that.defaultRadius = _math.min(that.radiusInner, that.radius);

        that.middleAngle = that.angle = -normalizeAngle(that.middleAngleCorrection - that.angle);
    },

    _checkVisibility: function(translator) {
        return translator.checkVisibility(this.radius, this.radiusInner);
    },

    getMarkerCoords: function() {
        return {
            x: this.centerX,
            y: this.centerY,
            outerRadius: this.radiusOuter,
            innerRadius: this.defaultRadius,
            startAngle: this.middleAngle - this.interval / 2,
            endAngle: this.middleAngle + this.interval / 2
        };
    },

    _drawMarker: function(renderer, group, animationEnabled) {
        var that = this,
            styles = that._getStyle(),
            coords = that.getMarkerCoords(),
            innerRadius = coords.innerRadius,
            outerRadius = coords.outerRadius,
            start = that.translators.translate(that.argument, CANVAS_POSITION_DEFAULT),
            x = coords.x,
            y = coords.y;

        if(animationEnabled) {
            innerRadius = 0;
            outerRadius = 0;
            x = start.x;
            y = start.y;
        }

        that.graphic = renderer.arc(x, y, innerRadius, outerRadius, coords.startAngle, coords.endAngle).attr(styles).data({ "chart-data-point": that }).append(group);
    },

    _checkLabelPosition: function(label, coord) {
        var that = this,
            visibleArea = that._getVisibleArea(),
            angleFunctions = vizUtils.getCosAndSin(that.middleAngle),
            x = that.centerX + that.defaultRadius * angleFunctions.cos,
            y = that.centerY - that.defaultRadius * angleFunctions.sin;

        if(x > visibleArea.minX && x < visibleArea.maxX && y > visibleArea.minY && y < visibleArea.maxY) {
            coord = that._moveLabelOnCanvas(coord, visibleArea, label.getBoundingRect());
        }
        return coord;
    },

    _addLabelAlignmentAndOffset: function(label, coord) {
        return coord;
    },

    correctCoordinates: function(correctOptions) {
        this.middleAngleCorrection = correctOptions.offset;
        this.interval = correctOptions.width;
    },

    coordsIn: function(x, y) {
        var val = this.translators.untranslate(x, y),
            coords = this.getMarkerCoords(),
            isBetweenAngles = coords.startAngle < coords.endAngle ?
            -val.phi >= coords.startAngle && -val.phi <= coords.endAngle :
            -val.phi <= coords.startAngle && -val.phi >= coords.endAngle;

        return (val.r >= coords.innerRadius && val.r <= coords.outerRadius && isBetweenAngles);
    }
});
