const registerComponent = require('../../core/component_registrator');
const NumberBoxMask = require('./number_box.mask');

// STYLE numberBox

registerComponent('dxNumberBox', NumberBoxMask);

module.exports = NumberBoxMask;
