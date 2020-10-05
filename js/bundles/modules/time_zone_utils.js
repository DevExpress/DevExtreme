/* eslint-disable import/no-commonjs */
import DevExpress from './core';

module.exports = DevExpress.timeZoneUtils = DevExpress.timeZoneUtils || {};

DevExpress.timeZone.timeZoneUtils = require('../../time_zone_utils').getTimeZones;
