var ListEdit = require('./list/ui.list.edit.search'),
    registerComponent = require('../core/component_registrator');
/**
* @name dxList
* @inherits CollectionWidget, SearchBoxMixin
* @module ui/list
* @export default
*/
registerComponent('dxList', ListEdit);

module.exports = ListEdit;
