"use strict";

var ListEdit = require("./list/ui.list.edit.search"),
    registerComponent = require("../core/component_registrator");
/**
* @name dxList
* @publicName dxList
* @inherits CollectionWidget
* @module ui/list
* @export default
*/
registerComponent("dxList", ListEdit);

module.exports = ListEdit;
