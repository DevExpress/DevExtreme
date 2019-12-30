const registerComponent = require('../../core/component_registrator');
const NumberBoxMask = require('./number_box.mask');

registerComponent('dxNumberBox', NumberBoxMask);

module.exports = NumberBoxMask;
