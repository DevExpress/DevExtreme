var projectionModule = require('./projection.main'),
    projection = projectionModule.projection,

    _min = Math.min,
    _max = Math.max,
    _sin = Math.sin,
    _asin = Math.asin,
    _tan = Math.tan,
    _atan = Math.atan,
    _exp = Math.exp,
    _log = Math.log,

    PI = Math.PI,
    PI_DIV_4 = PI / 4,
    GEO_LON_BOUND = 180,
    GEO_LAT_BOUND = 90,
    RADIANS = PI / 180,

    MERCATOR_LAT_BOUND = (2 * _atan(_exp(PI)) - PI / 2) / RADIANS,
    MILLER_LAT_BOUND = (2.5 * _atan(_exp(0.8 * PI)) - 0.625 * PI) / RADIANS;

function clamp(value, threshold) {
    return _max(_min(value, +threshold), -threshold);
}

// https://en.wikipedia.org/wiki/Mercator_projection
projection.add('mercator', projection({
    aspectRatio: 1,

    to: function(coordinates) {
        return [
            coordinates[0] / GEO_LON_BOUND,
            _log(_tan(PI_DIV_4 + clamp(coordinates[1], MERCATOR_LAT_BOUND) * RADIANS / 2)) / PI
        ];
    },

    from: function(coordinates) {
        return [
            coordinates[0] * GEO_LON_BOUND,
            (2 * _atan(_exp(coordinates[1] * PI)) - PI / 2) / RADIANS
        ];
    }
}));

// https://en.wikipedia.org/wiki/Equirectangular_projection
projection.add('equirectangular', projection({
    aspectRatio: 2,

    to: function(coordinates) {
        return [
            coordinates[0] / GEO_LON_BOUND,
            coordinates[1] / GEO_LAT_BOUND
        ];
    },

    from: function(coordinates) {
        return [
            coordinates[0] * GEO_LON_BOUND,
            coordinates[1] * GEO_LAT_BOUND
        ];
    }
}));

// https://en.wikipedia.org/wiki/Lambert_cylindrical_equal-area_projection
projection.add('lambert', projection({
    aspectRatio: 2,

    to: function(coordinates) {
        return [
            coordinates[0] / GEO_LON_BOUND,
            _sin(clamp(coordinates[1], GEO_LAT_BOUND) * RADIANS)
        ];
    },

    from: function(coordinates) {
        return [
            coordinates[0] * GEO_LON_BOUND,
            _asin(clamp(coordinates[1], 1)) / RADIANS
        ];
    }
}));

// https://en.wikipedia.org/wiki/Miller_cylindrical_projection
projection.add('miller', projection({
    aspectRatio: 1,

    to: function(coordinates) {
        return [
            coordinates[0] / GEO_LON_BOUND,
            1.25 * _log(_tan(PI_DIV_4 + clamp(coordinates[1], MILLER_LAT_BOUND) * RADIANS * 0.4)) / PI
        ];
    },

    from: function(coordinates) {
        return [
            coordinates[0] * GEO_LON_BOUND,
            (2.5 * _atan(_exp(0.8 * coordinates[1] * PI)) - 0.625 * PI) / RADIANS
        ];
    }
}));

exports.projection = projection;
