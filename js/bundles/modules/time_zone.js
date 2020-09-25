/* eslint-disable import/no-commonjs */
import DevExpress from './core';

module.exports = DevExpress.timeZone = DevExpress.timeZone || {};

// DevExpress.timeZones.getTimeZones = require('../../ui/scheduler/utils').getTimeZones;
DevExpress.timeZone.getTimeZones = require('../../time_zone').getTimeZones;
