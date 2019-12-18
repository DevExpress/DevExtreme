var registerComponent = require('../../core/component_registrator'),
    NumberBoxMask = require('./number_box.mask');

registerComponent('dxNumberBox', NumberBoxMask);

module.exports = NumberBoxMask;
