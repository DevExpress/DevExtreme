"use strict";

exports.default = void 0;
var _m_collection_widget = _interopRequireDefault(require("../../__internal/ui/collection/m_collection_widget.edit"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = _m_collection_widget.default;
/**
 * @name CollectionWidgetOptions.selectionMode
 * @type string
 * @default 'none'
 * @acceptValues 'multiple'|'single'|'all'|'none'
 * @hidden
 */
/**
 * @name CollectionWidgetOptions.selectionRequired
 * @type boolean
 * @default false
 * @hidden
 */
/**
 * @section Utils
 * @default null
 * @name CollectionWidgetOptions.onItemReordered
 * @type function(e)
 * @type_function_param1 e:object
 * @type_function_param1_field1 component:this
 * @type_function_param1_field2 element:DxElement
 * @type_function_param1_field3 model:object
 * @type_function_param1_field4 itemData:object
 * @type_function_param1_field5 itemElement:DxElement
 * @type_function_param1_field6 itemIndex:number | object
 * @type_function_param1_field7 fromIndex:number
 * @type_function_param1_field8 toIndex:number
 * @action
 * @hidden
 */
/**
 * @section Utils
 * @default null
 * @name CollectionWidgetOptions.onItemDeleting
 * @type function(e)
 * @type_function_param1 e:object
 * @type_function_param1_field1 component:this
 * @type_function_param1_field2 element:DxElement
 * @type_function_param1_field3 model:object
 * @type_function_param1_field4 itemData:object
 * @type_function_param1_field5 itemElement:DxElement
 * @type_function_param1_field6 itemIndex:number | object
 * @type_function_param1_field7 cancel:boolean | Promise<void>
 * @action
 * @hidden
 */
/**
 * @section Utils
 * @default null
 * @name CollectionWidgetOptions.onItemDeleted
 * @type function(e)
 * @type_function_param1 e:object
 * @type_function_param1_field1 component:this
 * @type_function_param1_field2 element:DxElement
 * @type_function_param1_field3 model:object
 * @type_function_param1_field4 itemData:object
 * @type_function_param1_field5 itemElement:DxElement
 * @type_function_param1_field6 itemIndex:number | object
 * @action
 * @hidden
 */
/**
 * @name CollectionWidget.isItemSelected
 * @publicName isItemSelected(itemElement)
 * @param1 itemElement:Element
 * @return boolean
 * @hidden
 */
/**
 * @name CollectionWidget.selectItem
 * @publicName selectItem(itemElement)
 * @param1 itemElement:Element
 * @hidden
 */
/**
 * @name CollectionWidget.unselectItem
 * @publicName unselectItem(itemElement)
 * @param1 itemElement:Element
 * @hidden
 */
/**
 * @name CollectionWidget.deleteItem
 * @publicName deleteItem(itemElement)
 * @param1 itemElement:Element
 * @return Promise<void>
 * @hidden
 */
/**
 * @name CollectionWidget.reorderItem
 * @publicName reorderItem(itemElement, toItemElement)
 * @param1 itemElement:Element
 * @param2 toItemElement:Element
 * @return Promise<void>
 * @hidden
 */
module.exports = exports.default;
module.exports.default = exports.default;