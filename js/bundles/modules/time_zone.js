/* eslint-disable import/no-commonjs */
import DevExpress from './core';

module.exports = DevExpress.timeZones = DevExpress.timeZones || {};

DevExpress.timeZones.getTimeZones = require('../../ui/scheduler/utils').getTimeZones;
