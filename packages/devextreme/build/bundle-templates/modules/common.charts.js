/* eslint-disable import/no-commonjs */
const DevExpress = require('./core');

DevExpress.common = DevExpress.common || {};
DevExpress.common.charts = require('../../common/charts');

module.exports = DevExpress.common.charts;
