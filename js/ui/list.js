var ListEdit = require('./list/ui.list.edit.search'),
    registerComponent = require('../core/component_registrator');
registerComponent('dxList', ListEdit);

module.exports = ListEdit;
