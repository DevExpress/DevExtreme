var extend = require('../../core/utils/extend').extend,
    eventEmitterModule = require('./event_emitter');

var _Number = Number,
    _min = Math.min,
    _max = Math.max,
    _abs = Math.abs,
    _round = Math.round,
    _ln = Math.log,
    _pow = Math.pow,

    TWO_TO_LN2 = 2 / Math.LN2,

    // T224204
    // The value is selected so that bounds range of 1 angular second can be defined
    // 1 angular second is (1 / 3600) degrees or (1 / 3600 / 180) after projection
    // The value 10 times less than projected 1 angular second is chosen
    MIN_BOUNDS_RANGE = 1 / 3600 / 180 / 10,

    DEFAULT_MIN_ZOOM = 1,
    DEFAULT_MAX_ZOOM = 1 << 8,

    DEFAULT_CENTER = [NaN, NaN],

    DEFAULT_ENGINE_NAME = 'mercator';

function floatsEqual(f1, f2) {
    return _abs(f1 - f2) < 1E-8;
}

function arraysEqual(a1, a2) {
    return floatsEqual(a1[0], a2[0]) && floatsEqual(a1[1], a2[1]);
}

function parseAndClamp(value, minValue, maxValue, defaultValue) {
    var val = _Number(value);
    return isFinite(val) ? _min(_max(val, minValue), maxValue) : defaultValue;
}

function parseAndClampArray(value, minValue, maxValue, defaultValue) {
    return [
        parseAndClamp(value[0], minValue[0], maxValue[0], defaultValue[0]),
        parseAndClamp(value[1], minValue[1], maxValue[1], defaultValue[1])
    ];
}

function getEngine(engine) {
    return (engine instanceof Engine && engine) || projection.get(engine) || projection.get(DEFAULT_ENGINE_NAME);
}

function Projection(parameters) {
    var that = this;
    that._initEvents();
    that._params = parameters;
    that._engine = getEngine();
    that._center = that._engine.center();
    that._adjustCenter();
}

Projection.prototype = {
    constructor: Projection,

    _minZoom: DEFAULT_MIN_ZOOM,
    _maxZoom: DEFAULT_MAX_ZOOM,
    _zoom: DEFAULT_MIN_ZOOM,
    _center: DEFAULT_CENTER,
    _canvas: {},
    _scale: [],

    dispose: function() {
        this._disposeEvents();
    },

    setEngine: function(value) {
        var that = this,
            engine = getEngine(value);
        if(that._engine !== engine) {
            that._engine = engine;
            that._fire('engine');
            if(that._changeCenter(engine.center())) {
                that._triggerCenterChanged();
            }
            if(that._changeZoom(that._minZoom)) {
                that._triggerZoomChanged();
            }
            that._adjustCenter();
            that._setupScreen();
        }
    },

    setBounds: function(bounds) {
        if(bounds !== undefined) {
            this.setEngine(this._engine.original().bounds(bounds));
        }
    },

    _setupScreen: function() {
        var that = this,
            canvas = that._canvas,
            width = canvas.width,
            height = canvas.height,
            aspectRatio = that._engine.ar();
        that._x0 = canvas.left + width / 2;
        that._y0 = canvas.top + height / 2;
        if(width / height <= aspectRatio) {
            that._xRadius = width / 2;
            that._yRadius = (width / 2) / aspectRatio;
        } else {
            that._xRadius = (height / 2) * aspectRatio;
            that._yRadius = height / 2;
        }
        that._fire('screen');
    },

    setSize: function(canvas) {
        var that = this;
        that._canvas = canvas;
        that._setupScreen();
    },

    _toScreen: function(coordinates) {
        return [
            this._x0 + this._xRadius * coordinates[0],
            this._y0 + this._yRadius * coordinates[1]
        ];
    },

    _fromScreen: function(coordinates) {
        return [
            (coordinates[0] - this._x0) / this._xRadius,
            (coordinates[1] - this._y0) / this._yRadius
        ];
    },

    _toTransformed: function(coordinates) {
        return [
            coordinates[0] * this._zoom + this._xCenter,
            coordinates[1] * this._zoom + this._yCenter
        ];
    },

    _toTransformedFast: function(coordinates) {
        return [
            coordinates[0] * this._zoom,
            coordinates[1] * this._zoom
        ];
    },

    _fromTransformed: function(coordinates) {
        return [
            (coordinates[0] - this._xCenter) / this._zoom,
            (coordinates[1] - this._yCenter) / this._zoom
        ];
    },

    _adjustCenter: function() {
        var that = this,
            center = that._engine.project(that._center);
        that._xCenter = -center[0] * that._zoom || 0;
        that._yCenter = -center[1] * that._zoom || 0;
    },

    project: function(coordinates) {
        return this._engine.project(coordinates);
    },

    transform: function(coordinates) {
        return this._toScreen(this._toTransformedFast(coordinates));
    },

    isInvertible: function() {
        return this._engine.isInvertible();
    },

    getSquareSize: function(size) {
        return [size[0] * this._zoom * this._xRadius, size[1] * this._zoom * this._yRadius];
    },

    getZoom: function() {
        return this._zoom;
    },

    _changeZoom: function(value) {
        var that = this,
            oldZoom = that._zoom,
            newZoom = that._zoom = parseAndClamp(value, that._minZoom, that._maxZoom, that._minZoom),
            isChanged = !floatsEqual(oldZoom, newZoom);
        if(isChanged) {
            that._adjustCenter();
            that._fire('zoom');
        }
        return isChanged;
    },

    setZoom: function(value) {
        if(this._engine.isInvertible() && this._changeZoom(value)) {
            this._triggerZoomChanged();
        }
    },

    getScaledZoom: function() {
        return _round((this._scale.length - 1) * _ln(this._zoom) / _ln(this._maxZoom));
    },

    setScaledZoom: function(scaledZoom) {
        this.setZoom(this._scale[_round(scaledZoom)]);
    },

    changeScaledZoom: function(deltaZoom) {
        this.setZoom(this._scale[_max(_min(_round(this.getScaledZoom() + deltaZoom), this._scale.length - 1), 0)]);
    },

    getZoomScalePartition: function() {
        return this._scale.length - 1;
    },

    _setupScaling: function() {
        var that = this,
            k = _round(TWO_TO_LN2 * _ln(that._maxZoom)),
            step,
            zoom,
            i = 1;

        k = k > 4 ? k : 4;
        step = _pow(that._maxZoom, 1 / k);
        zoom = that._minZoom;
        that._scale = [zoom];
        for(; i <= k; ++i) {
            that._scale.push(zoom *= step);
        }
    },

    setMaxZoom: function(maxZoom) {
        var that = this;
        that._minZoom = DEFAULT_MIN_ZOOM;
        that._maxZoom = parseAndClamp(maxZoom, that._minZoom, _Number.MAX_VALUE, DEFAULT_MAX_ZOOM);
        that._setupScaling();
        if(that._zoom > that._maxZoom) {
            that.setZoom(that._maxZoom);
        }
        that._fire('max-zoom');
    },

    getCenter: function() {
        return this._center.slice();
    },

    setCenter: function(value) {
        if(this._engine.isInvertible() && this._changeCenter(value || [])) {
            this._triggerCenterChanged();
        }
    },

    _changeCenter: function(value) {
        var that = this,
            engine = that._engine,
            oldCenter = that._center,
            newCenter = that._center = parseAndClampArray(value, engine.min(), engine.max(), engine.center()),
            isChanged = !arraysEqual(oldCenter, newCenter);
        if(isChanged) {
            that._adjustCenter();
            that._fire('center');
        }
        return isChanged;
    },

    _triggerCenterChanged: function() {
        this._params.centerChanged(this.getCenter());
    },

    _triggerZoomChanged: function() {
        this._params.zoomChanged(this.getZoom());
    },

    setCenterByPoint: function(coordinates, screenPosition) {
        var that = this,
            p = that._engine.project(coordinates),
            q = that._fromScreen(screenPosition);
        that.setCenter(that._engine.unproject([
            -q[0] / that._zoom + p[0],
            -q[1] / that._zoom + p[1]
        ]));
    },

    beginMoveCenter: function() {
        if(this._engine.isInvertible()) {
            this._moveCenter = this._center;
        }
    },

    endMoveCenter: function() {
        var that = this;
        if(that._moveCenter) {
            if(!arraysEqual(that._moveCenter, that._center)) {
                that._triggerCenterChanged();
            }
            that._moveCenter = null;
        }
    },

    moveCenter: function(shift) {
        var that = this,
            current,
            center;
        if(that._moveCenter) {
            current = that._toScreen(that._toTransformed(that._engine.project(that._center)));
            center = that._engine.unproject(that._fromTransformed(that._fromScreen([current[0] + shift[0], current[1] + shift[1]])));
            that._changeCenter(center);
        }
    },

    getViewport: function() {
        var that = this,
            unproject = that._engine.unproject,
            lt = unproject(that._fromTransformed([-1, -1])),
            lb = unproject(that._fromTransformed([-1, +1])),
            rt = unproject(that._fromTransformed([+1, -1])),
            rb = unproject(that._fromTransformed([+1, +1])),
            minMax = findMinMax([
                selectFarthestPoint(lt[0], lb[0], rt[0], rb[0]),
                selectFarthestPoint(lt[1], rt[1], lb[1], rb[1])
            ], [
                selectFarthestPoint(rt[0], rb[0], lt[0], lb[0]),
                selectFarthestPoint(lb[1], rb[1], lt[1], rt[1])
            ]);
        return [].concat(minMax.min, minMax.max);
    },

    // T254127
    // There should be no expectation that if viewport is got with `getViewport` and set with `setViewport`
    // then center and zoom will be retained - in general case they will be not.
    // Such retaining requires invertibility of projection which is generally not available
    // Invertibility means that `project(unproject([x, y])) === [x, y]` and `unproject(project([x, y])) === [x, y]` for any reasonable `(x, y)`
    // For example:
    // the "mercator" is non invertible - longitude is invertible, latitude is not (because of tan and log)
    // the "equirectangular" is invertible (it uses simple linear transformations)
    setViewport: function(viewport) {
        var engine = this._engine,
            data = viewport ? getZoomAndCenterFromViewport(engine.project, engine.unproject, viewport) : [this._minZoom, engine.center()];
        this.setZoom(data[0]);
        this.setCenter(data[1]);
    },

    getTransform: function() {
        return { translateX: this._xCenter * this._xRadius, translateY: this._yCenter * this._yRadius };
    },

    fromScreenPoint: function(coordinates) {
        return this._engine.unproject(this._fromTransformed(this._fromScreen(coordinates)));
    },

    _eventNames: ['engine', 'screen', 'center', 'zoom', 'max-zoom']
};

eventEmitterModule.makeEventEmitter(Projection);

function selectFarthestPoint(point1, point2, basePoint1, basePoint2) {
    var basePoint = (basePoint1 + basePoint2) / 2;
    return _abs(point1 - basePoint) > _abs(point2 - basePoint) ? point1 : point2;
}

function selectClosestPoint(point1, point2, basePoint1, basePoint2) {
    var basePoint = (basePoint1 + basePoint2) / 2;
    return _abs(point1 - basePoint) < _abs(point2 - basePoint) ? point1 : point2;
}

function getZoomAndCenterFromViewport(project, unproject, viewport) {
    var lt = project([viewport[0], viewport[3]]),
        lb = project([viewport[0], viewport[1]]),
        rt = project([viewport[2], viewport[3]]),
        rb = project([viewport[2], viewport[1]]),
        l = selectClosestPoint(lt[0], lb[0], rt[0], rb[0]),
        r = selectClosestPoint(rt[0], rb[0], lt[0], lb[0]),
        t = selectClosestPoint(lt[1], rt[1], lb[1], rb[1]),
        b = selectClosestPoint(lb[1], rb[1], lt[1], rt[1]);
    return [
        2 / _max(_abs(l - r), _abs(t - b)),
        unproject([(l + r) / 2, (t + b) / 2])
    ];
}

function setMinMax(engine, p1, p2) {
    var minMax = findMinMax(p1, p2);
    engine.min = returnArray(minMax.min);
    engine.max = returnArray(minMax.max);
}

function Engine(parameters) {
    var that = this,
        project = createProjectMethod(parameters.to),
        unproject = parameters.from ? createUnprojectMethod(parameters.from) : returnValue(DEFAULT_CENTER);

    that.project = project;
    that.unproject = unproject;
    that.original = returnValue(that);
    that.source = function() {
        return extend({}, parameters);
    };
    that.isInvertible = returnValue(!!parameters.from);
    that.ar = returnValue(parameters.aspectRatio > 0 ? _Number(parameters.aspectRatio) : 1);
    that.center = returnArray(unproject([0, 0]));
    setMinMax(that, [
        unproject([-1, 0])[0],
        unproject([0, +1])[1]
    ], [
        unproject([+1, 0])[0],
        unproject([0, -1])[1]
    ]);
}

Engine.prototype.aspectRatio = function(aspectRatio) {
    var engine = new Engine(extend(this.source(), { aspectRatio: aspectRatio }));
    engine.original = this.original;
    engine.min = this.min;
    engine.max = this.max;
    return engine;
};

Engine.prototype.bounds = function(bounds) {
    bounds = bounds || [];
    var parameters = this.source(),
        min = this.min(),
        max = this.max(),
        b1 = parseAndClampArray([bounds[0], bounds[1]], min, max, min),
        b2 = parseAndClampArray([bounds[2], bounds[3]], min, max, max),
        p1 = parameters.to(b1),
        p2 = parameters.to(b2),
        delta = _min(_abs(p2[0] - p1[0]) > MIN_BOUNDS_RANGE ? _abs(p2[0] - p1[0]) : 2, _abs(p2[1] - p1[1]) > MIN_BOUNDS_RANGE ? _abs(p2[1] - p1[1]) : 2),
        engine;
    if(delta < 2) {
        extend(parameters, createProjectUnprojectMethods(parameters.to, parameters.from, p1, p2, delta));
    }
    engine = new Engine(parameters);
    engine.original = this.original;
    setMinMax(engine, b1, b2);
    return engine;
};

function isEngine(engine) {
    return engine instanceof Engine;
}

function invertVerticalAxis(pair) {
    return [pair[0], -pair[1]];
}

function createProjectMethod(method) {
    return function(arg) {
        return invertVerticalAxis(method(arg));
    };
}

function createUnprojectMethod(method) {
    return function(arg) {
        return method(invertVerticalAxis(arg));
    };
}

function returnValue(value) {
    return function() {
        return value;
    };
}

function returnArray(value) {
    return function() {
        return value.slice();
    };
}

function projection(parameters) {
    return parameters && parameters.to ? new Engine(parameters) : null;
}

function findMinMax(p1, p2) {
    return {
        min: [_min(p1[0], p2[0]), _min(p1[1], p2[1])],
        max: [_max(p1[0], p2[0]), _max(p1[1], p2[1])]
    };
}

var projectionsCache = {};

projection.get = function(name) {
    return projectionsCache[name] || null;
};

projection.add = function(name, engine) {
    if(!projectionsCache[name] && isEngine(engine)) {
        projectionsCache[name] = engine;
    }
    return projection; // For chaining
};

function createProjectUnprojectMethods(project, unproject, p1, p2, delta) {
    var x0 = (p1[0] + p2[0]) / 2 - delta / 2,
        y0 = (p1[1] + p2[1]) / 2 - delta / 2,
        k = 2 / delta;
    return {
        to: function(coordinates) {
            var p = project(coordinates);
            return [-1 + (p[0] - x0) * k, -1 + (p[1] - y0) * k];
        },
        from: function(coordinates) {
            var p = [x0 + (coordinates[0] + 1) / k, y0 + (coordinates[1] + 1) / k];
            return unproject(p);
        }
    };
}

exports.Projection = Projection;
exports.projection = projection;

///#DEBUG
exports._TESTS_Engine = Engine;
///#ENDDEBUG
