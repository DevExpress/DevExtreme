const registerComponent = require('../../core/component_registrator');
const DateBoxMask = require('./ui.date_box.mask');

registerComponent('dxDateBox', DateBoxMask);

module.exports = DateBoxMask;
