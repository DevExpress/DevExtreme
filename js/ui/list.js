const ListEdit = require('./list/ui.list.edit.search');
const registerComponent = require('../core/component_registrator');

// STYLE list

registerComponent('dxList', ListEdit);

module.exports = ListEdit;
