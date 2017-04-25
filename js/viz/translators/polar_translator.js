"use strict";

var vizUtils = require("../core/utils"),
    extend = require("../../core/utils/extend").extend,
    commonUtils = require("../../core/utils/common"),
    translator2DModule = require("./translator2d"),
    SHIFT_ANGLE = 90,
    _round = Math.round;

function PolarTranslator(businessRange, canvas, options) {
    var that = this;

    that._startAngle = options.startAngle;
    that._endAngle = options.endAngle;

    that._argCanvas = { left: 0, right: 0, width: this._getAngle() };
    that._valCanvas = { left: 0, right: 0 };
    that.canvas = extend({}, canvas);
    that._init();

    that._arg = new translator2DModule.Translator2D(businessRange.arg, that._argCanvas, { isHorizontal: true, conversionValue: true });
    that._val = new translator2DModule.Translator2D(businessRange.val, that._valCanvas, { isHorizontal: true });

    that._businessRange = businessRange;
}

PolarTranslator.prototype = {
    constructor: PolarTranslator,

    _init: function() {
        var canvas = this.canvas;
        this._setCoords({
            x: canvas.left + (canvas.width - canvas.right - canvas.left) / 2,
            y: canvas.top + (canvas.height - canvas.top - canvas.bottom) / 2,
            r: Math.min((canvas.width - canvas.left - canvas.right), (canvas.height - canvas.top - canvas.bottom)) / 2
        });
        this._valCanvas.width = this._rad;
    },

    reinit: function() {
        this._init();
        this._arg.reinit();
        this._val.reinit();
    },

    _setCoords: function(coord) {
        this._x0 = coord.x;
        this._y0 = coord.y;
        this._rad = coord.r < 0 ? 0 : coord.r;
    },

    getBusinessRange: function() {
        return this._businessRange;
    },

    translate: function(arg, val, offsets) {
        var that = this,
            argTranslate = that._arg.translate(arg, offsets && offsets[0]),
            radius = that._val.translate(val, offsets && offsets[1]),
            angle = commonUtils.isDefined(argTranslate) ? argTranslate + that._startAngle - SHIFT_ANGLE : null,
            cosSin = vizUtils.getCosAndSin(angle),
            x,
            y;

        y = _round(that._y0 + radius * cosSin.sin);
        x = _round(that._x0 + radius * cosSin.cos);

        return { x: x, y: y, angle: angle, radius: radius };
    },

    setCanvasDimension: function(dimension) {
        this.canvas.width = this.canvas.height = dimension;
        this.reinit();
    },

    setAngles: function(startAngle, endAngle) {
        var that = this;

        that._startAngle = startAngle;
        that._endAngle = endAngle;
        that._argCanvas.width = that._getAngle();
        that._arg.update(that._arg.getBusinessRange(), that._argCanvas);
    },

    getAngles: function() {
        return [this._startAngle, this._endAngle];
    },

    getValLength: function() {
        return this._rad;
    },

    getCenter: function() {
        return { x: this._x0, y: this._y0 };
    },

    getBaseAngle: function() {
        return this._startAngle - SHIFT_ANGLE;
    },

    getInterval: function() {
        return this._arg.getInterval();
    },

    getValInterval: function() {
        return this._val.getInterval();
    },

    _getAngle: function() {
        return Math.abs(this._endAngle - this._startAngle);
    },

    //translator's unification
    getComponent: function(type) {
        var that = this,
            translator = this["_" + type];

        translator.getRadius = function() { return that.getValLength(); };
        translator.getCenter = function() { return that.getCenter(); };
        translator.getAngles = function() { return that.getAngles(); };

        return translator;
    },

    _untranslate: function(x, y) {
        var radius = vizUtils.getDistance(this._x0, this._y0, x, y),
            angle = Math.atan2(y - this._y0, x - this._x0);

        return { r: radius, phi: angle };
    },

    untranslate: function(x, y) {
        var pos = this._untranslate(x, y);
        pos.phi = _round(vizUtils.normalizeAngle(pos.phi * 180 / Math.PI));
        pos.r = _round(pos.r);
        return pos;
    },
    getVisibleCategories: commonUtils.noop,
    //TODO
    getCanvasVisibleArea: function() {
        return {};
    },
    getMinBarSize: function(minBarSize) {
        return this._val.getMinBarSize(minBarSize);
    }
};

exports.PolarTranslator = PolarTranslator;
