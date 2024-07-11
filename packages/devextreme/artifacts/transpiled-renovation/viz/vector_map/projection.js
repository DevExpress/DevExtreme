"use strict";

Object.defineProperty(exports, "projection", {
  enumerable: true,
  get: function () {
    return _projection.projection;
  }
});
var _projection = require("./projection.main");
const _min = Math.min;
const _max = Math.max;
const _sin = Math.sin;
const _asin = Math.asin;
const _tan = Math.tan;
const _atan = Math.atan;
const _exp = Math.exp;
const _log = Math.log;
const PI = Math.PI;
const PI_DIV_4 = PI / 4;
const GEO_LON_BOUND = 180;
const GEO_LAT_BOUND = 90;
const RADIANS = PI / 180;
const MERCATOR_LAT_BOUND = (2 * _atan(_exp(PI)) - PI / 2) / RADIANS;
const MILLER_LAT_BOUND = (2.5 * _atan(_exp(0.8 * PI)) - 0.625 * PI) / RADIANS;
function clamp(value, threshold) {
  return _max(_min(value, +threshold), -threshold);
}

// https://en.wikipedia.org/wiki/Mercator_projection
_projection.projection.add('mercator', (0, _projection.projection)({
  aspectRatio: 1,
  to: function (coordinates) {
    return [coordinates[0] / GEO_LON_BOUND, _log(_tan(PI_DIV_4 + clamp(coordinates[1], MERCATOR_LAT_BOUND) * RADIANS / 2)) / PI];
  },
  from: function (coordinates) {
    return [coordinates[0] * GEO_LON_BOUND, (2 * _atan(_exp(coordinates[1] * PI)) - PI / 2) / RADIANS];
  }
}));

// https://en.wikipedia.org/wiki/Equirectangular_projection
_projection.projection.add('equirectangular', (0, _projection.projection)({
  aspectRatio: 2,
  to: function (coordinates) {
    return [coordinates[0] / GEO_LON_BOUND, coordinates[1] / GEO_LAT_BOUND];
  },
  from: function (coordinates) {
    return [coordinates[0] * GEO_LON_BOUND, coordinates[1] * GEO_LAT_BOUND];
  }
}));

// https://en.wikipedia.org/wiki/Lambert_cylindrical_equal-area_projection
_projection.projection.add('lambert', (0, _projection.projection)({
  aspectRatio: 2,
  to: function (coordinates) {
    return [coordinates[0] / GEO_LON_BOUND, _sin(clamp(coordinates[1], GEO_LAT_BOUND) * RADIANS)];
  },
  from: function (coordinates) {
    return [coordinates[0] * GEO_LON_BOUND, _asin(clamp(coordinates[1], 1)) / RADIANS];
  }
}));

// https://en.wikipedia.org/wiki/Miller_cylindrical_projection
_projection.projection.add('miller', (0, _projection.projection)({
  aspectRatio: 1,
  to: function (coordinates) {
    return [coordinates[0] / GEO_LON_BOUND, 1.25 * _log(_tan(PI_DIV_4 + clamp(coordinates[1], MILLER_LAT_BOUND) * RADIANS * 0.4)) / PI];
  },
  from: function (coordinates) {
    return [coordinates[0] * GEO_LON_BOUND, (2.5 * _atan(_exp(0.8 * coordinates[1] * PI)) - 0.625 * PI) / RADIANS];
  }
}));