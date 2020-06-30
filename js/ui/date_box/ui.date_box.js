const registerComponent = require('../../core/component_registrator');
const DateBoxMask = require('./ui.date_box.mask');

// STYLE dateBox

registerComponent('dxDateBox', DateBoxMask);

module.exports = DateBoxMask;
